import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import moment from "moment";

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
          const user = await client.fetch(   `*[_type == "usuario" && email == $email][0]{
            "subscribedModels": subscribedModels[]{
              _id,
              nombre,
              slug,
              fotoPerfil,
              _createdAt,
              subscriptionId
            }
          }`, {
            email: session.user.email,
          });

          if (user && user.subscribedModels) {
            console.log(user)
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

  const handleUnsubscribe = async (modelId, subscriptionId) => {
    if (!session) return;

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelId, subscriptionId }),
      });

      if (response.ok) {
        setSubscriptions(subscriptions.filter(model => model._id !== modelId));
      } else {
        const data = await response.json();
        console.error('Error al desuscribirse del modelo:', data.error);
      }
    } catch (error) {
      console.error('Error al desuscribirse del modelo:', error);
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

  if (loading) return <div className="text-center p-6">Cargando...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl w-full lg:w-1/3 mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mis Suscripciones</h1>
      {subscriptions.length === 0 ? (
        <p>No estás suscrito a ningún modelo.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {subscriptions.map((model) => (
            <div 
              key={model._id} 
              className="bg-white rounded-[30px] suscriptionShadow overflow-hidden cursor-pointer flex flex-row items-center gap-[15px] px-[37px]" 
              onClick={() => handleModelClick(model.slug.current)}
            >
              <img 
                src={model.fotoPerfil ? urlFor(model.fotoPerfil).url() : '/default-profile.png'} 
                alt={model.nombre} 
                className="w-[59px] h-[59px] rounded-full object-cover"
              />
              <div className="p-4 flex-1">
                <h2 className="text-xl font-bold">{model.nombre}</h2>
                <p className="text-[10px] font-bold text-[#B9B9B9]">@{model.slug.current}</p>
                <p className='text-[10px]'>Suscrito desde el {moment(model._createdAt).format('DD/MM/YY')}</p>
              </div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-[20px] text-[12px] font-bold"
                onClick={(e) => {
                  e.stopPropagation(); // Para evitar que el click en el botón navegue al modelo
                  handleUnsubscribe(model._id, model.subscriptionId);
                }}
              >
                Desuscribirse
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Suscripciones;
