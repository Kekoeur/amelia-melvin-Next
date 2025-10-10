'use client';
import React from "react";
import { Section } from "@/types/api";


interface SectionRendererProps {
  section: Section;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
    React.useEffect(() => {
        (CSS as any).paintWorklet.addModule("/js/squircle.min.js");
      }, []);
    
    switch (section) {
    default:
      return <p>Type de section inconnu : {section}</p>;
  }
};

export default SectionRenderer;
