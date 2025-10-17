import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Filter, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los productos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: '¡Agregado al carrito!',
      description: `${product.name} ha sido agregado a tu carrito.`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Diplomados 2025</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Formación especializada en ciencias forenses y criminológicas
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar diplomados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-slate-900 border-slate-800 text-white focus:border-cyan-500 py-6"
              />
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="bg-slate-900 border-slate-800 animate-pulse">
                  <div className="h-48 bg-slate-800"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-slate-800 rounded mb-4"></div>
                    <div className="h-4 bg-slate-800 rounded mb-2"></div>
                    <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <Card
                  key={product.id}
                  className="group bg-slate-900 border-slate-800 hover:border-cyan-500 transition-all duration-300 hover:scale-102 flex flex-col"
                >
                  <Link to={`/tienda/producto/${product.slug}`} className="block">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                      <Badge className="absolute top-4 right-4 bg-cyan-500 text-slate-950">
                        {product.category}
                      </Badge>
                    </div>
                  </Link>
                  
                  <CardHeader>
                    <Link to={`/tienda/producto/${product.slug}`}>
                      <CardTitle className="text-white hover:text-cyan-400 transition-colors">
                        {product.name}
                      </CardTitle>
                    </Link>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                      {product.description}
                    </p>
                    {product.duration && (
                      <p className="text-gray-500 text-sm mb-2">📚 {product.duration}</p>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div>
                      <div className="text-3xl font-bold text-cyan-400">
                        ${product.price}
                      </div>
                      <div className="text-sm text-gray-500">{product.currency}</div>
                    </div>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Agregar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No se encontraron diplomados que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
