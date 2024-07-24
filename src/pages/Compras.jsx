import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Spinner } from '@/components/Spinner';

const Compras = () => {
  const { data: session } = useSession();
  const [compras, setCompras] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

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
              _createdAt
            },
            paquetesAdquiridos[]->{
              _id,
              nombre,
              portadas,
              slug,
              precio,
              _createdAt
            }
          }`, {
            email: session.user.email,
          });

          if (user) {
            if (user.compras) {
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

  const handlePaqueteClick = (paqueteSlug) => {
    router.push(`/paquete/${paqueteSlug}`);
  };

  const handlePublicacionClick = (publicacionSlug) => {
    router.push(`/publicacion/${publicacionSlug}`);
  };

  if (loading) return <Spinner />; // Muestra el loader mientras los datos se cargan

  if (error) return <div className="text-center p-6 text-red-500">{error}</div>; // Muestra el mensaje de error

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mis Compras</h1>
      {compras.length === 0 && paquetes.length === 0 ? (
        <p>No has comprado ningún paquete o publicación.</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Publicaciones Compradas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {compras.map((publicacion) => (
              <div 
                key={publicacion._id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                onClick={() => handlePublicacionClick(publicacion.slug.current)}
              >
                <img 
                  src={publicacion.fotografias && publicacion.fotografias.length > 0 ? urlFor(publicacion.fotografias[0]).url() : '/default-image.png'} 
                  alt={publicacion.copy} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-sm text-gray-500">{publicacion.copy}</p>
                  {publicacion.precio && <p className="font-bold">Precio: ${publicacion.precio}</p>}
                </div>
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-4">Paquetes Adquiridos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paquetes.map((paquete) => (
              <div 
                key={paquete._id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                onClick={() => handlePaqueteClick(paquete.slug.current)}
              >
                <img 
                  src={paquete.portadas && paquete.portadas.length > 0 ? urlFor(paquete.portadas[0]).url() : '/default-image.png'} 
                  alt={paquete.nombre} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{paquete.nombre}</h3>
                  {paquete.precio && <p className="font-bold">Precio: ${paquete.precio}</p>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Compras;