import { ComponentInfosDiapo } from '@/types/api';
import React from 'react';

interface DiapoProps {
    section: ComponentInfosDiapo;
    colorBackground?: string;
    colorGradDivider?: string;
    colorGradBack?: string;
}

const Diapo: React.FC<DiapoProps> = ({ section, colorBackground }) => {
  const getEmbedUrl = (url: string): string | null => {
    // Google Slides
    if (url.includes('docs.google.com/presentation')) {
      const embedUrl = url.replace('/edit', '/embed').replace('/view', '/embed');
      return embedUrl.includes('/embed') ? embedUrl : `${url}/embed`;
    }
    // Google Drive
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
    }
    // Canva
    if (url.includes('canva.com')) {
      return url.includes('/embed') ? url : url.replace('/view', '/embed');
    }
    return null;
  };

  const embedUrl = getEmbedUrl(section.LienDiapo);
  const isEmbeddable = !!embedUrl;

  return (
    <div className="diapo-container" style={{ background: colorBackground }}>
      <h3 className="diapo-title">Diaporama</h3>

      {isEmbeddable ? (
        <div className="diapo-embed-wrapper">
          <iframe
            src={embedUrl}
            allowFullScreen
            title="Diaporama"
          />
        </div>
      ) : (
        <div className="diapo-link-wrapper">
          <span className="diapo-icon">📸</span>
          <a
            href={section.LienDiapo}
            target="_blank"
            rel="noopener noreferrer"
            className="diapo-link"
          >
            Voir le diaporama
            <span className="diapo-link-arrow">→</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default Diapo;
