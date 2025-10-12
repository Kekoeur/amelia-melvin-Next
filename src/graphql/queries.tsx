import { gql } from "@apollo/client";

export const GET_PAGE_DATA = gql`
    query GetPageDate($documentId: ID!) {
        page(documentId: $documentId) {
            Nom
            Sections {
                __typename
                ... on ComponentHeadingSummaryAnimated {
                    Title
                    Summary {
                        AnimatedTitle : Title {
                            TextBefore
                            TypingElt {
                                Element
                                }
                            TextAfter
                            DelayAnimation
                        }
                        Summary
                    }
                    Button {
                        Text
                        RedirUrl
                        Type
                    }
                    Image {
                        ImgTitle
                        Image {
                            url
                            previewUrl
                            formats
                            height
                            width
                            name
                            size
                        }
                        ImgAlt
                    }
                    AnimatedType : Type
                }
                ... on ComponentHeadingSummaryBasic {
                    Title
                    Summary {
                        BasicTitle:Title
                        Summary
                    }
                    Button {
                        Text
                        RedirUrl
                        Type
                    }
                    Image {
                        ImgTitle
                        Image {
                            url
                            previewUrl
                            formats
                            height
                            width
                            name
                            size
                        }
                        ImgAlt
                    }
                    BasicType : Type
                }
                ... on ComponentSectionBasicSection {
                    Title
                    Content {
                        Title
                        Summary
                    }
                }
                ... on ComponentSectionCarrousel {
                    Element {
                        ImgTitle
                        Image {
                            url
                            previewUrl
                            formats
                            height
                            width
                            name
                            size
                        }
                        ImgAlt
                    }
                }
                ... on ComponentSectionDisplayBtn {
                    Title
                    Button {
                        Text
                        RedirUrl
                        Type
                    }
                }
                ... on ComponentSectionDisplayForm {
                    Title
                    Text
                    Form {
                        InputElt {
                            Name
                            Placeholder {
                                Icon {
                                    ImgTitle
                                    Image {
                                        url
                                        previewUrl
                                        formats
                                        height
                                        width
                                        name
                                        size
                                    }
                                    ImgAlt
                                }
                                Text
                            }
                            Size
                            Type
                            DataName
                        }
                        FormButton {
                            Text
                            RedirUrl
                            Type
                        }
                    }
                }
                ... on ComponentSectionDisplayFramedImage {
                    Title
                    Element {
                        Image {
                            ImgTitle
                            Image {
                                url
                                previewUrl
                                formats
                                height
                                width
                                name
                                size
                            }
                            ImgAlt
                        }
                        Text
                        RedirUrl
                    }
                    FramedType {
                        Type
                    }
                }
                ... on ComponentSectionDisplayGallery {
                    Element {
                        Image {
                            ImgTitle
                            Image {
                                url
                                previewUrl
                                formats
                                height
                                width
                                name
                                size
                            }
                            ImgAlt
                        }
                        Size
                    }
                }
                ... on ComponentSectionFramedBetweenImage {
                    LeftImage {
                        ImgTitle
                        Image {
                            url
                            previewUrl
                            formats
                            height
                            width
                            name
                            size
                        }
                        ImgAlt
                    }
                    UniqueFramedText: FramedText {
                        Title
                        Text
                    }
                    RightImage {
                        ImgTitle
                        Image {
                            url
                            previewUrl
                            formats
                            height
                            width
                            name
                            size
                        }
                        ImgAlt
                    }
                    FramedType {
                        Type
                    }
                }
                ... on ComponentSectionImageBetweenFramed {
                    LeftFramed {
                        Title
                        Text
                    }
                    Image {
                        ImgTitle
                        Image {
                            url
                            previewUrl
                            formats
                            height
                            width
                            name
                            size
                        }
                        ImgAlt
                    }
                    RightFramed {
                        Title
                        Text
                    }
                    FramedType {
                        Type
                    }
                }
                ... on ComponentSectionSectionLocation {
                    Title
                    Plan {
                        ImgTitle
                        Image {
                            url
                            previewUrl
                            formats
                            height
                            width
                            name
                            size
                        }
                        ImgAlt
                    }
                    AddressTitle
                    Address
                    RedirGPS {
                        Image {
                            ImgTitle
                            Image {
                                url
                                previewUrl
                                formats
                                height
                                width
                                name
                                size
                            }
                            ImgAlt
                        }
                        RedirUrl
                    }
                    ScheduleTitle
                    Schedule
                    LocationImg {
                        ImgTitle
                        Image {
                            url
                            previewUrl
                            formats
                            height
                            width
                            name
                            size
                        }
                        ImgAlt
                    }
                }
                ... on ComponentSectionSideSummary {
                    Title
                    Summary {
                        Title
                        Summary
                    }
                    SideImage {
                        ImgTitle
                        Image {
                            url
                            previewUrl
                            formats
                            height
                            width
                            name
                            size
                        }
                        ImgAlt
                    }
                    SideSummaryType : Type
                }
                ... on ComponentSectionSectionWithFramedText {
                    Title
                    MultipleFramedText: FramedText {
                        Title
                        Text
                    }
                    FramedType {
                        Type
                    }
                }
                ... on ComponentDividerImageDivider {
                    Image {
                        ImgTitle
                        Image {
                            url
                            previewUrl
                            formats
                            height
                            width
                            name
                            size
                        }
                        ImgAlt
                    }
                }
                ... on ComponentDividerLineDivider {
                    LineColor
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
            id: documentId
            Qui {
                Nom
                Prenom
            }
            Quand
            Allergies
            Message
            Reponse
            createdAt
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
`

export const GET_ALLERGENES = gql`
    query GetAllergenes {
        allergenes {
            Nom
        }
    }
`
