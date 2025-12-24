"use client";

import { useState, useMemo, useEffect } from "react";
import { Invite, Moment, InvitePerson, Allergenes, ComponentSectionFormInvite } from "@/types/api";
import { formatGroupInvite, getMomentsFromQuand, normalize } from "@/utils/formatters";
import AllergiesForm, { AllergySelection } from "@/components/Section/AllergiesForm";
import TextWrapper from "../Type/TextWrapper";

interface Props {
  section: ComponentSectionFormInvite;
  invites: Invite[];
  allergenes: Allergenes[];
}

export type Step = "Nom" | "Presence" | "Allergies" | "Message" | "Recap";

export default function RepondreForm({ section, invites, allergenes }: Props) {

  const [search, setSearch] = useState("");
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);
  const [presence, setPresence] = useState<Record<Moment, InvitePerson[]>>({
    Matin: [],
    Midi: [],
    Soir: [],
    Retour: [],
  });
  const [allergies, setAllergies] = useState<AllergySelection[]>([]);
  const [message, setMessage] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const steps = useMemo<Step[]>(() => {
    if (!selectedInvite) return ["Nom"];
    return ["Nom", "Presence", "Allergies", "Message", "Recap"];
  }, [selectedInvite]);

  const currentStep = steps[stepIndex];
  
  const availableMoments = useMemo<Moment[]>(() => {
    if (!selectedInvite) return [];
    return getMomentsFromQuand(selectedInvite.Quand);
  }, [selectedInvite]);

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

  const handleAllergiesChange = (newAllergies: AllergySelection[]) => {
    setAllergies(newAllergies);
  };

  const handleSubmit = async () => {
    if (!selectedInvite) return;

    // Formater les allergies pour l'envoi
    const allergiesFormatted = allergies.map(a => ({
      allergen: a.allergen === "Autres" ? a.customName : a.allergen,
      persons: a.persons.map(p => `${p.Prenom} ${p.Nom}`).join(", ")
    })).filter(a => a.allergen && a.persons);

    const payload = {
      id: selectedInvite.documentId,
      Reponse: true,
      Matin: presence.Matin,
      Midi: presence.Midi,
      Soir: presence.Soir,
      Retour: presence.Retour,
      Allergies: JSON.stringify(allergiesFormatted),
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
    setAllergies([]);
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
      <div className="repondre-form-container section">
        <div className="confirmation-card">
          <div className="confirmation-icon">🎉</div>
          <h2 className="confirmation-title">Merci pour votre réponse !</h2>
          <p className="confirmation-message">Elle a bien été enregistré, si vous souhaitez effectuez des modifications vous pouvez nous joindre par téléphone. Vous pouvez retrouvez nos numéros ici</p>
          <a href="./presentation#contact" className="glass-button btn-success" id="contact-btn">Contact</a>
          
          <div className="recap-section glass-card">
            <div className="recap-title glass-card-title">Votre réponse</div>
            <div className="recap-item">
              <p><span className="recap-group-title">Qui :</span> {formatGroupInvite(selectedInvite!.Qui)}</p>
            </div>
            
            <div className="recap-item recap-item-presence">
              <span className="recap-group-title">Quand :</span>
              <div className="recap-moments-grid">
                {availableMoments.map((moment) => (
                  <div key={moment} className="recap-moment-section">
                    <div className="recap-group-subtitle">{moment}</div>
                    <div className="recap-cards-container">
                      {selectedInvite!.Qui.map((person, idx) => {
                        const isSelected = presence[moment].some(p => p.Prenom === person.Prenom);
                        return (
                          <div
                            key={idx}
                            className={`recap-card ${isSelected ? 'recap-selected' : 'recap-unselected'}`}
                          >
                            <span className="person-icon">{isSelected ? '✓' : '○'}</span>
                            {person.Prenom} {person.Nom}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {allergies.length > 0 && (
              <div className="recap-item recap-item-presence">
                <span className="recap-group-title">Allergies :</span>
                <div className="recap-moments-grid">
                  {allergies.map((allergy, allergyIdx) => (
                    <div key={allergyIdx} className="recap-moment-section">
                      <div className="recap-group-subtitle">
                        {allergy.allergen === "Autres" ? allergy.customName : allergy.allergen}
                      </div>
                      <div className="recap-cards-container">
                        {selectedInvite!.Qui.map((person, idx) => {
                          const isSelected = allergy.persons.some(
                            p => p.Prenom === person.Prenom && p.Nom === person.Nom
                          );
                          return (
                            <div
                              key={idx}
                              className={`recap-card ${isSelected ? 'recap-selected' : 'recap-unselected'}`}
                            >
                              <span className="person-icon">{isSelected ? '✓' : '○'}</span>
                              {person.Prenom} {person.Nom}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="recap-item">
              <span className="recap-group-title">Message :</span>
              <p className="recap-message">{message || "Aucun message"}</p>
            </div>
          </div>
          
          <a href="./accueil" className="confirmation-link btn-primary glass-button">
            {"Retour à l'accueil"}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="repondre-form-container section">
      <div className="main-card">
          <h1 className="main-card-title">
            <TextWrapper text={section.Titre} />
          </h1>
          <p className="main-card-subtitle">Répondez à votre invitation en quelques étapes</p>
      </div>
      <div className="glass-card">
        {/* Étape Nom */}
        {currentStep === "Nom" && (
          <div>
            <label className="presence-title glass-card-title">
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
                    {formatGroupInvite(invite.Qui)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Étape Présence - Tous les moments regroupés */}
        {selectedInvite && currentStep === "Presence" && (
          <div>
            <div className="presence-title glass-card-title">
                Qui sera présent ?
            </div>
            <div className="presence-grid">
              {availableMoments.map((moment, index) => (
                <div className="presence-grid-elt" key={`elt-${moment}`}>
                  <div className="moment-section">
                    <h3 className="moment-title">
                      {section.DisplayInput.find(input => input.InputType === moment)?.Question || moment}
                    </h3>
                    <div className="person-cards">
                      {selectedInvite.Qui.map((person, idx) => {
                        const isSelected = presence[moment].some(p => p.Prenom === person.Prenom);
                        return (
                          <button
                            key={idx}
                            className={`person-card ${isSelected ? 'person-card-selected' : 'person-card-unselected'}`}
                            onClick={() => togglePresence(moment, person.Prenom || "")}
                          >
                            <span className="person-icon">{isSelected ? '✓' : '○'}</span>
                            <span className="person-name">
                              {person.Prenom} {person.Nom}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {index < availableMoments.length - 1 && (
                    <div className="v-divider"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Étape Allergies (formulaire détaillé) */}
        {selectedInvite && currentStep === "Allergies" && (
          <div className="allergies-section">
            {allergenes.length > 0 && (
              <AllergiesForm 
                invite={selectedInvite} 
                allergenes={allergenes} 
                onAllergiesChange={handleAllergiesChange}
              />
            )}
          </div>
        )}

        {/* Étape Message */}
        {selectedInvite && currentStep === "Message" && (
          <div>
            <label className="presence-title glass-card-title">
              {section.DisplayInput.find(input => input.InputType === currentStep)?.Question}
            </label>
            <div className="glass-card-subtitle">Vous pouvez nous laissez un petit message si vous le souhaitez !</div>
            <textarea
              className="glass-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ecrivez-votre message ici..."
            />
          </div>
        )}

        {/* Étape Récapitulatif */}
        {selectedInvite && currentStep === "Recap" && (
          <div className="recap-section">
            <div className="recap-title glass-card-title">Confirmation</div>
            <div className="glass-card-subtitle">Veuillez à bien vérifier l'ensemble des éléments avant d'envoyer votre réponse</div>
            
            <div className="recap-item">
              <p><span className="recap-group-title">Qui :</span> {formatGroupInvite(selectedInvite.Qui)}</p>
            </div>
            
            <div className="recap-item recap-item-presence">
              <span className="recap-group-title">Quand :</span>
              <div className="recap-moments-grid">
                {availableMoments.map((moment) => (
                  <div key={moment} className="recap-moment-section">
                    <div className="recap-group-subtitle">{moment}</div>
                    <div className="recap-cards-container">
                      {selectedInvite.Qui.map((person, idx) => {
                        const isSelected = presence[moment].some(p => p.Prenom === person.Prenom);
                        return (
                          <div
                            key={idx}
                            className={`recap-card ${isSelected ? 'recap-selected' : 'recap-unselected'}`}
                          >
                            <span className="person-icon">{isSelected ? '✓' : '○'}</span>
                            {person.Prenom} {person.Nom}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Affichage des allergies */}
            {allergies.length > 0 && (
              <div className="recap-item recap-item-presence">
                <span className="recap-group-title">Allergies :</span>
                <div className="recap-moments-grid">
                  {allergies.map((allergy, allergyIdx) => (
                    <div key={allergyIdx} className="recap-moment-section">
                      <div className="recap-group-subtitle">
                        {allergy.allergen === "Autres" ? allergy.customName : allergy.allergen}
                      </div>
                      <div className="recap-cards-container">
                        {selectedInvite.Qui.map((person, idx) => {
                          const isSelected = allergy.persons.some(
                            p => p.Prenom === person.Prenom && p.Nom === person.Nom
                          );
                          return (
                            <div
                              key={idx}
                              className={`recap-card ${isSelected ? 'recap-selected' : 'recap-unselected'}`}
                            >
                              <span className="person-icon">{isSelected ? '✓' : '○'}</span>
                              {person.Prenom} {person.Nom}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="recap-item">
              <span className="recap-group-title">Message :</span>
              <p className="recap-message">{message || "Aucun message"}</p>
            </div>
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
              <span>Réinitialiser</span>
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
                <span>Envoyer</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Barre de progression */}
      <div className="progress-bar-container">
        <div className="small-divider"></div>
        <div className="progress-bar-background">
          <div 
            className="progress-bar-fill"
            style={{ 
              width: `${
                stepIndex === 0 ? 0 : ((stepIndex) / (steps.length - 1)) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
}