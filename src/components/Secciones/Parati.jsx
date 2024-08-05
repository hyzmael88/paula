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

    
    const handleNext = () => {
        if (scrollContainerParaTiRef.current) {
            scrollContainerParaTiRef.current.scrollBy({ left: 390, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (scrollContainerParaTiRef.current) {
            scrollContainerParaTiRef.current.scrollBy({ left: -390, behavior: 'smooth' });
        }
    };

    const [showPrevButton, setShowPrevButton] = useState(false);
    const [showNextButton, setShowNextButton] = useState(true);

    const updateButtonsVisibility = () => {
        if (scrollContainerParaTiRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerParaTiRef.current;
            setShowPrevButton(scrollLeft > 0);
            setShowNextButton(scrollLeft < scrollWidth - clientWidth);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            updateButtonsVisibility();
        };

        if (scrollContainerParaTiRef.current) {
            scrollContainerParaTiRef.current.addEventListener('scroll', handleScroll);
            // Initial check to set button visibility on mount
            updateButtonsVisibility();
        }

        return () => {
            if (scrollContainerParaTiRef.current) {
                scrollContainerParaTiRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [scrollContainerParaTiRef.current]);

    if (loading) return <div className="text-center p-6">Loading...</div>;
    if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

    return (
        <div className='w-full h-[450px] flex flex-col  gap-[26px] cursor-pointer '>
          <h1 className='text-[20px] font-bold '>
            {title}
          </h1>
          <div className='w-full h-full relative'>

          <div className='w-full h-full flex items-center gap-[26px] overflow-x-scroll overflow-y-hidden no-scrollbar'
          ref={scrollContainerParaTiRef}
          >
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
