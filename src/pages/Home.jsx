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
              <div 
                key={publicacion._id} 
                className="bg-white  shadow-lg overflow-hidden cursor-pointer"
              >
                <div className='w-full flex justify-between px-2 '>
                  <div className='flex items-center'>
                    <img src={urlFor(publicacion.modelo.fotoPerfil).url()} alt={publicacion.modelo.nombre} className='w-[60px] h-[60px] bg-gray-400 rounded-full mr-4' />
                    <div className='flex flex-col'>
                      <p className='font-black text-[16px] '>{publicacion.modelo.nombre}</p>
                      <p className='text-[11px] font-bold text-[#B9B9B9]'>@{publicacion.modelo.slug.current}</p>
                      </div>
                    </div>
                    <div>
                     
                      <p className='text-[#B9B9B9] font-bold text-[11px] pt-3'>{moment(publicacion._createdAt).fromNow()}</p>
                      </div>
                  </div>
                 <div className="p-4">
                  <h2 className="text-[11px] leading-[13px]">{publicacion.copy}</h2>
                  
                </div>
                {!publicacion.precio  ?(
                  publicacion.fotografias &&
                  publicacion.fotografias.length > 0 && (
                    <div className="fotografias mb-4"> 
                      <img
                        key={publicacion.fotografias[0]}
                        src={urlFor(publicacion.fotografias[0]).url()}
                        alt={`Fotografía `}
                        className="w-full h-[330px] object-cover mb-2 cursor-pointer"
                        onClick={() => openVisor(publicacion.fotografias.map(foto => urlFor(foto).url()))}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </div>
                  )
                ) : session.user.compras &&
                  session.user.compras.some(
                    (compra) => compra._ref === publicacion._id
                  ) ? (
                    publicacion.fotografias &&
                    publicacion.fotografias.length > 0 && (
                      <div className="fotografias mb-4">
                        <img
                          key={publicacion.fotografias[0]}
                          src={urlFor(publicacion.fotografias[0]).url()}
                          alt={`Fotografía `}
                          className="w-full h-[60vh] object-cover mb-2 cursor-pointer"
                          onClick={() => openVisor(publicacion.fotografias.map(foto => urlFor(foto).url()))}
                          onContextMenu={(e) => e.preventDefault()}
                        />
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
                <div className='w-full flex justify-between items-center'>
                  <div className='flex'>

                    <div className='flex '>
                      <span>
                        200
                      </span>
                      </div>
                      <div className='flex '>
                        10 comentarios
                        </div>
                      </div>
                      <div>
                       dinero y guardar
                        </div>
                  </div>
              </div>
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
