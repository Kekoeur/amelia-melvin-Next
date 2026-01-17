import React from 'react';
import { ComponentSectionTitreText, Meteo } from '@/types/api';
import RichTextRenderer from '@/components/Type/RichTypeRenderer';
import MeteoCard from '@/components/Type/MeteoCard';

interface MeteoWithDate {
  meteo: Meteo;
  date: string;
}

interface TitreTextProps {
  section: ComponentSectionTitreText;
  colorBackground?: string;
  colorGradDivider?: string;
  colorGradBack?: string;
}

const TitreTextSection: React.FC<TitreTextProps> = ({ section, colorBackground, colorGradBack, colorGradDivider }) => {
  const [meteos, setMeteos] = React.useState<MeteoWithDate[]>([]);
  const [loading, setLoading] = React.useState(false);
  const dateEvent = ['2026-08-29', '2026-08-30'];

  // Vérifier si le titre contient "météo" (insensible à la casse)
  const isMeteoSection = section.Titre.toLowerCase().includes('météo');

  React.useEffect(() => {
    if (isMeteoSection) {
      setLoading(true);
      const lat = 47.838724703701764;
      const lon = -0.9329863608049458;

      Promise.all(
        dateEvent.map(date =>
          fetch(`/api/meteo?date=${date}&lat=${lat}&lon=${lon}`)
            .then(res => {
              // Si l'API retourne une erreur (404 = date trop loin), retourner null
              if (!res.ok) {
                return null;
              }
              return res.json().then(meteo => ({ meteo, date }));
            })
            .catch(() => null) // En cas d'erreur réseau, retourner null
        )
      )
        .then(data => {
          // Filtrer les résultats null (dates sans données)
          const validMeteos = data.filter((m): m is MeteoWithDate => m !== null);
          setMeteos(validMeteos);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [isMeteoSection]);

  return (
    <div className="titre-text-container">
      <div className="titre-text-card glass-card">
        <div className="titre-text-header glass-card-title">
          <h2 className="titre-text-title">{section.Titre}</h2>
        </div>
        
        {section.Desc && (
          <div className="titre-text-content" style={{background: colorBackground + '40'}}>
            <RichTextRenderer 
              content={section.Desc}
              className="titre-text-description"
            />
          </div>
        )}

        {/* Afficher la météo si le titre contient "météo" */}
        {isMeteoSection && (
          <div className="lieu-info-section">
            {loading ? (
              <div className="meteo-loading">
                <div className="loading-spinner"></div>
              </div>
            ) : meteos.length > 0 ? (
              meteos.map((item, index) => (
                <MeteoCard
                  key={index}
                  meteo={item.meteo}
                  date={item.date}
                  colorBackground={colorBackground}
                  colorGradDivider={colorGradDivider}
                  colorGradBack={colorGradBack}
                />
              ))
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default TitreTextSection;