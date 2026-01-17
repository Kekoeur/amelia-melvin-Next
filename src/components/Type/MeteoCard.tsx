import React from 'react';
import { Meteo } from '@/types/api';
import { transformDateToDay } from '@/utils/formatters'

interface MeteoCardProps {
  meteo: Meteo;
  date: string;
  colorBackground?: string;
  colorGradDivider?: string;
  colorGradBack?: string;
}

const getWeatherIcon = (code: number): string => {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '🌨️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '❄️';
  return '⛈️';
};

const MeteoCard: React.FC<MeteoCardProps> = ({ meteo, date, colorBackground, colorGradBack, colorGradDivider }) => {
  return (
    <div className="meteo-card">
      {/* Section date */}
    <div className="meteo-date-section" style={{background: colorBackground}}>
      <div className="meteo-date-large">
        {transformDateToDay(new Date(date)).toString().split('').map((digit, index) => (
          <span key={index} className="meteo-date-digit">{digit}</span>
        ))}
      </div>
      <div className="meteo-date-label">
        {new Date(date).toLocaleDateString('fr-FR', { month: 'short' })}
      </div>
    </div>

      {/* Section icône */}
      <div className="meteo-icon-section">
        <div className="meteo-icon-large">{getWeatherIcon(meteo.weatherCode)}</div>
      </div>

      {/* Section infos */}
      <div className="meteo-info-section" style={{background: colorBackground}}>
        <div className='meteo-info-containeur'>
          <div className="meteo-info-title">Prévision</div>
          <div className="meteo-info-data">
            <div className="meteo-temp meteo-group-data">
              <div className='meteo-title-info-data'>Températures</div>
              <div className='meteo-text-info-data'>
                <span className="meteo-temp-icon">🌡️</span>
                {meteo.tempMin}°C - {meteo.tempMax}°C
              </div>
            </div>
            <div className="meteo-precip meteo-group-data">
              <div className='meteo-title-info-data'>Précipitations</div>
              <div className='meteo-text-info-data'>
                <span className="meteo-precip-icon">💧</span>
                {meteo.precipitation} MM
              </div>
            </div>
          </div>
        </div>
        <div className="meteo-info-footer">{meteo.description}</div>
        <div className="meteo-footer">
          <p className="meteo-disclaimer">
            ⚠️ Prévisions indicatives - À confirmer plus près de la date
          </p>
        </div>
      </div>

    </div>
  );
};

export default MeteoCard;