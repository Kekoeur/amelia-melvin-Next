'use client';
import React from "react";
import { ComponentSectionHeading, ComponentSectionFormInvite, Invite, Allergenes, ComponentSectionPresentation, ComponentSectionHistoire, ComponentSectionSectionDate, ComponentInfosLieu, ComponentInfosTrajet } from "@/types/api";

// Import de tes composants de sections
import HeadingSection from "@/components/Section/HeadingSection";
import FormInviteSection from "@/components/Section/FormInviteSection";
import PresentationSection from "@/components/Section/PresentationSection";
import HistoireSection from "@/components/Section/HistoireSection";
import SectionDateSection from "@/components/Section/SectionDateSection";
import TitreTextSection from "@/components/Section/TitreTexteSection";
import ImageDividerSection from "@/components/Type/ImageDividerSection";
import InfosLieu from "@/components/Infos/Lieu";
import InfosTrajet from "@/components/Infos/Trajet";
import InfosContact from "@/components/Infos/Contact";

import { NavigationProps } from "@/types/pages";
import { Section } from "@/types/api";


// Extend the global CSS type to include paintWorklet
declare global {
  interface CSSPaintWorklet {
    addModule(url: string): void;
  }
  interface CSSWithPaintWorklet {
    [key: string]: unknown;
  }
}

interface SectionRendererProps {
  section: Section;
  navMenu: NavigationProps;
  invites?: Invite[];
  allergenes?: Allergenes[];
  colorGradDivider?: string;
  colorGradBack?: string;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section, navMenu, invites, allergenes, colorGradBack, colorGradDivider }) => {
  /*React.useEffect(() => {
    const cssObj = window.CSS as CSSWithPaintWorklet;
    const paintWorklet = cssObj && (cssObj["paintWorklet"] as CSSPaintWorklet | undefined);
    paintWorklet?.addModule("/js/squircle.min.js");
  }, []); */

  // console.log('Rendering SectionRenderer with section:', section);
  // console.log('Navigation menu in SectionRenderer:', navMenu);
  
  // Switch sur le __typename pour rendre le bon composant
  switch (section.__typename) {
    case 'ComponentSectionHeading': {
      return <HeadingSection section={section as ComponentSectionHeading} navMenu={navMenu} />;
    }
      
    case 'ComponentSectionFormInvite': {
      // Vérifier que invites et allergenes existent
      if (!invites || !allergenes) {
        return <p>Chargement du formulaire...</p>;
      }
      return (
        <FormInviteSection 
          section={section as ComponentSectionFormInvite} 
          invites={invites} 
          allergenes={allergenes} 
        />
      );
    }

    case 'ComponentSectionPresentation': {
      return <PresentationSection section={section as ComponentSectionPresentation} navMenu={navMenu} />;
    }

    case 'ComponentSectionHistoire': {
      return <HistoireSection section={section as ComponentSectionHistoire} navMenu={navMenu} />;
    }

    case 'ComponentSectionSectionDate': {
      return <SectionDateSection section={section as ComponentSectionSectionDate} navMenu={navMenu} />;
    }

    case 'ComponentInfosLieu': {
      return <InfosLieu section={section as ComponentInfosLieu} />;
    }

    case 'ComponentInfosTrajet': {
      return <InfosTrajet section={section as ComponentInfosTrajet} />;
    }

    case 'ComponentSectionTitreText': {
      return <TitreTextSection section={section} />;
    }

    case 'ComponentInfosContact': {
      return <InfosContact section={section} />;
    }

    case 'ComponentSectionImageDivider': {
      return <ImageDividerSection section={section} colorGradDivider={colorGradDivider} colorGradBack={colorGradBack} />;
    }

    default: {
      return <p>Type de section inconnu : {(section as Section).__typename}</p>;
    }
  }
};

export default SectionRenderer;