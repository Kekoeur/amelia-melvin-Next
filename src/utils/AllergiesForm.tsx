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

  const handleChange = (
    index: number,
    field: "allergen" | "customName",
    value: string
  ) => {
    const updated = [...allergySelections];
    if (field === "allergen") {
      updated[index].allergen = value;
      if (value !== "Autre") {
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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Allergies</h3>

      {allergySelections.map((selection, index) => (
        <div key={index} className="border p-4 rounded bg-gray-50">
          <label className="block mb-2">Sélectionne un allergène :</label>
          <select
            className="w-full p-2 border rounded"
            value={selection.allergen}
            onChange={(e) =>
              handleChange(index, "allergen", e.target.value)
            }
          >
            <option value="">-- Choisir --</option>
            {allergenes.map((allergen) => (
              <option key={allergen.Nom} value={allergen.Nom}>
                {allergen.Nom}
              </option>
            ))}
          </select>

          {selection.allergen === "Autres" && (
            <input
              type="text"
              className="mt-2 w-full p-2 border rounded"
              placeholder="Nom de l’allergie"
              value={selection.customName}
              onChange={(e) =>
                handleChange(index, "customName", e.target.value)
              }
            />
          )}

          <div className="mt-4">
            <label className="block mb-2">Associer à :</label>
            <div className="space-y-1">
              {persons.map((person) => (
                <label
                  key={person.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={selection.persons.some(p => p.id === person.id)}
                    onChange={() => handlePersonToggle(index, person)}
                  />
                  <span>{`${person.Prenom ?? ""} ${person.Nom ?? ""}`}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddLine}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Ajouter une allergie
      </button>
    </div>
  ) : null;
}
