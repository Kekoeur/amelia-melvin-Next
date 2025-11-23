// PAGE

export interface ListInvites {
  invites: Invite[];
}

export interface PageData {
    Nom: string;
    Slug: string;
    Section: Section[];
}

export type Section = ComponentSectionHeading | ComponentSectionFormInvite | ComponentSectionPresentation | ComponentSectionHistoire | ComponentSectionSectionDate | ComponentSectionTitreText | ComponentSectionImageDivider | ComponentInfosLieu | ComponentInfosTrajet | ComponentInfosContact;

export type Moment = "Matin" | "Midi" | "Soir" | "Retour";

export type InvitePerson = { Prenom: string; Nom: string };

// ========== Sections ==========

export interface ComponentSectionHeading {
    __typename: 'ComponentSectionHeading';
    id: string;
    Titre?: string;
    SousTitre?: string;
    Image?: ImageMedia;
    Logo?: ImageMedia;
}

export interface ComponentSectionFormInvite {
    __typename: 'ComponentSectionFormInvite';
    id: string;
    Titre: string;
    DisplayInput: DisplayInput[];
}

export interface ComponentSectionPresentation {
    __typename: 'ComponentSectionPresentation';
    id: string;
    TitreMaries: string;
    Maries: PresentationPersonne[];
    TitreTemoin: string;
    Temoins: PresentationPersonne[];
    TitreHonneur: string;
    Honneur: PresentationPersonne[];
    TitreMaitreTemps: string;
    MaitreTemps: PresentationPersonne;
}

export interface ComponentSectionHistoire {
    __typename: 'ComponentSectionHistoire';
    id: string;
    Titre: string;
    Event: HistoireEvenement[];
}

export interface ComponentSectionSectionDate {
  __typename: 'ComponentSectionSectionDate';
    id: string;
    Date: string;
    event: HistoireEvenement[];
}

export interface ComponentSectionTitreText {
    __typename: 'ComponentSectionTitreText';
    id: string;
    Titre: string;
    Desc: Paragraph[];
}

export interface ComponentSectionImageDivider {
    __typename: 'ComponentSectionImageDivider';
    id: string;
    Titre: string;
    Image: ImageMedia;
}

export interface ComponentInfosLieu {
    __typename: 'ComponentInfosLieu';
    id: string;
    Titre: string;
    Latitude: string;
    Longitude: string;
    Plan: ImageMedia;
}

export interface ComponentInfosTrajet {
    __typename: 'ComponentInfosTrajet';
    id: string;
    Titre: string;
    url: string;
    Logo: ImageMedia
}

export interface ComponentInfosContact {
    __typename: 'ComponentInfosContact';
    id: string;
    Titre: string;
    Desc: Paragraph[];
    Contact: ListContact[];
}

// INVITES 

export interface Invite {
    documentId: string
    Reponse: boolean;
    Quand: string;
    Qui: Personne[];
    Message: string;
    Allergies: string;
    createdAt: Date;
    Matin: Personne[];
    Midi: Personne[];
    Soir: Personne[];
    Retour: Personne[]
}

export interface Personne {
    Nom: string;
    Prenom: string;
    id: number
}

export interface Allergenes {
    Nom: string
}


//

export interface Paragraph {
    type: string;
    children: TextChild[];
}

export interface TextChild {
  text: string;
  type: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface Meteo {
    date: Date;
    weatherCode: number;
    description: string;
    tempMin: number;
    tempMax: number;
    precipitation: number;
}


// ========== Types de base réutilisables ==========

export interface ImageMedia {
  id: string;
  ImgTitle: string;
  ImgAlt: string;
  Image?: {
    url: string;
  };
}

export interface ListeElement {
  id: string;
  Elt: string;
}

export interface PresentationPersonne {
  id: string;
  Personne: string;
  ListeSurnom: ListeElement[] | [];
  ListLien: ListeElement[] | [];
  Presentation?: Paragraph[];
  Profession?: string;
  ProfilPicture?: ImageMedia;
  Type: string;
}

export interface DisplayInput {
  id: string;
  InputType: string;
  Question: string;
}

export interface HistoireEvenement {
  id: string;
  Titre: string;
  Lieu: string;
  Image?: ImageMedia;
  Desc?: Paragraph[];
  Date: string;
}

export interface Contact {
  id: string;
  Nom: string;
  NumTel: string;
}

export interface ListContact {
  id: string;
  Titre: string;
  Desc: Paragraph[];
  Contact: Contact[];
}