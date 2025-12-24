
import { initializeApollo } from "@/lib/apolloClient";
import { GET_ALLERGENES, GET_INVITES, GET_PAGE_DATA, GET_NAVIGATION } from "@/graphql/queries";
import { NavigationItem } from "@/types/pages";
import { Allergenes, Invite } from "@/types/api";
import { getFullRoute } from "@/utils/navigationUtils";
import { ApolloError } from "@apollo/client";

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

// ... tes fonctions existantes ...

/**
 * Récupère le documentId d'une page à partir de son slug
 */
export async function getDocumentIdFromSlug(slug: string): Promise<string | null> {
  const client = initializeApollo();
  
  try {
    console.log('🔍 Recherche documentId pour slug:', slug);
    
    const { data: navData } = await client.query({
      query: GET_NAVIGATION,
      variables: { navigationIdOrSlug: "yqv4a4ary5foimhq2e20r5ps" },
      context: {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      },
    });

    console.log('✅ Navigation récupérée pour documentId');
    console.log(navData)

    const pageId = navData?.renderNavigation.find(
      (item: NavigationItem) => {
        const route = getFullRoute(item);
        console.log('  Comparaison:', route, '===', slug, '?', route === slug);
        return route === slug;
      }
    )?.related?.documentId;

    console.log('🆔 DocumentId trouvé:', pageId);
    
    return pageId || null;
  } catch (error) {
    const apolloError = error as ApolloError;
    console.error("❌ Erreur getDocumentIdFromSlug:", apolloError.message);
    return null;
  }
}

export async function getPageData(slug: string) {
  console.log('🔍 Récupération page pour slug:', slug);
  const client = initializeApollo();

  try {
    // 1. Récupérer la navigation
    console.log('📥 Récupération navigation...');
    const { data: navData } = await client.query({
      query: GET_NAVIGATION,
      variables: { navigationIdOrSlug: "navigation" },
    });
    console.log('✅ Navigation récupérée');

    // 2. Trouver le pageId correspondant au slug
    const pageId = navData?.renderNavigation.find(
      (item: NavigationItem) => { 
        const route = getFullRoute(item);
        console.log('  Comparaison:', route, '===', slug, '?', route === slug);
        return route === slug;
      }
    )?.related?.documentId;

    console.log('🆔 Page ID trouvé:', pageId);

    if (!pageId) {
      console.warn('⚠️ Aucun pageId trouvé pour slug:', slug);
      return null;
    }

    // 3. Récupérer les données de la page
    console.log('📥 Récupération données page avec ID:', pageId);
    const { data } = await client.query({
      query: GET_PAGE_DATA,
      variables: { documentId: pageId },
    });

    console.log('✅ Données page récupérées');
    return {
      navProps: navData,
      pageProps: data.page || null
    };
  } catch (error) {
    const apolloError = error as ApolloError;
    console.error("❌ ERREUR getPageData:", apolloError.message);
    
    if (apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0) {
      console.error('🔴 Erreurs GraphQL:');
      apolloError.graphQLErrors.forEach((err, i) => {
        console.error(`  Erreur ${i + 1}:`, JSON.stringify(err, null, 2));
      });
    }
    
    if (apolloError.networkError && 'result' in apolloError.networkError) {
      const networkError = apolloError.networkError as { result?: { errors?: unknown[] } };
      if (networkError.result?.errors) {
        console.error('🔴 Erreurs réseau:');
        networkError.result.errors.forEach((err, i) => {
          console.error(`  Erreur ${i + 1}:`, JSON.stringify(err, null, 2));
        });
      }
    }
    
    return null;
  }
}