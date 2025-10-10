// PAGE

export interface ListInvites {
  invites: Invite[];
}

export interface PageData {
    Nom: string;
    Slug: string;
    Sections: Section[];
}

export type Section = "";

export type Moment = "Matin" | "Midi" | "Soir" | "Retour";

export type InvitePerson = { Prenom: string; Nom: string };

// INVITES 

export interface Invite {
    id: string
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
}