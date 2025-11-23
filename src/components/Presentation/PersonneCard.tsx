import React from 'react';
import { PresentationPersonne } from '@/types/api';
import RichTextRenderer from '@/components/Type/RichTypeRenderer';
import Image from 'next/image';

interface PersonneCardProps {
  personne: PresentationPersonne;
  variant?: 'maries' | 'temoins' | 'honneur' | 'maitre-temps';
}

const PersonneCard: React.FC<PersonneCardProps> = ({ personne, variant = 'maries' }) => {
  const surnoms = Array.isArray(personne.ListeSurnom) ? personne.ListeSurnom : [];
  const liens = Array.isArray(personne.ListLien) ? personne.ListLien : [];
  
  return (
    <div className={`personne personne--${variant}`}>
      {personne.ProfilPicture?.Image?.url && (
        <Image
          src={personne.ProfilPicture.Image.url}
          alt={personne.ProfilPicture.ImgAlt || ''}
          width={200}
          height={200}
          className="personne-photo"
        />
      )}
      <h3>{personne.Personne}</h3>
      {personne.Profession && <p className="profession">{personne.Profession}</p>}
      
      {personne.Presentation && (
        <RichTextRenderer 
          content={personne.Presentation} 
          className="presentation"
        />
      )}
      
      {surnoms.length > 0 && (
        <div className="surnoms">
          <strong>Surnoms: </strong>
          <span>{surnoms.map(s => s.Elt).join(', ')}</span>
        </div>
      )}
      
      {liens.length > 0 && (
        <div className="liens">
          <strong>Liens: </strong>
          <span>{liens.map(l => l.Elt).join(', ')}</span>
        </div>
      )}
    </div>
  );
};

export default PersonneCard;