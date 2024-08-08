// components/Secciones/Categorias.js
import React, { useEffect, useRef, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { useRouter } from 'next/router';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Categorias = ({ title }) => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const scrollContainerRef = useRef(null);
    const categoriaRef = useRef(null);
    const [posicion, setPosicion] = useState(0)


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

    useEffect(() => {
        if(categorias.length > 0){
        if(posicion === 0){
            setShowPrevButton(false);
        }
        if(posicion === categorias.length - 1){
            setShowNextButton(false);
        }
        if(posicion > 0){
            setShowPrevButton(true);
        }
        if(posicion < categorias.length - 1){
            setShowNextButton(true);
        }
        }
        else{
            setShowPrevButton(false);
            setShowNextButton(false);
        }
            
        
    }, [posicion,categorias]);


    const handleNext = () => {
        console.log("entre mas posicion", posicion);
        setPosicion(prevPosicion => {
            const newPosicion = prevPosicion + 1;
            scrollContainerRef.current.scrollBy({ left: categoriaRef.current.width+4, behavior: 'smooth' });
            return newPosicion;
        });
    };
    
    const handlePrev = () => {
        console.log("entre menos posicion", posicion);
        setPosicion(prevPosicion => {
            const newPosicion = prevPosicion - 1;
            scrollContainerRef.current.scrollBy({ left: -categoriaRef.current.width-4, behavior: 'smooth' });
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
            ref={scrollContainerRef}
            >
                {categorias.map(categoria => (
                    <div
                        key={categoria.slug.current}
                        className='flex-shrink-0 w-[279px] h-[125px] relative cursor-pointer'
                        onClick={() => handlePublicacionClick(categoria.slug.current)}
                    >
                        <img
                        ref={categoriaRef}
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

export default Categorias;
