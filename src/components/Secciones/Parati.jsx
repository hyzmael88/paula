// components/Secciones/Parati.js
import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { useRouter } from 'next/router';

const Parati = ({ title }) => {
    const [publicacionesGratuitas, setPublicacionesGratuitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPublicaciones = async () => {
            try {
                const query = `*[_type == "modelos" && defined(publicacionesGratuitas)]{
                    nombre,
                    fotoPerfil,
                    publicacionesGratuitas[]->{
                        _id,
                        fotografias,
                        slug
                    }
                }`;
                const data = await client.fetch(query);
                setPublicacionesGratuitas(data.flatMap(modelo => modelo.publicacionesGratuitas.map(pub => ({ ...pub, modelo }))));
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError('Error al cargar las publicaciones gratuitas.');
                setLoading(false);
            }
        };

        fetchPublicaciones();
    }, []);

    const handlePublicacionClick = (modeloSlug, publicacionSlug) => {
        router.push(`/Modelo/${modeloSlug}/Publicacion/${publicacionSlug}`);
    };

    if (loading) return <div className="text-center p-6">Loading...</div>;
    if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

    return (
        <div className='w-full h-[450px] flex flex-col  gap-[26px] '>
          <h1 className='text-[20px] font-bold '>
            {title}
          </h1>
          <div className='w-full flex items-center gap-[26px]'>
          {
            publicacionesGratuitas.map(publicacion => (
                <div
                    key={publicacion._id}
                    className='flex flex-col items-center justify-center  relative'
                    onClick={() => handlePublicacionClick(publicacion.modelo.slug.current, publicacion.slug.current)}
                >
                    <img
                        src={urlFor(publicacion.fotografias[0].asset).url()}
                        alt={publicacion.titulo}
                        className='flex-shrink-0 w-[201px] h-[299px] object-cover rounded-[30px]'
                    />
                    
                    
                    <img
                        src={urlFor(publicacion.modelo.fotoPerfil).width(300).height(300).url()}
                        alt={publicacion.titulo}
                        className='absolute w-[98px] h-[98px] object-cover rounded-full -bottom-8'
                    /> 
                    
                    
                </div>
            ))
          }

        </div>
        </div>
    );
};

export default Parati;
