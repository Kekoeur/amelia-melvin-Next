'use client';
import { useEffect } from 'react';
import { getFontVariable } from '@/utils/fontMapping';

interface StyleConfig {
  Police?: { Font: string };
  Elements?: { Nom: string };
}

interface UsePageStylesProps {
  globalStyles?: StyleConfig[];
  pageStyles?: StyleConfig[];
  pageSlug?: string;
}

export function usePageStyles({ globalStyles, pageStyles, pageSlug }: UsePageStylesProps) {
  useEffect(() => {
    // Créer un élément <style> unique pour cette page
    const styleId = `dynamic-styles-${pageSlug || 'global'}`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Construire les règles CSS
    const cssRules: string[] = [];

    // 1. Appliquer les styles globaux (de la page "heading")
    if (globalStyles) {
      globalStyles.forEach(style => {
        if (style.Police?.Font && style.Elements?.Nom) {
          const fontVar = getFontVariable(style.Police.Font);
          const selector = style.Elements.Nom;
          cssRules.push(`${selector} { font-family: var(${fontVar}) !important; }`);
        }
      });
    }

    // 2. Appliquer les styles de page (overrides)
    if (pageStyles && pageSlug !== 'heading') {
      pageStyles.forEach(style => {
        if (style.Police?.Font && style.Elements?.Nom) {
          const fontVar = getFontVariable(style.Police.Font);
          const selector = style.Elements.Nom;
          // Plus haute priorité pour les styles de page
          cssRules.push(`${selector} { font-family: var(${fontVar}) !important; }`);
        }
      });
    }

    // Injecter les règles CSS
    styleElement.textContent = cssRules.join('\n');

    // Cleanup au démontage
    return () => {
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [globalStyles, pageStyles, pageSlug]);
}