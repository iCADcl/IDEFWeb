import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Download, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>

                <h1 className="text-4xl font-bold text-white mb-4">
                  ¡Pago Exitoso!
                </h1>
                
                <p className="text-xl text-gray-300 mb-8">
                  Tu compra ha sido procesada correctamente
                </p>

                {orderId && (
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-8">
                    <p className="text-gray-400 text-sm mb-1">Número de Orden</p>
                    <p className="text-cyan-400 font-mono text-lg">{orderId}</p>
                  </div>
                )}

                <div className="space-y-4 mb-8 text-left">
                  <div className="flex items-start space-x-3 text-gray-300">
                    <Mail className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white mb-1">Confirmación por Email</p>
                      <p className="text-sm">
                        Hemos enviado un correo de confirmación con los detalles de tu compra y las instrucciones para acceder a tus diplomados.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-gray-300">
                    <Download className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white mb-1">Acceso a los Cursos</p>
                      <p className="text-sm">
                        Recibirás un email con las credenciales de acceso a nuestra plataforma educativa en las próximas 24 horas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/tienda')}
                    className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold"
                  >
                    Continuar Comprando
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="border-slate-700 text-white hover:bg-slate-800"
                  >
                    Volver al Inicio
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                ¿Tienes preguntas? Contáctanos a{' '}
                <a href="mailto:contacto@idefinternacional.com" className="text-cyan-400 hover:underline">
                  contacto@idefinternacional.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
