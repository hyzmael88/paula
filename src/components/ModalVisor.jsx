import { useSession } from 'next-auth/react';
import React, { useState, useRef } from 'react';

function ModalVisor({ isOpen, onClose, fotografias }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const startPosition = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const { data: session, status } = useSession();


  if (!isOpen) return null;

  const nextPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % fotografias.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + fotografias.length) % fotografias.length);
  };

  const zoomIn = () => {
    setZoom((prevZoom) => prevZoom + 20);
  };

  const zoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 20, 100));
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    startPosition.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    currentPos.current = { x: e.clientX - startPosition.current.x, y: e.clientY - startPosition.current.y };
    setPosition(currentPos.current);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg overflow-hidden" onClick={stopPropagation}>
        <div className="flex justify-between items-center p-4">
          <button onClick={prevPhoto} className="p-2">Anterior</button>
          <button onClick={onClose} className="p-2">Cerrar</button>
          <button onClick={nextPhoto} className="p-2">Siguiente</button>
        </div>
        <div
          className="relative overflow-hidden max-w-[90vw] max-h-[80vh] cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
           <div className="absolute bottom-4 right-4 text-white text-3xl opacity-75 z-10">mylove.ai/{session?.user?.email}</div>
          <div className="absolute top-4 left-4 text-white text-3xl opacity-75 z-10">mylove.ai/{session?.user?.email}</div>
       
          <img
            ref={imgRef}
            src={fotografias[currentIndex]}
            alt={`Fotografía ${currentIndex + 1}`}
            className="object-contain"
            style={{
              transform: `scale(${zoom / 100}) translate(${position.x}px, ${position.y}px)`,
              transition: dragging ? 'none' : 'transform 0.2s ease-in-out',
              cursor: dragging ? 'grabbing' : 'grab',
            }}
            onContextMenu={(e) => e.preventDefault()}

          />
        </div>
        <div className="flex justify-center gap-4 p-4">
          <button onClick={zoomOut} className="p-2">-</button>
          <button onClick={zoomIn} className="p-2">+</button>
        </div>
      </div>
    </div>
  );
}

export default ModalVisor;
