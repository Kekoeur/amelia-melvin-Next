import { getAllergenes, getInvites } from "@/utils/getter";
import { notFound } from "next/navigation";
import RepondreForm from "./reponseForm";

export default async function RepondrePage() {
  const invites = await getInvites();

  const allergenes = await getAllergenes();
  if (!invites || !allergenes) return notFound();
  
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Répondre à l’invitation</h1>
      <RepondreForm invites={invites} allergenes={allergenes} />
    </div>
  );
}
