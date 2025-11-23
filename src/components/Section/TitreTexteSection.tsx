import React from 'react';
import { ComponentSectionTitreText } from '@/types/api';
import RichTextRenderer from '@/components/Type/RichTypeRenderer';

interface TitreTextProps {
  section: ComponentSectionTitreText;
}

const TitreTextSection: React.FC<TitreTextProps> = ({ section }) => {
  console.log('Rendering TitreTextSection with data:', section);

  return (
    <div className="titre-text-container">
      <div className="titre-text-card">
        <div className="titre-text-header">
          <span className="titre-text-icon">📝</span>
          <h2 className="titre-text-title">{section.Titre}</h2>
        </div>
        
        {section.Desc && (
          <div className="titre-text-content">
            <RichTextRenderer 
              content={section.Desc}
              className="titre-text-description"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TitreTextSection;