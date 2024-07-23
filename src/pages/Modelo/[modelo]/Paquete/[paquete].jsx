import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { urlFor } from '@/sanity/lib/image';
import { useSession } from 'next-auth/react';
import ModalLogin from '@/components/ModalLogin';
import ModalVisor from '@/components/ModalVisor';
import getStripe from '@/sanity/lib/getStripe';
import { client } from '@/sanity/lib/client';

function Paquete() {
  const [paqueteState, setPaqueteState] = useState(null);
  const router = useRouter();
  const { paquete } = router.query;
  const { data: session, status } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  console.log(session)
  const [isVisorOpen, setIsVisorOpen] = useState(false);
  const [comprado, setComprado] = useState(false);

  async function procesarPago() {
   
      const stripe = await getStripe();

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paquete: paqueteState,
        email: session.user.email,
      }),
    });

    if (response.status === 500) return;

    const data = await response.json();

    // Solo pasa el sessionId a la función redirectToCheckout
    const { error } = stripe.redirectToCheckout({ sessionId: data.id });

    
  }



  useEffect(() => {
    if (!session) {
      // Si no hay sesión, mostrar el modal
    setIsLoginModalOpen(true); 
    }
  
  }, [session]);

  useEffect(() => {
    session?.user?.paquetesAdquiridos.map(paqueteAdquirido => {
      if(paqueteAdquirido._ref === paqueteState?._id){
        setComprado(true);
      }
    })
    
  }, [session, paqueteState]);

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
      <button className='bg-orange-400 rounded-xl px-4 py-2'
      onClick={()=>
      {
        if(comprado){
          setIsVisorOpen(true)
        } else {
          procesarPago();
       }
      }
    }
      
      >
        {
          comprado ? 'Ver' : 'Comprar'
        }
      </button>
    </div>
    </div>
    <ModalVisor isOpen={isVisorOpen} onClose={() => setIsVisorOpen(false)} fotografias={paqueteState.fotografias.map(foto => urlFor(foto).url())} />

    <ModalLogin isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

    </div>


  );
}

export default Paquete;
