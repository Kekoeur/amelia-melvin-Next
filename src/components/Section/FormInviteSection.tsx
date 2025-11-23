"use client";

import { useState, useMemo, useEffect, Component } from "react";
import { Invite, Moment, InvitePerson, Allergenes, ComponentSectionFormInvite } from "@/types/api";
import { formatGroupInvite, getMomentsFromQuand, normalize } from "@/utils/formatters";
import AllergiesForm from "@/utils/AllergiesForm";

interface Props {
  section: ComponentSectionFormInvite;
  invites: Invite[];
  allergenes: Allergenes[];
}

export type Step = "Nom" | Moment | "Allergies" | "Allergies2" | "Message" | "Recap";

export default function RepondreForm({ section, invites, allergenes }: Props) {

  const [search, setSearch] = useState("");
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);
  const [presence, setPresence] = useState<Record<Moment, InvitePerson[]>>({
    Matin: [],
    Midi: [],
    Soir: [],
    Retour: [],
  });
  const [allergie, setAllergies] = useState("");
  const [message, setMessage] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const steps = useMemo<Step[]>(() => {
    if (!selectedInvite) return ["Nom"];
    const moments = getMomentsFromQuand(selectedInvite.Quand);
    return ["Nom", ...moments, "Allergies", "Allergies2", "Message", "Recap"];
  }, [selectedInvite]);

  const currentStep = steps[stepIndex];

  const filteredInvites = useMemo(() => {
    if (!search || search.length < 2) return [];

    const normalizedSearch = normalize(search);
    return invites
      .filter((invite) =>
        !invite.Reponse &&
        invite.Qui.some(
          (person) =>
            normalize(`${person.Prenom} ${person.Nom}`).includes(normalizedSearch)
        )
      )
      .slice(0, 5);
  }, [search, invites]);

  const togglePresence = (moment: Moment, prenom: string) => {
    setPresence((prev) => {
      if (!selectedInvite) return prev;

      // On cherche la personne complète
      const membre = selectedInvite.Qui.find((p) => p.Prenom === prenom);
      if (!membre) return prev;

      const exists = prev[moment].some((p) => p.Prenom === membre.Prenom);

      return {
        ...prev,
        [moment]: exists
          ? prev[moment].filter((p) => p.Prenom !== membre.Prenom)
          : [...prev[moment], {  Nom: membre.Nom || "", Prenom: membre.Prenom || ""}],
      };
    });
  };




  const handleSubmit = async () => {
    if (!selectedInvite) return;

    const payload = {
      id: selectedInvite.documentId,
      Reponse: true,
      Matin: presence.Matin,
      Midi: presence.Midi,
      Soir: presence.Soir,
      Retour: presence.Retour,
      Allergies: allergie,
      Message: message,
    };

    await fetch("/api/reponse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedInvite(null);
    setPresence({ Matin: [], Midi: [], Soir: [], Retour: [] });
    setAllergies("");
    setMessage("");
    setStepIndex(0);
  };

  // Pré-cocher les présences au moment de la sélection
  useEffect(() => {
    if (selectedInvite) {
      const moments = getMomentsFromQuand(selectedInvite.Quand);
      const newPresence: Record<Moment, { Prenom: string; Nom: string }[]> = {
        Matin: [],
        Midi: [],
        Soir: [],
        Retour: [],
      };
      for (const moment of moments) {
        newPresence[moment] = selectedInvite.Qui.map((p) => ({
          Prenom: p.Prenom || "",
          Nom: p.Nom || "",
        }));
      }
      setPresence(newPresence);
    }
  }, [selectedInvite]);


  if (submitted) {
    return (
      <div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Merci pour votre réponse !</h2>
          <p><strong>Invité :</strong> {formatGroupInvite(selectedInvite!.Qui)}</p>
          <p><strong>Présence :</strong></p>
          <ul className="list-disc ml-6">
            {getMomentsFromQuand(selectedInvite!.Quand).map((moment) => (
              <li key={moment}>
                {moment} : { presence[moment].length > 0
                  ? presence[moment].map((p) => `${p.Prenom} ${p.Nom}`).join(", ")
                  : "Aucune présence"}

              </li>
            ))}
          </ul>
          <p><strong>Allergies :</strong> {allergie || "Aucune allergie"}</p>
          <p><strong>Message :</strong> {message || "Aucun message"}</p>
        </div>
        
        <a href="./">Accueil</a>
      </div>
    );
  }

  console.log("Section dans RepondreForm :", section);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{section.Titre}</h1>
      <div className="space-y-4">
        {currentStep === "Nom" && (
          <div>
            <label className="block mb-2">
              {section.DisplayInput.find(input => input.InputType === currentStep)?.Question}
            </label>
            <input
              className="border px-3 py-2 w-full rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ex : Alice, Dupont..."
            />
            {filteredInvites.length > 0 && (
              <ul className="mt-2 space-y-2">
                {filteredInvites.map((invite) => (
                  <li
                    key={invite.documentId}
                    className="cursor-pointer p-2 bg-gray-100 hover:bg-gray-200 rounded"
                    onClick={() => {
                      setSelectedInvite(invite);
                      setStepIndex(1);
                    }}
                  >
                    {formatGroupInvite(invite.Qui)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {selectedInvite && ["Matin", "Midi", "Soir", "Retour"].includes(currentStep) && (
          <div>
            <p className="font-bold mb-2">
              {section.DisplayInput.find(input => input.InputType === currentStep)?.Question}
            </p>
            {selectedInvite.Qui.map((p, idx) => (
              <label key={idx} className="block">
                <input
                  type="checkbox"
                  checked={presence[currentStep as Moment].some(person => person.Prenom === p.Prenom)}
                  onChange={() => togglePresence(currentStep as Moment, p.Prenom || "")}
                  className="mr-2"
                />
                {p.Prenom}
              </label>
            ))}
          </div>
        )}

        {selectedInvite && currentStep === "Allergies" && (
          <div>
            <label className="block mb-1">
              {section.DisplayInput.find(input => input.InputType === currentStep)?.Question}
            </label>
            <textarea
              className="border w-full px-3 py-2 rounded"
              value={allergie}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>
        )}

        {selectedInvite && currentStep === "Allergies2" && (
          <div>
            {allergenes.length > 0 && (
              <AllergiesForm invite={selectedInvite} allergenes={allergenes} />
            )}
          </div>
        )}

        {selectedInvite && currentStep === "Message" && (
          <div>
            <label className="block mb-1">
              {section.DisplayInput.find(input => input.InputType === currentStep)?.Question}
            </label>
            <textarea
              className="border w-full px-3 py-2 rounded"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        )}

        {selectedInvite && currentStep === "Recap" && (
          <div className="space-y-2">
            <p><strong>Invité :</strong> {formatGroupInvite(selectedInvite.Qui)}</p>
            <ul className="list-disc ml-6">
              {getMomentsFromQuand(selectedInvite!.Quand).map((moment) => (
                <li key={moment}>
                  {moment} : { presence[moment].length > 0
                    ? presence[moment].map((p) => `${p.Prenom} ${p.Nom}`).join(", ")
                    : "Aucune présence"}

                </li>
              ))}
            </ul>
            <p><strong>Allergies :</strong> {allergie || "Aucune allergie"}</p>
            <p><strong>Message :</strong> {message || "Aucun message"}</p>
          </div>
        )}

        {/* Navigation */}
        {selectedInvite && (
          <div className="flex justify-between gap-4">
            {stepIndex > 1 && (
              <button
                onClick={() => setStepIndex((prev) => Math.max(prev - 1, 1))}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Retour
              </button>
            )}
            {selectedInvite && (
              <div className="flex justify-center gap-2 mb-4">
                {steps.slice(1).map((step, index) => (
                  <span key={index} className="text-xl">
                    {index < stepIndex - 1
                      ? "✔️"
                      : index === stepIndex - 1
                      ? "●"
                      : "○"}
                  </span>
                ))}
              </div>
            )}
            <button
              onClick={handleReset}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-auto"
            >
              Réinitialiser
            </button>

            {currentStep !== "Recap" ? (
              <button
                onClick={() => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Envoyer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
