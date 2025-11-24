import { NextResponse } from "next/server";
import { print } from "graphql";
import { SEND_REPONSE } from "@/graphql/mutations";

export async function POST(req: Request) {
  const body = await req.json();

  const variables = {
    documentId: body.id,
    data: {
      Reponse: true,
      Matin: body.Matin,
      Midi: body.Midi,
      Soir: body.Soir,
      Allergies: body.Allergies,
      Message: body.Message,
    },
  };

 const res = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_API}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify({ query: print(SEND_REPONSE), variables }),
  });

  const text = await res.text();
  console.error("Strapi response status:", res.status);
  console.error("Strapi raw response:", text);

  try {
    const result = JSON.parse(text);
    return NextResponse.json({ success: true, result });
  } catch (e) {
    return NextResponse.json({ success: false, error: `Invalid JSON returned ${e}`, raw: text });
  }

}
