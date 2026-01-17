'use client';

import { ComponentInfosTimer } from '@/types/api';
import React, { useState, useEffect } from 'react';

interface TimerProps {
  section: ComponentInfosTimer;
  colorBackground?: string;
  colorGradDivider?: string;
  colorGradBack?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Timer: React.FC<TimerProps> = ({ section, colorBackground }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const calculateTimeLeft = () => {
      const targetDate = new Date(section.StartDate).getTime();
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [section.StartDate, isClient]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  if (isExpired) {
    return (
      <div className="timer-container" style={{ background: colorBackground }}>
        <div className="timer-expired">
          <span className="timer-expired-icon">🎉</span>
          <span className="timer-expired-text">Le jour J est arrivé !</span>
        </div>
      </div>
    );
  }

  // Affichage de chargement pendant l'hydratation client
  if (!timeLeft) {
    return (
      <div className="timer-container" style={{ background: colorBackground }}>
        <h3 className="timer-title">Compte à rebours</h3>
        <div className="timer-countdown">
          <div className="timer-unit">
            <div className="timer-value">--</div>
            <div className="timer-label">Jours</div>
          </div>
          <div className="timer-separator">:</div>
          <div className="timer-unit">
            <div className="timer-value">--</div>
            <div className="timer-label">Heures</div>
          </div>
          <div className="timer-separator">:</div>
          <div className="timer-unit">
            <div className="timer-value">--</div>
            <div className="timer-label">Minutes</div>
          </div>
          <div className="timer-separator">:</div>
          <div className="timer-unit">
            <div className="timer-value">--</div>
            <div className="timer-label">Secondes</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="timer-container" style={{ background: colorBackground }}>
      <h3 className="timer-title">Compte à rebours</h3>
      <div className="timer-countdown">
        <div className="timer-unit">
          <div className="timer-value">{formatNumber(timeLeft.days)}</div>
          <div className="timer-label">Jours</div>
        </div>
        <div className="timer-separator">:</div>
        <div className="timer-unit">
          <div className="timer-value">{formatNumber(timeLeft.hours)}</div>
          <div className="timer-label">Heures</div>
        </div>
        <div className="timer-separator">:</div>
        <div className="timer-unit">
          <div className="timer-value">{formatNumber(timeLeft.minutes)}</div>
          <div className="timer-label">Minutes</div>
        </div>
        <div className="timer-separator">:</div>
        <div className="timer-unit">
          <div className="timer-value">{formatNumber(timeLeft.seconds)}</div>
          <div className="timer-label">Secondes</div>
        </div>
      </div>
      <div className="timer-target-date">
        {new Date(section.StartDate).toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </div>
    </div>
  );
};

export default Timer;
