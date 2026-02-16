
import React from 'react';
import { SmallProject } from '../types';

export const SmallProjectCard: React.FC<{ project: SmallProject }> = ({ project }) => {
  return (
    <div className="group bg-white rounded-sm overflow-hidden border border-obsidian/5 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2">
      <div className="aspect-video overflow-hidden bg-obsidian relative">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover group-hover:scale-110 grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <div className="p-8 space-y-6">
        <div className="flex flex-wrap gap-3">
          {project.tags.map(t => (
            <span key={t} className="font-mono text-[8px] font-bold tracking-widest uppercase px-3 py-1 bg-paper text-obsidian/40 border border-obsidian/5 rounded-full group-hover:text-gold group-hover:border-gold transition-colors">
              {t}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-serif italic font-bold text-obsidian uppercase tracking-tight">{project.title}</h3>
          <p className="text-base text-obsidian/50 italic leading-relaxed font-light">
            {project.description}
          </p>
        </div>
        <button className="text-[10px] font-mono font-bold text-obsidian uppercase tracking-[0.4em] flex items-center gap-4 group/btn">
          View Dossier 
          <span className="w-8 h-[1px] bg-gold group-hover/btn:w-12 transition-all"></span>
        </button>
      </div>
    </div>
  );
};
