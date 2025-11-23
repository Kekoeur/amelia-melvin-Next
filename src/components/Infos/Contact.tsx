import React from 'react';
import { ComponentInfosContact } from '@/types/api';
import RichTextRenderer from '@/components/Type/RichTypeRenderer';
import ContactGroup from '@/components/Infos/ContactGroup';

interface InfosContactProps {
  section: ComponentInfosContact;
}

const InfosContact: React.FC<InfosContactProps> = ({ section }) => {
  console.log('Rendering InfosContact with data:', section);

  return (
    <section className="infos-contact">
      <h3 className="section-titre">{section.Titre}</h3>
      
      {section.Desc && (
        <RichTextRenderer 
          content={section.Desc}  
          className="section-description"
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
          />
        ))}
      </div>
    </section>
  );
};

export default InfosContact;