
import React from 'react';
import { BibleSection as IBibleSection } from '../types';

interface Props {
  section: IBibleSection;
  reversed?: boolean;
}

export const BibleSection: React.FC<Props> = ({ section, reversed }) => {
  return (
    <div id={section.id} className={`flex flex-col md:flex-row items-center gap-12 py-16 ${reversed ? 'md:flex-row-reverse' : ''}`}>
      <div className="flex-1 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-sm font-semibold tracking-wider uppercase">
          <span className="text-xl">{section.icon}</span>
          {section.title}
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
          {section.subtitle}
        </h2>
        <p className="text-lg text-stone-600 leading-relaxed max-w-xl">
          {section.content}
        </p>
        <button className="group flex items-center gap-2 text-bantu font-bold hover:gap-4 transition-all">
          Explore {section.title} 
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
      <div className="flex-1 w-full h-[400px] relative rounded-3xl overflow-hidden shadow-2xl group">
        <img 
          src={section.image} 
          alt={section.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent flex items-end p-8">
           <span className="text-white font-medium opacity-80 uppercase tracking-widest">{section.title} Insight</span>
        </div>
      </div>
    </div>
  );
};
