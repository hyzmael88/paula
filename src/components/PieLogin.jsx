import React from 'react';
import { FaFacebook, FaInstagram, FaTimes, FaTiktok, FaGlobe } from 'react-icons/fa';

const PieLogin = () => {
  return (
    <footer className="w-full px-4 py-8 bg-white text-gray-800 flex flex-col items-start">
      <hr className='h-[2px] bg-gray-300 w-full mb-4 '/>
      <div className="flex space-x-4 mb-4">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="text-gray-800 w-6 h-6 hover:text-gray-600" />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-gray-800 w-6 h-6 hover:text-gray-600" />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaTimes className="text-gray-800 w-6 h-6 hover:text-gray-600" />
        </a>
        <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
          <FaTiktok className="text-gray-800 w-6 h-6 hover:text-gray-600" />
        </a>
      </div>
      <div className="flex space-x-4 mb-4">
        <a href="#" className="text-gray-800 hover:text-gray-600 flex items-center"><FaGlobe className="mr-1"/> Idioma</a>
        <a href="#" className="text-gray-800 hover:text-gray-600">Términos y Condiciones</a>
        <a href="#" className="text-gray-800 hover:text-gray-600">Políticas de Privacidad</a>
        <a href="#" className="text-gray-800 hover:text-gray-600">FAQs</a>
      </div>
      <div className="text-center text-gray-800">
        © 2024 LuvMyPack by <span className="font-bold">Jaizmora Digital Media™</span>
      </div>
    </footer>
  );
};

export default PieLogin;
