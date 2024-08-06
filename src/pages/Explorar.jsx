// pages/explorar.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Section from '@/components/Section';
import Parati from '@/components/Secciones/Parati';
import LoNuevo from '@/components/Secciones/LoNuevo';
import Packs from '@/components/Secciones/Packs';
import Categorias from '@/components/Secciones/Categorias';

const Explore = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [forYou, setForYou] = useState([]);
  const [newPaquetes, setNewPaquetes] = useState([]);
  const [discover, setDiscover] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPaquetes = async () => {
      try {
        const query = `*[_type == "paquetes"]{
          _id,
          nombre,
          portadas,
          slug,
          precio,
          _createdAt,
          modelo->{
            nombre,
            slug
          }
        }`;

        const paquetesData = await client.fetch(query);
        setPaquetes(paquetesData);
        
        // Simulating data for sections, replace this with your own logic
        setForYou(paquetesData.slice(0, 4));
        setNewPaquetes(paquetesData.slice(0, 4));
        setDiscover(paquetesData.slice(0, 4));

        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Error al cargar los paquetes.');
        setLoading(false);
      }
    };

    fetchPaquetes();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const fetchModels = async () => {
        const query = `*[_type == "modelos" && nombre match "${searchQuery}*"]{
          _id,
          nombre,
          slug,
          fotoPerfil,
          fotoPortada
        }`;
        const results = await client.fetch(query);
        setSearchResults(results);
      };

      fetchModels();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handlePaqueteClick = (modeloSlug, paqueteSlug) => {
    router.push(`/Modelo/${modeloSlug}/Paquete/${paqueteSlug}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl w-full lg:w-1/3 h-screen overflow-y-scroll mx-auto px-[25px] mb-[100px] ">

      <div className="mb-8 ">
      <div className="relative mb-4 mt-4 lg:hidden"> 
            <input
              type="text"
              className="w-full p-2 pl-10 rounded-full bg-gray-200"
              placeholder="Buscar Modelo"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.9 14.32a8 8 0 111.414-1.414l4.3 4.3a1 1 0 01-1.414 1.414l-4.3-4.3zm-6.4 0A6.5 6.5 0 1114 7.5 6.5 6.5 0 016.5 14.82z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="space-y-4 mb-4 lg:mb-0">
            {searchQuery
              && searchResults.map((model) => (
                <div
                key={model._id}
                className="flex items-center bg-gray-200 p-4  shadow-md cursor-pointer relative rounded-[30px]"
                onClick={() => window.location.href = `/Modelo/${model.slug.current}`}
              >
                 <img
                  src={urlFor(model.fotoPortada).url()}
                  alt={model.nombre} 
                  className="w-full h-full absolute object-cover rounded-[30px] left-0" 
                /> 
                <div className="w-full h-1/2 absolute bottom-0 left-0 rounded-b-[30px] bg-black bg-opacity-50 z-10"/>
                <img
                  src={urlFor(model.fotoPerfil).url()}
                  alt={model.nombre}
                  className="w-[78px] h-[78px] bg-gray-400 rounded-full mr-4 object-cover z-20"
                />
                <button className='absolute top-4 right-4 text-white visitButton rounded-[23px] w-[112px] h-[23px] '>
                  Follow
                </button>
                <div className='z-20 text-white mt-8 '>
                  <h3 className="text-[18px] font-bold ">{model.nombre}</h3>
                  <p className="text-[9px] text-[#B9B9B9] ">@{model.nombre.replace(/\s+/g, '').toLowerCase()}</p>
                </div>
              </div>
                ))
              }
          </div>
          <h1 className='text-[20px] font-bold mb-[27px] lg:mt-[90px] '>
            Tendencias
          </h1>
        <Slider {...settings}>
          {paquetes.slice(0, 4).map((paquete, index) => (
            <div 
              key={index} 
              className="relative cursor-pointer  "
              onClick={() => handlePaqueteClick(paquete.modelo.slug.current, paquete.slug.current)}
            >
              <img 
                src={paquete.portadas && paquete.portadas.length > 0 ? urlFor(paquete.portadas[0]).url() : '/default-image.png'} 
                alt={paquete.nombre} 
                className="w-full h-[400px] object-cover rounded-[38px] "
              />
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 rounded-b-[38px]">
                <h2 className="text-xl font-bold">{paquete.nombre}</h2>
                <p>Ver ${paquete.precio}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <Parati title="Para ti"  />
      <LoNuevo title="Lo + nuevo" />
      <Packs title="Packs" paquetes={paquetes}  />
      <Categorias title="Categorías"  />
    </div>
  );
};

export default Explore;
