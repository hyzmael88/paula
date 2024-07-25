import React from 'react';
import Link from 'next/link';
function SideBarLeft() {
  return (
    <div className="w-1/3 hidden bg-white h-screen border-r-2  xl:flex flex-col justify-between p-4">
      <div>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Logo</h1>
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link href="/">
                <p className="block text-lg font-medium text-black hover:text-purple-600">Inicio</p>
              </Link>
            </li>
            <li>
              <Link href="/explorar">
                <p className="block text-lg font-medium text-black hover:text-purple-600">Explorar</p>
              </Link>
            </li>
            <li>
              <Link href="/notificaciones">
                <p className="block text-lg font-medium text-black hover:text-purple-600">Notificaciones</p>
              </Link>
            </li>
            <li>
              <Link href="/suscripciones">
                <p className="block text-lg font-medium text-black hover:text-purple-600">Suscripciones</p>
              </Link>
            </li>
            <li>
              <Link href="/compras">
                <p className="block text-lg font-medium text-black hover:text-purple-600">Compras</p>
              </Link>
            </li>
            <li>
              <Link href="/historial-pagos">
                <p className="block text-lg font-medium text-black hover:text-purple-600">Historial de pagos</p>
              </Link>
            </li>
            <li>
              <Link href="/faqs">
                <p className="block text-lg font-medium text-black hover:text-purple-600">FAQS</p>
              </Link>
            </li>
            <li>
              <Link href="/soporte">
                <p className="block text-lg font-medium text-black hover:text-purple-600">Soporte</p>
              </Link>
            </li>
            <li>
              <Link href="/configuracion">
                <p className="block text-lg font-medium text-black hover:text-purple-600">Configuracion</p>
              </Link>
            </li>
            <li>
              <Link href="/cerrar-sesion">
                <p className="block text-lg font-medium text-black hover:text-purple-600">Cerrar sesión</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="text-center">
        <Link href="/politicas-privacidad">
          <p className="block text-sm font-medium text-black hover:text-purple-600">Políticas de privacidad</p>
        </Link>
        <Link href="/terminos-condiciones">
          <p className="block text-sm font-medium text-black hover:text-purple-600">Términos y condiciones</p>
        </Link>
      </div>
    </div>
  );
};

export default SideBarLeft;
