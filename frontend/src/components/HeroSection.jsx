import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { heroData } from '../mock';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToServices = () => {
    const element = document.getElementById('servicios');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroData.image}
          alt="Forensic Laboratory"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/85 to-slate-950"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {heroData.title}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed">
            {heroData.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <Button
              onClick={scrollToServices}
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold text-lg px-8 py-6 transition-all duration-200 hover:scale-105"
            >
              Conocer Servicios
            </Button>
            <Button
              onClick={() => document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              variant="outline"
              className="border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-semibold text-lg px-8 py-6 transition-all duration-200"
            >
              Contactar
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce cursor-pointer hover:text-cyan-400 transition-colors"
      >
        <ChevronDown className="w-8 h-8 text-white" />
      </button>
    </section>
  );
};

export default HeroSection;