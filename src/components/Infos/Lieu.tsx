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
  const dateEvent = '2025-11-30'

  console.log('Rendering InfosLieu with data:', section);

  React.useEffect(() => {
    fetch(`/api/meteo?date=${dateEvent}&lat=${section.Latitude}&lon=${section.Longitude}`)
      .then(res => res.json())
      .then(data => {
        setMeteo(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="infos-lieu">
      <h3>{section.Titre}</h3>
      
      {section.Plan?.Image?.url && (
        <Image
          src={section.Plan.Image.url}
          alt={section.Plan.ImgAlt || ''}
          title={section.Plan.ImgTitle || ''}
          width={800}
          height={600}
        />
      )}
 
      {loading && <p>Chargement de la météo...</p>}
      {meteo && !loading && <MeteoCard meteo={meteo} date={dateEvent} />}
    </div>
  );
};

export default InfosLieu;