import { Allergenes, Invite, Personne } from "@/types/api";
import { useState } from "react";

interface Props {
  invite: Invite;
  allergenes: Allergenes[];
}

interface AllergySelection {
  allergen: string;
  customName: string;
  persons: Personne[];
}

export default function AllergiesForm({ invite, allergenes }: Props) {
  const [allergySelections, setAllergySelections] = useState<AllergySelection[]>([
    { allergen: "", customName: "", persons: [] }
  ]);

  const persons = invite?.Qui || [];

  const handleAddLine = () => {
    setAllergySelections([
      ...allergySelections,
      { allergen: "", customName: "", persons: [] }
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (allergySelections.length > 1) {
      setAllergySelections(allergySelections.filter((_, i) => i !== index));
    }
  };

  const handleChange = (
    index: number,
    field: "allergen" | "customName",
    value: string
  ) => {
    const updated = [...allergySelections];
    if (field === "allergen") {
      updated[index].allergen = value;
      if (value !== "Autres") {
        updated[index].customName = "";
      }
    } else if (field === "customName") {
      updated[index].customName = value;
    }
    setAllergySelections(updated);
  };

  const handlePersonToggle = (index: number, person: Personne) => {
    const updated = [...allergySelections];
    const selected = updated[index].persons;

    const alreadySelected = selected.some(p => p.id === person.id);
    updated[index].persons = alreadySelected
      ? selected.filter(p => p.id !== person.id)
      : [...selected, person];

    setAllergySelections(updated);
  };

  return invite ? (
    <div className="allergies-form-container">
      <h3 className="allergies-title">🥜 Allergies alimentaires</h3>
      <p className="allergies-subtitle">
        Indiquez les allergies de chaque membre de votre groupe
      </p>

      {allergySelections.map((selection, index) => (
        <div key={index} className="allergie-card">
          <div className="allergie-card-header">
            <span className="allergie-card-number">Allergie #{index + 1}</span>
            {allergySelections.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveLine(index)}
                className="allergie-remove-btn"
                aria-label="Supprimer cette allergie"
              >
                ❌
              </button>
            )}
          </div>

          <div className="allergie-item">
            <label className="allergie-label">
              Sélectionnez un allergène :
            </label>
            <select
              className="glass-select"
              value={selection.allergen}
              onChange={(e) => handleChange(index, "allergen", e.target.value)}
            >
              <option value="">-- Choisir un allergène --</option>
              {allergenes.map((allergen) => (
                <option key={allergen.Nom} value={allergen.Nom}>
                  {allergen.Nom}
                </option>
              ))}
            </select>
          </div>

          {selection.allergen === "Autres" && (
            <div className="allergie-item">
              <label className="allergie-label">
                {"Précisez l'allergie :"}
              </label>
              <input
                type="text"
                className="glass-input"
                placeholder="Ex : Kiwi, Ananas..."
                value={selection.customName}
                onChange={(e) => handleChange(index, "customName", e.target.value)}
              />
            </div>
          )}

          <div className="allergie-item">
            <label className="allergie-label">
              Qui est concerné ?
            </label>
            <div className="allergie-checkbox-group">
              {persons.map((person) => (
                <label
                  key={person.id}
                  className="allergie-checkbox-label"
                >
                  <input
                    type="checkbox"
                    checked={selection.persons.some(p => p.id === person.id)}
                    onChange={() => handlePersonToggle(index, person)}
                  />
                  <span>👤 {`${person.Prenom ?? ""} ${person.Nom ?? ""}`}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddLine}
        className="glass-button btn-primary allergie-add-btn"
      >
        <span>➕ Ajouter une allergie</span>
      </button>
    </div>
  ) : null;
}