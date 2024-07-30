import React from 'react';
import { urlFor } from '@/sanity/lib/image';
import { FaRegImage } from 'react-icons/fa';

const PublicacionBody = ({ publicacion, openVisor, session, comprarPublicacionStripe }) => {
  return (
    <>
      <div className="p-4">
        <h2 className="text-[11px] leading-[13px]">{publicacion.copy}</h2>
      </div>
      {!publicacion.precio ? (
        publicacion.fotografias && publicacion.fotografias.length > 0 && (
          <div className="fotografias mb-4">
            <img
              key={publicacion.fotografias[0]}
              src={urlFor(publicacion.fotografias[0]).url()}
              alt={`Fotografía `}
              className="w-full h-[330px] object-cover mb-2 cursor-pointer"
              onClick={() => openVisor(publicacion.fotografias.map(foto => urlFor(foto).url()))}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        )
      ) : session.user.compras &&
        session.user.compras.some(
          (compra) => compra._ref === publicacion._id
        ) ? (
          publicacion.fotografias && publicacion.fotografias.length > 0 && (
            <div className="fotografias mb-4">
              <img
                key={publicacion.fotografias[0]}
                src={urlFor(publicacion.fotografias[0]).url()}
                alt={`Fotografía `}
                className="w-full h-[60vh] object-cover mb-2 cursor-pointer"
                onClick={() => openVisor(publicacion.fotografias.map(foto => urlFor(foto).url()))}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          )
        ) : (
          <div className="w-full h-[494px] bg-pink-300 object-cover mb-2 flex flex-col items-center justify-center">
            <div className='flex flex-col items-center w-[346px] h-[212px] justify-center gap-y-[7px] bg-[#39383980] rounded-[27px] relative'
              style={{
                background: 'rgba(57, 56, 57, 0.50)',
              }}
            >
              <img src='/lock.png' alt='lock' className=' absolute -top-10' />
              <p className='text-[18px] font-bold text-white '>Desbloquea para ver</p>
              <p className='text-[15px] text-white flex gap-2 items-center '> <FaRegImage /> 1 imagen</p>
              <p className='text-white '>${publicacion.precio} mxn</p>
              <div
                className="w-[149px] h-[31px] bg-pink-500 text-center rounded-3xl text-white cursor-pointer loginButton flex items-center justify-center font-bold desbloquearButton"
                onClick={() => comprarPublicacionStripe(publicacion)}
              >
                Desbloquear
              </div>
            </div>
          </div>
        )}
    </>
  );
}

export default PublicacionBody;
