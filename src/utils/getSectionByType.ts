// utils/getSectionByType.ts

type SectionTypename = 
  | 'ComponentSectionHeading'
  | 'ComponentSectionFormInvite'
  | string;

interface BaseSection {
  __typename: string;
  id: string;
}

interface Page {
  __typename: 'Page';
  Section: BaseSection[];
}

/**
 * Extrait une section spécifique par son __typename
 * @param data - Les données de la page
 * @param typename - Le type de section à extraire
 * @returns La section trouvée ou null
 */
export const getSectionByType = <T extends BaseSection = BaseSection>(
  data: Page[] | null | undefined,
  typename: SectionTypename
): T | null => {
  if (!data || data.length === 0) return null;
  
  const page = data[0];
  if (!page.Section || page.Section.length === 0) return null;

  const section = page.Section.find(
    (section) => section.__typename === typename
  );

  return (section as T) || null;
};

/**
 * Extrait toutes les sections d'un type spécifique
 * @param data - Les données de la page
 * @param typename - Le type de section à extraire
 * @returns Un tableau de sections trouvées
 */
export const getAllSectionsByType = <T extends BaseSection = BaseSection>(
  data: Page[] | null | undefined,
  typename: SectionTypename
): T[] => {
  if (!data || data.length === 0) return [];
  
  const page = data[0];
  if (!page.Section || page.Section.length === 0) return [];

  return page.Section.filter(
    (section) => section.__typename === typename
  ) as T[];
};