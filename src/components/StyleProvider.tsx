'use client';
import { useEffect } from 'react';
import { getFontVariable } from '@/utils/fontMapping';
import { getElementSelector } from '@/utils/elementMapping';
import { ComponentTypeChoixPoliceHtml } from '@/types/api';

interface StyleProviderProps {
  globalStyles?: ComponentTypeChoixPoliceHtml[];
  pageStyles?: ComponentTypeChoixPoliceHtml[];
  pageSlug?: string;
}

export default function StyleProvider({ globalStyles, pageStyles, pageSlug }: StyleProviderProps) {
  useEffect(() => {
    const styleId = `dynamic-styles-${pageSlug || 'global'}`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.setAttribute('data-page', pageSlug || 'global');
      document.head.appendChild(styleElement);
    }

    const cssRules: string[] = [];

    // Styles globaux
    if (globalStyles && globalStyles.length > 0) {
      globalStyles.forEach(style => {
        if (style.Police?.Font && style.Elements && style.Elements.length > 0) {
          const fontVar = getFontVariable(style.Police.Font);
          
          style.Elements.forEach(element => {
            if (element.Nom) {
              const selector = getElementSelector(element.Nom);
              cssRules.push(`${selector} { font-family: var(${fontVar}) !important; }`);
            }
          });
        }
      });
    }

    // Styles de page (priorité supérieure)
    if (pageStyles && pageStyles.length > 0 && pageSlug !== 'header') {
      pageStyles.forEach(style => {
        if (style.Police?.Font && style.Elements && style.Elements.length > 0) {
          const fontVar = getFontVariable(style.Police.Font);
          
          style.Elements.forEach(element => {
            if (element.Nom) {
              const selector = getElementSelector(element.Nom);
              cssRules.push(`${selector} { font-family: var(${fontVar}) !important; }`);
            }
          });
        }
      });
    }

    if (cssRules.length > 0) {
      styleElement.textContent = cssRules.join('\n');
    } else {
      styleElement.textContent = '';
    }

    return () => {
      const allStyleElements = document.querySelectorAll('style[id^="dynamic-styles-"]');
      allStyleElements.forEach(el => {
        const pageAttr = el.getAttribute('data-page');
        if (pageAttr && pageAttr !== pageSlug) {
          el.remove();
        }
      });
    };
  }, [globalStyles, pageStyles, pageSlug]);

  return null;
}