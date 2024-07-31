// components/Secciones/Packs.js
import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { useRouter } from 'next/router';

const Packs = ({ title }) => {
    const [paquetes, setPaquetes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPaquetes = async () => {
            try {
                const query = `*[_type == "paquetes"]{
                    nombre,
                    precio,
                    portadas,
                    slug,
                    copy
                }`;
                const data = await client.fetch(query);
                setPaquetes(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError('Error al cargar los paquetes.');
                setLoading(false);
            }
        };

        fetchPaquetes();
    }, []);

    const handlePublicacionClick = (paquetelug) => {
        router.push(`/Modelo/${modeloSlug}`);
    };

    if (loading) return <div className="text-center p-6">Loading...</div>;
    if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

    return (
        <div className='w-full h-auto flex flex-col gap-[26px] mb-8'>
            <h1 className='text-[20px] font-bold'>{title}</h1>
            <div className='w-full flex items-center gap-[22px] overflow-x-auto no-scrollbar'>
                {paquetes.map(paquete => (
                    <div
                        key={paquete.slug.current}
                        className='flex-shrink-0 w-full h-full relative cursor-pointer'
                        onClick={() => handlePublicacionClick(paquete.slug.current)}
                    >
                      {
                        console.log(paquete)
                      }<img
                            src={urlFor(paquete.portadas[0]).url()}
                            alt={paquete.nombre}
                            className='w-full h-[393px] object-cover rounded-[30px]'
                        /> 
                        {/* <div className='absolute bottom-4 left-0 right-0 mx-auto w-[164px] '>
                            <h2 className='text-[16px] text-white font-bold  text-center'>{paquete.copy}</h2>
                          </div> */}
                        <div className='absolute bottom-4 left-0 right-0 mx-auto w-[164px] '>
                            <h2 className='text-[16px] text-white font-bold modeloButton text-center'>Ver por ${paquete.precio}</h2>
                          </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Packs;
