import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

const Suscripciones = () => {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      const fetchSubscriptions = async () => {
        try {
          const user = await client.fetch(`*[_type == "usuario" && email == $email][0]{
            subscribedModels[]->{
              _id,
              nombre,
              slug,
              fotoPerfil
            }
          }`, {
            email: session.user.email,
          });

          if (user && user.subscribedModels) {
            setSubscriptions(user.subscribedModels);
          }
          setLoading(false);
        } catch (error) {
          console.error(error);
          setError('Error al cargar las suscripciones.');
          setLoading(false);
        }
      };
      fetchSubscriptions();
    }
  }, [session]);

  const handleModelClick = (slug) => {
    router.push(`/Modelo/${slug}`);
  };

  useEffect(() => {
    if (!session) {
      router.push('/Auth/Login');
    }
  }, [session, router]);

  if (!session) {
    return null; // Retorna null para evitar renderizar el componente antes de redirigir
  }

  if (loading) return <div className="text-center p-6">Cargando...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mis Suscripciones</h1>
      {subscriptions.length === 0 ? (
        <p>No estás suscrito a ningún modelo.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subscriptions.map((model) => (
            <div 
              key={model._id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer" 
              onClick={() => handleModelClick(model.slug.current)}
            >
              <img 
                src={model.fotoPerfil ? urlFor(model.fotoPerfil).url() : '/default-profile.png'} 
                alt={model.nombre} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold">{model.nombre}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Suscripciones;
