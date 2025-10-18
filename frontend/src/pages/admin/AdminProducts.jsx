import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2, ArrowLeft, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminProducts = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getAuthHeader } = useAdmin();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    } else {
      fetchProducts();
    }
  }, [isAuthenticated, navigate]);

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

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      await axios.patch(
        `${BACKEND_URL}/api/products/${editingProduct.id}`,
        {
          name: editingProduct.name,
          description: editingProduct.description,
          price: parseFloat(editingProduct.price),
          image_url: editingProduct.image_url,
          duration: editingProduct.duration,
          modules: editingProduct.modules ? parseInt(editingProduct.modules) : null,
        },
        { headers: getAuthHeader() }
      );
      
      toast({
        title: '¡Actualizado!',
        description: 'Producto actualizado correctamente',
      });
      
      setIsDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el producto',
        variant: 'destructive',
      });
    }
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
              <h1 className="text-xl font-bold text-white">Gestionar Productos</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-slate-900 border-slate-800">
              <div className="relative h-40 overflow-hidden rounded-t-lg">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-white text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-cyan-400">
                    ${product.price}
                  </div>
                  <Button
                    onClick={() => handleEdit(product)}
                    size="sm"
                    className="bg-cyan-500 hover:bg-cyan-600 text-slate-950"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Nombre del Diplomado</Label>
                <Input
                  id="name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">Descripción</Label>
                <Textarea
                  id="description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={4}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-gray-300">Precio (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="duration" className="text-gray-300">Duración</Label>
                  <Input
                    id="duration"
                    value={editingProduct.duration || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, duration: e.target.value })}
                    placeholder="120 horas académicas"
                    className="bg-slate-800 border-slate-700 text-white mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image_url" className="text-gray-300">URL de Imagen</Label>
                <Input
                  id="image_url"
                  value={editingProduct.image_url}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                />
              </div>

              <div>
                <Label htmlFor="modules" className="text-gray-300">Número de Módulos</Label>
                <Input
                  id="modules"
                  type="number"
                  value={editingProduct.modules || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, modules: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-slate-700 text-white hover:bg-slate-800"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-cyan-500 hover:bg-cyan-600 text-slate-950"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
