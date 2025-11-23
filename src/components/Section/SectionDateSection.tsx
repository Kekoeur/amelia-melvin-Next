import React from 'react';
import { ComponentSectionSectionDate } from '@/types/api';
import SectionDateCard from '@/components/Presentation/SectionDateCard';
import { NavigationProps } from "@/types/pages";
import { transformDateToString } from '@/utils/formatters';

interface SectionDateSectionProps {
  section: ComponentSectionSectionDate;
  navMenu: NavigationProps;
}

const SectionDateSection: React.FC<SectionDateSectionProps> = ({ section, navMenu }) => {
  console.log('Rendering SectionDateSection with data:', section);
  console.log('Navigation menu in SectionDateSection:', navMenu);

  return (
    <div className="section-date-container">
      <div className="section-date-header">
        <div className="date-badge">
          <span className="date-icon">📅</span>
          <h2 className="section-date-title">
            {transformDateToString(new Date(section.Date))}
          </h2>
        </div>
      </div>
      
      <div className="events-timeline">
        {section.event.map((event, index) => (
          <SectionDateCard
            key={index}
            event={event}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionDateSection;