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
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div className="flex space-x-4 overflow-x-auto no-scrollbar">
                {publicacionesGratuitas.map((publicacion, index) => (
                    <div 
                        key={index} 
                        className="relative cursor-pointer flex-shrink-0"
                        onClick={() => handlePublicacionClick(publicacion.modelo.slug.current, publicacion.slug.current)}
                    >
                        <img 
                            src={urlFor(publicacion.fotografias[0]).url()} 
                            alt={publicacion.modelo.nombre} 
                            className="w-[200px] h-[300px] object-cover rounded-[30px]"
                        />
                        <img
                            src={urlFor(publicacion.modelo.fotoPerfil).url()}
                            alt={publicacion.modelo.nombre}
                            className="w-[70px] h-[70px] xl:w-[90px] xl:h-[90px] rounded-full border-2 border-white absolute -bottom-[35px] left-0 right-0 mx-auto"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Parati;
