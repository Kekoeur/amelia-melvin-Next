import React from 'react';
import { HistoireEvenement } from '@/types/api';
import RichTextRenderer from '@/components/Type/RichTypeRenderer';
import Image from 'next/image';

interface HistoireCardProps {
  event: HistoireEvenement;
}

const HistoireCard: React.FC<HistoireCardProps> = ({ event }) => {
  
  return (
    <div className={`event-card`}>
      {event.Image?.Image?.url && (
        <Image
          src={event.Image.Image.url}
          alt={event.Image.ImgAlt || ''}
          title={event.Image.ImgTitle ||''}
        />
      )}
      <p>{event.Date}</p>
      <h3>{event.Titre}</h3>
      <p>{event.Lieu}</p>
      {event.Desc && (
        <RichTextRenderer 
          content={event.Desc}
          className="event-description"
        />
      )}
    </div>
  );
};

export default HistoireCard;