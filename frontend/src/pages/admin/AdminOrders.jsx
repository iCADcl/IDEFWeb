import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Package, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminOrders = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getAuthHeader } = useAdmin();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    } else {
      fetchOrders();
    }
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/admin/orders`,
        { headers: getAuthHeader() }
      );
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las órdenes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      paid: 'bg-green-500/20 text-green-400 border-green-500/50',
      completed: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/50',
    };
    
    const labels = {
      pending: 'Pendiente',
      paid: 'Pagada',
      completed: 'Completada',
      cancelled: 'Cancelada',
    };

    return (
      <Badge className={variants[status] || variants.pending}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/admin/dashboard')}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
              <h1 className="text-xl font-bold text-white">Órdenes de Compra</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No hay órdenes aún</h3>
              <p className="text-gray-400">Las órdenes de compra aparecerán aquí</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Orden #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(order.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Cliente</h4>
                      <p className="text-white">{order.customer_name}</p>
                      <p className="text-gray-400 text-sm">{order.customer_email}</p>
                      {order.customer_phone && (
                        <p className="text-gray-400 text-sm">{order.customer_phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Productos</h4>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm mb-1">
                          <span className="text-white">{item.product_name} x{item.quantity}</span>
                          <span className="text-cyan-400">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t border-slate-800 mt-3 pt-3 flex justify-between">
                        <span className="text-white font-bold">Total</span>
                        <span className="text-cyan-400 font-bold text-lg">${order.total.toFixed(2)} {order.currency}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrders;
