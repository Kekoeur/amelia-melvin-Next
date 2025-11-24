import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  console.log("🚀 API deleteGroupe appelée");
  
  try {
    const body = await request.json();
    console.log("📦 Body reçu:", body);
    
    const { id } = body;

    if (!id) {
      console.error("❌ ID manquant");
      return NextResponse.json(
        { error: "ID manquant" },
        { status: 400 }
      );
    }

    console.log("🗑️ Tentative de suppression de l'ID:", id);

    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    const strapiToken = process.env.STRAPI_API_TOKEN;
    
    if (!strapiUrl || !strapiToken) {
      throw new Error("Variables d'environnement manquantes");
    }

    // Mutation GraphQL pour supprimer
    const mutation = `
      mutation DeleteInvite($documentId: ID!) {
        deleteInvite(documentId: $documentId) {
          documentId
        }
      }
    `;

    const url = `${strapiUrl}/graphql`;
    console.log("📍 URL GraphQL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${strapiToken}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          documentId: id
        }
      })
    });

    console.log("📊 Strapi response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur HTTP:", errorText);
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();
    console.log("📦 Strapi raw response:", JSON.stringify(result));

    // Vérifier les erreurs GraphQL
    if (result.errors) {
      console.error("❌ Erreurs GraphQL:", result.errors);
      throw new Error(`Erreur GraphQL: ${JSON.stringify(result.errors)}`);
    }

    if (!result.data?.deleteInvite) {
      console.error("❌ Pas de données dans la réponse");
      throw new Error("Aucune donnée retournée par Strapi");
    }

    console.log("✅ Suppression réussie:", result.data.deleteInvite);

    return NextResponse.json({ 
      success: true, 
      data: result.data.deleteInvite 
    });
    
  } catch (error) {
    console.error("❌ Erreur catch:", error);
    return NextResponse.json(
      { 
        error: "Erreur serveur",
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}