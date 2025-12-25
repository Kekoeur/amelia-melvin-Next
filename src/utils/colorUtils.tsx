export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Enlever le # si présent
  const cleanHex = hex.replace('#', '');
  
  // Format #RGB
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  }
  
  // Format #RRGGBB
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }
  
  return null;
}

export function generateGradient(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  
  if (!rgb) {
    return 'transparent';
  }
  
  const { r, g, b } = rgb;
  
  // Créer le gradient comme dans votre CSS
  // --gradient-green: linear-gradient(180deg, var(--green) 0%, var(--p75-green) 25%, var(--p50-green) 50%, var(--white) 100%);
  return `linear-gradient(180deg, 
    rgb(${r}, ${g}, ${b}) 0%, 
    rgba(${r}, ${g}, ${b}, 0.75) 25%, 
    rgba(${r}, ${g}, ${b}, 0.5) 50%, 
    #ffffff 100%)`;
}

export function generateDividerGradient(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  
  if (!rgb) {
    return 'transparent';
  }
  
  const { r, g, b } = rgb;
  
  // --gradient-green-divider pattern
  return `linear-gradient(180deg, 
    #ffffff 0%, 
    rgba(${r}, ${g}, ${b}, 0.5) 15%, 
    rgba(${r}, ${g}, ${b}, 0.75) 30%, 
    rgba(${r}, ${g}, ${b}, 0.5) 45%, 
    rgba(${r}, ${g}, ${b}, 0.2) 75%, 
    #ffffff 100%)`;
}