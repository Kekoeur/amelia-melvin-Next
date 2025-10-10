
import { initializeApollo } from "@/utils/apolloClient";
import { GET_ALLERGENES, GET_INVITES } from "@/graphql/queries";
import { Allergenes, Invite } from "@/types/api";

export async function getInvites() {
  const client = initializeApollo();
  try {
    const { data } = await client.query<{ invites: Invite[] }>({
      query: GET_INVITES,
      variables: {},
    });

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