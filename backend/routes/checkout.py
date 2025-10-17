from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import List
import stripe
import os
import logging
from models.order import Order, OrderItem, OrderCreate
from datetime import datetime

logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

router = APIRouter(prefix="/checkout", tags=["checkout"])


def get_db():
    from server import db
    return db


def get_orders_collection():
    db = get_db()
    return db.orders


def get_products_collection():
    db = get_db()
    return db.products


class CheckoutRequest(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str = None
    items: List[OrderItem]
    billing_address: dict = None


class PaymentIntentResponse(BaseModel):
    client_secret: str
    order_id: str
    amount: float


@router.post("/create-payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(checkout_request: CheckoutRequest):
    """
    Create a Stripe payment intent for the order.
    
    This generates a client_secret that the frontend will use to complete the payment.
    """
    try:
        products_collection = get_products_collection()
        orders_collection = get_orders_collection()
        
        # Validate all products exist and calculate total
        subtotal = 0
        validated_items = []
        
        for item in checkout_request.items:
            product = await products_collection.find_one({"id": item.product_id})
            
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Producto {item.product_id} no encontrado"
                )
            
            if not product.get("is_active", True):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Producto {product['name']} no está disponible"
                )
            
            # Check stock if applicable
            if product.get("stock") is not None and product["stock"] < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Stock insuficiente para {product['name']}"
                )
            
            item_total = product["price"] * item.quantity
            subtotal += item_total
            
            validated_items.append(OrderItem(
                product_id=product["id"],
                product_name=product["name"],
                price=product["price"],
                quantity=item.quantity
            ))
        
        # Create order in database
        order = Order(
            customer_name=checkout_request.customer_name,
            customer_email=checkout_request.customer_email,
            customer_phone=checkout_request.customer_phone,
            items=validated_items,
            subtotal=subtotal,
            total=subtotal,  # Add tax calculation if needed
            status="pending",
            billing_address=checkout_request.billing_address
        )
        
        await orders_collection.insert_one(order.model_dump())
        
        # Create Stripe payment intent
        # Amount must be in cents for Stripe
        amount_cents = int(order.total * 100)
        
        payment_intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency="usd",
            metadata={
                "order_id": order.id,
                "customer_email": order.customer_email,
                "customer_name": order.customer_name
            },
            description=f"Compra IDEF - {len(order.items)} producto(s)"
        )
        
        # Update order with payment intent ID
        await orders_collection.update_one(
            {"id": order.id},
            {"$set": {
                "payment_intent_id": payment_intent.id,
                "updated_at": datetime.utcnow()
            }}
        )
        
        logger.info(f"Payment intent created for order {order.id}: {payment_intent.id}")
        
        return PaymentIntentResponse(
            client_secret=payment_intent.client_secret,
            order_id=order.id,
            amount=order.total
        )
    
    except HTTPException:
        raise
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al procesar el pago: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Error creating payment intent: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear la intención de pago"
        )


@router.post("/confirm-payment/{order_id}")
async def confirm_payment(order_id: str, payment_intent_id: str):
    """
    Confirm payment was successful and update order status.
    """
    try:
        orders_collection = get_orders_collection()
        products_collection = get_products_collection()
        
        # Get order
        order = await orders_collection.find_one({"id": order_id})
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Orden no encontrada"
            )
        
        # Verify payment with Stripe
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        if payment_intent.status == "succeeded":
            # Update order status
            await orders_collection.update_one(
                {"id": order_id},
                {"$set": {
                    "status": "paid",
                    "payment_status": "succeeded",
                    "updated_at": datetime.utcnow()
                }}
            )
            
            # Update product stock if applicable
            for item in order["items"]:
                product = await products_collection.find_one({"id": item["product_id"]})
                if product and product.get("stock") is not None:
                    new_stock = product["stock"] - item["quantity"]
                    await products_collection.update_one(
                        {"id": item["product_id"]},
                        {"$set": {"stock": new_stock, "updated_at": datetime.utcnow()}}
                    )
            
            logger.info(f"Order {order_id} marked as paid")
            
            return {
                "success": True,
                "message": "Pago confirmado exitosamente",
                "order_id": order_id
            }
        else:
            return {
                "success": False,
                "message": f"Pago no completado. Estado: {payment_intent.status}"
            }
    
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al verificar el pago: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Error confirming payment: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al confirmar el pago"
        )


@router.get("/order/{order_id}")
async def get_order(order_id: str):
    """
    Get order details.
    """
    try:
        orders_collection = get_orders_collection()
        order = await orders_collection.find_one({"id": order_id})
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Orden no encontrada"
            )
        
        return Order(**order)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching order: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener la orden"
        )
