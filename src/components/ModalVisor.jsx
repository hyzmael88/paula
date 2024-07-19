import React, { useState, useRef, useEffect } from 'react';
import { useGesture } from '@use-gesture/react';

function ModalVisor({ isOpen, onClose, fotografias }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const startPosition = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });



  const nextPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % fotografias.length);
    setPosition({ x: 0, y: 0 });
    setZoom(100);
  };

  const prevPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + fotografias.length) % fotografias.length);
    setPosition({ x: 0, y: 0 });
    setZoom(100);
  };

  const zoomIn = () => {
    setZoom((prevZoom) => prevZoom + 10);
  };

  const zoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 10, 100));
    if (zoom === 100) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const handleMouseDown = (e) => {
    if (zoom === 100) return;
    setDragging(true);
    startPosition.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!dragging || zoom === 100) return;
    currentPos.current = { x: e.clientX - startPosition.current.x, y: e.clientY - startPosition.current.y };

    const imgWidth = imgRef.current.offsetWidth * (zoom / 100);
    const imgHeight = imgRef.current.offsetHeight * (zoom / 100);
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    // Calculate boundaries
    const maxX = Math.max((imgWidth - containerWidth) / 2, 0);
    const maxY = Math.max((imgHeight - containerHeight) / 2, 0);

    const newX = Math.max(Math.min(currentPos.current.x, maxX), -maxX);
    const newY = Math.max(Math.min(currentPos.current.y, maxY), -maxY);

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const bind = useGesture(
    {
      onDrag: ({ down, movement: [mx, my] }) => {
        if (zoom === 100) return;
        if (down) {
          currentPos.current = { x: mx, y: my };
          setPosition(currentPos.current);
        }
      },
      onPinch: ({ da: [d] }) => {
        const newZoom = Math.max(100, zoom + d / 2);
        setZoom(newZoom);
      },
      onWheel: ({ event }) => {
        const delta = event.deltaY > 0 ? -10 : 10;
        setZoom((prevZoom) => Math.max(prevZoom + delta, 100));
      }
    },
    {
      drag: {
        enabled: zoom > 100
      }
    }
  );

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg overflow-hidden" onClick={stopPropagation}>
        <div className="flex justify-between items-center p-4">
          <button onClick={prevPhoto} className="p-2">Anterior</button>
          <button onClick={onClose} className="p-2">Cerrar</button>
          <button onClick={nextPhoto} className="p-2">Siguiente</button>
        </div>
        <div
          ref={containerRef}
          {...bind()}
          className="relative overflow-hidden max-w-[90vw] max-h-[80vh] cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          <img
            ref={imgRef}
            src={fotografias[currentIndex]}
            alt={`Fotografía ${currentIndex + 1}`}
            className="object-contain"
            style={{
              transform: `scale(${zoom / 100}) translate(${position.x}px, ${position.y}px)`,
              transition: dragging ? 'none' : 'transform 0.2s ease-in-out',
              cursor: zoom > 100 ? 'grabbing' : 'default',
            }}
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
