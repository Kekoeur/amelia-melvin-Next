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
      image: section.ImageMaries,
    },
    {
      label: 'Témoins',
      titre: section.TitreTemoin,
      personnes: section.Temoins,
      variant: 'temoins' as const,
      image: section.ImageTemoins,
    },
    {
      label: 'Honneur',
      titre: section.TitreHonneur,
      personnes: section.Honneur,
      variant: 'honneur' as const,
      image: section.ImageHonneur,
    },
    {
      label: 'Maître du Temps',
      titre: section.TitreMaitreTemps,
      personnes: [section.MaitreTemps],
      variant: 'maitre-temps' as const,
      image: section.ImageMaitreTemps,
    }
  ];

  return (
    <div className="presentation-section-container">

      <div className="presentation-groups">
        {groups.map((group, index) => (
          <PersonneGroup
            key={index}
            label={group.label}
            titre={group.titre}
            personnes={group.personnes}
            variant={group.variant}
            image={group.image}
          />
        ))}
      </div>
    </div>
  );
};

export default PresentationSection;