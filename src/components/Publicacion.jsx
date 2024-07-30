import React from 'react';
import PublicacionHeader from './PublicacionHeader';
import PublicacionBody from './PublicacionBody';
import PublicacionFooter from './PublicacionFooter';

const Publicacion = ({ publicacion, comprarPublicacionStripe, openVisor, session }) => {
  return (
    <div className="bg-white shadow-lg overflow-hidden cursor-pointer">
      <PublicacionHeader publicacion={publicacion} />
      <PublicacionBody publicacion={publicacion} openVisor={openVisor} session={session} comprarPublicacionStripe={comprarPublicacionStripe} />
      <PublicacionFooter publicacion={publicacion} />
    </div>
  );
}

export default Publicacion;
