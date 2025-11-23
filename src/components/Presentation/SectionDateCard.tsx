import React from 'react';
import { HistoireEvenement } from '@/types/api';
import RichTextRenderer from '@/components/Type/RichTypeRenderer';
import Image from 'next/image';
import { transformDateToHourString } from '@/utils/formatters';

interface SectionDateCardProps {
  event: HistoireEvenement;
}

const SectionDateCard: React.FC<SectionDateCardProps> = ({ event }) => {
  console.log('Rendering SectionDateCard with event:', event);
  return (
    <div className={`event-card`}>
      {event.Image?.Image?.url && (
        <Image
          src={event.Image.Image.url}
          alt={event.Image.ImgAlt || ''}
          title={event.Image.ImgTitle ||''}
        />
      )}
      <h3>{event.Titre}{event.Date && !event.Lieu && ' - '+transformDateToHourString(new Date(event.Date)) }</h3>
     
      <p>{event.Lieu}{event.Date && event.Lieu && ' - '+transformDateToHourString(new Date(event.Date)) }</p>
      {event.Desc && (
        <RichTextRenderer 
          content={event.Desc}  
          className="event-description"
        />
      )}
    </div>
  );
};

export default SectionDateCard;