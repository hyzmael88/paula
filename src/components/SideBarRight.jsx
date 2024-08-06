import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

const SidebarRight = () => {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Fetch initial suggestions
    const fetchSuggestions = async () => {
      try {
        const query = `*[_type == "modelos"] | order(_createdAt desc)[0...5]{
          _id,
          nombre,
          slug,
          fotoPerfil,
          fotoPortada
        }`;
        const results = await client.fetch(query);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
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

  if (session) {
    return (
      <div className="w-1/3 hidden bg-white h-screen border-l-[1px] border-l-[#71056D]  lg:flex flex-col p-4">
        <div className="mb-8  lg:mt-[80px]">
          <div className="relative">
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
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Sugerencias</h2>
          <div className="space-y-4">
            {searchQuery
              ? searchResults.map((model) => (
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
              : suggestions.map((model) => (
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
                    <button className='absolute top-4 right-4 text-white visitButton rounded-[23px] w-[112px] h-[23px] text-[13px] font-bold '>
                      Follow
                    </button>
                    <div className='z-20 text-white mt-8 '>
                      <h3 className="text-[18px] font-bold ">{model.nombre}</h3>
                      <p className="text-[9px] text-[#B9B9B9] ">@{model.nombre.replace(/\s+/g, '').toLowerCase()}</p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SidebarRight;
