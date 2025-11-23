import React from 'react';
import { ComponentSectionTitreText } from '@/types/api';
import RichTextRenderer from '@/components/Type/RichTypeRenderer';

interface TitreTextProps {
  section: ComponentSectionTitreText;
}

const TitreTextSection: React.FC<TitreTextProps> = ({ section }) => {
  console.log('Rendering InfosTrajet with data:', section);

  return (
    <div className="titre-text">
      <h3>{section.Titre}</h3>
      {section.Desc && (
        <RichTextRenderer 
          content={section.Desc}
          className="event-description"
        />
      )}
      
    </div>
  );
};

export default TitreTextSection;