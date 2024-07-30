// pages/Home.js
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Spinner } from '@/components/Spinner';
import { NextSeo } from 'next-seo';
import ModalVisor from '@/components/ModalVisor';
import moment from 'moment';
import 'moment/locale/es'; // Importa el idioma español
import { FaRegImage } from 'react-icons/fa';
import Publicacion from '@/components/Publicacion';
import getStripe from '@/sanity/lib/getStripe';

moment.locale('es');


export default function Home() {
  const { data: session, status } = useSession();
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisorOpen, setIsVisorOpen] = useState(false);
  const [currentFotos, setCurrentFotos] = useState([]);
  
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Si la sesión está cargando, no hacer nada
    if (!session) {
      signIn(); // Si no está autenticado, redirigir al inicio de sesión
      return;
    }

    const fetchData = async () => {
      try {
        const user = await client.fetch(`*[_type == "usuario" && email == $email][0]{
          subscribedModels[]->{
            publicaciones[]->{
              _id,
              fotografias,
              copy,
              slug,
              precio,
              _createdAt,
              modelo->{
                nombre,
                fotoPerfil,
                slug,
                _id
              }
            }
          },
          compras[]->{
            _id
          }
        }`, { email: session.user.email });

        if (!user || !user.subscribedModels || user.subscribedModels.length === 0) {
          router.push('/Explorar'); // Si no hay suscripciones, redirigir a explorar
          return;
        }

        // Concatenar todas las publicaciones de los modelos suscritos y ordenarlas por fecha
        const allPublicaciones = user.subscribedModels.flatMap(modelo => modelo.publicaciones).sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));
        
        setPublicaciones(allPublicaciones);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Error al cargar las publicaciones.');
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router]);

  const comprarPublicacionStripe = async (publicacion) => {
    const stripe = await getStripe();
    const response = await fetch('/api/stripeComprarPublicacion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        precio: publicacion.precio,
        nombre: publicacion.modelo.nombre,
        _id: publicacion._id,
        email: session.user.email,
      }),
    });

    if (response.status === 500) return;

    const data = await response.json();
    const { error } = stripe.redirectToCheckout({ sessionId: data.id });
    if (error) console.error('Error al redirigir a Stripe:', error);
  };

  const openVisor = (fotografias) => {
    setCurrentFotos(fotografias);
    setIsVisorOpen(true);
  };

  if (loading) return <Spinner />; // Muestra el loader mientras los datos se cargan

  if (error) return <div className="text-center p-6 text-red-500">{error}</div>; // Muestra el mensaje de error

  return (
    <>
      <NextSeo
        title="Prime Beauties | Home"
        description="Esta es la descripción de la página de inicio"
        openGraph={{
          title: 'Prime Beauties | Home',
          description: 'Esta es la descripción de la página de inicio',
          images: [
            {
              url: 'https://www.tusitioweb.com/imagen-inicio-og.png',
              width: 800,
              height: 600,
              alt: 'Imagen de Inicio',
            },
          ],
        }}
      />
      <div className="max-w-4xl w-full lg:w-1/3  mx-auto">
        <div className='w-full  mb-[33px]'>
          <img src='/Logo.png' alt='Logo' className='w-[205px] mx-auto' />
        </div>
        {/* <h1 className="text-3xl font-bold mb-6">Publicaciones Recientes</h1> */}
        {publicaciones.length === 0 ? (
          <p>No hay publicaciones disponibles.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {publicaciones.map((publicacion) => (
              <Publicacion
              key={publicacion._id}
              publicacion={publicacion}
              comprarPublicacionStripe={comprarPublicacionStripe}
              openVisor={openVisor}
              session={session}
              urlFor={urlFor}


              />
            ))}
          </div>
        )}
      </div>
      {isVisorOpen && (
        <ModalVisor
          isOpen={isVisorOpen}
          onClose={() => setIsVisorOpen(false)}
          fotografias={currentFotos}
        />
      )}
    </>
  );
}
