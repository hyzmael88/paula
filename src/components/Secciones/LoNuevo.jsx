// components/Secciones/LoNuevo.js
import React, { useEffect, useRef, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { useRouter } from 'next/router';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const LoNuevo = ({ title }) => {
    const [modelos, setModelos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const scrollContainerLoNuevoRef = useRef(null);


    const settings = {
        className: "center",
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 3, // Show 3 slides at a time for better visualization
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

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


    const handleNext = () => {
        if (scrollContainerLoNuevoRef.current) {
            scrollContainerLoNuevoRef.current.scrollBy({ left: 388, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (scrollContainerLoNuevoRef.current) {
            scrollContainerLoNuevoRef.current.scrollBy({ left: -388, behavior: 'smooth' });
        }
    };

    const [showPrevButton, setShowPrevButton] = useState(false);
    const [showNextButton, setShowNextButton] = useState(true);

    const updateButtonsVisibility = () => {
        if (scrollContainerLoNuevoRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerLoNuevoRef.current;
            setShowPrevButton(scrollLeft > 0);
            setShowNextButton(scrollLeft < scrollWidth - clientWidth);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            updateButtonsVisibility();
        };

        if (scrollContainerLoNuevoRef.current) {
            scrollContainerLoNuevoRef.current.addEventListener('scroll', handleScroll);
            // Initial check to set button visibility on mount
            updateButtonsVisibility();
        }

        return () => {
            if (scrollContainerLoNuevoRef.current) {
                scrollContainerLoNuevoRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [scrollContainerLoNuevoRef.current]);

    if (loading) return <div className="text-center p-6">Loading...</div>;
    if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

    return (
        <div className='w-full h-auto flex flex-col gap-[26px] mb-8'>
            <h1 className='text-[27px] font-bold'>{title}</h1>
            <div className='w-full h-full relative'>
                
            <div className='w-full flex items-center gap-[22px] overflow-x-auto no-scrollbar py-4 relative' ref={scrollContainerLoNuevoRef}>
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
                            <div className='absolute bottom-4 left-0 right-0 mx-auto w-[164px]'>
                                <h2 className='text-[16px] text-white font-bold modeloButton text-center'>{modelo.nombre}</h2>
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

export default LoNuevo;
