// pages/Paquete.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { urlFor } from '@/sanity/lib/image';
import { useSession, signIn } from 'next-auth/react';
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
  const [isVisorOpen, setIsVisorOpen] = useState(false);
  const [comprado, setComprado] = useState(false);

  async function procesarPago() {
    const stripe = await getStripe();

    const response = await fetch("/api/stripePaquetes", {
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
    const { error } = stripe.redirectToCheckout({ sessionId: data.id });
  }

  useEffect(() => {
    if (!session) {
      setIsLoginModalOpen(true);
    }
  }, [session]);

  useEffect(() => {
    session?.user?.paquetesAdquiridos.forEach(paqueteAdquirido => {
      if (paqueteAdquirido._ref === paqueteState?._id) {
        setComprado(true);
      }
    });
  }, [session, paqueteState]);

  useEffect(() => {
    if (paquete) {
      const query = `*[_type == "paquetes" && slug.current == $paquete][0]{
        ...,
        modelo->{
          slug
        }
      }`;
      client.fetch(query, { paquete })
        .then((data) => {
          if (data) {
            setPaqueteState(data);
          } else {
            console.error("Paquete no encontrado");
          }
        })
        .catch(console.error);
    }
  }, [paquete]);

  if (!paqueteState) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-10 px-4 bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {paqueteState.portadas && (
          <div className="w-full overflow-hidden flex">
            {paqueteState.portadas.map((portada, index) => (
              <img
                key={index}
                src={urlFor(portada).url()}
                className="w-full h-auto object-cover"
                alt={`Portada ${index + 1}`}
              />
            ))}
          </div>
        )}
        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold mb-4">{paqueteState.nombre}</h1>
          {paqueteState.copy && <p className="mb-4">{paqueteState.copy}</p>}
          {paqueteState.precio && <p className="text-xl font-semibold mb-4">Precio: ${paqueteState.precio}</p>}
          <button
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition duration-300 mb-4"
            onClick={() => {
              if (comprado) {
                setIsVisorOpen(true);
              } else {
                procesarPago();
              }
            }}
          >
            {comprado ? 'Ver' : 'Comprar'}
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
            onClick={() => router.push(`/Modelo/${paqueteState.modelo.slug.current}`)}
          >
            Volver al perfil de la modelo
          </button>
        </div>
      </div>
      {isVisorOpen && (
        <ModalVisor
          isOpen={isVisorOpen}
          onClose={() => setIsVisorOpen(false)}
          fotografias={paqueteState.fotografias.map(foto => urlFor(foto).url())}
        />
      )}
      {isLoginModalOpen && (
        <ModalLogin isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      )}
    </div>
  );
}

export default Paquete;
