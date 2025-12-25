import React from 'react';
import { HistoireEvenement } from '@/types/api';
import RichTextRenderer from '@/components/Type/RichTypeRenderer';
import Image from 'next/image';
import { transformDateToHourString } from '@/utils/formatters';
import TextWrapper from '../Type/TextWrapper';

interface SectionDateCardProps {
  event: HistoireEvenement;
  index?: number;
}

const SectionDateCard: React.FC<SectionDateCardProps> = ({ event }) => {
  console.log('Rendering SectionDateCard with event:', event);
  
  return (
    <div className="event-card-wrapper">
      {event.Date && (
        <span className="event-time-inline">
          <TextWrapper text={transformDateToHourString(new Date(event.Date))}></TextWrapper>
        </span>
      )}
      <div className="event-card glass-card">
        {event.Image?.Image?.url && (
          <div className="event-image-wrapper">
            <Image
              src={event.Image.Image.url}
              alt={event.Image.ImgAlt || ''}
              title={event.Image.ImgTitle || ''}
              width={400}
              height={300}
              className="event-image"
            />
          </div>
        )}
        
        <div className="event-content">
          <h3 className="event-title">
            <TextWrapper text={event.Titre}></TextWrapper>
          </h3>
          
          {event.Lieu && (
            <p className="event-location">
              📍{event.Lieu}
            </p>
          )}

          {event.Desc && (
            <div className="event-description-wrapper">
              <RichTextRenderer 
                content={event.Desc}  
                className="event-description"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionDateCard;