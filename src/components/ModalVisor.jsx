import { useSession } from 'next-auth/react';
import React, { useState, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function ModalVisor({ isOpen, onClose, fotografias }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const startPosition = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const { data: session, status } = useSession();


  
/*   const nextPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % fotografias.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + fotografias.length) % fotografias.length);
  }; */
const [posicion, setPosicion] = useState(0);

    const handleNext = () => {
      setPosicion((prevPos) => (prevPos + 1) % fotografias.length);
    };
  
    const handlePrev = () => {
      setPosicion((prevPos) => (prevPos - 1 + fotografias.length) % fotografias.length);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-[50px] overflow-hidden flex flex-col items-center" onClick={stopPropagation}>
        {/* <div className="flex justify-between items-center p-4">
          
         <button onClick={prevPhoto} className="p-2">Anterior</button>
          <button onClick={onClose} className="p-2">Cerrar</button>
          <button onClick={nextPhoto} className="p-2">Siguiente</button> 
        </div> */}
        <div
          className="relative overflow-hidden max-w-[90vw] max-h-[80vh] w-full h-[508px] lg:w-[684px] lg:h-[943px] cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
           <div className="absolute bottom-4 right-4 text-white text-3xl opacity-75 z-10">luvmypack.com/{session?.user?.email}</div>
          <div className="absolute top-8 left-8 text-white text-[24px] opacity-65 z-10">luvmypack.com/{session?.user?.email}</div>
          {
          fotografias.length > 1 &&
            <div className="absolute top-4 right-4 bg-[#2222228F] rounded-[27px] text-white px-2 py-1 z-10">
                  <p className="text-[12px]">{posicion + 1}/{fotografias.length}</p>
                </div>
        }
                {
                fotografias.length > 1 &&
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-[47px] h-[47px] rounded-full z-10 bg-[#B9B9B98C] flex justify-center items-center" onClick={handleNext}>
                  <FaChevronRight className="text-white"/>
                </div>
}
{
                fotografias.length > 1 &&
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-[47px] h-[47px] rounded-full z-10 bg-[#B9B9B98C] flex justify-center items-center" onClick={handlePrev}>
                  <FaChevronLeft className="text-white"/>
                </div>
}

          <img
            ref={imgRef}
            src={fotografias[posicion]}
            alt={`Fotografía ${posicion + 1}`}
            className="object-contain w-full h-full"
            style={{
              transform: `scale(${zoom / 100}) translate(${position.x}px, ${position.y}px)`,
              transition: dragging ? 'none' : 'transform 0.2s ease-in-out',
              cursor: dragging ? 'grabbing' : 'grab',
            }}
            onContextMenu={(e) => e.preventDefault()}
            loading='lazy'

          />
        </div>
        <div className="flex justify-center gap-8 p-4">
          <button onClick={zoomOut} className="p">
            <img src='/icons/zoomLess.svg'  alt="zoomOut" />
          </button>
          <button onClick={zoomIn} className="p">
            <img src='/icons/zoomPlus.svg'  alt="zoomIn" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalVisor;
