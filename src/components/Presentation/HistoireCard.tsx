import React from 'react';
import { HistoireEvenement } from '@/types/api';
import RichTextRenderer from '@/components/Type/RichTypeRenderer';
import Image from 'next/image';
import TextWrapper from '@/components/Type/TextWrapper';
import { transformDateToStringDay } from '@/utils/formatters';

interface HistoireCardProps {
  event: HistoireEvenement;
}

const HistoireCard: React.FC<HistoireCardProps> = ({ event }) => {
  const hasImage = !!event.Image?.Image?.url;
  const hasText = !!event.Desc && event.Desc.length > 0;
  const hasTitle = !!event.Titre;
  const hasLocation = !!event.Lieu;

  // Determine card variant
  const getCardVariant = () => {
    if (hasImage && !hasText && !hasTitle && !hasLocation) return 'histoire-card--image-only';
    if (!hasImage && (hasText || hasTitle)) return 'histoire-card--text-only';
    return '';
  };

  return (
    <div className="histoire-card-wrapper">
      <span className="histoire-timeline-dot" />

      <div className={`histoire-card glass-card ${getCardVariant()}`}>
        {hasImage && (
          <div className="histoire-card-image-wrapper">
            <Image
              src={process.env.NEXT_PUBLIC_STRAPI_URL + event.Image!.Image!.url}
              alt={event.Image!.ImgAlt || event.Titre || ''}
              title={event.Image!.ImgTitle || event.Titre || ''}
              fill
              className="histoire-card-image"
            />
          </div>
        )}

        <div className="histoire-card-content">
          {event.Date && (
            <span className="histoire-card-date">
              {transformDateToStringDay(new Date(event.Date))}
            </span>
          )}

          {hasTitle && (
            <h3 className="histoire-card-title">
              <TextWrapper text={event.Titre} />
            </h3>
          )}

          {hasLocation && (
            <p className="histoire-card-location">
              <span>📍</span>
              {event.Lieu}
            </p>
          )}

          {hasText && (
            <RichTextRenderer
              content={event.Desc!}
              className="histoire-card-description"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoireCard;
