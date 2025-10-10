import { ApolloProvider } from "@apollo/client";
import { initializeApollo } from "./apolloClient";
import { ReactNode } from "react";

interface ApolloProviderWrapperProps {
    children: ReactNode;
  }

const ApolloProviderWrapper = ({children} : ApolloProviderWrapperProps) => {
  const client = initializeApollo();

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;
