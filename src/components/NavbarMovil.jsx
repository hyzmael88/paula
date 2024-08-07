import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { TiHome } from "react-icons/ti";
import { FaCompass, FaStar, FaShoppingCart, FaQuestionCircle, FaCog, FaFacebook, FaInstagram, FaTiktok, FaSignOutAlt, FaHeadset, FaHeart, FaHome } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { usePathname } from "next/navigation";

const NavbarMovil = () => {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  if (!session) return null;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="relative">
      <div className="fixed lg:hidden bottom-0 left-0 right-0 navbarMovil  h-[71px] z-40">
        <div className="w-full h-full flex justify-around items-center pb-4">
          <Link href="/Home">
            <TiHome className={`text-2xl ${pathname === '/Home' ? 'text-purple-600' : 'text-black hover:text-purple-600'}`} />
          </Link>
          <Link href="/Explorar">
            <FaCompass className={`text-2xl ${pathname === '/Explorar' ? 'text-purple-600' : 'text-black hover:text-purple-600'}`} />
          </Link>
          <Link href="/Suscripciones">
            <FaStar className={`text-2xl ${pathname === '/Suscripciones' ? 'text-purple-600' : 'text-black hover:text-purple-600'}`} />
          </Link>
          <button onClick={toggleMenu}>
            {menuOpen ? <MdClose className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
      </div>
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-50 rounded-r-[18px]`}
        style={{ width: '75%' }}
      >
        <div className="p-4 h-full flex flex-col justify-center">
          <div className="flex justify-center items-center mb-6">
            <img src="/Logo.png " alt="Logo" className="h-[91px] w-[151px]" />
          </div>
          <ul className="space-y-4 pl-[50px]">
            <li onClick={toggleMenu}>
              <Link href="/Home">
                <p className={`flex items-center text-lg font-medium ${pathname === '/Home' ? 'text-purple-600' : 'text-black hover:text-purple-600'}`}>
                  <FaHome className="mr-2" />
                  Inicio
                </p>
              </Link>
            </li>
            <li onClick={toggleMenu}>
              <Link href="/Explorar">
                <p className={`flex items-center text-lg font-medium ${pathname === '/Explorar' ? 'text-purple-600' : 'text-black hover:text-purple-600'}`}>
                  <FaCompass className="mr-2" />
                  Explorar
                </p>
              </Link>
            </li>
            <li onClick={toggleMenu}>
              <Link href="/Suscripciones">
                <p className={`flex items-center text-lg font-medium ${pathname === '/Suscripciones' ? 'text-purple-600' : 'text-black hover:text-purple-600'}`}>
                  <FaHeart className="mr-2" />
                  Suscripciones
                </p>
              </Link>
            </li>
            <li onClick={toggleMenu}>
              <Link href="/Compras">
                <p className={`flex items-center text-lg font-medium ${pathname === '/Compras' ? 'text-purple-600' : 'text-black hover:text-purple-600'}`}>
                  <FaShoppingCart className="mr-2" />
                  Compras
                </p>
              </Link>
            </li>
            <li onClick={toggleMenu}>
              <Link href="/Faqs">
                <p className={`flex items-center text-lg font-medium ${pathname === '/Faqs' ? 'text-purple-600' : 'text-black hover:text-purple-600'}`}>
                  <FaQuestionCircle className="mr-2" />
                  FAQS
                </p>
              </Link>
            </li>
            <li onClick={toggleMenu}>
              <Link href="https://www.instagram.com/luvmy_pack/" target="_blank">
                <p className={`flex items-center text-lg font-medium ${pathname === '/Soporte' ? 'text-purple-600' : 'text-black hover:text-purple-600'}`}>
                  <FaHeadset className="mr-2" />
                  Soporte
                </p>
              </Link>
            </li>
            <li onClick={toggleMenu}>
              <Link href="/Configuracion">
                <p className={`flex items-center text-lg font-medium ${pathname === '/Configuracion' ? 'text-purple-600' : 'text-black hover:text-purple-600'}`}>
                  <FaCog className="mr-2" />
                  Configuracion
                </p>
              </Link>
            </li>
            <li onClick={toggleMenu}>
              <p
                className="flex items-center text-lg font-medium text-black hover:text-purple-600 cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <FaSignOutAlt className="mr-2" />
                Cerrar sesión
              </p>
            </li>
          </ul>
          <div className="flex items-center text-[20px] gap-[25px] pl-[50px] my-[40px]">
            <a href="#" className="text-black hover:text-purple-600">
              <FaFacebook />
            </a>
            <a href="#" className="text-black hover:text-purple-600">
              <FaInstagram />
            </a>
            <a href="#" className="text-black hover:text-purple-600">
              <FaXTwitter />
            </a>
            <a href="#" className="text-black hover:text-purple-600">
              <FaTiktok />
            </a>
          </div>
          <div className="mt-6 text-center">
            <Link href="/PoliticaPrivacidad">
              <p className="block text-black hover:text-purple-600">
                Políticas de privacidad
              </p>
            </Link>
            <Link href="/TerminosCondiciones">
              <p className="block text-black hover:text-purple-600">
                Términos y condiciones
              </p>
            </Link>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
};

export default NavbarMovil;
