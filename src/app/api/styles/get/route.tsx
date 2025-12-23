import { NextRequest, NextResponse } from 'next/server';
import { getDocumentIdFromSlug } from '@/utils/getter';
import { initializeApollo } from '@/lib/apolloClient';
import { GET_PAGE_STYLES } from '@/graphql/queries';
import { fromStrapiElementName } from '@/utils/elementMapping';
import { fromStrapiFontName } from '@/utils/fontMapping';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;
    
    console.log('📥 API get styles - slug reçu:', slug);
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug manquant', page: { Style: [] } },
        { status: 400 }
      );
    }
    
    const documentId = await getDocumentIdFromSlug(slug);
    
    if (!documentId) {
      console.warn('⚠️ DocumentId non trouvé pour slug:', slug);
      return NextResponse.json(
        { error: 'Page non trouvée', page: { Style: [] } },
        { status: 404 }
      );
    }
    
    console.log('🆔 DocumentId trouvé:', documentId);
    
    const client = initializeApollo();
    const { data } = await client.query({
      query: GET_PAGE_STYLES,
      variables: { documentId },
      context: {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
      },
      fetchPolicy: 'no-cache',
    });
    
    console.log('📦 Données brutes Strapi:', JSON.stringify(data, null, 2));
    
    // Convertir depuis format Strapi vers format app
    const convertedPage = data?.page ? {
      ...data.page,
      Style: data.page.Style?.map((style: any) => ({
        ...style,
        Police: {
          Font: fromStrapiFontName(style.Police?.Font) // birds_of_paradise → birds-of-paradise
        },
        Elements: style.Elements?.map((el: any) => ({
          ...el,
          Nom: fromStrapiElementName(el.Nom) // titre-principal (h1) → titre-principal
        }))
      }))
    } : { Style: [] };
    
    console.log('✅ Styles convertis (format app):', JSON.stringify(convertedPage, null, 2));
    
    return NextResponse.json({ page: convertedPage });
  } catch (error) {
    console.error('❌ Erreur API get styles:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération', page: { Style: [] } },
      { status: 500 }
    );
  }
}