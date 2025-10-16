import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from '../hooks/use-toast';
import { submitContactForm } from '../mock';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitContactForm(formData);
      toast({
        title: '¡Mensaje enviado!',
        description: 'Nos pondremos en contacto contigo pronto.',
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al enviar el mensaje. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-20 bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Contáctanos</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Estamos aquí para responder tus consultas y aportar claridad
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Información de Contacto</h3>
              <p className="text-gray-400 leading-relaxed mb-8">
                Nuestro compromiso es con la verdad objetiva. Contáctanos para consultas sobre servicios forenses, programas de formación o colaboraciones institucionales.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <div className="text-white font-medium">contacto@idefinternacional.com</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Teléfono</div>
                    <div className="text-white font-medium">+1 (555) 123-4567</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Oficina Principal</div>
                    <div className="text-white font-medium">Miami, Florida, USA</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Enviar Mensaje</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Nombre Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500 mt-2"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
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

                <div>
                  <Label htmlFor="subject" className="text-gray-300">Asunto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500 mt-2"
                    placeholder="Motivo de consulta"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-300">Mensaje</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500 mt-2"
                    placeholder="Describe tu consulta o necesidad..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold text-lg py-6 transition-all duration-200 hover:scale-105"
                >
                  {isSubmitting ? 'Enviando...' : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensaje
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;