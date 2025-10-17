import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center py-16">
              <ShoppingBag className="w-24 h-24 text-gray-600 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">Tu carrito está vacío</h1>
              <p className="text-gray-400 mb-8">Aún no has agregado ningún diplomado a tu carrito</p>
              <Button
                onClick={() => navigate('/tienda')}
                className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold"
              >
                Explorar Diplomados
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Carrito de Compras</h1>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <Card key={item.id} className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {item.name}
                          </h3>
                          {item.duration && (
                            <p className="text-sm text-gray-400 mb-4">
                              {item.duration}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="border-slate-700 text-white hover:bg-slate-800"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="text-white font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="border-slate-700 text-white hover:bg-slate-800"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Price & Remove */}
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-cyan-400">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ${item.price} c/u
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="bg-slate-900 border-slate-800 sticky top-24">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Resumen del Pedido</h2>
                    
                    <div className="space-y-4 mb-6">
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

                    <Button
                      onClick={() => navigate('/checkout')}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-lg py-6"
                    >
                      Proceder al Pago
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <Button
                      onClick={() => navigate('/tienda')}
                      variant="ghost"
                      className="w-full mt-3 text-gray-400 hover:text-cyan-400"
                    >
                      Continuar Comprando
                    </Button>
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

export default Cart;
