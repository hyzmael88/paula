import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Spinner } from '@/components/Spinner';
import Publicacion from '@/components/Publicacion';
import PublicacionCompras from '@/components/PublicacionCompras';

const Compras = () => {
  const { data: session } = useSession();
  const [compras, setCompras] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selector, setSelector] = useState("Publicaciones");
  const router = useRouter();

  const openVisor = (fotografias) => {
    setCurrentFotos(fotografias);
    setIsVisorOpen(true);
  };


  useEffect(() => {
    if (session) {
      const fetchCompras = async () => {
        try {
          const user = await client.fetch(`*[_type == "usuario" && email == $email][0]{
            compras[]->{
              _id,
              fotografias,
              copy,
              slug,
              precio,
              _createdAt,
              modelo->{
                fotoPerfil,
                nombre,
                slug

              }
            },
            paquetesAdquiridos[]->{
              _id,
              nombre,
              portadas,
              slug,
              precio,
              _createdAt,
              modelo->{
                fotoPerfil,
                nombre,
                slug
              }
            }
          }`, {
            email: session.user.email,
          });

          if (user) {
            if (user.compras) {
              console.log(user.compras)
              setCompras(user.compras);
            }
            if (user.paquetesAdquiridos) {
              setPaquetes(user.paquetesAdquiridos);
            }
          }
          setLoading(false);
        } catch (error) {
          console.error(error);
          setError('Error al cargar las compras.');
          setLoading(false);
        }
      };
      fetchCompras();
    }
  }, [session]);

  const obtenerSlugDeModeloPorRef = async (modeloRef) => {
    try {
      const query = `*[_type == "modelos" && _id == $modeloRef][0]{
        "slug": slug.current
      }`;
      const params = { modeloRef };
      const data = await client.fetch(query, params);
      if (data && data.slug) {
      
        return data.slug;
      } else {
        console.error("No se encontró la modelo con el _ref proporcionado.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el slug de la modelo:", error);
      return null;
    }
  };

  const handlePaqueteClick = async (modeloRef, paqueteSlug) => {
    const modeloSlug = await obtenerSlugDeModeloPorRef(modeloRef);
    if (modeloSlug) {
      router.push(`/Modelo/${modeloSlug}/Paquete/${paqueteSlug}`);
    }
  };

  const handlePublicacionClick = async (modeloRef, publicacionSlug) => {
    const modeloSlug = await obtenerSlugDeModeloPorRef(modeloRef);
    if (modeloSlug) {
      router.push(`/Modelo/${modeloSlug}/Publicacion/${publicacionSlug}`);
    }
  };

  useEffect(() => {
    if (!session) {
      router.push('/Auth/Login');
    }
  }, [session, router]);

  if (!session) {
    return null; // Retorna null para evitar renderizar el componente antes de redirigir
  }

  if (loading) return <Spinner />; // Muestra el loader mientras los datos se cargan

  if (error) return <div className="text-center p-6 text-red-500">{error}</div>; // Muestra el mensaje de error

  return (
    <div className="max-w-4xl w-full lg:w-1/3 mx-auto h-screen overflow-y-scroll pb-[100px] lg:px-[40px] lg:pb-[150px]  lg:mt-[80px] mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Compras</h1>
      {
        console.log(compras)
      }
      {
        console.log(paquetes)
      }
      {compras.length === 0 && paquetes.length === 0 ? (
        <p className='text-center'>No has comprado ningún paquete o publicación.</p>
      ) : (
        <>
        <div className="w-full flex text-center mb-4">
            <div
              className={`w-full {selector==='Publicaciones ' ? "bg-[#D9D9D9] text-black" : "bg-[#e2e1e1] text-[#9b9b9b] }  cursor-pointer uppercase text-[12px] font-bold flex justify-center items-center`}
              onClick={() => setSelector("Publicaciones")}
            >
               {compras.length} Publicaciones 
            </div>
            <div
              className={`w-full ${selector==='Paquetes' ? "bg-[#D9D9D9] text-black" : "bg-[#e2e1e1] text-[#9b9b9b]" }  px-4 py-2 cursor-pointer uppercase text-[12px] font-bold flex justify-center items-center `}
              onClick={() => setSelector("Paquetes")}
            >
               {paquetes.length} Paquetes
            </div>
          </div>
          {
            selector === "Publicaciones" && (
          <div className="flex flex-col gap-6 mb-8 ">
          
            {compras.map((publicacion, index) => (
              
              <PublicacionCompras
              publicacion={publicacion}
              openVisor={openVisor}
              urlFor={urlFor}
              key={index}
              />
              
            ))}
          </div>
            )
          } 
          
          {
            selector === "Paquetes" && (
          <div className="flex flex-col gap-6">
            {paquetes.map((paquete, index) => (
               <div
               key={index}
               className="w-full h-full relative cursor-pointer"
               onClick={() => handlePaqueteClick(paquete.slug.current)}
             >
               <div className="w-full absolute left-0 bottom-4 z-10 flex flex-col justify-center items-center">
                 {paquete.nombre && (
                   <h3 className="text-center text-white bg-opacity-50 font-bold text-[15px] p-2">
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
            )
          } 
            
        </>
      )}
    </div>
  );
};

export default Compras;
