import React from 'react';
import { ComponentSectionPresentation } from '@/types/api';
import { NavigationProps } from "@/types/pages";
import PersonneGroup from '@/components/Presentation/PersonneGroup';

interface PresentationSectionProps {
  section: ComponentSectionPresentation;
  navMenu: NavigationProps;
}

const PresentationSection: React.FC<PresentationSectionProps> = ({ section, navMenu }) => {
  console.log('Rendering PresentationSection with data:', section);
  console.log('Navigation menu in PresentationSection:', navMenu);

  const groups = [
    {
      label: 'Mariés',
      titre: section.TitreMaries,
      personnes: section.Maries,
      variant: 'maries' as const,
      emoji: '💑'
    },
    {
      label: 'Témoins',
      titre: section.TitreTemoin,
      personnes: section.Temoins,
      variant: 'temoins' as const,
      emoji: '🤝'
    },
    {
      label: 'Honneur',
      titre: section.TitreHonneur,
      personnes: section.Honneur,
      variant: 'honneur' as const,
      emoji: '👑'
    },
    {
      label: 'Maître du Temps',
      titre: section.TitreMaitreTemps,
      personnes: [section.MaitreTemps],
      variant: 'maitre-temps' as const,
      emoji: '⏰'
    }
  ];

  return (
    <div className="presentation-section-container">
      <div className="presentation-header">
        <h2 className="presentation-main-title">Notre équipe de rêve</h2>
        <p className="presentation-subtitle">
          Les personnes qui nous accompagnent dans cette aventure
        </p>
      </div>

      <div className="presentation-groups">
        {groups.map((group, index) => (
          <PersonneGroup
            key={index}
            label={group.label}
            titre={group.titre}
            personnes={group.personnes}
            variant={group.variant}
            emoji={group.emoji}
          />
        ))}
      </div>
    </div>
  );
};

export default PresentationSection;