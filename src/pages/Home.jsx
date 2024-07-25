// pages/Home.js
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Spinner } from '@/components/Spinner';

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
              _createdAt,
              modelo->{
                nombre,
                slug
              }
            }
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

  if (loading) return <Spinner />; // Muestra el loader mientras los datos se cargan

  if (error) return <div className="text-center p-6 text-red-500">{error}</div>; // Muestra el mensaje de error

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Publicaciones Recientes</h1>
      {publicaciones.length === 0 ? (
        <p>No hay publicaciones disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {publicaciones.map((publicacion) => (
            <div 
              key={publicacion._id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
              onClick={() => router.push(`/Modelo/${publicacion.modelo.slug.current}/publicacion/${publicacion.slug.current}`)}
            >
              <img 
                src={publicacion.fotografias && publicacion.fotografias.length > 0 ? urlFor(publicacion.fotografias[0]).url() : '/default-image.png'} 
                alt={publicacion.copy} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500">{publicacion.copy}</p>
                <p className="text-xs text-gray-400">{new Date(publicacion._createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
