import React, { useEffect, useRef } from 'react';
import { client } from '@/sanity/lib/client'; // Asegúrate de tener configurado el cliente de Sanity
import { urlFor } from '@/sanity/lib/image'; // Asegúrate de tener configurado este helper para manejar las imágenes de Sanity
import { gsap } from 'gsap';

function CarrouselIndex({ photos }) {
  const topRowRef = useRef(null);
  const bottomRowRef = useRef(null);

  const topPhotos = photos.slice(0, 16);
  const bottomPhotos = [...topPhotos].reverse();

  useEffect(() => {
    const topRow = topRowRef.current;
    const bottomRow = bottomRowRef.current;

    gsap.fromTo(
      topRow,
      { xPercent: 0 },
      { xPercent: -50, duration: 20, repeat: -1, ease: 'linear' }
    );

    gsap.fromTo(
      bottomRow,
      { xPercent: -50 },
      { xPercent: 0, duration: 20, repeat: -1, ease: 'linear' }
    );
  }, []);

  return (
    <div className='absolute w-full h-1/4'>
      <div className='w-full h-full flex flex-col gap-y-2 -z-10 relative'>
        <div className='w-full h-[50vh] bg-white z-10 blur-2xl opacity-70 xl:opacity-65 rounded-[45px] absolute' />

        <div className='w-full h-full flex gap-4 transition-all' ref={topRowRef}>
          {topPhotos.map((photo, index) => (
            <div key={index} className='w-full h-full'>
              <img src={photo} alt='carrousel' className='object-cover min-w-40 w-full h-full lg:h-[250px] rounded-[45px]' />
            </div>
          ))}
        </div>
        
        <div className='w-full h-full flex gap-4 transition-all' ref={bottomRowRef}>
          {bottomPhotos.map((photo, index) => (
            <div key={index} className='w-full h-full'>
              <img src={photo} alt='carrousel' className='object-cover min-w-40 w-full h-full lg:h-[250px] rounded-[45px]' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CarrouselIndex;
