import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image"; // Asegúrate de tener configurado este helper para manejar las imágenes de Sanity
import { Spinner } from "@/components/Spinner"; // Asegúrate de tener un componente Spinner para mostrar el loader
import { useSession } from "next-auth/react";
import ModalLogin from "@/components/ModalLogin";
import getStripe from "@/sanity/lib/getStripe";
import { FaInstagram, FaTwitter, FaTiktok, FaShareAlt } from 'react-icons/fa';
import ModalVisor from "@/components/ModalVisor";
import PublicacionPerfil from "@/components/PublicacionPerfil";
import { LuShare } from "react-icons/lu";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss';
import { NextSeo } from "next-seo";


function Modelo() {
  const [modelo, setModelo] = useState(null);
  const [allPublicaciones, setAllPublicaciones] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [publicacionesGratuitas, setPublicacionesGratuitas] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { modelo: slug } = router.query;
  const { data: session, status } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selector, setSelector] = useState("Publicaciones");
  const [isVisorOpen, setIsVisorOpen] = useState(false);
  const [currentFotos, setCurrentFotos] = useState([]);

  useEffect(() => {
    if (!session) {
      // Si no hay sesión, mostrar el modal
      setIsLoginModalOpen(true);
    }
  }, [session]);

  useEffect(() => {
    if (session && modelo) {
     
  
      // Verificar si el usuario está suscrito al modelo
      const isSubscribed = session.user.subscribedModels.some((subscribedModel) => 
        
        subscribedModel.modelRef._ref === modelo._id
      );
      setSubscribed(isSubscribed);
  
      // Verificar si el usuario sigue al modelo
      const isFollowing = session.user.follows.some((followedModel) => 
        followedModel._ref === modelo._id
      );
      setIsFollowing(isFollowing);
      
    }
  }, [session, modelo]);
  

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
              portadas,
              nombre,
              copy,
              slug,
              precio,
              _createdAt
            },
            publicacionesGratuitas[]->{
              _id,
              fotografias,
              copy,
              slug,
              precio,
              _createdAt
            },
            fotoPerfil,
            portada,
            instagram,
            twitter,
            tiktok
          }`;

      client
        .fetch(query, { slug })
        .then((data) => {
          setModelo(data);
          if (data.publicaciones) {
            setPublicaciones(data.publicaciones);
          }
          if (data.paquetes) {
            setPaquetes(data.paquetes);
          }
          if (data.publicacionesGratuitas) {
            const publicacionesGratuitasConTipo = data.publicacionesGratuitas.map(pub => ({
              ...pub,
              tipo: 'gratuita'
            }));
            setPublicacionesGratuitas(publicacionesGratuitasConTipo);
            setAllPublicaciones(
              [...data.publicaciones, ...publicacionesGratuitasConTipo].sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt))
            );
            } else {
            setAllPublicaciones(data.publicaciones);
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
        modelo_id: modelo._id,
      }),
    });

    

    if (response.status === 500) return;

    const data = await response.json();

    // Solo pasa el sessionId a la función redirectToCheckout
    const { error } = stripe.redirectToCheckout({ sessionId: data.id });
  }

  async function comprarPublicacionStripe(publicacion) {
    const stripe = await getStripe();
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
    router.push(`/Modelo/${slug}/Paquete/${paqueteSlug}`);
  };


  const followModelo = async () => {
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modeloId: modelo._id, email: session.user.email }),
      });
  
      if (response.ok) {
        setIsFollowing(!isFollowing);
      } else {
        console.error('Error al seguir al modelo');
      }
    } catch (error) {
      console.error('Error al seguir al modelo:', error);
    }
  };
  const unfollowModelo = async () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres dejar de seguir a esta cuenta?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF66AE',
      cancelButtonColor: '#6E26B6',
      confirmButtonText: 'Sí, dejar de seguir',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch('/api/unfollow', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ modeloId: modelo._id, email: session.user.email }),
          });
  
          if (response.ok) {
            setIsFollowing(false);
            Swal.fire(
              '¡Unfollow!',
              'Has dejado de seguir la cuenta.',
              'success'
            );
          } else {
            console.error('Error al dejar de seguir la cuenta');
            Swal.fire(
              'Error',
              'No se pudo dejar de seguir la cuenta.',
              'error'
            );
          }
        } catch (error) {
          console.error('Error al dejar de seguir la cuenta:', error);
          Swal.fire(
            'Error',
            'No se pudo dejar de seguir la cuenta.',
            'error'
          );
        }
      }
    });
  };
  
  if (loading) return <Spinner />; // Muestra el loader mientras los datos se cargan

  if (error) return <div className="text-red-500">{error}</div>; // Muestra el mensaje de error

  if (!modelo) return <div>No se encontró la cuenta.</div>;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: modelo.nombre,
        text: 'Echa un vistazo al perfil de este modelo',
        url: window.location.href,
      }).catch((error) => console.error('Error sharing', error));
    }
  };

  const openVisor = (fotografias) => {
    setCurrentFotos(fotografias);
    setIsVisorOpen(true);
  };

 
  return (
    <>
    <NextSeo
      title={`Luvyourpack | Perfil de ${modelo.nombre}`}
      description={`Perfil de ${modelo.nombre}`}
      openGraph={{
        title: `Luvyourpack | Perfil de ${modelo.nombre}`,
        description: `Conoce el perfil de ${modelo.nombre}, te encantarán sus publicaciones.`,
        images: [
          {
            url: "https://cdn.sanity.io/images/aw6296fu/production/"+modelo.fotoPortada.asset._ref
            .replace("image-", "https://cdn.sanity.io/images/aw6296fu/production/")
            .replace("-png", ".png")
            .replace("-jpg", ".jpg"),
            width: 800,
            height: 600,
            alt: `Portada de ${modelo.nombre}`,
          },
        ],
      }}
    />
    <div className="p-4 w-full lg:w-1/3 mx-auto bg-white rounded-lg shadow-lg h-screen overflow-y-auto pb-[150px]">
      
      <div className="relative">
        {modelo.fotoPortada && (
          <img
            src={urlFor(modelo.fotoPortada).url()}
            alt="Portada"
            className="w-full h-[271px] object-cover rounded-[30px]"
            onContextMenu={(e) => e.preventDefault()}
          />
        )}
        <div className="flex absolute -bottom-14 left-4 ">
          
        {modelo.fotoPerfil && (
          <img
            src={urlFor(modelo.fotoPerfil).url()}
            alt="Foto de Perfil"
            className="w-24 lg:w-[133px] h-24 lg:h-[133px] rounded-full   object-cover"
            onContextMenu={(e) => e.preventDefault()}
          />
          
        )}
       
        <div className="flex flex-col gap-[8px] ">

       <div className="mt-[50px] lg:mt-[95px]  font-bold modeloButton text-white w-[112px] h-[24px] text-center cursor-pointer" onClick={isFollowing ? unfollowModelo: followModelo}>
  {isFollowing ? 'Unfollow' : 'Follow'}
</div>
<div className="flex gap-[7px] ">
       {/*  <div className="flex items-center gap-[2px]">
          <img src="/icons/posts.svg" className="w-[16px] h-[16px] text-gray-600" />
          <span className="text-[11px]">post</span>
        </div>
        <div className="flex items-center gap-[4px]">
          <img src="/icons/packs.svg" className="w-[16px] h-[16px] text-gray-600" />
          <span className="text-[11px]">packs</span>
        </div>
        <div className="flex items-center gap-[2px]">
          <img src="/icons/likes.svg" className="w-[16px] h-[16px] text-gray-600" />
          <span className="text-[11px]">likes</span>
        </div> */}
</div>
        </div>
       
        </div>
      </div>
      <div className="mt-16">
        <div className="flex justify-between">

        <h1 className="text-3xl font-bold ">{modelo.nombre}</h1>
        <button onClick={handleShare} className="ml-auto">
          <div className="flex items-center gap-2">

          <div className="bg-[#B9B9B98C] rounded-full w-[35px]  h-[35px] flex justify-center items-center">

        <img src="/icons/donate.svg" 
        className="text-gray-600 w-[20px] h-[16px]" />
          </div>
          <div className="bg-[#B9B9B98C] rounded-full w-[35px]  h-[35px] flex justify-center items-center">

        <LuShare 
        className="text-gray-600 w-[20px] h-[16px]" />
          </div>
        </div>
          </button>
        </div>
        <p className="text-[11px] font-bold text-[#B9B9B9] mb-4">@{modelo.slug.current}</p>
        <p className="">{modelo.biografia}</p>
        <div className="flex space-x-4 my-4">
          {modelo.instagram && (
            <a href={modelo.instagram} target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-pink-500 w-6 h-6" />
            </a>
          )}
          {modelo.twitter && (
            <a href={modelo.twitter} target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-blue-400 w-6 h-6" />
            </a>
          )}
          {modelo.tiktok && (
            <a href={modelo.tiktok} target="_blank" rel="noopener noreferrer">
              <FaTiktok className="text-black-600 w-6 h-6" />
            </a>
          )}
          
        </div>
        <div className="flex flex-row gap-x-4 my-4">
          {!subscribed ? (
            <button
              className=" text-white w-full h-[33px]  rounded-2xl cursor-pointer px-8 flex justify-between items-center loginButton font-bold text-[11px] uppercase"
              onClick={suscribeStripe}
            >
              <span>Suscribete</span>
              <span>${modelo.precioSuscripcion} por 30 días</span>
            </button>
          ) : (
            <div
              className="bg-[#6E26B6] text-white w-full h-[33px] rounded-2xl font-bold text-[11px] uppercase flex items-center justify-center "
              
            >
              Suscrito
            </div>
          )}
        </div>
        <div>
          <div className="w-full flex text-center mb-4">
            <div
              className={`w-full ${selector==='Publicaciones' ? "bg-[#D9D9D9] text-black" : "bg-white text-[#B9B9B9]" }  cursor-pointer uppercase text-[12px] font-bold flex justify-center items-center`}
              onClick={() => setSelector("Publicaciones")}
            >
              {
              modelo.publicaciones && modelo.publicacionesGratuitas ?
              modelo.publicaciones.length + modelo.publicacionesGratuitas.length
            : modelo.publicaciones.length } Publicaciones 
            </div>
            <div
              className={`w-full ${selector==='Paquetes' ? "bg-[#D9D9D9] text-black" : "bg-white text-[#B9B9B9]" }  px-4 py-2 cursor-pointer uppercase text-[12px] font-bold flex justify-center items-center `}
              onClick={() => setSelector("Paquetes")}
            >
              {modelo.paquetes.length} Paquetes
            </div>
          </div>
        </div>
        <div className="publicaciones">
          {selector === "Publicaciones" ? (
            allPublicaciones.length === 0 ? (
              <p>No hay publicaciones disponibles.</p>
            ) : (
              <div className="flex flex-col gap-8">
                {
              allPublicaciones.map((publicacion) => (
               
               <PublicacionPerfil
                key={publicacion._id}
                publicacion={publicacion}
                comprarPublicacionStripe={comprarPublicacionStripe}
                openVisor={openVisor}
                session={session}
                urlFor={urlFor}
                subscribed={subscribed}
                modelo={modelo}
                suscribeStripe={suscribeStripe}
              />
              )
              )
            }
              </div>
            )
          ) : (
            <div>
              {paquetes.length > 0 ? (
                <div className="flex flex-col gap-4 mb-4">
                  {paquetes.map((paquete, index) => (
                    <div
                      key={index}
                      className="w-full h-full relative cursor-pointer"
                      onClick={() => handlePaqueteClick(paquete.slug.current)}
                    >
                      <div className="w-full absolute left-0 bottom-4 z-10 flex flex-col justify-center items-center">
                        {paquete.nombre && (
                          <h3 className="text-center text-white bg-opacity-50 p-2">
                            {paquete.nombre}
                          </h3>
                        )}
                        <div className="w-[152px] h-[33px] paqueteButton text-center rounded-[32px] text-white font-bold flex items-center justify-center">
                          Ver por ${paquete.precio}
                        </div>
                      </div>
                      <img
                        src={urlFor(paquete.portadas[0]).url()}
                        alt=""
                        className="w-full h-[372px] rounded-[28px] object-cover"
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
        <ModalLogin isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        {isVisorOpen && (
          <ModalVisor
            isOpen={isVisorOpen}
            onClose={() => setIsVisorOpen(false)}
            fotografias={currentFotos}
          />
        )}
      </div>
    </div>
    </>
  );
}

export default Modelo;
