import React from 'react';
import { statsData } from '../mock';

const StatsSection = () => {
  return (
    <section className="py-16 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg bg-slate-800/50 backdrop-blur border border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl lg:text-5xl font-bold text-cyan-400 mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm lg:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;