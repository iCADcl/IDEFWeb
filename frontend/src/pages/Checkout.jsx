import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Lock, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#ffffff',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#64748b',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true, // Makes postal code optional
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!formData.name || !formData.email) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor completa todos los campos obligatorios',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent
      const orderItems = cart.map(item => ({
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const { data } = await axios.post(`${BACKEND_URL}/api/checkout/create-payment-intent`, {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        items: orderItems,
      });

      const clientSecret = data.client_secret;

      // Confirm the card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
        },
      });

      if (result.error) {
        toast({
          title: 'Error en el pago',
          description: result.error.message,
          variant: 'destructive',
        });
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // Confirm payment on backend
          await axios.post(
            `${BACKEND_URL}/api/checkout/confirm-payment/${data.order_id}?payment_intent_id=${result.paymentIntent.id}`
          );

          setSucceeded(true);
          setProcessing(false);
          
          toast({
            title: '¡Pago exitoso!',
            description: 'Tu compra ha sido procesada correctamente.',
          });

          // Clear cart
          clearCart();

          // Redirect to success page after 2 seconds
          setTimeout(() => {
            navigate('/checkout/success', { state: { orderId: data.order_id } });
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Hubo un error al procesar tu pago',
        variant: 'destructive',
      });
      setProcessing(false);
    }
  };

  if (succeeded) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">¡Pago Exitoso!</h2>
        <p className="text-gray-400">Redirigiendo...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300">Nombre Completo *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500 mt-2"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-300">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500 mt-2"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-300">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500 mt-2"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Información de Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
          <div className="flex items-center text-gray-400 text-sm mt-4">
            <Lock className="w-4 h-4 mr-2" />
            <span>Pago seguro procesado por Stripe</span>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-lg py-6 disabled:opacity-50"
      >
        {processing ? 'Procesando...' : `Pagar $${getCartTotal().toFixed(2)} USD`}
      </Button>

      <p className="text-center text-gray-500 text-sm">
        Al completar tu compra, aceptas nuestros términos y condiciones
      </p>
    </form>
  );
};

const Checkout = () => {
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/tienda');
    }
  }, [cart, navigate]);

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Finalizar Compra</h1>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <Elements stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="bg-slate-900 border-slate-800 sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-white">Resumen del Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Cart Items */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <div className="flex-1">
                            <div className="text-white font-medium">{item.name}</div>
                            <div className="text-gray-500">Cantidad: {item.quantity}</div>
                          </div>
                          <div className="text-cyan-400 font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-800 pt-4 space-y-2">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal</span>
                        <span>${getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Impuestos</span>
                        <span>$0.00</span>
                      </div>
                      <div className="border-t border-slate-800 pt-4">
                        <div className="flex justify-between text-white font-bold text-xl">
                          <span>Total</span>
                          <span className="text-cyan-400">${getCartTotal().toFixed(2)} USD</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
