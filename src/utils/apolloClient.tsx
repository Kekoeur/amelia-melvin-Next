import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === "undefined", // Désactiver SSR en mode client
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_API || "http://localhost:4337/graphql",
      credentials: "same-origin",
    }),
    cache: new InMemoryCache(),
  });
};

export const initializeApollo = () => {
  return createApolloClient();
};
