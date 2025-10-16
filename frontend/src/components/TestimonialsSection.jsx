import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { testimonialsData } from '../mock';

const TestimonialsSection = () => {
  return (
    <section id="testimonios" className="py-20 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            La confianza de quienes buscan la verdad
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-slate-800/50 border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-6">
                <Quote className="w-10 h-10 text-cyan-400 mb-4 opacity-50" />
                <p className="text-gray-300 leading-relaxed mb-6 italic">"{testimonial.content}"</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;