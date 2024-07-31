// components/Secciones/Categorias.js
import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { useRouter } from 'next/router';

const Categorias = ({ title }) => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPublicaciones = async () => {
            try {
                const query = `*[_type == "categorias"]{
                    nombre,
                    slug,
                    portada,
                    descripcion
                }`;
                const data = await client.fetch(query);
                console.log(data);
                setCategorias(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError('Error al cargar las categorias.');
                setLoading(false);
            }
        };

        fetchPublicaciones();
    }, []);

    const handlePublicacionClick = (categoriaSlug) => {
        router.push(`/Categoria/${categoriaSlug}`);
    };

    if (loading) return <div className="text-center p-6">Loading...</div>;
    if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

    return (
        <div className='w-full h-auto flex flex-col gap-[26px] mb-8'>
            <h1 className='text-[20px] font-bold'>{title}</h1>
            <div className='w-full flex items-center gap-[22px] overflow-x-auto no-scrollbar'>
                {categorias.map(categoria => (
                    <div
                        key={categoria.slug.current}
                        className='flex-shrink-0 w-[279px] h-[125px] relative cursor-pointer'
                        onClick={() => handlePublicacionClick(categoria.slug.current)}
                    >
                        <img
                            src={urlFor(categoria.portada).url()}
                            alt={categoria.nombre}
                            className='w-[279px] h-[125px] object-cover rounded-[30px]'
                        />
                        <div className='bg-black/30 absolute top-0 left-0 w-[279px] h-[125px] rounded-[30px]'/>
                          
                        <div className='absolute text-white uppercase top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
  <h2 className='text-[20px] font-bold'>{categoria.nombre}</h2>
</div>
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categorias;
