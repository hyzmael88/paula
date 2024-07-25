import React from 'react';

const SidebarRight = () => {
  return (
    <div className="w-1/3 hidden bg-white h-screen border-l-2  xl:flex flex-col p-4">
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            className="w-full p-2 pl-10 rounded-full bg-gray-200"
            placeholder="Buscar Modelo"
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
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center bg-gray-200 p-4 rounded-lg shadow-md"
            >
              <div className="w-12 h-12 bg-gray-400 rounded-full mr-4"></div>
              <div>
                <h3 className="text-md font-bold">Lorem Ipsum</h3>
                <p className="text-sm text-gray-600">@LoremIpsum</p>
                <p className="text-sm text-gray-600">Disponible ahora</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
