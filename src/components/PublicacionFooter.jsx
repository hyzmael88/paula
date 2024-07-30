import React from 'react';

const PublicacionFooter = ({ publicacion }) => {
  return (
    <div className='w-full flex justify-between items-center px-2'>
      <div className='flex'>
        <div className='flex '>
          <span>200</span>
        </div>
        <div className='flex'>
          10 comentarios
        </div>
      </div>
      <div>
        dinero y guardar
      </div>
    </div>
  );
}

export default PublicacionFooter;
