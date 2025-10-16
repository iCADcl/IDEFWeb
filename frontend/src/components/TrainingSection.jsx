import React from 'react';
import { GraduationCap, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { trainingData } from '../mock';

const TrainingSection = () => {
  return (
    <section id="formacion" className="py-20 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={trainingData.image}
              alt="Professional Training"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent"></div>
          </div>

          {/* Right: Content */}
          <div>
            <div className="mb-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">{trainingData.title}</h2>
              <p className="text-xl text-gray-400 leading-relaxed">{trainingData.subtitle}</p>
            </div>

            <div className="space-y-6">
              {trainingData.programs.map((program) => (
                <Card
                  key={program.id}
                  className="bg-slate-800/50 border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:scale-102"
                >
                  <CardHeader>
                    <CardTitle className="text-white flex items-start justify-between">
                      <span className="flex-1">{program.name}</span>
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                        {program.duration}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-gray-400 mb-3">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">{program.target}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{program.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingSection;