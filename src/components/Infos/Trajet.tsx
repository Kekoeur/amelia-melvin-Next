import React from 'react';
import { ComponentInfosTrajet } from '@/types/api';
import Image from 'next/image';

interface InfosTrajetProps {
  section: ComponentInfosTrajet;
}

const InfosTrajet: React.FC<InfosTrajetProps> = ({ section }) => {
  console.log('Rendering InfosTrajet with data:', section);

  return (
    <div className="infos-trajet">
      <h3>{section.Titre}</h3>
      <a href={section.url}>
        {section.Logo?.Image?.url ? (
          <Image
            src={section.Logo.Image.url}
            alt={section.Logo.ImgAlt || ''}
            title={section.Logo.ImgTitle || ''}
          />
        ): section.Titre
        }
      </a>
      
    </div>
  );
};

export default InfosTrajet;