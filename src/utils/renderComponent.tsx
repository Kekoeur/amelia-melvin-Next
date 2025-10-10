'use client';
import React from "react";
import { Section } from "@/types/api";

// Minimal interface for PaintWorklet
interface PaintWorklet {
  addModule(url: string): void;
}

// Extend the global CSS type to include paintWorklet
declare global {
  interface CSSPaintWorklet {
    addModule(url: string): void;
  }
}

interface SectionRendererProps {
  section: Section;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
    React.useEffect(() => {
        const paintWorklet = (window.CSS && (window.CSS as any)["paintWorklet"]) as CSSPaintWorklet | undefined;
        paintWorklet?.addModule("/js/squircle.min.js");
      }, []);
    
    switch (section) {
    default:
      return <p>Type de section inconnu : {section}</p>;
  }
};

export default SectionRenderer;
