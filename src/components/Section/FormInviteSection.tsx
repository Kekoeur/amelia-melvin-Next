"use client";

import { useState, useMemo, useEffect } from "react";
import { Invite, Moment, InvitePerson, Allergenes, ComponentSectionFormInvite } from "@/types/api";
import { formatGroupInvite, getMomentsFromQuand, normalize } from "@/utils/formatters";
import AllergiesForm from "@/utils/AllergiesForm";

interface Props {
  section: ComponentSectionFormInvite;
  invites: Invite[];
  allergenes: Allergenes[];
}

export type Step = "Nom" | Moment | "Allergies" | "Message" | "Recap";

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
    return ["Nom", ...moments, "Allergies", "Message", "Recap"];
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

      const membre = selectedInvite.Qui.find((p) => p.Prenom === prenom);
      if (!membre) return prev;

      const exists = prev[moment].some((p) => p.Prenom === membre.Prenom);

      return {
        ...prev,
        [moment]: exists
          ? prev[moment].filter((p) => p.Prenom !== membre.Prenom)
          : [...prev[moment], { Nom: membre.Nom || "", Prenom: membre.Prenom || ""}],
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
      <div className="repondre-form-container">
        <div className="confirmation-card">
          <div className="confirmation-icon">🎉</div>
          <h2 className="confirmation-title">Merci pour votre réponse !</h2>
          
          <div className="recap-section">
            <div className="recap-item">
              <strong>Invité :</strong>
              <p>{formatGroupInvite(selectedInvite!.Qui)}</p>
            </div>
            
            <div className="recap-item">
              <strong>Présence :</strong>
              <ul className="recap-list">
                {getMomentsFromQuand(selectedInvite!.Quand).map((moment) => (
                  <li key={moment}>
                    <strong>{moment} :</strong> {presence[moment].length > 0
                      ? presence[moment].map((p) => `${p.Prenom} ${p.Nom}`).join(", ")
                      : "Aucune présence"}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="recap-item">
              <strong>Allergies :</strong>
              <p>{allergie || "Aucune allergie"}</p>
            </div>
            
            <div className="recap-item">
              <strong>Message :</strong>
              <p>{message || "Aucun message"}</p>
            </div>
          </div>
          
          <a href="./" className="confirmation-link">
            {"🏠 Retour à l'accueil"}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="repondre-form-container">
      <div className="glass-card">
        <div className="glass-card-header">
          <h1 className="glass-card-title">{section.Titre}</h1>
          <p className="glass-card-subtitle">Répondez à votre invitation en quelques étapes</p>
        </div>

        {/* Étape Nom */}
        {currentStep === "Nom" && (
          <div>
            <label className="presence-title">
              {section.DisplayInput.find(input => input.InputType === currentStep)?.Question}
            </label>
            <input
              className="glass-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ex : Alice, Dupont..."
            />
            {filteredInvites.length > 0 && (
              <ul className="invite-list">
                {filteredInvites.map((invite) => (
                  <li
                    key={invite.documentId}
                    className="invite-item"
                    onClick={() => {
                      setSelectedInvite(invite);
                      setStepIndex(1);
                    }}
                  >
                    👥 {formatGroupInvite(invite.Qui)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Étapes Moments (Matin, Midi, Soir, Retour) */}
        {selectedInvite && ["Matin", "Midi", "Soir", "Retour"].includes(currentStep) && (
          <div className="presence-section">
            <p className="presence-title">
              {section.DisplayInput.find(input => input.InputType === currentStep)?.Question}
            </p>
            {selectedInvite.Qui.map((p, idx) => (
              <label key={idx} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={presence[currentStep as Moment].some(person => person.Prenom === p.Prenom)}
                  onChange={() => togglePresence(currentStep as Moment, p.Prenom || "")}
                />
                <span>👤 {p.Prenom} {p.Nom}</span>
              </label>
            ))}
          </div>
        )}

        {/* Étape Allergies (texte libre) */}
        {/*selectedInvite && currentStep === "Allergies2" && (
          <div>
            <label className="presence-title">
              {section.DisplayInput.find(input => input.InputType === currentStep)?.Question}
            </label>
            <textarea
              className="glass-textarea"
              value={allergie}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Décrivez vos allergies alimentaires..."
            />
          </div>
        )*/}

        {/* Étape Allergies (formulaire détaillé) */}
        {selectedInvite && currentStep === "Allergies" && (
          <div className="presence-section">
            {allergenes.length > 0 && (
              <AllergiesForm invite={selectedInvite} allergenes={allergenes} />
            )}
          </div>
        )}

        {/* Étape Message */}
        {selectedInvite && currentStep === "Message" && (
          <div>
            <label className="presence-title">
              {section.DisplayInput.find(input => input.InputType === currentStep)?.Question}
            </label>
            <textarea
              className="glass-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Laissez-nous un petit message..."
            />
          </div>
        )}

        {/* Étape Récapitulatif */}
        {selectedInvite && currentStep === "Recap" && (
          <div className="recap-section">
            <div className="recap-item">
              <strong>Invité :</strong>
              <p>{formatGroupInvite(selectedInvite.Qui)}</p>
            </div>
            
            <div className="recap-item">
              <strong>Présence :</strong>
              <ul className="recap-list">
                {getMomentsFromQuand(selectedInvite.Quand).map((moment) => (
                  <li key={moment}>
                    <strong>{moment} :</strong> {presence[moment].length > 0
                      ? presence[moment].map((p) => `${p.Prenom} ${p.Nom}`).join(", ")
                      : "Aucune présence"}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="recap-item">
              <strong>Allergies :</strong>
              <p>{allergie || "Aucune allergie"}</p>
            </div>
            
            <div className="recap-item">
              <strong>Message :</strong>
              <p>{message || "Aucun message"}</p>
            </div>
          </div>
        )}

        {/* Indicateur de progression */}
        {selectedInvite && (
          <div className="progress-indicator">
            {steps.slice(1).map((step, index) => (
              <span 
                key={index} 
                className={`progress-dot ${
                  index < stepIndex - 1 
                    ? 'completed' 
                    : index === stepIndex - 1 
                    ? 'current' 
                    : 'pending'
                }`}
              >
                {index < stepIndex - 1 ? "✔️" : index === stepIndex - 1 ? "●" : "○"}
              </span>
            ))}
          </div>
        )}

        {/* Navigation */}
        {selectedInvite && (
          <div className="step-navigation">
            {stepIndex > 1 && (
              <button
                onClick={() => setStepIndex((prev) => Math.max(prev - 1, 1))}
                className="glass-button btn-secondary"
              >
                <span>← Retour</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="glass-button btn-danger"
            >
              <span>🔄 Réinitialiser</span>
            </button>

            {currentStep !== "Recap" ? (
              <button
                onClick={() => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))}
                className="glass-button btn-primary"
              >
                <span>Suivant →</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="glass-button btn-success"
              >
                <span>✓ Envoyer</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}