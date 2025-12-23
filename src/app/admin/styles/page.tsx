'use client';
import React, { useState, useEffect } from 'react';
import { AVAILABLE_FONTS, getFontVariable } from '@/utils/fontMapping';
import { AVAILABLE_ELEMENTS, ELEMENT_LABELS } from '@/utils/elementMapping';
import { ComponentTypeChoixPoliceHtml } from '@/types/api';

export default function StyleAdminPage() {
  const [selectedPage, setSelectedPage] = useState<string>('header');
  const [selectedFont, setSelectedFont] = useState<string>('');
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [previewElement, setPreviewElement] = useState<string>('titre-principal'); // ← CLÉ, pas label
  const [currentStyles, setCurrentStyles] = useState<ComponentTypeChoixPoliceHtml[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadPageStyles();
  }, [selectedPage]);

  const loadPageStyles = async (): Promise<void> => {
    setLoading(true);
    try {
      console.log('🔄 Chargement styles pour slug:', selectedPage);
      
      const response = await fetch('/api/styles/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: selectedPage }),
      });
      
      console.log('📥 Réponse status:', response.status);
      
      const data = await response.json();
      console.log('📦 Données reçues:', data);
      console.log('🎨 Styles extraits:', data.page?.Style);
      
      setCurrentStyles(data.page?.Style || []);
      console.log('✅ CurrentStyles mis à jour avec', data.page?.Style?.length || 0, 'styles');
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleElement = (element: string): void => {
    setSelectedElements(prev =>
      prev.includes(element)
        ? prev.filter(e => e !== element)
        : [...prev, element]
    );
  };

  const handleAddStyle = async (): Promise<void> => {
    if (!selectedFont) {
      alert('Veuillez sélectionner une police');
      return;
    }

    if (selectedElements.length === 0) {
      alert('Veuillez sélectionner au moins un élément');
      return;
    }

    const newStyle: ComponentTypeChoixPoliceHtml = {
      __typename: 'ComponentTypeChoixPoliceHtml',
      Police: { Font: selectedFont },
      Elements: selectedElements.map(nom => ({ Nom: nom })),
    };

    const updatedStyles = [...currentStyles, newStyle];
    setLoading(true);
    
    try {
      const response = await fetch('/api/styles/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: selectedPage,
          styles: updatedStyles,
        }),
      });

      if (!response.ok) throw new Error('Erreur');

      await loadPageStyles();
      setSelectedFont('');
      setSelectedElements([]);
      alert('✅ Règle ajoutée !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStyle = async (index: number): Promise<void> => {
    const updatedStyles = currentStyles.filter((_, i) => i !== index);
    setLoading(true);
    
    try {
      const response = await fetch('/api/styles/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: selectedPage,
          styles: updatedStyles,
        }),
      });

      if (!response.ok) throw new Error('Erreur');

      await loadPageStyles();
      alert('✅ Règle supprimée !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-yellow-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-rose-600 mb-8">
          🎨 Gestion des Styles
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Page à modifier
          </label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            disabled={loading}
            className="w-full p-3 border-2 border-rose-300 rounded-lg"
          >
            <option value="header">🌐 Header (Styles globaux)</option>
            <option value="home">🏠 Accueil</option>
            <option value="presentation">👥 Présentation</option>
            <option value="programme">📅 Programme</option>
            <option value="infos">ℹ️ Infos Pratiques</option>
            <option value="reponses">✉️ Réponses</option>
          </select>
          {selectedPage === 'header' && (
            <p className="text-sm text-rose-600 mt-2">
              ⚠️ Les styles s'appliquent à <strong>toutes les pages</strong>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ➕ Ajouter une règle
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Police
                  </label>
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full p-3 border-2 border-rose-300 rounded-lg"
                  >
                    <option value="">Sélectionner une police</option>
                    {AVAILABLE_FONTS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Éléments à modifier
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_ELEMENTS.map((element) => (
                      <button
                        key={element}
                        type="button"
                        onClick={() => handleToggleElement(element)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          selectedElements.includes(element)
                            ? 'bg-rose-500 text-white border-rose-600'
                            : 'bg-white text-gray-700 border-rose-300 hover:border-rose-500'
                        }`}
                      >
                        {ELEMENT_LABELS[element]}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddStyle}
                  disabled={loading}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Ajout...' : '✅ Ajouter la règle'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📋 Règles actives
              </h2>
              <div className="space-y-3">
                {currentStyles.map((style, index) => (
                  <div
                    key={index}
                    className="p-4 bg-rose-50 rounded-lg border-2 border-rose-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-bold text-rose-600 text-lg">
                        {style.Police?.Font}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStyle(index)}
                        disabled={loading}
                        className="text-red-500 hover:text-red-700 font-bold disabled:opacity-50"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium">Appliqué à :</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {style.Elements?.map((el, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white rounded-full text-sm border border-rose-300"
                          >
                            {ELEMENT_LABELS[el.Nom as keyof typeof ELEMENT_LABELS] || el.Nom}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {currentStyles.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    Aucune règle définie
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              👁️ Aperçu
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Élément à prévisualiser
              </label>
              <select
                value={previewElement}
                onChange={(e) => setPreviewElement(e.target.value)}
                className="w-full p-2 border-2 border-rose-300 rounded-lg"
              >
                {AVAILABLE_ELEMENTS.map(element => (
                  <option key={element} value={element}>
                    {ELEMENT_LABELS[element]}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-4 border-rose-200 rounded-lg p-8 bg-gradient-to-br from-yellow-50 to-rose-50">
              <PreviewComponent
                element={previewElement}
                styles={currentStyles}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewComponent({ 
  element, 
  styles 
}: { 
  element: string; 
  styles: ComponentTypeChoixPoliceHtml[] 
}) {
  console.log('🎨 Preview - Element recherché:', element);
  console.log('📦 Styles disponibles:', styles);
  
  const matchingStyle = styles.find(s => {
    console.log('🔍 Vérification style:', s);
    console.log('  - Police:', s.Police?.Font);
    console.log('  - Elements:', s.Elements);
    
    const hasMatch = s.Elements?.some(el => {
      console.log('    Comparaison:', el.Nom, '===', element, '?', el.Nom === element);
      return el.Nom === element;
    });
    
    return hasMatch;
  });
  
  console.log('✅ Style trouvé:', matchingStyle);
  
  const fontVar = matchingStyle ? getFontVariable(matchingStyle.Police.Font) : undefined;
  console.log('🔤 Variable font:', fontVar);
  
  const baseStyle = fontVar ? { fontFamily: `var(${fontVar})` } : {};
  console.log('🎨 Style appliqué:', baseStyle);

  switch (element) {
    case 'titre-principal':
      return <h1 style={baseStyle} className="text-4xl font-bold">Titre Principal</h1>;
    case 'sous-titre':
      return <h2 style={baseStyle} className="text-3xl font-semibold">Sous-titre</h2>;
    case 'titre-section':
      return <h3 style={baseStyle} className="text-2xl font-semibold">Titre de Section</h3>;
    case 'paragraphe':
      return <p style={baseStyle} className="text-lg">Ceci est un paragraphe de texte.</p>;
    case 'lien-navigation':
      return <a style={baseStyle} className="text-rose-600 text-lg">Lien de navigation</a>;
    case 'titre-courbe':
      return <div style={baseStyle} className="text-3xl">Titre Courbé</div>;
    case 'bouton':
      return <button style={baseStyle} className="bg-rose-500 text-white px-6 py-3 rounded-lg">Bouton</button>;
    case 'dropdown':
      return <div style={baseStyle} className="text-base">Option de menu</div>;
    case 'texte-formulaire':
      return <label style={baseStyle} className="text-sm">Label de formulaire</label>;
    case 'badge-profil':
      return <div style={baseStyle} className="text-xl font-bold">Prénom Nom</div>;
    default:
      console.warn('⚠️ Element non reconnu dans switch:', element);
      return <div style={baseStyle}>Élément [{element}]</div>;
  }
}