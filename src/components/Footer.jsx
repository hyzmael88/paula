import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaInstagram, FaTwitter, FaFacebook, FaTiktok, FaGlobe } from 'react-icons/fa';

const Footer = () => {
  const router = useRouter()

  if(router.pathname === '/' ) {
    
  return (
        <div className='w-full h-full pb-14 xl:pb-0 flex justify-center '>
      <footer className="w-[90%] bg-white py-4 border-t border-gray-300">
      <div className=" mx-auto flex flex-col-reverse lg:flex-row items-center justify-between px-4">
        <div className="flex flex-col-reverse lg:flex-row items-center lg:space-x-4 gap-y-4 text-gray-700 text-[12px] mb-4 xl:mb-0">
          <span>&copy; 2024 LuvMyPack by 
            <span className='font-bold ml-1 cursor-pointer'>
            Jaizmora Digital Media™
            </span>
            </span>
          <Link href="/Terminos"><span className="hover:text-gray-900">Terms</span></Link>
          <Link href="/Politicas"><span className="hover:text-gray-900">Privacy</span></Link>
          <Link href="/Faqs"><span className="hover:text-gray-900">FAQs</span></Link>
          <Link href="#"><span className="hover:text-gray-900 flex items-center text-[15px]"><FaGlobe className="mr-1"/>Idioma</span></Link>
        </div>
        <div className="flex items-center space-x-4 xl:mt-4 mb-4 md:mt-0">
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
}
};

export default Footer;
