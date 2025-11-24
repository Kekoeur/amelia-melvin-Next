
import { initializeApollo } from "@/utils/apolloClient";
import { GET_ALLERGENES, GET_INVITES, GET_PAGE_DATA, GET_NAVIGATION } from "@/graphql/queries";
import { NavigationItem } from "@/types/pages";
import { Allergenes, Invite } from "@/types/api";
import { getFullRoute } from "@/utils/navigationUtils";

export async function getInvites() {
  const client = initializeApollo();
  try {
    console.log('URL GraphQL:', client.link);
    const { data } = await client.query<{ invites: Invite[] }>({
      query: GET_INVITES,
      variables: {},
    });
    console.log('Données reçues:', data);

    return data.invites;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return null;
  }
}

export async function getAllergenes() {
  const client = initializeApollo();
  try {
    const { data } = await client.query<{ allergenes: Allergenes[] }>({
      query: GET_ALLERGENES,
      variables: {},
    });

    return data.allergenes;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return null;
  }
}

export async function getPageData(slug: string) {
  //console.log(slug)
  const client = initializeApollo();

  try {
    const { data: navData } = await client.query({
      query: GET_NAVIGATION,
      variables: { navigationIdOrSlug: "yqv4a4ary5foimhq2e20r5ps" },
    });

    console.log('Données de navigation reçues:', navData);

    const pageId = navData?.renderNavigation.find(
      (item: NavigationItem) => { 
        console.log('Comparaison des routes:', getFullRoute(item), slug);
        return getFullRoute(item) === slug 
      }
    )?.related.documentId;
    console.log('ID de la page trouvée:', pageId);

    if (!pageId) return null;

    const { data } = await client.query({
      query: GET_PAGE_DATA,
      variables: { documentId: pageId },
    });

    console.log('Données de page reçues:', data);

    return {navProps: navData,pageProps: data.page || null};
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return null;
  }
}