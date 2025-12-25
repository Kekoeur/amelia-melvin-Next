import { getAllergenes, getInvites, getPageData } from "@/utils/getter";
import { notFound } from "next/navigation";
import { PageData, ComponentTypeChoixPoliceHtml } from "@/types/api";
import { NavigationProps } from "@/types/pages";
import SectionRenderer from "@/utils/renderComponent"
import DefaultPage from "@/components/Page/DefaultPage";
import ClientStyleWrapper from "@/utils/ClientStyleWrapper";
import TextWrapper from "@/components/Type/TextWrapper";
import { generateGradient, generateDividerGradient } from "@/utils/colorUtils";

// Fonction helper pour récupérer les styles
async function getPageStyles(slug: string): Promise<ComponentTypeChoixPoliceHtml[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/styles/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
      cache: 'no-store',
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.page?.Style || [];
  } catch (error) {
    console.error('Erreur récupération styles:', error);
    return [];
  }
}

export default async function DynamicPage({ 
  params 
}: { 
  params: Promise<{ slug?: string[] }> 
}) {
  const { slug } = await params;
  const currentSlug: string = slug ? slug.join('/') : 'home';
  
  const props = await getPageData(currentSlug);
  const page: PageData = props?.pageProps;
  
  if (!page) return notFound();
  
  // Récupérer les styles
  const globalStyles = currentSlug !== 'header' ? await getPageStyles('header') : [];
  const pageStyles = await getPageStyles(currentSlug);
  
  const invites = await getInvites();
  const nav = props?.navProps;
  const navMenu: NavigationProps = {current: currentSlug, ...nav};
  const allergenes = await getAllergenes();
  
  if (!invites || !allergenes) return notFound();
  
  // Générer le gradient à partir de la couleur Strapi
  const gradientBackground = page?.Couleur.CouleurBasic ? generateGradient(page.Couleur.CouleurBasic) : 'transparent';
  const gradientDivider = page?.Couleur.CouleurBasic ? generateDividerGradient(page.Couleur.CouleurBasic) : 'transparent';

  return (
    <ClientStyleWrapper
      globalStyles={globalStyles}
      pageStyles={pageStyles}
      pageSlug={currentSlug}
    >
      <DefaultPage navMenu={navMenu}>
        <section className="gradient-section" style={{background: gradientBackground}}>
          <h2 className="mainTitle"><TextWrapper text={page?.MainTitle?.Titre}></TextWrapper></h2>
          {page?.MainTitle?.Desc && <p className="mainTitleDesc">{page?.MainTitle?.Desc}</p>}
          <div className="all-sections">
            {page?.Visible?.Visibility || process.env.NEXT_PUBLIC_DEV ?
              page?.Section?.map((element, index) => {
                return element.__typename === 'ComponentSectionFormInvite' ? (
                  <SectionRenderer
                    key={index}
                    section={element}
                    navMenu={navMenu}
                    invites={invites}
                    allergenes={allergenes}
                    colorGradDivider={gradientDivider}
                    colorGradBack={gradientBackground}
                  />
                ) : (
                  <SectionRenderer
                    key={index}
                    section={element}
                    navMenu={navMenu}
                    colorGradDivider={gradientDivider}
                    colorGradBack={gradientBackground}
                  />
                );
              }) :
              <p className="notReady">{page?.Visible?.AlternatifText || "Cette page n'est pas disponible pour le moment."}</p>
            }
          </div>
        </section>
      </DefaultPage>
    </ClientStyleWrapper>
  );
}