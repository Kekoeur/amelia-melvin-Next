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
            width
            height
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
                    ImageMaries {
                        ...ImageFields
                    }
                    TitreTemoin
                    Temoins {
                        ...PersonneFields
                    }
                    ImageTemoins {
                        ...ImageFields
                    }
                    TitreHonneur
                    Honneur {
                        ...PersonneFields
                    }
                    ImageHonneur {
                        ...ImageFields
                    }
                    TitreMaitreTemps
                    MaitreTemps {
                        ...PersonneFields
                    }
                    ImageMaitreTemps {
                        ...ImageFields
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
                    isLast
                }

                ... on ComponentInfosLieu {
                    id
                    Latitude
                    Longitude
                    Titre
                    Plan {
                        ...ImageFields
                    }
                    Ville
                    Photo {
                        ...ImageFields
                    }
                    Topo {
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

                ... on ComponentInfosTimer {
                    id
                    StartDate
                }

                ... on ComponentInfosDiapo {
                    id
                    LienDiapo
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
                id
                Nom
                Prenom
            }
            Matin {
                id
                Nom
                Prenom
            }
            Midi {
                id
                Nom
                Prenom
            }
            Soir {
                id
                Nom
                Prenom
            }
            Retour {
                id
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