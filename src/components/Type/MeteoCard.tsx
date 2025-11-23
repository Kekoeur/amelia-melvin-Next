import React from 'react';
import { Meteo } from '@/types/api';

interface MeteoCardProps {
  meteo: Meteo;
  date: string;
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

const MeteoCard: React.FC<MeteoCardProps> = ({ meteo, date }) => {
  return (
    <div className="meteo-card">
      <div className="meteo-header">
        <span className="meteo-icon">{getWeatherIcon(meteo.weatherCode)}</span>
        <div className="meteo-date">
          <p className="meteo-label">Météo prévue</p>
          <p className="meteo-date-value">{new Date(date).toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}</p>
        </div>
      </div>
      
      <div className="meteo-body">
        <h4 className="meteo-description">{meteo.description}</h4>
        
        <div className="meteo-details">
          <div className="meteo-item">
            <span className="meteo-item-icon">🌡️</span>
            <div className="meteo-item-content">
              <p className="meteo-item-label">Températures</p>
              <p className="meteo-item-value">
                {meteo.tempMin}°C - {meteo.tempMax}°C
              </p>
            </div>
          </div>
          
          <div className="meteo-item">
            <span className="meteo-item-icon">💧</span>
            <div className="meteo-item-content">
              <p className="meteo-item-label">Précipitations</p>
              <p className="meteo-item-value">{meteo.precipitation} mm</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="meteo-footer">
        <p className="meteo-disclaimer">
          ⚠️ Prévisions indicatives - À confirmer plus près de la date
        </p>
      </div>
    </div>
  );
};

export default MeteoCard;