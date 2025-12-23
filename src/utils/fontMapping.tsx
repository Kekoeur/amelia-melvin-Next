export const FONT_MAPPING = {
  'joseph-sophia': '--font-joseph-sophia',
  'lovely-melody': '--font-lovely-melody',
  'autography': '--font-autography',
  'billing-lottre': '--font-billing-lottre',
  'birds-of-paradise': '--font-birds-of-paradise',
  'brittany-signature': '--font-brittany-signature',
  'chetta-vissto': '--font-chetta-vissto',
  'cronde': '--font-cronde',
  'foremost': '--font-foremost',
  'halimun': '--font-halimun',
  'motterdam': '--font-motterdam',
  'sinera': '--font-sinera',
  'velista': '--font-velista',
  'zestful-christmas': '--font-zestful-christmas',
  'geist-sans': '--font-geist-sans',
  'geist-mono': '--font-geist-mono',
  'italianno': '--font-italianno',
  'anonymous-pro': '--font-anonymous-pro',
  'graduate': '--font-graduate',
} as const;

export type FontKey = keyof typeof FONT_MAPPING;

export const AVAILABLE_FONTS = Object.keys(FONT_MAPPING) as FontKey[];

export function getFontVariable(fontKey: string): string {
  return FONT_MAPPING[fontKey as FontKey] || fontKey;
}

// Mapping vers les valeurs Strapi
export const STRAPI_FONT_MAPPING: Record<string, string> = {
  'joseph-sophia': 'josephSophia',
  'lovely-melody': 'lovely_melody',
  'autography': 'autography',
  'billing-lottre': 'billing_lottre',
  'birds-of-paradise': 'birds_of_paradise',
  'brittany-signature': 'brittany_signature',
  'chetta-vissto': 'chetta_vissto',
  'cronde': 'cronde',
  'foremost': 'foremost',
  'halimun': 'halimun',
  'motterdam': 'motterdam',
  'sinera': 'sinera',
  'velista': 'velista',
  'zestful-christmas': 'zestful_christmas',
  'geist-sans': 'Geist',
  'geist-mono': 'Geist_Mono',
  'italianno': 'Italianno',
  'anonymous-pro': 'Anonymous_Pro',
  'graduate': 'Graduate',
};

// Inverse mapping
export const STRAPI_TO_APP_FONT: Record<string, string> = Object.fromEntries(
  Object.entries(STRAPI_FONT_MAPPING).map(([k, v]) => [v, k])
);

export function toStrapiFontName(appName: string): string {
  return STRAPI_FONT_MAPPING[appName] || appName;
}

export function fromStrapiFontName(strapiName: string): string {
  return STRAPI_TO_APP_FONT[strapiName] || strapiName;
}