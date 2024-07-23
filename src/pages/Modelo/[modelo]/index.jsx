import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image"; // Asegúrate de tener configurado este helper para manejar las imágenes de Sanity
import { Spinner } from "@/components/Spinner"; // Asegúrate de tener un componente Spinner para mostrar el loader
import { useSession } from "next-auth/react";
import ModalVisor from "@/components/ModalVisor";
import ModalLogin from "@/components/ModalLogin";
import { useStateLink } from "sanity/router";
import getStripe from "@/sanity/lib/getStripe";

function Modelo() {
  const [modelo, setModelo] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { modelo: slug } = router.query;
  const { data: session, status } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);


  useEffect(() => {
    if (!session) {
      // Si no hay sesión, mostrar el modal
      setIsLoginModalOpen(true);
    }
  }, [session]);

  console.log(session)

  useEffect(() => {
    session?.user?.subscribedModels?.map((subscribed) => {
      if (subscribed._ref === modelo) {
        setSubscribed(true);
      }
    });
  }, [session]);

  useEffect(() => {
    if (slug) {
      const query = `*[_type == "modelos" && slug.current == $slug][0]{
        ...,
        publicaciones[]->{
          _id,
          fotografias,
          copy,
          slug,
          precio,
          _createdAt
        }
      }`;
      client
        .fetch(query, { slug })
        .then((data) => {
          setModelo(data);
          if (data && data.publicaciones) {
            setPublicaciones(data.publicaciones);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setError("Ocurrió un error al cargar las publicaciones.");
          setLoading(false);
        });
    }
  }, [slug]);


  async function suscribeStripe() {
   
    const stripe = await getStripe();

  const response = await fetch("/api/stripeSuscripciones", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      precio: modelo.precioSuscripcion,
      nombre: modelo.nombre,
      email: session.user.email,
      fotoPerfil: modelo.fotoPerfil,
      _id: modelo._id,

    }),
  });

  if (response.status === 500) return;

  const data = await response.json();

  // Solo pasa el sessionId a la función redirectToCheckout
  const { error } = stripe.redirectToCheckout({ sessionId: data.id });

  
}


  if (loading) return <Spinner />; // Muestra el loader mientras los datos se cargan

  if (error) return <div className="text-red-500">{error}</div>; // Muestra el mensaje de error

  if (!modelo) return <div>No se encontró el modelo.</div>;



  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{modelo.nombre}</h1>
      {/* Muestra más detalles de la modelo como desees */}
      <p className="mb-8">{modelo.biografia}</p>
      <div className="publicaciones">
        {publicaciones.length === 0 ? (
          <p>No hay publicaciones disponibles.</p>
        ) : (
          publicaciones.map((publicacion) => (
            <div
              key={publicacion._id}
              className="publicacion mb-8 p-4 bg-white rounded shadow-md"
            >
              {subscribed ? (
                publicacion.fotografias &&
                publicacion.fotografias.length > 0 ? (
                  <div className="fotografias mb-4">
                    {publicacion.fotografias.map((foto, index) => (
                      <img
                        key={index}
                        src={urlFor(foto).url()}
                        alt={`Fotografía ${index + 1}`}
                        className="w-full h-[60vh] object-cover mb-2"
                      />
                    ))}
                  </div>
                ) : null
              ) : (
                <div className="w-full h-[60vh] bg-gray-700 object-cover mb-2 flex flex-col items-center justify-center" >
                <div className="w-[70%] bg-pink-500 text-center py-4 rounded-3xl text-white cursor-pointer"
                onClick={suscribeStripe}
                >
                  Suscribete para ver el contenido
                  </div>
                </div>
              )}
              <p className="copy mb-2">{publicacion.copy}</p>
              {publicacion.precio && (
                <p className="precio text-sm text-gray-500">
                  Precio: ${publicacion.precio}
                </p>
              )}
            </div>
          ))
        )}
      </div>
      {/* <ModalVisor isOpen={isVisorOpen} onClose={() => setIsVisorOpen(false)} fotografias={paqueteState.fotografias.map(foto => urlFor(foto).url())} /> */}

      <ModalLogin
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

export default Modelo;
