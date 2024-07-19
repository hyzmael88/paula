import React, { useState } from 'react';

function ModalVisor({ isOpen, onClose, fotografias }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(100);

  if (!isOpen) return null;

  const nextPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % fotografias.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + fotografias.length) % fotografias.length);
  };

  const zoomIn = () => {
    setZoom((prevZoom) => prevZoom + 10);
  };

  const zoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 10, 100));
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    onClick={onClose}
    >
      <div className="modal bg-white rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4">
          <button onClick={prevPhoto} className="p-2">Anterior</button>
          <button onClick={onClose} className="p-2">Cerrar</button>
          <button onClick={nextPhoto} className="p-2">Siguiente</button>
        </div>
        <img src={fotografias[currentIndex]} alt={`Fotografía ${currentIndex + 1}`}
             className={`w-full max-w-[90vw] max-h-[80vh] object-contain`}
             style={{ transform: `scale(${zoom / 100})` }} />
        <div className="flex justify-center gap-4 p-4">
          <button onClick={zoomOut} className="p-2">-</button>
          <button onClick={zoomIn} className="p-2">+</button>
        </div>
      </div>
    </div>
  );
}

export default ModalVisor;