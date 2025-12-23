import { gql } from "@apollo/client";

export const SEND_REPONSE = gql`
  mutation UpdateInvite($documentId: ID!, $data: InviteInput!) {
    updateInvite(documentId: $documentId, data: $data) {
      documentId
      Reponse
      Matin {
        Nom
        Prenom
      }
      Midi {
        Nom
        Prenom
      }
      Soir {
        Nom
        Prenom
      }
      Retour {
        Nom
        Prenom
      }
      Allergies
      Message
    }
  }
`;

export const UPDATE_INVITE = gql`
  mutation UpdateInvite($documentId: ID!, $data: InviteInput!) {
    updateInvite(documentId: $documentId, data: $data) {
      documentId
      Quand
      Qui {
        Nom
        Prenom
      }
      Matin {
        Nom
        Prenom
      }
      Midi {
        Nom
        Prenom
      }
      Soir {
        Nom
        Prenom
      }
      Retour {
        Nom
        Prenom
      }
    }
  }
`;


export const CREATE_INVITE = gql`
  mutation CreateInvite($data: InviteInput!) {
    createInvite(data: $data) {
      documentId
      Quand
      Reponse
      Allergies
      Message
      Matin {
        Nom
        Prenom
      }
      Midi {
        Nom
        Prenom
      }
      Soir{
        Nom
        Prenom
      }
      Retour {
        Nom
        Prenom
      }
      Qui {
        id
        Nom
        Prenom
      }
      createdAt
    }
  }
`;

export const UPDATE_PAGE_STYLES = gql`
  mutation UpdatePageStyles($documentId: ID!, $data: PageInput!)  {
    updatePage(documentId: $documentId, data: $data) {
      documentId
      Style {
        ... on ComponentTypeChoixPoliceHtml {
          Police {
            Font
          }
          Elements {
            Nom
          }
        }
      }
    }
  }
`;
