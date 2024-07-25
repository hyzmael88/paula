// components/NavbarMovil.js
import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FiHome, FiSearch, FiBell, FiUser, FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";

const NavbarMovil = () => {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!session) return null;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 z-50">
      <div className="flex justify-around items-center py-2">
        <Link href="/">
          <FiHome className="text-2xl" />
        </Link>
        <Link href="/Explorar">
          <FiSearch className="text-2xl" />
        </Link>
        {/* <Link href="/Notificaciones">
          <FiBell className="text-2xl" />
        </Link> */}
        <button onClick={toggleMenu}>
          {menuOpen ? <MdClose className="text-2xl" /> : <FiMenu className="text-2xl" />}
        </button>
        {/* <Link href="/Configuracion">
          <FiUser className="text-2xl" />
        </Link> */}
      </div>
      {menuOpen && (
        <div className="bg-white shadow-md border-t-2 p-4">
          <ul className="space-y-4">
            <li>
              <Link href="/" onClick={toggleMenu} className="block text-lg font-medium text-black hover:text-purple-600">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/Explorar" onClick={toggleMenu} className="block text-lg font-medium text-black hover:text-purple-600">
                Explorar
              </Link>
            </li>
            {/* <li>
              <Link href="/Notificaciones" className="block text-lg font-medium text-black hover:text-purple-600">
                Notificaciones
              </Link>
            </li> */}
            <li>
              <Link href="/Suscripciones" onClick={toggleMenu} className="block text-lg font-medium text-black hover:text-purple-600">
                Suscripciones
              </Link>
            </li>
            <li>
              <Link href="/Compras" onClick={toggleMenu} className="block text-lg font-medium text-black hover:text-purple-600">
                Compras
              </Link>
            </li>
            {/* <li>
              <Link href="/Historial" className="block text-lg font-medium text-black hover:text-purple-600">
                Historial de pagos
              </Link>
            </li> */}
            <li>
              <Link href="/Faqs" onClick={toggleMenu} className="block text-lg font-medium text-black hover:text-purple-600">
                FAQS
              </Link>
            </li>
            <li>
              <Link href="/Soporte" onClick={toggleMenu} className="block text-lg font-medium text-black hover:text-purple-600">
                Soporte
              </Link>
            </li>
            <li>
              <Link href="/Configuracion" onClick={toggleMenu} className="block text-lg font-medium text-black hover:text-purple-600">
                Configuracion
              </Link>
            </li>
            <li>
              <p
                className="block text-lg font-medium text-black hover:text-purple-600 cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Cerrar sesión
              </p>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavbarMovil;
