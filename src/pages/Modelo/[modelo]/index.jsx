import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image"; // Asegúrate de tener configurado este helper para manejar las imágenes de Sanity
import { Spinner } from "@/components/Spinner"; // Asegúrate de tener un componente Spinner para mostrar el loader
import { useSession } from "next-auth/react";
import ModalLogin from "@/components/ModalLogin";
import getStripe from "@/sanity/lib/getStripe";

function Modelo() {
  const [modelo, setModelo] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { modelo: slug } = router.query;
  const { data: session, status } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [selector, setSelector] = useState("Publicaciones");

  useEffect(() => {
    if (!session) {
      // Si no hay sesión, mostrar el modal
      setIsLoginModalOpen(true);
    }
  }, [session]);

  useEffect(() => {
    session?.user?.subscribedModels?.forEach((subscribedModel) => {
      if (subscribedModel?._ref === modelo?._id) {
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
            },
            paquetes[]->{
              _id,
              fotografias,
              portadas,
              nombre,
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
          console.log(data);
          if (data && data.publicaciones) {
            setPublicaciones(data.publicaciones);
          }
          if (data && data.paquetes) {
            setPaquetes(data.paquetes);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setError("Ocurrió un error al cargar los datos.");
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

  async function donateStripe() {
    const stripe = await getStripe();

    const response = await fetch("/api/stripeDonaciones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 5000, // Donación fija de $50 MXN
        email: session.user.email,
        description: `Donación para ${modelo.nombre}`,
      }),
    });

    if (response.status === 500) return;

    const data = await response.json();

    // Solo pasa el sessionId a la función redirectToCheckout
    const { error } = stripe.redirectToCheckout({ sessionId: data.id });
  }

  async function comprarPublicacionStripe(publicacion) {
    const stripe = await getStripe();
    console.log(publicacion);
    const response = await fetch("/api/stripeComprarPublicacion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        precio: publicacion.precio,
        nombre: modelo.nombre,
        _id: publicacion._id,
        email: session.user.email,
      }),
    });

    if (response.status === 500) return;

    const data = await response.json();

    // Solo pasa el sessionId a la función redirectToCheckout
    const { error } = stripe.redirectToCheckout({ sessionId: data.id });
  }

  const handlePaqueteClick = (paqueteSlug) => {
    /*  const currentPath = router.asPath; // Obtén la ruta actual
    router.push(`${currentPath}/Paquete/${paqueteSlug}`); */

    router.push(`/Modelo/${slug}/Paquete/${paqueteSlug}`);
  };

  if (loading) return <Spinner />; // Muestra el loader mientras los datos se cargan

  if (error) return <div className="text-red-500">{error}</div>; // Muestra el mensaje de error

  if (!modelo) return <div>No se encontró el modelo.</div>;

  return (
    <div className="p-4 w-full xl:w-1/3 ">
      <h1 className="text-3xl font-bold mb-4">{modelo.nombre}</h1>
      {/* Muestra más detalles de la modelo como desees */}
      <p className="">{modelo.biografia}</p>
      <div className="flex flex-row gap-x-4 my-4">
        {!subscribed ? (
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded-2xl cursor-pointer"
            onClick={suscribeStripe}
          >
            Suscribete
          </button>
          
          
        ) : (
          <button
            className="bg-pink-300 text-white px-4 py-2 rounded-2xl "
            onClick={suscribeStripe}
            >
            Suscrito
          </button>
        )
        
      }
        {/* <button
          className="bg-blue-500 text-white px-4 py-2 rounded-2xl cursor-pointer"
          onClick={donateStripe}
        >
          Donar
        </button> */}
      </div>
      <div>
        <div className="w-full flex text-center  ">
          <div
            className="w-full text-white bg-pink-500  px-4 py-2 cursor-pointer "
            onClick={() => setSelector("Publicaciones")}
          >
            Publicaciones
          </div>
          <div
            className="w-full bg-purple-700 text-white  px-4 py-2  cursor-pointer "
            onClick={() => setSelector("Paquetes")}
          >
            Paquetes 😈
          </div>
        </div>
      </div>
      <div className="publicaciones">
        {selector === "Publicaciones" ? (
          publicaciones.length === 0 ? (
            <p>No hay publicaciones disponibles.</p>
          ) : (
            publicaciones.map((publicacion) => (
              <div
                key={publicacion._id}
                className="publicacion mb-8 p-4 bg-white rounded shadow-md"
              >
                {subscribed ? (
                  !publicacion.precio ? (
                    publicacion.fotografias &&
                    publicacion.fotografias.length > 0 && (
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
                    )
                  ) : session.user.compras &&
                    session.user.compras.some(
                      (compra) => compra._ref === publicacion._id
                    ) ? (
                    publicacion.fotografias &&
                    publicacion.fotografias.length > 0 && (
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
                    )
                  ) : (
                    <div className="w-full h-[60vh] bg-gray-700 object-cover mb-2 flex flex-col items-center justify-center">
                      <div
                        className="w-[70%] bg-pink-500 text-center py-4 rounded-3xl text-white cursor-pointer"
                        onClick={() => comprarPublicacionStripe(publicacion)}
                      >
                        Compra este contenido por ${publicacion.precio}mxn
                      </div>
                    </div>
                  )
                ) : (
                  <div className="w-full h-[60vh] bg-gray-700 object-cover mb-2 flex flex-col items-center justify-center">
                    <div
                      className="w-[70%] bg-pink-500 text-center py-4 rounded-3xl text-white cursor-pointer"
                      onClick={suscribeStripe}
                    >
                      Suscríbete para ver el contenido
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
          )
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Paquetes</h2>
            {console.log(paquetes)}
            {paquetes.length > 0 ? (
              <div className="grid grid-cols-2">
                {paquetes.map((paquete, index) => (
                  <div
                    key={index}
                    className="w-full h-[450px] relative cursor-pointer"
                    onClick={() => handlePaqueteClick(paquete.slug.current)}
                  >
                    <div className="w-full absolute left-0 bottom-0 z-10 ">
                      {paquete.nombre && (
                        <h3 className="text-center text-white bg-black bg-opacity-50 p-2">
                          {paquete.nombre}
                        </h3>
                      )}
                    </div>
                    <img
                      src={urlFor(paquete.portadas[0]).url()}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <h2>No hay paquetes disponibles</h2>
            )}
          </div>
        )}
      </div>

      <ModalLogin
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

export default Modelo;
