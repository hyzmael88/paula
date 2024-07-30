import React, { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client'; // Asegúrate de tener configurado el cliente de Sanity
import { urlFor } from '@/sanity/lib/image'; // Asegúrate de tener configurado este helper para manejar las imágenes de Sanity

function CarrouselIndex({ photos }) {

    const topPhotos = photos.slice(0, 8);
    const bottomPhotos = photos.slice(8, 16);

  return (
    <div className='absolute w-full h-[45vh] '>

    <div className='w-full h-full  flex flex-col gap-y-2 -z-10 relative  '>
    <div className='h-[800px] w-full xl:h-full bg-white z-10 blur-2xl opacity-70 xl:opacity-65 rounded-[45px]  absolute '/>


        <div className='w-full h-full flex gap-4 -translate-x-20 transition-all '>

      {photos.map((photo, index) => (
          <div key={index} className='w-full h-full'>
          <img src={photo} alt='carrousel' className='object-cover min-w-40 w-full h-full rounded-[45px]' />
        </div>
      ))}
      </div>
        <div className='w-full h-full flex gap-4'>

      {photos.map((photo, index) => (
          <div key={index} className='w-full h-full'>
          <img src={photo} alt='carrousel' className='object-cover min-w-40 w-full h-full rounded-[45px]' />
        </div>
      ))}
      </div>
      
      </div>
    </div>
  );
}

export default CarrouselIndex;
