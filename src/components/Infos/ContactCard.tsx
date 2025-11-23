import React, { useState, useRef, useEffect } from 'react';

interface Contact {
  id: string;
  Nom: string;
  NumTel: string;
}

interface ContactCardProps {
  contact: Contact;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse les numéros (séparés par " / ")
  const phoneNumbers = contact.NumTel.split(' / ').map(num => num.trim());
  const hasMultipleNumbers = phoneNumbers.length > 1;

  // Ferme le dropdown si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCall = (phoneNumber: string) => {
    // Retire les espaces pour le lien tel:
    const cleanNumber = phoneNumber.replace(/\s/g, '');
    window.location.href = `tel:${cleanNumber}`;
    setIsDropdownOpen(false);
  };

  const formatPhoneDisplay = (phone: string) => {
    // Affiche le numéro de façon lisible
    return phone;
  };

  return (
    <div className="contact-card">
      <div className="contact-info">
        <p className="contact-nom">👤 {contact.Nom}</p>
        <div className="contact-tel-list">
          {phoneNumbers.map((phone, index) => (
            <p key={index} className="contact-tel">
              📞 {formatPhoneDisplay(phone)}
            </p>
          ))}
        </div>
      </div>

      <div className="contact-button-wrapper" ref={dropdownRef}>
        {hasMultipleNumbers ? (
          <>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="contact-button contact-button--dropdown"
              aria-label={`Choisir un numéro pour ${contact.Nom}`}
              aria-expanded={isDropdownOpen}
            >
              Appeler
              <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
            </button>

            {isDropdownOpen && (
              <div className="contact-dropdown">
                {phoneNumbers.map((phone, index) => (
                  <button
                    key={index}
                    onClick={() => handleCall(phone)}
                    className="contact-dropdown-item"
                  >
                    <span className="dropdown-icon">📞</span>
                    <span className="dropdown-number">{formatPhoneDisplay(phone)}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() => handleCall(phoneNumbers[0])}
            className="contact-button"
            aria-label={`Appeler ${contact.Nom}`}
          >
            Appeler
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactCard;