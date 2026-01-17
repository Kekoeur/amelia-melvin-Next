import React from 'react';
import { ComponentInfosContact } from '@/types/api';
import RichTextRenderer from '@/components/Type/RichTypeRenderer';
import ContactGroup from '@/components/Infos/ContactGroup';
import TextWrapper from '@/components/Type/TextWrapper';

interface InfosContactProps {
  section: ComponentInfosContact;
  colorBackground?: string;
  colorGradDivider?: string;
  colorGradBack?: string;
}

const InfosContact: React.FC<InfosContactProps> = ({ section, colorBackground, colorGradBack, colorGradDivider }) => {
  return (
    <section className="infos-contact">
      <div className="section-header">
        <h2 className="infos-title">
          <TextWrapper text={section.Titre} />
        </h2>
      </div>

      {section.Desc && (
        <RichTextRenderer
          content={section.Desc}
          className="section-subtitle"
        />
      )}

      <div className="contact-groups">
        {section.Contact.map((listcontact) => (
          <ContactGroup
            key={listcontact.id}
            id={listcontact.id}
            titre={listcontact.Titre}
            description={listcontact.Desc}
            contacts={listcontact.Contact}
            colorBackground={colorBackground}
            colorGradDivider={colorGradDivider}
            colorGradBack={colorGradBack}
          />
        ))}
      </div>
    </section>
  );
};

export default InfosContact;
