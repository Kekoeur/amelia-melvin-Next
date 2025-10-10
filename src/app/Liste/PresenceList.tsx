import React from "react";
import { ListInvites, Invite, Personne, Moment } from "@/types/api"; // adapte le chemin si besoin

const PresenceList: React.FC<ListInvites> = ({ invites }) => {
  const getPeopleByMoment = (moment: Moment): Personne[] => {
    const peopleMap = new Map<number, Personne>();

    invites.forEach(invite => {
      if (!invite.Reponse || !invite[moment]) return;
      invite[moment]?.forEach(person => {
        if (!peopleMap.has(person.id)) {
          peopleMap.set(person.id, person);
        }
      });
    });

    return Array.from(peopleMap.values());
  };

  const momentLabels: Record<Moment, string> = {
    Matin: "Présents le matin",
    Midi: "Présents le midi",
    Soir: "Présents le soir",
    Retour: "Présents pour le retour"
  };

  return (
    <div className="space-y-6">
      {(Object.keys(momentLabels) as Moment[]).map(moment => {
        const people = getPeopleByMoment(moment);
        if (people.length === 0) return null;

        return (
          <div key={moment}>
            <h2 className="text-xl font-semibold mb-2">
              {momentLabels[moment]} : 👥 {people.length} personne(s)
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {people.map(person => (
                <li key={moment + person.id}>
                  {person.Prenom} {person.Nom}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default PresenceList;
