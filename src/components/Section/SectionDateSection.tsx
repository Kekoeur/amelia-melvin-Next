import React from 'react';
import { ComponentSectionSectionDate } from '@/types/api';
import SectionDateCard from '@/components/Presentation/SectionDateCard';
import { NavigationProps } from "@/types/pages";
import { transformDateToStringDate, transformDateToStringDay } from '@/utils/formatters';
import TextWrapper from '../Type/TextWrapper';

interface SectionDateSectionProps {
  section: ComponentSectionSectionDate;
  navMenu: NavigationProps;
}

const SectionDateSection: React.FC<SectionDateSectionProps> = ({ section, navMenu }) => {
  console.log('Rendering SectionDateSection with data:', section);
  console.log('Navigation menu in SectionDateSection:', navMenu);

  return (
    <div className="section-date-container section">
      <div className="section-date-header">
        <div className="date-event">
          <h2 className="section-date-title">
            <span className="section-date-weekday">
              <TextWrapper text={transformDateToStringDate(new Date(section.Date))}></TextWrapper>
            </span>
            <span className="section-date-day">
              <TextWrapper text={transformDateToStringDay(new Date(section.Date))}></TextWrapper>
            </span>
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