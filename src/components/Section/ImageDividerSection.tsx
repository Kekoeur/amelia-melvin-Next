import React from 'react';
import { ComponentSectionImageDivider } from '@/types/api';
import Image from 'next/image';

interface ImageDividerSectionProps {
  section: ComponentSectionImageDivider;
}

const ImageDividerSection: React.FC<ImageDividerSectionProps> = ({ section }) => {

  return (
    <div className="image-divider">
      <h2>{section.Titre}</h2>
      {section.Image?.Image?.url && (
        <Image
          src={section.Image.Image.url}
          alt={section.Image.ImgAlt || 'Image Divider'}
          title={section.Image.ImgTitle}
        />
      )}
    </div>
  );
};

export default ImageDividerSection;