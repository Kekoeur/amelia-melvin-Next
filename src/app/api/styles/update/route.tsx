import { NextRequest, NextResponse } from 'next/server';
import { getDocumentIdFromSlug } from '@/utils/getter';
import { toStrapiElementName } from '@/utils/elementMapping';
import { toStrapiFontName } from '@/utils/fontMapping';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, styles } = body;

    console.log('📝 API update styles - slug reçu:', slug);
    console.log('📝 Styles reçus (format app):', JSON.stringify(styles, null, 2));

    if (!slug) {
      return NextResponse.json({ error: 'Slug manquant' }, { status: 400 });
    }

    const documentId = await getDocumentIdFromSlug(slug);
    
    if (!documentId) {
      console.warn('⚠️ DocumentId non trouvé pour slug:', slug);
      return NextResponse.json({ error: 'Page non trouvée' }, { status: 404 });
    }

    console.log('🆔 DocumentId trouvé:', documentId);

    console.log('🎨 Conversion des styles vers format Strapi...');

    // Convertir vers format Strapi
    const cleanedStyles = styles.map((style: any) => ({
      __component: "type.choix-police-html",
      Police: {
        Font: toStrapiFontName(style.Police.Font) // Convertit birds-of-paradise → birds_of_paradise
      },
      Elements: style.Elements.map((el: any) => ({
        Nom: toStrapiElementName(el.Nom) // Convertit titre-principal → titre-principal (h1)
      }))
    }));

    console.log('🎨 Styles convertis (format Strapi):', JSON.stringify(cleanedStyles, null, 2));
    console.log('📤 Envoi via API REST à Strapi...');

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pages/${documentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            Style: cleanedStyles
          }
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error('❌ Erreur REST:', JSON.stringify(data.error, null, 2));
      return NextResponse.json(
        { error: 'Erreur REST', details: data.error },
        { status: 400 }
      );
    }

    console.log('✅ Styles mis à jour avec succès via REST');
    return NextResponse.json({ updatePage: data.data });
  } catch (error) {
    console.error('❌ Erreur API update:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}