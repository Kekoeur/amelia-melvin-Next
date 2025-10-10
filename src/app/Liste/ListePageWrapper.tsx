import { getInvites } from "@/utils/getter";
import { notFound } from "next/navigation";
import ListePage from "./ListePage";

export default async function ListePageWrapper() {
  const invites = await getInvites();
  if (!invites) return notFound();

  return <ListePage invites={invites} />;
}
