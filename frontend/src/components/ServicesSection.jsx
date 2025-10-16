import React from 'react';
import { Microscope, FileText, Layers } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { servicesData } from '../mock';

const iconMap = {
  Microscope: Microscope,
  FileText: FileText,
  Layers: Layers
};

const ServicesSection = () => {
  return (
    <section id="servicios" className="py-20 bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Nuestros Servicios</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Donde la incertidumbre se encuentra con la ciencia, nace la certeza
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {servicesData.map((service, index) => {
            const IconComponent = iconMap[service.icon];
            return (
              <Card
                key={service.id}
                className="group bg-slate-900 border-slate-800 hover:border-cyan-500 transition-all duration-300 overflow-hidden hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;