// components/Secciones/LoNuevo.js
import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { useRouter } from 'next/router';

const LoNuevo = ({ title }) => {
    const [modelos, setModelos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPublicaciones = async () => {
            try {
                const query = `*[_type == "modelos"]{
                    nombre,
                    fotoPerfil,
                    slug
                }`;
                const data = await client.fetch(query);
                setModelos(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError('Error al cargar las modelos.');
                setLoading(false);
            }
        };

        fetchPublicaciones();
    }, []);

    const handlePublicacionClick = (modeloSlug) => {
        router.push(`/Modelo/${modeloSlug}`);
    };

    if (loading) return <div className="text-center p-6">Loading...</div>;
    if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

    return (
        <div className='w-full h-auto flex flex-col gap-[26px] mb-8'>
            <h1 className='text-[20px] font-bold'>{title}</h1>
            <div className='w-full flex items-center gap-[22px] overflow-x-auto no-scrollbar'>
                {modelos.map(modelo => (
                    <div
                        key={modelo.slug.current}
                        className='flex-shrink-0 w-[384px] h-[258px] relative cursor-pointer'
                        onClick={() => handlePublicacionClick(modelo.slug.current)}
                    >
                        <img
                            src={urlFor(modelo.fotoPerfil).url()}
                            alt={modelo.nombre}
                            className='w-[384px] h-[258px] object-cover rounded-[30px]'
                        />
                        <div className='absolute bottom-4 left-0 right-0 mx-auto w-[164px] '>
                            <h2 className='text-[16px] text-white font-bold modeloButton text-center'>{modelo.nombre}</h2>
                          </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoNuevo;
