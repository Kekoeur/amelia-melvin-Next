// components/sections/HeadingSection.tsx
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
      <section className="py-12 text-center">
        {section.Titre && <h2 className="text-4xl font-bold mb-4">{section.Titre}</h2>}
        {section.SousTitre && <p className="text-xl text-gray-600">{section.SousTitre}</p>}
      </section>
    );
  }

  return (
    <section className="relative h-96 w-full">
      <Image
        src={process.env.NEXT_PUBLIC_STRAPI_URL + section.Image.Image.url}
        alt={section.Image.ImgAlt || 'Section heading'}
        title={section.Image.ImgTitle || 'Section heading'}
        fill
        className="object-cover"
        priority
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-30" />
      
      {/* Titre en cercle */}
      <div className="absolute bottom-35 left-0 right-0 flex justify-center z-10">
        <svg viewBox="0 0 600 250" className="w-full max-w-2xl svg-handwriting">
          <defs>
            <path
              id="arcPath"
              d="M 50,200 Q 300,20 550,200"
              fill="transparent"
            />
          </defs>
          <text 
            className="font-joseph-sophia fill-white"
            fontSize="60"
            fontWeight="bold"
            style={{
              filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8))',
            }}
          >
            <textPath href="#arcPath" startOffset="50%" textAnchor="middle">
              {section.Titre}
            </textPath>
          </text>
        </svg>
      </div>
      {/* Menu en bas */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <HamburgerMenuPage {...(navMenu as NavigationProps)} logo={logo}/>
      </div>
    </section>
  );
};

export default HeadingSection;