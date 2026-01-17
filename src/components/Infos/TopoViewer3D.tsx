'use client';

import React, { useEffect, useRef } from 'react';
import { FileMedia } from '@/types/api';

interface TopoViewer3DProps {
  file: FileMedia;
  title?: string;
}

const TopoViewer3D: React.FC<TopoViewer3DProps> = ({ file, title = 'Topographie 3D' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileUrl = process.env.NEXT_PUBLIC_STRAPI_URL + file.url;

  useEffect(() => {
    // Import model-viewer dynamically to avoid SSR issues
    import('@google/model-viewer').catch(console.error);
  }, []);

  return (
    <div className="topo3d-container">
      <h3 className="topo3d-title">{title}</h3>

      <div className="topo3d-canvas-wrapper" ref={containerRef}>
        {/* @ts-expect-error - model-viewer is a web component */}
        <model-viewer
          src={fileUrl}
          alt={title}
          camera-controls
          auto-rotate
          shadow-intensity="1"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="topo3d-controls-hint">
        <span>🖱️ Clic + glisser : Rotation</span>
        <span>🖱️ Molette : Zoom</span>
        <span>🖱️ Deux doigts : Déplacer</span>
      </div>

      <div className="topo3d-actions">
        <a
          href={fileUrl}
          download={file.name}
          className="topo3d-download-button"
        >
          Telecharger le fichier 3D
        </a>
      </div>
    </div>
  );
};

export default TopoViewer3D;
