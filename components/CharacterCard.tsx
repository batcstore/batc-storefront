import React from 'react';
import { Character } from '../types';

export const CharacterCard: React.FC<{ char: Character }> = ({ char }) => {
  return (
    <div className="group animate-fade-up">
      <div className="aspect-[3/4] overflow-hidden relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
        <img 
          src={char.image} 
          alt={char.name} 
          className="w-full h-full object-contain filter drop-shadow-md" 
        />
      </div>
    </div>
  );
};