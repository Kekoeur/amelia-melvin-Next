import { NormalizedCacheObject } from "@apollo/client";
import { PageData } from "./api";

export interface PageProps {
  initialApolloState?: NormalizedCacheObject; // Rend optionnel si tu veux l'utiliser uniquement sur certaines pages
  pageData: PageData | null;
}

export interface NavigationProps {
  current: string;
  renderNavigation: NavigationItem[];
}

export interface NavigationItem {
  title: string;
  path: string;
  menuAttached: boolean;
  related?: {
    __typename: string;
    documentId?: string;
  };
  parent?: {
    title: string;
    path: string;
    menuAttached: boolean;
    parent?: {
      title:string;
      path: string;
      menuAttached: boolean;
    }
  }
}
