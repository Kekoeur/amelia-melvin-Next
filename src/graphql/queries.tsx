import { gql } from "@apollo/client";

// Query SANS Style (pour les pages normales)
export const GET_PAGE_DATA = gql`
    # Tous tes fragments existants...
    fragment ListeFields on ComponentTypeListeString {
        id
        Elt
    }

    fragment ListContactFields on ComponentTypeListContact {
        id
        Titre
        Desc
        Contact {
            ...ContactFields
        }
    }

    fragment ImageFields on ComponentMediaImageMedia {
        id
        ImgTitle
        ImgAlt
        Image {
            url
        }
    }

    fragment PersonneFields on ComponentPresentationPresentation {
        id
        Personne
        ListeSurnom {
            ...ListeFields
        }
        ListLien {
            ...ListeFields
        }
        Presentation
        Profession
        ProfilPicture {
            ...ImageFields
        }
        Type
    }

    fragment EventFields on ComponentPresentationDateHistoire {
        id
        Titre
        Lieu
        Image {
            ...ImageFields
        }
        Desc
        Date
    }

    fragment ContactFields on ComponentTypeContact {
        id
        Nom
        NumTel
    }

    query GetPageData($documentId: ID!) {
        page(documentId: $documentId) {
            documentId
            Nom
            Slug
            Couleur {
                CouleurBasic
            }
            MainTitle {
                Titre
                Desc
            }
            Visible {
                Visibility
                AlternatifText
            }
            Section {
                ... on ComponentSectionFormInvite {
                    id
                    Titre
                    DisplayInput {
                        id
                        Question
                        InputType
                    }
                }
                
                ... on ComponentSectionHeading {
                    id
                    Image {
                        ...ImageFields
                    }
                    Logo {
                        ...ImageFields
                    }
                    Titre
                }
                
                ... on ComponentSectionPresentation {
                    id
                    TitreMaries
                    Maries {
                        ...PersonneFields
                    }
                    TitreTemoin
                    Temoins {
                        ...PersonneFields
                    }
                    TitreHonneur
                    Honneur {
                        ...PersonneFields
                    }
                    TitreMaitreTemps
                    MaitreTemps {
                        ...PersonneFields
                    }
                }

                ... on ComponentSectionHistoire {
                    id
                    Titre
                    Event {
                        ...EventFields
                    }
                }

                ... on ComponentSectionSectionDate {
                    id
                    Date
                    event {
                        ...EventFields
                    }
                }

                ... on ComponentSectionTitreText {
                    id
                    Titre
                    Desc
                }

                ... on ComponentSectionImageDivider {
                    id
                    Titre
                    Image {
                        ...ImageFields
                    }
                }

                ... on ComponentInfosLieu {
                    id
                    Latitude
                    Longitude
                    Titre
                    Plan {
                        ...ImageFields
                    }
                }

                ... on ComponentInfosTrajet {
                    id
                    Titre
                    url
                    Logo {
                        ...ImageFields  
                    }
                }

                ... on ComponentInfosContact {
                    id
                    Titre
                    Desc
                    Contact {
                        ...ListContactFields
                    }
                }
            }
        }
    }
`;

// Query AVEC Style (pour l'admin et la récupération des styles)
export const GET_PAGE_STYLES = gql`
    query GetPageStyles($documentId: ID!) {
        page(documentId: $documentId) {
            documentId
            Nom
            Slug
            Style {
                __typename
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

export const GET_NAVIGATION = gql`
    query getNavigation($navigationIdOrSlug: String!) {
        renderNavigation(navigationIdOrSlug: $navigationIdOrSlug) {
            title
            path
            menuAttached
            related {
                __typename
                ... on Page {
                documentId
                }
            }
            parent {
                title
                path
                parent {
                    title
                    path
                }
            }
        }
    }
`;

export const GET_INVITES = gql`
    query GetInvite {
        invites {
            documentId
            Reponse
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
            Message
            Allergies
            createdAt
            updatedAt
            publishedAt
        }
    }
`;

export const GET_ALLERGENES = gql`
    query GetAllergenes {
        allergenes {
            documentId
            Nom
            createdAt
            updatedAt
            publishedAt
        }
    }
`;