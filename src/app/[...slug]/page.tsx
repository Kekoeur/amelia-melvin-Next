import { initializeApollo } from "@/utils/apolloClient";
import { GET_NAVIGATION, GET_PAGE_DATA } from "@/graphql/queries";
import { NavigationItem, NavigationProps } from "@/types/pages";
import SectionRenderer from "@/utils/renderComponent";
import { notFound } from "next/navigation";
import { PageData } from "@/types/api";
import { HamburgerMenuPage } from "@/components/Navigation/NavigationMenu";
import { getFullRoute } from "@/utils/navigationUtils";

async function getPageData(slug: string) {
  const client = initializeApollo();

  try {
    const { data: navData } = await client.query({
      query: GET_NAVIGATION,
      variables: { navigationIdOrSlug: "navigation-fr" },
    });
    

    const pageId = navData?.renderNavigation.find(
      (item: NavigationItem) => getFullRoute(item) === slug
    )?.related.documentId;

    if (!pageId) return null;

    const { data } = await client.query({
      query: GET_PAGE_DATA,
      variables: { documentId: pageId },
    });

    return {navProps: navData,pageProps: data.page || null};
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return null;
  }
}

export default async function DynamicPage(props: { params: Promise<{ slug?: string[] }> }) {
  // Await params pour Next.js 15
  const params = await props.params;
  const paramsslug = params.slug;
  const slug = paramsslug ? paramsslug.join("/") : "acceuil";
  
  const result = await getPageData(slug);
  const page: PageData = result?.pageProps;
  const nav = result?.navProps;
  const navMenu: NavigationProps = { current: slug, ...nav };

  if (!page) {
    notFound();
  }

  return (
    <div>
      <HamburgerMenuPage {...(navMenu as NavigationProps)} />
      {page.Sections?.map((element, index) => (
        <SectionRenderer key={index} section={element} />
      ))}
    </div>
  );
}