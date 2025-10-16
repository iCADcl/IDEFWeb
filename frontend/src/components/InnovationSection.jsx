import React from 'react';
import { Dna, Cube, HardDrive, Scan } from 'lucide-react';
import { innovationData } from '../mock';

const iconMap = {
  Dna: Dna,
  Cube: Cube,
  HardDrive: HardDrive,
  Scan: Scan
};

const InnovationSection = () => {
  return (
    <section id="innovacion" className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">{innovationData.title}</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">{innovationData.subtitle}</p>
        </div>

        {/* Technology Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {innovationData.technologies.map((tech) => {
            const IconComponent = iconMap[tech.icon];
            return (
              <div
                key={tech.id}
                className="group p-6 rounded-xl bg-slate-900/50 backdrop-blur border border-slate-800 hover:border-cyan-500 transition-all duration-300 hover:scale-105"
              >
                <div className="w-14 h-14 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                  <IconComponent className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{tech.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{tech.description}</p>
              </div>
            );
          })}
        </div>

        {/* Lab Images */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {innovationData.images.map((image, index) => (
            <div key={index} className="relative rounded-xl overflow-hidden group">
              <img
                src={image}
                alt={`Innovation ${index + 1}`}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InnovationSection;