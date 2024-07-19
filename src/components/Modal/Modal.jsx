import React from "react";

const Modal = ({ show, onClose, children }) => {
  // Si la propiedad "show" es falsa, no renderiza el modal
  if (!show) {
    return null;
  }

  return (
    // El contenedor del modal tiene posición fija y cubre toda la pantalla
    <div className="fixed   lg:top-[5%] z-30 inset-0 overflow-y-auto lg:overflow-y-hidden  ">
      <div className="flex items-end justify-center  pt-4 px-4 pb-20 text-center sm:block sm:p-0">
{/*         El fondo oscuro semitransparente se crea aquí
 */}        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose} // Cierra el modal cuando se hace clic en el fondo
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
{/*         El contenedor del contenido del modal
 */}        <div
          className="inline-block align-bottom bg-white rounded-lg text-left  shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg 2xl:max-w-4xl 2xl:h-[800px] sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {/*            Renderiza el contenido que se le pasa como hijo (children) al componente
           */}{" "}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
