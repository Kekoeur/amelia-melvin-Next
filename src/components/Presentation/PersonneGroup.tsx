import React from 'react';
import { ImageMedia, PresentationPersonne } from '@/types/api';
import PersonneCard from './PersonneCard';
import Image from 'next/image';
import TextWrapper from '../Type/TextWrapper';

interface PersonneGroupProps {
  label: string;
  titre: string;
  personnes: PresentationPersonne[];
  variant: 'maries' | 'temoins' | 'honneur' | 'maitre-temps';
  image?: ImageMedia;
}

const classVariantMap: { [key in PersonneGroupProps['variant']]: string } = {
  maries: 'personnes-grid',
  temoins: 'personnes-grid',
  honneur: 'personnes-grid-honneur',
  'maitre-temps': 'personnes-grid-maitre-temps',
};

const PersonneGroup: React.FC<PersonneGroupProps> = ({ label, titre, personnes, variant, image }) => {
  const personnesArray = Array.isArray(personnes) ? personnes : [];
  
  if (personnesArray.length === 0) return null;

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${process.env.NEXT_PUBLIC_STRAPI_URL || ''}${url}`;
  };
  
  return (
    <section className={`glass-card personne-group personne-group--${variant}`}>
      <div className="personne-group-header">
        {image?.Image?.url && (
          <div className="personne-group-image">
            <Image
              src={getImageUrl(image.Image.url)}
              alt={image.ImgAlt || ''}
              width={80}
              height={60}
              className="w-auto"
            />
          </div>
        )}
        <div className="personne-group-titles">
          <div className="personne-group-label">
            <TextWrapper text={label}></TextWrapper>
          </div>
          <h3 className="personne-group-titre">{titre}</h3>
        </div>
      </div>
      
      <div className={classVariantMap[variant]}>
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