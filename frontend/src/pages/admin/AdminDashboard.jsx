import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, DollarSign, Package, Users, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { admin, logout, isAuthenticated, getAuthHeader } = useAdmin();
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    } else {
      fetchStats();
    }
  }, [isAuthenticated, navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/admin/orders/stats`,
        { headers: getAuthHeader() }
      );
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las estadísticas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
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
            <div>
              <h1 className="text-xl font-bold text-white">Panel de Administración</h1>
              <p className="text-sm text-gray-400">Bienvenido, {admin?.full_name || admin?.username}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Órdenes Totales</CardTitle>
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats?.total_orders || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Órdenes Pagadas</CardTitle>
              <Package className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats?.paid_orders || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Pendientes</CardTitle>
              <Users className="w-4 h-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats?.pending_orders || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Ingresos Totales</CardTitle>
              <DollarSign className="w-4 h-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${stats?.total_revenue?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-gray-500 mt-1">USD</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-slate-800 hover:border-cyan-500 transition-colors cursor-pointer"
                onClick={() => navigate('/admin/products')}>
            <CardHeader>
              <CardTitle className="text-white">Gestionar Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">Crear, editar y eliminar diplomados</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 hover:border-cyan-500 transition-colors cursor-pointer"
                onClick={() => navigate('/admin/content')}>
            <CardHeader>
              <CardTitle className="text-white">Editar Contenido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">Modificar textos, imágenes y secciones del sitio</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 hover:border-cyan-500 transition-colors cursor-pointer"
                onClick={() => navigate('/admin/orders')}>
            <CardHeader>
              <CardTitle className="text-white">Ver Órdenes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">Gestionar pedidos y clientes</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
