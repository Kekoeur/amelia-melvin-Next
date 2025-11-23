import React from 'react';
import { ComponentSectionHistoire } from '@/types/api';
import HistoireCard from '@/components/Presentation/HistoireCard';
import { NavigationProps } from "@/types/pages";

interface HistoireSectionProps {
  section: ComponentSectionHistoire;
  navMenu: NavigationProps;
}

const HistoireSection: React.FC<HistoireSectionProps> = ({ section, navMenu }) => {
  console.log('Rendering HistoireSection with data:', section);
  console.log('Navigation menu in HistoireSection:', navMenu);


  return (
    <div className="histoire-container">
      {section.Event.map((event, index) => (
        <HistoireCard
          key={index}
          event={event}
        />
      ))}
    </div>
  );
};

export default HistoireSection;