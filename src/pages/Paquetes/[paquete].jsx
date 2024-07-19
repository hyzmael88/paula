import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '../../sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { useSession } from 'next-auth/react';
import ModalLogin from '@/components/ModalLogin';

function Paquete() {
  const [paqueteState, setPaqueteState] = useState(null);
  const router = useRouter();
  const { paquete } = router.query;
  const { data: session, status } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  console.log(session)


  useEffect(() => {
    if (!session) {
      // Si no hay sesión, mostrar el modal
    setIsLoginModalOpen(true); 
    }
  }, [session]);

  const handleLogin = () => {
    signIn(); // Redirige al usuario a la página de inicio de sesión
  };

  useEffect(() => {
    if (paquete) {
      // Consulta a Sanity para obtener el paquete específico por su slug
      const query = `*[_type == "paquetes" && slug.current == $paquete][0]`;
      client.fetch(query, { paquete })
        .then((data) => {
          if (data) {
            console.log(data);
            setPaqueteState(data);
          } else {
            console.error("Paquete no encontrado");
          }
        })
        .catch(console.error);
    }
  }, [paquete]);

  if (!paqueteState) return <div>Loading...</div>;

  return (
    <div className='w-full h-screen'>
      <div className='w-full h-full flex flex-col'>

      {/* Muestra más detalles del paquete como desees */}
      {paqueteState.portadas && (
        <div className='w-full h-[65%] flex flex-col items-center'>
          {paqueteState.portadas.map((portada, index) => (
            <img key={index} src={urlFor(portada).url()}
            className='w-full max-w-[90%] h-full object-cover'
            alt={`Portada ${index + 1}`} />
          ))}
        </div>
      )}
      
      {/* {paqueteState.fotografias && (
        <div>
        {paqueteState.fotografias.map((foto, index) => (
          <img key={index} src={urlFor(foto).url()} alt={`Fotografía ${index + 1}`} />
          ))}
          </div>
          )} */}
          <div className='text-center flex-col items-center'>

          <h1>{paqueteState.nombre}</h1>
      {paqueteState.copy && <p>{paqueteState.copy}</p>}
      {paqueteState.precio && <p>Precio: {paqueteState.precio}</p>}
      <button className='bg-orange-400 rounded-xl px-4 py-2'>
        Comprar
      </button>
    </div>
    </div>
    <ModalLogin isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

    </div>


  );
}

export default Paquete;
