import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { TiHome } from "react-icons/ti";
import { FaCompass, FaStar, FaShoppingCart, FaQuestionCircle, FaCog, FaLanguage, FaFacebook, FaInstagram, FaTimes, FaTiktok, FaSignOutAlt, FaHeadset, FaHeart, FaHome } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


const NavbarMovil = () => {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!session) return null;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="relative">
      <div className="fixed lg:hidden bottom-0 left-0 right-0 navbarMovil border-t-2 h-[71px] z-40">
        <div className="w-full h-full flex justify-around items-center pb-4">
          <Link href="/">
            <TiHome className="text-2xl" />
          </Link>
          <Link href="/Explorar">
            <FaCompass className="text-2xl" />
          </Link>
          <Link href="/Suscripciones">
            <FaStar className="text-2xl" />
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
              <li
              onClick={toggleMenu}
              >
                <Link href="/Home">
                  <p className="flex items-center text-lg font-medium text-black hover:text-purple-600">
                    <FaHome className="mr-2" />
                    Inicio
                  </p>
                </Link>
              </li>
              <li
              onClick={toggleMenu}
              >
                <Link href="/Explorar">
                  <p className="flex items-center text-lg font-medium text-black hover:text-purple-600">
                    <FaCompass className="mr-2" />
                    Explorar
                  </p>
                </Link>
              </li>
            {/*   <li>
                <Link href="/Notificaciones">
                  <p className="flex items-center text-lg font-medium text-black hover:text-purple-600">
                    <FaBell className="mr-2" />
                    Notificaciones
                  </p>
                </Link>
              </li> */}
              <li
              onClick={toggleMenu}
              >
                <Link href="/Suscripciones">
                  <p className="flex items-center text-lg font-medium text-black hover:text-purple-600">
                    <FaHeart className="mr-2" />
                    Suscripciones
                  </p>
                </Link>
              </li>
              <li
              onClick={toggleMenu}
              >
                <Link href="/Compras">
                  <p className="flex items-center text-lg font-medium text-black hover:text-purple-600">
                    <FaShoppingCart className="mr-2" />
                    Compras
                  </p>
                </Link>
              </li>
              {/* <li>
                <Link href="/Historial">
                  <p className="flex items-center text-lg font-medium text-black hover:text-purple-600">
                    <FaHistory className="mr-2" />
                    Historial de pagos
                  </p>
                </Link>
              </li> */}
              <li
              onClick={toggleMenu}
              >
                <Link href="/Faqs">
                  <p className="flex items-center text-lg font-medium text-black hover:text-purple-600">
                    <FaQuestionCircle className="mr-2" />
                    FAQS
                  </p>
                </Link>
              </li>
              <li
              onClick={toggleMenu}
              >
                <Link href="/Soporte">
                  <p className="flex items-center text-lg font-medium text-black hover:text-purple-600">
                    <FaHeadset className="mr-2" />
                    Soporte
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/Configuracion">
                  <p className="flex items-center text-lg font-medium text-black hover:text-purple-600">
                    <FaCog className="mr-2" />
                    Configuracion
                  </p>
                </Link>
              </li>
              <li
              onClick={toggleMenu}
              >
                <p
                  className="flex items-center text-lg font-medium text-black hover:text-purple-600 cursor-pointer"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <FaSignOutAlt className="mr-2" />
                  Cerrar sesión
                </p>
              </li>
            </ul>
          <div className="flex  items-center  text-[20px] gap-[25px] pl-[50px] my-[40px]">
            <a href="#" className="text-black hover:text-purple-600">
              <FaFacebook className="" />
            </a>
            <a href="#" className="text-black hover:text-purple-600">
              <FaInstagram className="" />
            </a>
            <a href="#" className="text-black hover:text-purple-600">
              <FaXTwitter className="" />
            </a>
            <a href="#" className="text-black hover:text-purple-600">
              <FaTiktok className="" />
            </a>
          </div>
          <div className="mt-6 text-center">
            <Link href="/PoliticaPrivacidad" className="block text-black hover:text-purple-600">
              Políticas de privacidad
            </Link>
            <Link href="/TerminosCondiciones" className="block text-black hover:text-purple-600">
              Términos y condiciones
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
