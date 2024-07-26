// pages/see-all.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Spinner } from '@/components/Spinner';

const SeeAll = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { section } = router.query;

  useEffect(() => {
    if (section) {
      const fetchPaquetes = async () => {
        try {
          const query = `*[_type == "paquetes"]{
            _id,
            nombre,
            portadas,
            slug,
            precio,
            _createdAt,
            modelo->{
              nombre,
              slug
            }
          }`;

          const paquetesData = await client.fetch(query);
          setPaquetes(paquetesData);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setError('Error al cargar los paquetes.');
          setLoading(false);
        }
      };

      fetchPaquetes();
    }
  }, [section]);

  if (loading) return <Spinner />; // Muestra el loader mientras los datos se cargan

  if (error) return <div className="text-center p-6 text-red-500">{error}</div>; // Muestra el mensaje de error

  return (
    <div className="max-w-4xl w-full xl:w-1/3 mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Todos los Paquetes de {section}</h1>
      {paquetes.length === 0 ? (
        <p>No hay paquetes disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {paquetes.map((paquete) => (
            <div 
              key={paquete._id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
              onClick={() => router.push(`/Modelo/${paquete.modelo.slug.current}/Paquete/${paquete.slug.current}`)}
            >
              <img 
                src={paquete.portadas && paquete.portadas.length > 0 ? urlFor(paquete.portadas[0]).url() : '/default-image.png'} 
                alt={paquete.nombre} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold">{paquete.nombre}</h3>
                <p className="font-bold">Precio: ${paquete.precio}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeeAll;
