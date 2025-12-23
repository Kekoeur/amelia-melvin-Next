export const ELEMENT_MAPPING = {
  'titre-principal': 'h1',
  'sous-titre': 'h2',
  'titre-section': 'h3',
  'paragraphe': 'p',
  'lien-navigation': '.nav-link',
  'titre-courbe': '.heading-title-text',
  'bouton': '.button',
  'dropdown': '.dropdown-item',
  'texte-formulaire': '.form-label',
  'badge-profil': '.profile-name',
} as const;

export type ElementKey = keyof typeof ELEMENT_MAPPING;

export const AVAILABLE_ELEMENTS = Object.keys(ELEMENT_MAPPING) as ElementKey[];

export const ELEMENT_LABELS = {
  'titre-principal': 'Titre Principal (h1)',
  'sous-titre': 'Sous-titre (h2)',
  'titre-section': 'Titre de Section (h3)',
  'paragraphe': 'Paragraphe',
  'lien-navigation': 'Liens de Navigation',
  'titre-courbe': 'Titre Courbé',
  'bouton': 'Boutons',
  'dropdown': 'Menu Déroulant',
  'texte-formulaire': 'Labels de Formulaire',
  'badge-profil': 'Noms sur Badges',
} as const;

export function getElementSelector(elementKey: string): string {
  return ELEMENT_MAPPING[elementKey as ElementKey] || elementKey;
}
// Mapping vers les valeurs Strapi (avec underscores)
// Mapping vers les valeurs Strapi (AVEC les labels entre parenthèses !)
export const STRAPI_ELEMENT_MAPPING: Record<string, string> = {
  'titre-principal': 'titre-principal (h1)',
  'sous-titre': 'sous-titre (h2)',
  'titre-section': 'titre-section (h3)',
  'paragraphe': 'paragraphe (p)',
  'lien-navigation': 'lien-navigation (.nav-link)',
  'titre-courbe': 'titre-courbe (.heading-title-text)',
  'bouton': 'bouton (.button)',
  'dropdown': 'dropdown (.dropdown-item)',
  'texte-formulaire': 'texte-formulaire (.form-label)',
  'badge-profil': 'badge-profil (.profile-name)',
};

// Inverse mapping (Strapi → App)
export const STRAPI_TO_APP_ELEMENT: Record<string, string> = Object.fromEntries(
  Object.entries(STRAPI_ELEMENT_MAPPING).map(([k, v]) => [v, k])
);

export function toStrapiElementName(appName: string): string {
  return STRAPI_ELEMENT_MAPPING[appName] || appName;
}

export function fromStrapiElementName(strapiName: string): string {
  return STRAPI_TO_APP_ELEMENT[strapiName] || strapiName;
}