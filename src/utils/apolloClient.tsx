import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_API || "https://api.melvin-et-amelia.fr/graphql",
      credentials: "include", // Change ici
      fetchOptions: {
        mode: 'cors',
      },
    }),
    cache: new InMemoryCache(),
  });
};

export const initializeApollo = () => {
  return createApolloClient();
};
