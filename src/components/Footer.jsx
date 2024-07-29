import Link from 'next/link';
import { FaInstagram, FaTwitter, FaFacebook, FaTiktok, FaGlobe } from 'react-icons/fa';

const Footer = () => {
  return (
        <div className='w-full flex justify-center'>
      <footer className="w-[90%] bg-white py-4 border-t border-gray-300">
      <div className=" mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="flex items-center space-x-4 text-gray-700 text-sm">
          <span>&copy; 2024 LuvMyPack by Jaimzora Digital Media™</span>
          <Link href="/terms"><span className="hover:text-gray-900">Terms</span></Link>
          <Link href="/privacy"><span className="hover:text-gray-900">Privacy</span></Link>
          <Link href="/faqs"><span className="hover:text-gray-900">FAQs</span></Link>
          <Link href="#"><span className="hover:text-gray-900 flex items-center"><FaGlobe className="mr-1"/>Idioma</span></Link>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <span href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
            <FaFacebook className="w-5 h-5" />
          </span>
          <span href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
            <FaInstagram className="w-5 h-5" />
          </span>
          <span href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
            <FaTwitter className="w-5 h-5" />
          </span>
          <span href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
            <FaTiktok className="w-5 h-5" />
          </span>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
