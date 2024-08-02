// pages/Paquete.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { urlFor } from "@/sanity/lib/image";
import { useSession, signIn } from "next-auth/react";
import ModalLogin from "@/components/ModalLogin";
import ModalVisor from "@/components/ModalVisor";
import getStripe from "@/sanity/lib/getStripe";
import { client } from "@/sanity/lib/client";
import Link from "next/link";

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
    session?.user?.paquetesAdquiridos.forEach((paqueteAdquirido) => {
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
          slug,
          nombre,
          fotoPerfil
        
        }
      }`;
      client
        .fetch(query, { paquete })
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

  if (!paqueteState)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="w-full min-h-screen lg:w-1/3 flex flex-col items-center py-10 px-4 pb-[75px] ">
      <div className="w-full max-w-4xl bg-white rounded-lg  overflow-hidden">
        {paqueteState.portadas && (
          <div className="w-full overflow-hidden flex">
            {paqueteState.portadas.map((portada, index) => (
              <img
                key={index}
                src={urlFor(portada).url()}
                className="w-full h-[477px] object-cover rounded-[30px]"
                alt={`Portada ${index + 1}`}
              />
            ))}
          </div>
        )}
        <div className="p-6 text-center flex flex-col items-center justify-center ">
          <Link href={`/Modelo/${paqueteState.modelo.slug.current}`}>
          <div className="flex p-[19px] gap-[19px] w-[191px] h-[95px] perfilPaquete cursor-pointer"
          
          >
            <div>
              <img src={urlFor(paqueteState.modelo.fotoPerfil).url()} alt="" className="w-[60px] h-[60px] rounded-full object-cover" />
            </div>
            <div className="flex-col text-left flex-shrink-0 space-y-[px]">
                <h2 className="text-[16px] font-bold ">{paqueteState.modelo.nombre}</h2>
                <p className="text-[10px]  ">@{paqueteState.modelo.slug.current}</p>
                <div className="modeloButton text-white  text-[8px] text-center">Ver Perfil</div>
            </div>
          </div>
          </Link>
          <h1 className="text-[26px] uppercase font-bold mb-4">{paqueteState.nombre}</h1>
          {paqueteState.precio && (
            <p className="text-[18px] font-bold mb-4">
              Precio: ${paqueteState.precio}
            </p>
          )}
          {paqueteState.copy && <p className="mb-4 text-[12px]">{paqueteState.copy}</p>}
          <button
            className="bg-orange-500 text-white h-[30px] rounded-lg  transition duration-300 mb-4 w-full paqueteButton"
            onClick={() => {
              if (comprado) {
                setIsVisorOpen(true);
              } else {
                procesarPago();
              }
            }}
          >
            {comprado ? "Ver" : "Comprar"}
          </button>
          {/* <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
            onClick={() =>
              router.push(`/Modelo/${paqueteState.modelo.slug.current}`)
            }
          >
            Volver al perfil de la modelo
          </button> */}
        </div>
      </div>
      {isVisorOpen && (
        <ModalVisor
          isOpen={isVisorOpen}
          onClose={() => setIsVisorOpen(false)}
          fotografias={paqueteState.fotografias.map((foto) =>
            urlFor(foto).url()
          )}
        />
      )}
      {isLoginModalOpen && (
        <ModalLogin
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Paquete;
