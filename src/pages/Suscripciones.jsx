import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'; // Asegúrate de importar el CSS de SweetAlert2

const Suscripciones = () => {
  const { data: session, status } = useSession();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      const fetchSubscriptions = async () => {
        try {
          const user = await client.fetch(`*[_type == "usuario" && email == $email][0]{
            "subscribedModels": subscribedModels[]{
              modelRef->{
                _id,
                nombre,
                slug,
                fotoPerfil,
                _createdAt
              },
              subscriptionId
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

  const handleUnsubscribe = async (modelId, subscriptionId) => {
    if (!session) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción y en este momento perderas el acceso al contenido.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF66AE', // Usa el color de tu estilo
      cancelButtonColor: '#6E26B6', // Usa el color de tu estilo
      confirmButtonText: 'Sí, desuscribirme',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch('/api/unsubscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ modelId, subscriptionId, email: session.user.email }),
          });

          if (response.ok) {
            setSubscriptions(subscriptions.filter(model => model.modelRef._id !== modelId));
            Swal.fire(
              'Desuscrito',
              'Te has desuscrito correctamente.',
              'success'
            );
          } else {
            const data = await response.json();
            console.error('Error al desuscribirse del modelo:', data.error);
            Swal.fire(
              'Error',
              'Hubo un problema al desuscribirse. Por favor, inténtalo de nuevo.',
              'error'
            );
          }
        } catch (error) {
          console.error('Error al desuscribirse del modelo:', error);
          Swal.fire(
            'Error',
            'Hubo un problema al desuscribirse. Por favor, inténtalo de nuevo.',
            'error'
          );
        }
      }
    });
  };

  useEffect(() => {
    if (status === 'loading') {
      // Esperar a que la sesión termine de cargar
      return;
    }
    if (!session) {
      // Redirigir al login si no hay sesión
      router.push('/Auth/Login');
    }
  }, [session, status, router]);

  if (!session) {
    return null; // Retorna null para evitar renderizar el componente antes de redirigir
  }

  if (loading) return <div className="text-center p-6">Cargando...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl w-full lg:w-1/3 mx-auto p-6">
      <h1 className="text-[32px] font-bold text-center lg:mt-[75px] mb-6"> Suscripciones</h1>
      {subscriptions.length === 0 ? (
        <p>No estás suscrito a ningún modelo.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {subscriptions.map((model) => (
            <div 
              key={model.modelRef._id} 
              className="bg-white h-[95px] rounded-[30px] suscriptionShadow overflow-hidden cursor-pointer flex flex-row items-center gap-[15px] px-[37px] " 
              onClick={() => handleModelClick(model.modelRef.slug.current)}
            >
              <img 
                src={model.modelRef.fotoPerfil ? urlFor(model.modelRef.fotoPerfil).url() : '/default-profile.png'} 
                alt={model.modelRef.nombre} 
                className="w-[59px] h-[59px]  rounded-full object-cover"
              />
              <div className=" flex-1">
                <h2 className="text-[16px] font-bold">{model.modelRef.nombre}</h2>
                <p className="text-[10px] font-bold text-[#B9B9B9]">@{model.modelRef.slug.current}</p>
                <p className='text-[10px]'>Suscrito desde el {moment(model.modelRef._createdAt).format('DD/MM/YY')}</p>
              </div>
              <button
                className="loginButton text-white px-4 py-2 rounded-[20px] text-[8px] lg:text-[12px] font-bold w-[67px] lg:w-[112px] h-[14px]lg:h-[23px]  flex justify-center items-center  "
                onClick={(e) => {
                  e.stopPropagation(); // Para evitar que el click en el botón navegue al modelo
                  handleUnsubscribe(model.modelRef._id, model.subscriptionId);
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
