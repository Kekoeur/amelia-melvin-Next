"use client";

import { useMemo, useState } from "react";
import { Invite, Personne } from "@/types/api";
import { formatGroupInvite, getMomentsFromQuand, normalize } from "@/utils/formatters";

type Moment = "Matin" | "Midi" | "Soir" | "Retour";

export default function InviteInfo({ invites }: { invites: Invite[] }) {
  const [search, setSearch] = useState("");
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);
  const [editedInvite, setEditedInvite] = useState<Invite | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateNew, setIsCreateNew] = useState(false);
  const [localInvites, setLocalInvites] = useState(invites);

  const filteredInvites = useMemo(() => {
    const normalizedSearch = normalize(search);

    return localInvites.filter((invite) =>
      invite.Qui.some((person) =>
        normalize(`${person.Prenom} ${person.Nom}`).includes(normalizedSearch)
      )
    );
  }, [localInvites, search]);

  const invitesByQuand = useMemo(() => {
    return filteredInvites.reduce<Record<string, Invite[]>>((acc, invite) => {
      if (!acc[invite.Quand]) acc[invite.Quand] = [];
      acc[invite.Quand].push(invite);
      return acc;
    }, {} as Record<string, Invite[]>);
  }, [filteredInvites]);

  const handlePresenceChange = (index: number, moment: Moment, checked: boolean) => {
    if (!editedInvite) return;

    const person = editedInvite.Qui[index];
    const updatedMomentList = new Set((editedInvite[moment] ?? []).map(p => p.Prenom));

    if (checked) updatedMomentList.add(person.Prenom);
    else updatedMomentList.delete(person.Prenom);

    const newList = editedInvite.Qui.filter(p => updatedMomentList.has(p.Prenom));
    setEditedInvite({ ...editedInvite, [moment]: newList });
  };

  const openModal = (invite: Invite) => {
    setSelectedInvite(invite);
    setEditedInvite({ ...invite, Qui: [...invite.Qui] });
    setIsModalOpen(true);
    setIsCreateNew(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvite(null);
    setEditedInvite(null);
  };

  const handleCreate = async () => {
    if (editedInvite) {
      const payload = {
        Quand: editedInvite.Quand,
        Reponse: editedInvite.Reponse,
        Qui: editedInvite.Qui,
        Matin: editedInvite.Matin,
        Midi: editedInvite.Midi,
        Soir: editedInvite.Soir,
        Retour: editedInvite.Retour,
        Allergies: editedInvite.Allergies,
        Message: editedInvite.Message,
      };

      await fetch("/api/createGroupe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      closeModal();
      setLocalInvites((prev) => [...prev, editedInvite]);
    }
  };

  const handleSave = async () => {
    if (editedInvite && selectedInvite) {
      const payload = {
        id: editedInvite.id,
        Quand: editedInvite.Quand,
        Reponse: editedInvite.Reponse,
        Qui: editedInvite.Qui,
        Matin: editedInvite.Matin,
        Midi: editedInvite.Midi,
        Soir: editedInvite.Soir,
        Retour: editedInvite.Retour
      };

      await fetch("/api/updateListe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      closeModal();
      setLocalInvites((prev) =>
        prev.map((invite) =>
          invite.id === selectedInvite.id ? { ...invite, ...editedInvite } : invite
        )
      );
    }
  };

  const handlePersonChange = (index: number, key: keyof Personne, value: string) => {
    if (!editedInvite) return;
    const updatedQui = [...editedInvite.Qui];
    updatedQui[index] = { ...updatedQui[index], [key]: value };
    setEditedInvite({ ...editedInvite, Qui: updatedQui });
  };

  const handleAddPerson = () => {
    if (!editedInvite) return;
    const updatedQui = [...editedInvite.Qui, { Nom: "", Prenom: "", id: Date.now() }];
    setEditedInvite({ ...editedInvite, Qui: updatedQui });
  };

  const handleRemovePerson = (index: number) => {
    if (!editedInvite) return;
    const personToRemove = editedInvite.Qui[index];

    const updatedQui = editedInvite.Qui.filter((_, i) => i !== index);

    const cleanMoment = (moment: Moment) =>
      (editedInvite[moment] ?? []).filter(p => p.Prenom !== personToRemove.Prenom);

    setEditedInvite({
      ...editedInvite,
      Qui: updatedQui,
      Matin: cleanMoment("Matin"),
      Midi: cleanMoment("Midi"),
      Soir: cleanMoment("Soir"),
      Retour: cleanMoment("Retour"),
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des invités</h1>

      <input
        type="text"
        placeholder="Rechercher un nom..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      />

      <button
        onClick={() => {
          const newInvite: Invite = {
            id: `new-${Date.now()}`,
            Qui: [{ Nom: "", Prenom: "", id: Date.now() }],
            Quand: "Journee",
            Allergies: "",
            Message: "",
            Reponse: false,
            Matin: [],
            Midi: [],
            Soir: [],
            Retour: [],
            createdAt: new Date(),
          };
          setEditedInvite(newInvite);
          setIsModalOpen(true);
          setIsCreateNew(true);
        }}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        ➕ Nouveau groupe
      </button>

      {Object.entries(invitesByQuand).map(([quand, group]) => {
        const moments = getMomentsFromQuand(quand);
        return (
          <div key={quand} className="mb-8 border p-4 rounded shadow">
            <p className="text-xl font-semibold mb-2">📅 {quand}</p>
            <p className="text-sm text-gray-600 mb-2">
              👥 {group.reduce((acc, i) => acc + (i.Qui?.length ?? 0), 0)} personne(s)
            </p>

            {group.map((invite) => (
              <div key={invite.id} className="border p-3 rounded mb-3 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      Réponse : {invite.Reponse ? "✅ Oui" : "❌ Non"}
                    </p>
                    <p className="text-gray-700">{formatGroupInvite(invite.Qui)}</p>
                  </div>
                  <button
                    className="text-blue-600 underline text-sm"
                    onClick={() => openModal(invite)}
                  >
                    ✏️ Modifier
                  </button>
                </div>

                {invite.Reponse && (
                  <div className="mt-2">
                    {moments.map((moment) => (
                      <div key={moment} className="ml-4">
                        <p className="text-sm font-semibold">{moment} :</p>
                        <ul className="text-sm list-disc ml-4">
                          {invite[moment]?.length ? (
                            invite[moment].map((p) => (
                              <li key={moment + p.id}>
                                {p.Prenom} {p.Nom}
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-400 italic">Personne</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}

      {isModalOpen && editedInvite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg space-y-4">
            <h2 className="text-xl font-semibold mb-2">
              {isCreateNew ? "Nouveau groupe" : "Modifier le groupe"}
            </h2>

            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={editedInvite.Reponse ?? false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setEditedInvite({
                    ...editedInvite,
                    Reponse: checked,
                    ...(checked ? {} : { Matin: [], Midi: [], Soir: [], Retour: [] }),
                  });
                }}
              />
              Présent / a répondu
            </label>

            {editedInvite.Qui.map((person, index) => (
              <div key={person.id} className="border p-2 mb-2 rounded">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={person.Prenom  ?? ""}
                    placeholder="Prénom"
                    onChange={(e) => handlePersonChange(index, "Prenom", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                  <input
                    type="text"
                    value={person.Nom ?? ""}
                    placeholder="Nom"
                    onChange={(e) => handlePersonChange(index, "Nom", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                  <button onClick={() => handleRemovePerson(index)} className="text-red-500">
                    ❌
                  </button>
                </div>

                {editedInvite.Reponse && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getMomentsFromQuand(editedInvite.Quand).map((moment) => (
                      <label key={moment} className="text-sm flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={
                            (editedInvite[moment] ?? []).some(
                              (p) => p.Prenom === person.Prenom
                            )
                          }
                          onChange={(e) =>
                            handlePresenceChange(index, moment, e.target.checked)
                          }
                        />
                        {moment}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={handleAddPerson}
              className="text-sm text-green-600 underline"
            >
              ➕ Ajouter une personne
            </button>

            <div>
              <label className="block text-sm font-medium mb-1">Quand :</label>
              <select
                value={editedInvite.Quand}
                onChange={(e) => setEditedInvite({ ...editedInvite, Quand: e.target.value })}
                className="border p-1 rounded w-full"
              >
                <option value="Journee">Journée</option>
                <option value="Matin_and_Soir">Matin & Soir</option>
                <option value="Matin">Matin</option>
              </select>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={isCreateNew ? handleCreate : handleSave}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                {isCreateNew ? "Créer" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
