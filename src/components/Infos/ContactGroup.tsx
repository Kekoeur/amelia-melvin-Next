import React from 'react';
import RichTextRenderer from '@/components/Type/RichTypeRenderer';
import ContactCard from './ContactCard';
import { Paragraph } from '@/types/api';

interface Contact {
  id: string;
  Nom: string;
  NumTel: string;
}

interface ContactGroupProps {
  id: string;
  titre: string;
  description?: Paragraph[];
  contacts: Contact[];
  colorBackground?: string;
  colorGradDivider?: string;
  colorGradBack?: string;
}

const ContactGroup: React.FC<ContactGroupProps> = ({ titre, description, contacts, colorBackground, colorGradBack, colorGradDivider }) => {
  if (contacts.length === 0) return null;

  return (
    <div className="contact-group glass-card">
      <h4 className="contact-group-titre glass-card-title">{titre}</h4>
      
      {description && (
        <RichTextRenderer 
          content={description}  
          className="contact-group-description"
        />
      )}
      
      <div className="contact-list">
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} colorBackground={colorBackground} colorGradDivider={colorGradDivider} colorGradBack={colorGradBack}/>
        ))}
      </div>
    </div>
  );
};

export default ContactGroup;