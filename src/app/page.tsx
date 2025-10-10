import { initializeApollo } from "@/utils/apolloClient";
import { GET_NAVIGATION, GET_PAGE_DATA } from "@/graphql/queries";
import { NavigationItem, NavigationProps } from "@/types/pages";
import SectionRenderer from "@/utils/renderComponent";
import { PageData } from "@/types/api";
import { HamburgerMenuPage } from "@/components/Navigation/NavigationMenu";

async function getPageData() {
  const client = initializeApollo();

  try {
    const { data: navData } = await client.query({
      query: GET_NAVIGATION,
      variables: { navigationIdOrSlug: "navigation-fr" },
    });

    const pageId = navData?.renderNavigation.find(
      (item: NavigationItem) => item.path === "acceuil"
    )?.related.documentId;

    if (!pageId) return null;

    const { data } = await client.query({
      query: GET_PAGE_DATA,
      variables: { documentId: pageId },
    });

    return {navProps: navData,pageProps: data.page || null} ;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return null;
  }
}

export default async function Homepage() {
  const props = await getPageData()
  const page: PageData = props?.pageProps;
  const nav = props?.navProps;
  const navMenu: NavigationProps = {current: "acceuil", ...nav}

  if (!page) {
    return <p>Page non trouvée</p>;
  }

  return (
    <div>
      <HamburgerMenuPage {... (navMenu as NavigationProps)} />
      {page.Sections?.map((element, index) => (
        <SectionRenderer key={index} section={element} />
      ))}
    </div>
  );
}
