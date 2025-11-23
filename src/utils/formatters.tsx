import { Moment } from "@/types/api";
import { Paragraph, TextChild } from '@/types/api';

export function formatGroupInvite(personnes: { Prenom: string | null; Nom: string | null }[]) {
  if (!personnes || personnes.length === 0) return "";

  // Filtrer les personnes valides (au moins un nom ou prénom)
  const valides = personnes.filter(p => p.Prenom || p.Nom);

  if (valides.length === 0) return "";

  // Regrouper les personnes par nom
  const groupeParNom = new Map<string, string[]>();

  for (const p of valides) {
    const nom = p.Nom ?? "";
    const prenom = p.Prenom ?? "";
    if (!prenom && !nom) continue;

    if (!groupeParNom.has(nom)) {
      groupeParNom.set(nom, []);
    }

    groupeParNom.get(nom)!.push(prenom);
  }

  // Construire le rendu formaté
  const result: string[] = [];

  for (const [nom, prenoms] of groupeParNom.entries()) {
    const nomsFormates = formatPrenoms(prenoms);
    if (nom.trim() === "") {
      result.push(nomsFormates);
    } else {
      result.push(`${nomsFormates} ${nom}`);
    }
  }

  return result.join(", ");
}

// Fonction pour formater les prénoms comme "Alice", "Alice & Bob", "Alice, Bob & Clara"
export function formatPrenoms(prenoms: string[]) {
  const valides = prenoms.filter(p => p.trim() !== "");
  if (valides.length === 0) return "";
  if (valides.length === 1) return valides[0];
  if (valides.length === 2) return `${valides[0]} & ${valides[1]}`;
  return `${valides.slice(0, -1).join(", ")} & ${valides[valides.length - 1]}`;
}

export function getMomentsFromQuand(quand: string): Moment[] {
  switch (quand) {
    case "Journee":
      return ["Matin", "Midi", "Soir", "Retour"];
    case "Matin_and_Soir":
      return ["Matin", "Soir"];
    case "Matin":
      return ["Matin"];
    default:
      return [];
  }
}

export function normalize(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

interface Props {
  paragraphs: Paragraph[] | null | undefined;
}

const RenderParagraphText: React.FC<Props> = ({ paragraphs }) => {
  if (!paragraphs || paragraphs.length === 0) {
    return null;
  }

  return (
    <div>
      {paragraphs.map((paragraph, index) => (
        <div key={index}>
          {paragraph.children?.map((child: TextChild, childIndex) => (
            <p className="leading-none" key={childIndex}>{child.text}</p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RenderParagraphText;

export function isEmptyParagraph(paragraphs: Paragraph[]): boolean {
  return paragraphs.every(paragraph =>
    paragraph.children.every(child => child.text.trim() === "")
  );
}

export function transformDateToString(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { weekday:'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

export function transformDateToHourString(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  console.log('Transforming date to hour string:', date.toLocaleTimeString('fr-FR', options));
  return date.toLocaleTimeString('fr-FR', options);
}