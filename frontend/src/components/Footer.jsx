import React from 'react';
import { Scale, Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">IDEF Internacional</h3>
                <p className="text-xs text-cyan-400">Instituto Forense</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Ciencia y tecnología para la justicia. Transformamos la evidencia en respuestas con análisis riguroso y tecnología de vanguardia.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-cyan-500 transition-colors duration-200 group">
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-slate-950" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-cyan-500 transition-colors duration-200 group">
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-slate-950" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-cyan-500 transition-colors duration-200 group">
                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-slate-950" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#servicios" className="text-gray-400 hover:text-cyan-400 transition-colors">Servicios</a>
              </li>
              <li>
                <a href="#formacion" className="text-gray-400 hover:text-cyan-400 transition-colors">Formación</a>
              </li>
              <li>
                <a href="#innovacion" className="text-gray-400 hover:text-cyan-400 transition-colors">Innovación</a>
              </li>
              <li>
                <a href="#testimonios" className="text-gray-400 hover:text-cyan-400 transition-colors">Testimonios</a>
              </li>
              <li>
                <a href="#contacto" className="text-gray-400 hover:text-cyan-400 transition-colors">Contacto</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">contacto@idefinternacional.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Miami, Florida, USA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} IDEF Internacional. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Política de Privacidad</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Términos de Servicio</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
