// pages/explorar.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Section from '@/components/Section';

const Explore = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [forYou, setForYou] = useState([]);
  const [newPaquetes, setNewPaquetes] = useState([]);
  const [discover, setDiscover] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl w-full xl:w-1/3 mx-auto p-6">
      <div className="mb-8">
        <Slider {...settings}>
          {paquetes.slice(0, 4).map((paquete, index) => (
            <div 
              key={index} 
              className="relative cursor-pointer"
              onClick={() => handlePaqueteClick(paquete.modelo.slug.current, paquete.slug.current)}
            >
              <img 
                src={paquete.portadas && paquete.portadas.length > 0 ? urlFor(paquete.portadas[0]).url() : '/default-image.png'} 
                alt={paquete.nombre} 
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4">
                <h2 className="text-xl font-bold">{paquete.nombre}</h2>
                <p>Ver ${paquete.precio}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <Section title="FOR YOU" paquetes={forYou} handlePaqueteClick={handlePaqueteClick} />
      <Section title="NEW" paquetes={newPaquetes} handlePaqueteClick={handlePaqueteClick} />
      <Section title="DISCOVER" paquetes={discover} handlePaqueteClick={handlePaqueteClick} />
    </div>
  );
};

export default Explore;
