import React from 'react';
import { ComponentInfosLieu } from '@/types/api';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamic import pour éviter les problèmes SSR
const TopoViewer3D = dynamic(() => import('./TopoViewer3D'), {
  ssr: false,
  loading: () => (
    <div className="topo3d-loading">
      <span className="topo3d-loading-spinner"></span>
      <span>Chargement du viewer 3D...</span>
    </div>
  ),
});

interface InfosLieuProps {
  section: ComponentInfosLieu;
}

const InfosLieu: React.FC<InfosLieuProps> = ({ section }) => {
  return (
    <section className="infos-lieu-container">
      <h2 className="infos-lieu-title">{section.Titre}</h2>

      <p className='city-label'>
        <span className="lieu-icon">📍</span>
        {section.Ville}
      </p>

      {(section.Latitude && section.Longitude) && (
        <>
          <a
            href={`https://www.google.com/maps?q=${section.Latitude},${section.Longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link-button"
          >
            Google Maps
          </a>
          <a
            href={`https://www.waze.com/ul?ll=${section.Latitude},${section.Longitude}&navigate=yes`}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link-button"
          >
            Waze
          </a>
        </>
      )}

      {/* Photos */}
      {section.Photo?.filter(photo => photo.Image?.url).map((photo, index) =>
        photo.Image && (
          <Image
            key={index}
            src={process.env.NEXT_PUBLIC_STRAPI_URL + photo.Image.url}
            alt={photo.ImgAlt || `Photo ${index + 1}`}
            title={photo.ImgTitle || ''}
            width={400}
            height={400}
            className={`lieu-image lieu-photo-${index}`}
          />
        )
      )}

      {/* Topo Image */}
      {section.Topo?.Image?.url && (
        <Image
          src={process.env.NEXT_PUBLIC_STRAPI_URL + section.Topo.Image.url}
          alt={section.Topo.ImgAlt || 'Topo du lieu'}
          title={section.Topo.ImgTitle || ''}
          width={400}
          height={400}
          className="lieu-image lieu-topo"
        />
      )}

      {/* Topo glTF 3D avec Google model-viewer */}
      {section.TopoGltf?.url && (
        <TopoViewer3D
          file={section.TopoGltf}
          title="Topographie 3D du lieu"
        />
      )}

      {/* Plan */}
      {section.Plan?.Image?.url && (
        <Image
          src={process.env.NEXT_PUBLIC_STRAPI_URL + section.Plan.Image.url}
          alt={section.Plan.ImgAlt || 'Plan du lieu'}
          title={section.Plan.ImgTitle || ''}
          width={800}
          height={600}
          className="lieu-image lieu-plan"
        />
      )}
    </section>
  );
};

export default InfosLieu;