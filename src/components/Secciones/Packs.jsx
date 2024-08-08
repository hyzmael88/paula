// components/Secciones/Packs.js
import React, { useEffect, useRef, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { useRouter } from 'next/router';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Packs = ({ title }) => {
    const [paquetes, setPaquetes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const scrollContainerPacksRef = useRef(null);
    const [posicion, setPosicion] = useState(0)

    useEffect(() => {
        const fetchPaquetes = async () => {
            try {
                const query = `*[_type == "paquetes"]{
                    nombre,
                    precio,
                    portadas,
                    slug,
                    copy,
                    modelo->{
                        nombre,
                        slug
                    }
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

    const handlePublicacionClick = (modeloSlug,paqueteSlug) => {
        router.push(`/Modelo/${modeloSlug}/Paquete/${paqueteSlug}`);
    };

    useEffect(() => {
        if(paquetes.length > 0){
        if(posicion === 0){
            setShowPrevButton(false);
        }
        if(posicion === paquetes.length - 1){
            setShowNextButton(false);
        }
        if(posicion > 0){
            setShowPrevButton(true);
        }
        if(posicion < paquetes.length - 1){
            setShowNextButton(true);
        }
        }
        else{
            setShowPrevButton(false);
            setShowNextButton(false);
        }
        
    }, [posicion, paquetes]);
    
    const handleNext = () => {
        console.log("entre mas posicion", posicion);
        setPosicion(prevPosicion => {
            const newPosicion = prevPosicion + 1;
            scrollContainerPacksRef.current.scrollBy({ left: scrollContainerPacksRef.current.clientWidth+22, behavior: 'smooth' });
            return newPosicion;
        });
    };
    
    const handlePrev = () => {
        console.log("entre menos posicion", posicion);
        setPosicion(prevPosicion => {
            const newPosicion = prevPosicion - 1;
            scrollContainerPacksRef.current.scrollBy({ left: -scrollContainerPacksRef.current.clientWidth-22, behavior: 'smooth' });
            return newPosicion;
        });
    };
    

    const [showPrevButton, setShowPrevButton] = useState(false);
    const [showNextButton, setShowNextButton] = useState(true);
  

    if (loading) return <div className="text-center p-6">Loading...</div>;
    if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

    return (
        <div className='w-full h-auto flex flex-col gap-[26px] mb-8'>
            <h1 className='text-[27px] font-bold'>{title}</h1>
            <div className='w-full h-full relative'>

            <div className='w-full flex items-center gap-[22px] overflow-x-auto no-scrollbar'
             ref={scrollContainerPacksRef}
            >
                {paquetes.map(paquete => (
                    <div
                        key={paquete.slug.current}
                        className='flex-shrink-0 w-full h-full relative cursor-pointer'
                        onClick={() => handlePublicacionClick(paquete.modelo.slug.current, paquete.slug.current)}
                    >
                      <img
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
            {showPrevButton && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-[47px] h-[47px] rounded-full z-10 bg-[#B9B9B98C] flex justify-center items-center cursor-pointer" onClick={handlePrev}>
                        <FaChevronLeft className="text-white" />
                    </div>
                )}
               {showNextButton && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-[47px] h-[47px] rounded-full z-10 bg-[#B9B9B98C] flex justify-center items-center cursor-pointer" onClick={handleNext}>
                        <FaChevronRight className="text-white" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Packs;
