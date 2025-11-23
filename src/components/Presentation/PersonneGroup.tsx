import React from 'react';
import { PresentationPersonne } from '@/types/api';
import PersonneCard from './PersonneCard';

interface PersonneGroupProps {
  label: string;
  titre: string;
  personnes: PresentationPersonne[];
  variant: 'maries' | 'temoins' | 'honneur' | 'maitre-temps';
  emoji?: string;
}

const PersonneGroup: React.FC<PersonneGroupProps> = ({ label, titre, personnes, variant, emoji = '👤' }) => {

  const personnesArray = Array.isArray(personnes) ? personnes : [];
  
  if (personnesArray.length === 0) return null;
  
  return (
      <section className={`personne-group personne-group--${variant}`}>
        <div className="personne-group-header">
          <span className="personne-group-emoji">{emoji}</span>
          <div className="personne-group-titles">
            <p className="personne-group-label">{label}</p>
            <h3 className="personne-group-titre">{titre}</h3>
          </div>
        </div>
        
        <div className="personnes-grid">
          {personnes.map((personne) => (
            <PersonneCard 
              key={personne.id} 
              personne={personne} 
              variant={variant}
            />
          ))}
        </div>
      </section>
    );
};

export default PersonneGroup;