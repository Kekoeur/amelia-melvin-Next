'use client';
import React from "react";
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
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
    React.useEffect(() => {
        const cssObj = window.CSS as CSSWithPaintWorklet;
        const paintWorklet = cssObj && (cssObj["paintWorklet"] as CSSPaintWorklet | undefined);
        paintWorklet?.addModule("/js/squircle.min.js");
      }, []);
    
    switch (section) {
    default:
      return <p>Type de section inconnu : {section}</p>;
  }
};

export default SectionRenderer;
