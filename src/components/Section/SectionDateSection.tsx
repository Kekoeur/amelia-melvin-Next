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
      <h2>{transformDateToString(new Date(section.Date))}</h2>
      {section.event.map((event, index) => (
        <SectionDateCard
          key={index}
          event={event}
        />
      ))}
    </div>
  );
};

export default SectionDateSection;