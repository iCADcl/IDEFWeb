import React, { useState, useEffect } from 'react';
import { Menu, X, Scale, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCart } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-950/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">IDEF Internacional</h1>
              <p className="text-xs text-cyan-400">Instituto Forense</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('servicios')}
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              Servicios
            </button>
            <button
              onClick={() => scrollToSection('formacion')}
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              Formación
            </button>
            <a
              href="/tienda"
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              Tienda
            </a>
            <button
              onClick={() => scrollToSection('innovacion')}
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              Innovación
            </button>
            <button
              onClick={() => scrollToSection('testimonios')}
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              Testimonios
            </button>
            <Button
              onClick={() => scrollToSection('contacto')}
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold transition-colors duration-200"
            >
              Contacto
            </Button>
            
            {/* Cart Icon */}
            <button
              onClick={() => navigate('/carrito')}
              className="relative text-white hover:text-cyan-400 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartItemCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-cyan-500 text-slate-950 text-xs px-1.5 min-w-[20px] h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </Badge>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-cyan-400 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900/98 backdrop-blur-lg rounded-lg mt-2 p-4 space-y-3">
            <button
              onClick={() => scrollToSection('servicios')}
              className="block w-full text-left py-2 px-4 text-gray-300 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
            >
              Servicios
            </button>
            <button
              onClick={() => scrollToSection('formacion')}
              className="block w-full text-left py-2 px-4 text-gray-300 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
            >
              Formación
            </button>
            <a
              href="/tienda"
              className="block w-full text-left py-2 px-4 text-gray-300 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
            >
              Tienda
            </a>
            <button
              onClick={() => scrollToSection('innovacion')}
              className="block w-full text-left py-2 px-4 text-gray-300 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
            >
              Innovación
            </button>
            <button
              onClick={() => scrollToSection('testimonios')}
              className="block w-full text-left py-2 px-4 text-gray-300 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
            >
              Testimonios
            </button>
            <Button
              onClick={() => scrollToSection('contacto')}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold"
            >
              Contacto
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;