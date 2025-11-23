import React from 'react';
import Image from 'next/image';
import { ComponentSectionHeading } from '@/types/api';
import { NavigationProps } from "@/types/pages";
import { HamburgerMenuPage } from "@/components/Navigation/NavigationMenu";

interface HeadingSectionProps {
  section: ComponentSectionHeading;
  navMenu: NavigationProps;
}

const HeadingSection: React.FC<HeadingSectionProps> = ({ section, navMenu }) => {
  console.log('Rendering HeadingSection with data:', section);
  console.log('Section Image data:', section.Image?.Image?.url);
  console.log('Section Image Alt:', section.Image?.ImgAlt);
  console.log('Section Image Title:', section.Image?.ImgTitle);
  console.log('Navigation menu in HeadingSection:', navMenu);

  const logo = {
    url: section.Logo?.Image ? process.env.NEXT_PUBLIC_STRAPI_URL + section.Logo.Image.url : undefined,
    alt: section.Logo?.ImgAlt || 'Logo',
    title: section.Logo?.ImgTitle || 'Logo',
  }

  if (!section.Image?.Image) {
    return (
      <section className="heading-section-fallback">
        <div className="heading-fallback-content">
          {section.Titre && <h2 className="heading-fallback-title">{section.Titre}</h2>}
          {section.SousTitre && <p className="heading-fallback-subtitle">{section.SousTitre}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="heading-section">
      {/* Image de fond */}
      <div className="heading-image-wrapper">
        <Image
          src={process.env.NEXT_PUBLIC_STRAPI_URL + section.Image.Image.url}
          alt={section.Image.ImgAlt || 'Section heading'}
          title={section.Image.ImgTitle || 'Section heading'}
          fill
          className="heading-image"
          priority
        />
      </div>
      
      {/* Overlay avec effet glassmorphism */}
      <div className="heading-overlay" />
      
      {/* Titre en cercle avec animation manuscrite */}
      <div className="heading-title-wrapper">
        <svg viewBox="0 0 600 250" className="heading-title-svg">
          <defs>
            <path
              id="arcPath"
              d="M 50,200 Q 300,20 550,200"
              fill="transparent"
            />
          </defs>
          <text 
            className="heading-title-text font-joseph-sophia"
            fontSize="60"
            fontWeight="bold"
          >
            <textPath href="#arcPath" startOffset="50%" textAnchor="middle">
              {section.Titre}
            </textPath>
          </text>
        </svg>
      </div>

      {/* Menu de navigation avec effet marque-page */}
      <div className="heading-navigation-wrapper">
        <HamburgerMenuPage {...(navMenu as NavigationProps)} logo={logo}/>
      </div>
    </section>
  );
};

export default HeadingSection;