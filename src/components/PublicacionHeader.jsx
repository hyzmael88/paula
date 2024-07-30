import React from 'react';
import { urlFor } from '@/sanity/lib/image';
import moment from 'moment';

const PublicacionHeader = ({ publicacion }) => {
  return (
    <div className='w-full flex justify-between px-2'>
      <div className='flex items-center'>
        <img src={urlFor(publicacion.modelo.fotoPerfil).url()} alt={publicacion.modelo.nombre} className='w-[60px] h-[60px] bg-gray-400 rounded-full mr-4' />
        <div className='flex flex-col'>
          <p className='font-black text-[16px]'>{publicacion.modelo.nombre}</p>
          <p className='text-[11px] font-bold text-[#B9B9B9]'>@{publicacion.modelo.slug.current}</p>
        </div>
      </div>
      <div>
        <p className='text-[#B9B9B9] font-bold text-[11px] pt-3'>{moment(publicacion._createdAt).fromNow()}</p>
      </div>
    </div>
  );
}

export default PublicacionHeader;
