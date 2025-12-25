"use client";

import React from 'react';
import { ComponentSectionImageDivider } from '@/types/api';
import Image from 'next/image';
import { useRef } from 'react';

interface ImageDividerSectionProps {
  section: ComponentSectionImageDivider;
  colorGradDivider?: string;
  colorGradBack?: string;
}

const ImageDividerSection: React.FC<ImageDividerSectionProps> = ({ section, colorGradDivider, colorGradBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div 
      ref={containerRef} 
      className="image-divider"
      style={{
        '--divider-gradient': section.isLast ? colorGradBack : colorGradDivider
      } as React.CSSProperties}
    >
      {section.Titre && (
        <h2>{section.Titre}</h2>
      )}
      {section.Image?.Image?.url && (
        <Image
          src={process.env.NEXT_PUBLIC_STRAPI_URL + section.Image.Image.url}
          alt={section.Image.ImgAlt || 'Image Divider'}
          title={section.Image.ImgTitle || ''}
          fill
          onLoadingComplete={(img) => {
            if (containerRef.current) {
              const ratio = img.naturalWidth / img.naturalHeight;
              containerRef.current.style.setProperty(
                '--ratio',
                ratio.toString()
              );
            }
          }}
        />
      )}
    </div>
  );
};

export default ImageDividerSection;