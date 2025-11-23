import React from 'react';
import { ComponentInfosLieu, Meteo } from '@/types/api';
import Image from 'next/image';
import MeteoCard from '@/components/Type/MeteoCard';

interface InfosLieuProps {
  section: ComponentInfosLieu;
}

const InfosLieu: React.FC<InfosLieuProps> = ({ section }) => {
  const [meteo, setMeteo] = React.useState<Meteo | null>(null);
  const [loading, setLoading] = React.useState(true);
  const dateEvent = '2025-11-30';

  console.log('Rendering InfosLieu with data:', section);

  React.useEffect(() => {
    fetch(`/api/meteo?date=${dateEvent}&lat=${section.Latitude}&lon=${section.Longitude}`)
      .then(res => res.json())
      .then(data => {
        setMeteo(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [section.Latitude, section.Longitude]);

  return (
    <div className="infos-lieu-container">
      <div className="infos-lieu-header">
        <span className="lieu-icon">📍</span>
        <h2 className="infos-lieu-title">{section.Titre}</h2>
      </div>

      <div className="lieu-content-wrapper">
        {section.Plan?.Image?.url && (
          <div className="lieu-map-section">
            <div className="lieu-map-card">
              <div className="map-image-wrapper">
                <Image
                  src={section.Plan.Image.url}
                  alt={section.Plan.ImgAlt || 'Plan du lieu'}
                  title={section.Plan.ImgTitle || ''}
                  width={800}
                  height={600}
                  className="map-image"
                />
              </div>
              
              {(section.Latitude && section.Longitude) && (
                <a 
                  href={`https://www.google.com/maps?q=${section.Latitude},${section.Longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link-button"
                >
                  <span>🗺️ Ouvrir dans Google Maps</span>
                </a>
              )}
            </div>
          </div>
        )}

        <div className="lieu-info-section">
          {loading ? (
            <div className="meteo-loading">
              <div className="loading-spinner"></div>
              <p>Chargement de la météo...</p>
            </div>
          ) : meteo ? (
            <MeteoCard meteo={meteo} date={dateEvent} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InfosLieu;