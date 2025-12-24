import { getAllergenes, getInvites, getPageData } from "@/utils/getter";
import { notFound } from "next/navigation";
import { PageData, ComponentTypeChoixPoliceHtml } from "@/types/api";
import { NavigationProps } from "@/types/pages";
import SectionRenderer from "@/utils/renderComponent"
import DefaultPage from "@/components/Page/DefaultPage";
import ClientStyleWrapper from "@/utils/ClientStyleWrapper";

const couleur: { [key: string]: string } = {
  'reponses': 'var(--gradient-green)',
  'programme': 'var(--gradient-jaune)',
}

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
  
  return (
    <ClientStyleWrapper
      globalStyles={globalStyles}
      pageStyles={pageStyles}
      pageSlug={currentSlug}
    >
      <DefaultPage navMenu={navMenu}>
        <section className="gradient-section" style={{background: couleur[currentSlug] || 'transparent'}}>
          {page?.Section?.map((element, index) => {
            return element.__typename === 'ComponentSectionFormInvite' ? (
              <SectionRenderer
                key={index}
                section={element}
                navMenu={navMenu}
                invites={invites}
                allergenes={allergenes}
              />
            ) : (
              <SectionRenderer
                key={index}
                section={element}
                navMenu={navMenu}
              />
            );
          })}
        </section>
      </DefaultPage>
    </ClientStyleWrapper>
  );
}