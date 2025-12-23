import { Allergenes, Invite, Personne } from "@/types/api";
import { useState } from "react";
import CustomSelect from "../Type/CustomSelect";

interface Props {
  invite: Invite;
  allergenes: Allergenes[];
  onAllergiesChange?: (allergies: AllergySelection[]) => void;
}

export interface AllergySelection {
  allergen: string;
  customName: string;
  persons: Personne[];
}

export default function AllergiesForm({ invite, allergenes, onAllergiesChange }: Props) {
  const [allergySelections, setAllergySelections] = useState<AllergySelection[]>([]);

  const persons = invite?.Qui || [];

  const handleAddLine = () => {
    const newSelections = [
      ...allergySelections,
      { allergen: "", customName: "", persons: [] }
    ];
    setAllergySelections(newSelections);
    onAllergiesChange?.(newSelections);
  };

  const handleRemoveLine = (index: number) => {
    const newSelections = allergySelections.filter((_, i) => i !== index);
    setAllergySelections(newSelections);
    onAllergiesChange?.(newSelections);
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
    onAllergiesChange?.(updated);
  };

  const handlePersonToggle = (index: number, person: Personne) => {
    const updated = [...allergySelections];
    const selected = updated[index].persons;

    const alreadySelected = selected.some(
      p => p.Prenom === person.Prenom && p.Nom === person.Nom
    );
    
    updated[index].persons = alreadySelected
      ? selected.filter(p => !(p.Prenom === person.Prenom && p.Nom === person.Nom))
      : [...selected, person];

    setAllergySelections(updated);
    onAllergiesChange?.(updated);
  };

  // Préparer les options pour le CustomSelect
  const allergeneOptions = [
    { value: "", label: "Choisir un allergène" },
    ...allergenes.map(allergen => ({
      value: allergen.Nom,
      label: allergen.Nom
    }))
  ];

  return invite ? (
    <div className="allergies-form-container">
      <div className="allergies-title glass-card-title">Allergies alimentaires</div>
      <p className="allergies-subtitle glass-card-subtitle">
        Vous pouvez nous faire part de vos allergies en l'ajoutant, n'oubliez pas d'indiquer qui est allergique
      </p>
      
      <div className="allergies-container">
        <div className="small-divider"></div>
        {allergySelections.length === 0 ? (
          <div className="no-allergies-message glass-card-subtitle">
            <p>Aucune allergie ajoutée pour le moment.</p>
          </div>
        ) : (
          allergySelections.map((selection, index) => (
            <div key={index} className="allergie-card">
              <div className="allergie-card-header">
                <span className="allergie-card-number">Allergie #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveLine(index)}
                  className="allergie-remove-btn"
                  aria-label="Supprimer cette allergie"
                >
                  ❌
                </button>
              </div>

              <div className="allergie-item">
                <CustomSelect
                  id={`allergie-${index}`}
                  value={selection.allergen}
                  onChange={(value) => handleChange(index, "allergen", value)}
                  options={allergeneOptions}
                  placeholder="Choisir un allergène"
                />
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
                <div className="person-cards person-cards-horizontal">
                  {persons.map((person, personIndex) => {
                    const isSelected = selection.persons.some(
                      p => p.Prenom === person.Prenom && p.Nom === person.Nom
                    );
                    return (
                      <button
                        key={`${person.Prenom}-${person.Nom}-${personIndex}`}
                        type="button"
                        className={`person-card ${isSelected ? 'person-card-selected' : 'person-card-unselected'}`}
                        onClick={() => handlePersonToggle(index, person)}
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
            </div>
          ))
        )}

        <button
          type="button"
          onClick={handleAddLine}
          className="glass-button btn-primary allergie-add-btn"
        >
          <span>+ Ajouter une allergie</span>
        </button>
      </div>
    </div>
  ) : null;
}