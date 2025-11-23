'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PresentationPersonne } from '@/types/api';
import RichTextRenderer from '@/components/Type/RichTypeRenderer';
import Image from 'next/image';

interface PersonneCardProps {
  personne: PresentationPersonne;
  variant?: 'maries' | 'temoins' | 'honneur' | 'maitre-temps';
}

const PersonneCard: React.FC<PersonneCardProps> = ({ personne, variant = 'maries' }) => {
  const surnoms = Array.isArray(personne.ListeSurnom) ? personne.ListeSurnom : [];
  const liens = Array.isArray(personne.ListLien) ? personne.ListLien : [];
  
  const cardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!badgeRef.current || !isHovered) return;
      
      const rect = badgeRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculer la distance par rapport au centre du badge (normalisée)
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);
      
      // Limiter les valeurs entre -1 et 1
      setMousePosition({ 
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y))
      });
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);

  // Extraire correctement les images depuis ProfilPicture (qui est un tableau)
  const profilPictures = Array.isArray(personne.ProfilPicture) ? personne.ProfilPicture : [];
  const images = profilPictures
    .map(pp => pp.Image)
    .filter(img => img && img.url);

  const hasDoubleImage = images.length >= 2;
  const imageUrl = images[0]?.url;
  const backgroundImageUrl = images[1]?.url;
  const imageAlt = profilPictures[0]?.ImgAlt || personne.Personne;
  const imageTitle = profilPictures[0]?.ImgTitle || personne.Personne;

  return (
    <div 
      ref={cardRef}
      className={`personne-card personne-card--${variant}`}
    >
      {/* Photo de profil en haut à droite avec effet parallax */}
      {imageUrl && (
        <div 
          ref={badgeRef}
          className="personne-profile-badge"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setMousePosition({ x: 0, y: 0 });
          }}
        >
          {/* Image de fond - définit la taille du cadre */}
          {hasDoubleImage && backgroundImageUrl ? (
            <div 
              className="profile-image-background"
              style={{
                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                transition: isHovered ? 'none' : 'transform 0.3s ease-out'
              }}
            >
              <Image
                src={process.env.NEXT_PUBLIC_STRAPI_URL + backgroundImageUrl}
                alt=""
                width={120}
                height={120}
                className="profile-img-bg"
              />
            </div>
          ) : null}
          
          {/* Image de premier plan - légèrement plus grande */}
          <div 
            className="profile-image-foreground"
            style={{
              transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
              transition: isHovered ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            <Image
              src={process.env.NEXT_PUBLIC_STRAPI_URL + imageUrl}
              alt={imageAlt}
              title={imageTitle}
              width={135}
              height={135}
              className="profile-img-fg"
            />
          </div>
        </div>
      )}
      
      <div className="personne-content">
        <h4 className="personne-nom">{personne.Personne}</h4>
        
        {personne.Profession && (
          <p className="personne-profession">💼 {personne.Profession}</p>
        )}
        
        {surnoms.length > 0 && (
          <div className="personne-surnoms">
            <strong className="info-label">Surnoms :</strong>
            <span className="info-value">
              {surnoms.map(s => s.Elt).join(', ')}
            </span>
          </div>
        )}
        
        {liens.length > 0 && (
          <div className="personne-liens">
            <strong className="info-label">Liens :</strong>
            <span className="info-value">
              {liens.map(l => l.Elt).join(', ')}
            </span>
          </div>
        )}

        {personne.Presentation && (
          <div className="personne-presentation">
            <RichTextRenderer 
              content={personne.Presentation} 
              className="presentation-text"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonneCard;