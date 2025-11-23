import { getPageData } from "@/utils/getter";
import HeadingSection from "@/components/Section/HeadingSection";
import { NavigationProps } from "@/types/pages";
import { ComponentSectionHeading } from "@/types/api";

interface DefaultPageProps {
  navMenu: NavigationProps;
  children: React.ReactNode;
}

export default async function DefaultPage({ navMenu, children }: DefaultPageProps) {
  // Récupère les données de la page pour avoir le heading
  const pageData = await getPageData('header');
  console.log('Page data dans DefaultPage:', pageData);

  console.log('Navigation menu dans DefaultPage:', navMenu);
  console.log('Children dans DefaultPage:', children);
  
  // Trouve la section Heading dans les sections
  const headingSection = pageData?.pageProps?.Section?.find(
    (heading: ComponentSectionHeading) => heading.__typename === 'ComponentSectionHeading'
  ) as ComponentSectionHeading | undefined;

  console.log('Heading section dans DefaultPage:', headingSection);

  return (
    <div>
      {/* Affiche automatiquement le heading si il existe */}
      {headingSection && (
        <HeadingSection section={headingSection} navMenu={navMenu} />
      )}
      
      {/* Contenu de la page */}
      {children}
    </div>
  );
}