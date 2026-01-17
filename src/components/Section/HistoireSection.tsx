import React, { useMemo } from 'react';
import { ComponentSectionHistoire } from '@/types/api';
import HistoireCard from '@/components/Presentation/HistoireCard';
import { NavigationProps } from "@/types/pages";
import TextWrapper from '@/components/Type/TextWrapper';

interface HistoireSectionProps {
  section: ComponentSectionHistoire;
  navMenu: NavigationProps;
}

const HistoireSection: React.FC<HistoireSectionProps> = ({ section }) => {
  // Tri des événements par ordre chronologique (du plus ancien au plus récent)
  const sortedEvents = useMemo(() => {
    return [...section.Event].sort((a, b) => {
      const dateA = a.Date ? new Date(a.Date).getTime() : 0;
      const dateB = b.Date ? new Date(b.Date).getTime() : 0;
      return dateA - dateB;
    });
  }, [section.Event]);

  return (
    <div className="histoire-container">
      {section.Titre && (
        <div className="histoire-header">
          <h2 className="glass-card-title">
            <TextWrapper text={section.Titre} />
          </h2>
        </div>
      )}

      <div className="histoire-timeline">
        {sortedEvents.map((event, index) => (
          <HistoireCard
            key={event.id || index}
            event={event}
          />
        ))}
      </div>
    </div>
  );
};

export default HistoireSection;
