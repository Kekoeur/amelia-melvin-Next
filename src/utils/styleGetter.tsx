import { initializeApollo } from '@/lib/apolloClient';
import { GET_PAGE_STYLES } from '@/graphql/queries';
import { ComponentTypeChoixPoliceHtml } from '@/types/api';

export async function getPageStyles(documentId: string): Promise<ComponentTypeChoixPoliceHtml[]> {
  try {
    const client = initializeApollo();
    const { data } = await client.query({
      query: GET_PAGE_STYLES,
      variables: { documentId },
    });
    
    return data?.page?.Style || [];
  } catch (error) {
    console.warn(`⚠️ Impossible de récupérer les styles pour ${documentId}:`, error);
    return [];
  }
}