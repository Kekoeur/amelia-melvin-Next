import React from 'react';
import { HistoireEvenement } from '@/types/api';
import RichTextRenderer from '@/components/Type/RichTypeRenderer';
import Image from 'next/image';
import { transformDateToHourString } from '@/utils/formatters';

interface SectionDateCardProps {
  event: HistoireEvenement;
  index?: number;
}

const SectionDateCard: React.FC<SectionDateCardProps> = ({ event, index = 0 }) => {
  console.log('Rendering SectionDateCard with event:', event);
  
  const isEven = index % 2 === 0;
  
  return (
    <div className={`event-card-wrapper ${isEven ? 'event-card--left' : 'event-card--right'}`}>
      <div className="event-timeline-dot" />
      
      <div className="event-card glass-card-event">
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
            {event.Titre}
            {event.Date && !event.Lieu && (
              <span className="event-time">
                {' '}⏰ {transformDateToHourString(new Date(event.Date))}
              </span>
            )}
          </h3>
          
          {event.Lieu && (
            <p className="event-location">
              📍 {event.Lieu}
              {event.Date && (
                <span className="event-time-inline">
                  {' '}• ⏰ {transformDateToHourString(new Date(event.Date))}
                </span>
              )}
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