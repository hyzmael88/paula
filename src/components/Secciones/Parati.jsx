// components/Secciones/Parati.js
import React, { useEffect, useRef, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { useRouter } from 'next/router';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Parati = ({ title }) => {
    const [publicacionesGratuitas, setPublicacionesGratuitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const scrollContainerParaTiRef = useRef(null);
    const publicacionRef = useRef(null);
    const [posicion, setPosicion] = useState(0)


    useEffect(() => {
        const fetchPublicaciones = async () => {
            try {
                const query = `*[_type == "modelos" && defined(publicacionesGratuitas)]{
                    nombre,
                    fotoPerfil,
                    slug,
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
        router.push(`/Modelo/${modeloSlug}`);
    };

    
    useEffect(() => {
        if(publicacionesGratuitas.length > 0){
        if(posicion === 0){
            setShowPrevButton(false);
        }
        if(posicion === publicacionesGratuitas.length - 1){
            setShowNextButton(false);
        }
        if(posicion > 0){
            setShowPrevButton(true);
        }
        if(posicion < publicacionesGratuitas.length - 1){
            setShowNextButton(true);
        }
    }
    else{
        setShowPrevButton(false);
        setShowNextButton(false);
    }
        
    }, [posicion, publicacionesGratuitas]);


    const handleNext = () => {
        console.log("entre mas posicion", posicion);
        setPosicion(prevPosicion => {
            const newPosicion = prevPosicion + 1;
            scrollContainerParaTiRef.current.scrollBy({ left: publicacionRef.current.width*2, behavior: 'smooth' });
            return newPosicion;
        });
    };
    
    const handlePrev = () => {
        console.log("entre menos posicion", posicion);
        setPosicion(prevPosicion => {
            const newPosicion = prevPosicion - 1;
            scrollContainerParaTiRef.current.scrollBy({ left: -publicacionRef.current.width*2, behavior: 'smooth' });
            return newPosicion;
        });
    };
    

    const [showPrevButton, setShowPrevButton] = useState(false);
    const [showNextButton, setShowNextButton] = useState(true);

    if (loading) return <div className="text-center p-6">Loading...</div>;
    if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

    return (
        <div className='w-full  flex flex-col justify-start  gap-[23px] cursor-pointer '>
          <h1 className='text-[27px] font-bold '>
            {title}
          </h1>
          <div className='w-full  relative'>

          <div className='w-full h-full flex items-center gap-[26px] overflow-x-scroll  no-scrollbar pb-[50px]'
          ref={scrollContainerParaTiRef}
          >
          {
            publicacionesGratuitas.map(publicacion => (
                <div
                ref={publicacionRef}
                    key={publicacion._id}
                    className='w-[159px] h-[236px] lg:w-[201px] lg:h-[299px] flex flex-col items-center justify-center  relative'
                    onClick={() => handlePublicacionClick(publicacion.modelo.slug.current, publicacion.slug.current)}
                >
                    <img
                        src={urlFor(publicacion.fotografias[0].asset).url()}
                        alt={publicacion.titulo}
                        className='w-full h-full object-cover rounded-[30px]'
                    />
                    
                    
                    <img
                        src={urlFor(publicacion.modelo.fotoPerfil).width(300).height(300).url()}
                        alt={publicacion.titulo}
                        className='absolute w-[98px] h-[98px] object-cover rounded-full -bottom-8 '
                    /> 
                    
                    
                </div>
            ))
          }

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

export default Parati;
