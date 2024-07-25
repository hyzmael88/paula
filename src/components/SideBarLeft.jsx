import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { FaHome, FaCompass, FaBell, FaHeart, FaShoppingCart, FaHistory, FaQuestionCircle, FaHeadset, FaCog, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";

function SideBarLeft() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="hidden w-1/3  bg-white h-screen border-r-2 xl:flex flex-col justify-between p-4">
        <div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Logo</h1>
          </div>
          <nav>
            <ul className="space-y-4">
              <li>
                <Link href="/Home">
                  <p className="flex items-center text-lg font-medium text-black hover:text-purple-600">
                    <FaHome className="mr-2" />
                    Inicio
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/Explorar">
                  <p className="flex items-center text-lg font-medium text-black hover:text-purple-600">
                    <FaCompass className="mr-2" />
                    Explorar
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/Notificaciones">
                  <p className="flex items-center text-lg font-medium text-black hover:text-purple-600">
                    <FaBell className="mr-2" />
                    Notificaciones
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/Suscripciones">
                  <p className="flex items-center text-lg font-medium text-black hover:text-purple-600">
                    <FaHeart className="mr-2" />
                    Suscripciones
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/Compras">
                  <p className="flex items-center text-lg font-medium text-black hover:text-purple-600">
                    <FaShoppingCart className="mr-2" />
                    Compras
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/Historial">
                  <p className="flex items-center text-lg font-medium text-black hover:text-purple-600">
                    <FaHistory className="mr-2" />
                    Historial de pagos
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/Faqs">
                  <p className="flex items-center text-lg font-medium text-black hover:text-purple-600">
                    <FaQuestionCircle className="mr-2" />
                    FAQS
                  </p>
                </Link>
              </li>
              <li>
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
              <li>
                <p
                  className="flex items-center text-lg font-medium text-black hover:text-purple-600 cursor-pointer"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <FaSignOutAlt className="mr-2" />
                  Cerrar sesión
                </p>
              </li>
            </ul>
          </nav>
        </div>
        <div className="text-center">
          <Link href="/Politicas">
            <p className="flex items-center text-sm font-medium text-black hover:text-purple-600">
              <FaShieldAlt className="mr-2" />
              Políticas de privacidad
            </p>
          </Link>
          <Link href="/Terminos">
            <p className="flex items-center text-sm font-medium text-black hover:text-purple-600">
              <FaShieldAlt className="mr-2" />
              Términos y condiciones
            </p>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

export default SideBarLeft;
