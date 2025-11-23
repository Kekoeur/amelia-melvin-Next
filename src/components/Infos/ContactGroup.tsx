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
}

const ContactGroup: React.FC<ContactGroupProps> = ({ id, titre, description, contacts }) => {
  if (contacts.length === 0) return null;

  return (
    <div className="contact-group">
      <h4 className="contact-group-titre">{titre}</h4>
      
      {description && (
        <RichTextRenderer 
          content={description}  
          className="contact-group-description"
        />
      )}
      
      <div className="contact-list">
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>
    </div>
  );
};

export default ContactGroup;