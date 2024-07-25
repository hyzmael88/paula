import { urlFor } from '@/sanity/lib/image';
import React from 'react'


    const Section = ({ title, paquetes, handlePaqueteClick }) => (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <a href="#" className="text-blue-500">see all</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {paquetes.map((paquete) => (
              <div 
                key={paquete._id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                onClick={() => handlePaqueteClick(paquete.modelo.slug.current, paquete.slug.current)}
              >
                <img 
                  src={paquete.portadas && paquete.portadas.length > 0 ? urlFor(paquete.portadas[0]).url() : '/default-image.png'} 
                  alt={paquete.nombre} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{paquete.nombre}</h3>
                  <p className="font-bold">Precio: ${paquete.precio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );


export default Section