// pages/Home.js
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Spinner } from '@/components/Spinner';
import { NextSeo } from 'next-seo';

export default function Home() {
  const { data: session, status } = useSession();
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
          router.push('/explorar'); // Si no hay suscripciones, redirigir a explorar
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
    // Implementa la lógica para comprar la publicación usando Stripe
    // Este es solo un ejemplo, debes ajustarlo según tu implementación de Stripe
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
    <div className="max-w-4xl w-full p-6 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Publicaciones Recientes</h1>
      {publicaciones.length === 0 ? (
        <p>No hay publicaciones disponibles.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {publicaciones.map((publicacion) => (
            <div 
              key={publicacion._id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
            >
              {!publicacion.precio  ?(
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
              }
              <div className="p-4">
                <h2 className="text-xl font-bold">{publicacion.copy}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(publicacion._createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}