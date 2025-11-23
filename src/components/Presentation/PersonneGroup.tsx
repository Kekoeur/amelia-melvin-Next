import React from 'react';
import { PresentationPersonne } from '@/types/api';
import PersonneCard from './PersonneCard';

interface PersonneGroupProps {
  label: string;
  titre: string;
  personnes: PresentationPersonne[];
  variant: 'maries' | 'temoins' | 'honneur' | 'maitre-temps';
}

const PersonneGroup: React.FC<PersonneGroupProps> = ({ label, titre, personnes, variant }) => {

  const personnesArray = Array.isArray(personnes) ? personnes : [];
  
  if (personnesArray.length === 0) return null;
  
  return (
    <section className={`${variant}-section`}>
      <p className="section-label">{label}</p>
      <h2 className="section-titre">{titre}</h2>
      <div className="personnes-grid">
        {personnesArray.map((personne) => (
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