import { NextResponse } from "next/server";
import { print } from "graphql";
import { CREATE_INVITE } from "@/graphql/mutations";
import { InvitePerson } from "@/types/api";

export async function POST(req: Request) {
  const body = await req.json();

  const variables = {
    data: {
      Quand: body.Quand,
      Reponse: body.Reponse,
      Qui: body.Qui.map((p: InvitePerson) => ({ Nom: p.Nom, Prenom: p.Prenom })),
      Matin: body.Matin.map((p: InvitePerson) => ({ Nom: p.Nom, Prenom: p.Prenom })),
      Midi: body.Midi.map((p: InvitePerson) => ({ Nom: p.Nom, Prenom: p.Prenom })),
      Soir: body.Soir.map((p: InvitePerson) => ({ Nom: p.Nom, Prenom: p.Prenom })),
      Allergies: "",
      Message: ""
    },
  };

console.log(JSON.stringify({ query: print(CREATE_INVITE), variables }))

 const res = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_API}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ query: print(CREATE_INVITE), variables }),
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
