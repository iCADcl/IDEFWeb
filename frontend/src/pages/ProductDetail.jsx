import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/products/slug/${slug}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el producto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: '¡Agregado al carrito!',
      description: `${product.name} ha sido agregado a tu carrito.`,
    });
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/carrito');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-slate-800 rounded w-1/3 mb-8"></div>
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="h-96 bg-slate-800 rounded"></div>
                  <div>
                    <div className="h-10 bg-slate-800 rounded mb-4"></div>
                    <div className="h-6 bg-slate-800 rounded w-2/3 mb-8"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-800 rounded"></div>
                      <div className="h-4 bg-slate-800 rounded"></div>
                      <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl text-white mb-4">Producto no encontrado</h1>
            <Button onClick={() => navigate('/tienda')} className="bg-cyan-500 hover:bg-cyan-600 text-slate-950">
              Volver a la tienda
            </Button>
          </div>
        </div>
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
            {/* Back Button */}
            <Button
              onClick={() => navigate('/tienda')}
              variant="ghost"
              className="text-gray-400 hover:text-cyan-400 mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la tienda
            </Button>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Product Image */}
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <Badge className="absolute top-6 right-6 bg-cyan-500 text-slate-950 text-lg px-4 py-2">
                  {product.category}
                </Badge>
              </div>

              {/* Product Info */}
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-baseline gap-4 mb-8">
                  <div className="text-5xl font-bold text-cyan-400">
                    ${product.price}
                  </div>
                  <div className="text-lg text-gray-500">{product.currency}</div>
                </div>

                <p className="text-xl text-gray-300 leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Course Details */}
                <Card className="bg-slate-900 border-slate-800 mb-8">
                  <CardContent className="p-6 space-y-4">
                    {product.duration && (
                      <div className="flex items-center text-gray-300">
                        <Clock className="w-5 h-5 text-cyan-400 mr-3" />
                        <span>Duración: {product.duration}</span>
                      </div>
                    )}
                    {product.modules && (
                      <div className="flex items-center text-gray-300">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                        <span>{product.modules} módulos de formación</span>
                      </div>
                    )}
                    {product.certificate && (
                      <div className="flex items-center text-gray-300">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                        <span>Certificado Internacional Incluido</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">Incluye:</h3>
                    <ul className="space-y-3">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-gray-300">
                          <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleBuyNow}
                    size="lg"
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-lg py-6"
                  >
                    Comprar Ahora
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    variant="outline"
                    className="flex-1 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-bold text-lg py-6"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Agregar al Carrito
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
