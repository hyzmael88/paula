import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
function SideBarLeft() {

  const { data: session } = useSession();
if(session){
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
                <p className="block text-lg font-medium text-black hover:text-purple-600">
                  Inicio
                </p>
              </Link>
            </li>
            <li>
              <Link href="/Explorar">
                <p className="block text-lg font-medium text-black hover:text-purple-600">
                  Explorar
                </p>
              </Link>
            </li>
            <li>
              <Link href="/Notificaciones">
                <p className="block text-lg font-medium text-black hover:text-purple-600">
                  Notificaciones
                </p>
              </Link>
            </li>
            <li>
              <Link href="/Suscripciones">
                <p className="block text-lg font-medium text-black hover:text-purple-600">
                  Suscripciones
                </p>
              </Link>
            </li>
            <li>
              <Link href="/Compras">
                <p className="block text-lg font-medium text-black hover:text-purple-600">
                  Compras
                </p>
              </Link>
            </li>
            <li>
              <Link href="/Historial">
                <p className="block text-lg font-medium text-black hover:text-purple-600">
                  Historial de pagos
                </p>
              </Link>
            </li>
            <li>
              <Link href="/Faqs">
                <p className="block text-lg font-medium text-black hover:text-purple-600">
                  FAQS
                </p>
              </Link>
            </li>
            <li>
              <Link href="/Soporte">
                <p className="block text-lg font-medium text-black hover:text-purple-600">
                  Soporte
                </p>
              </Link>
            </li>
            <li>
              <Link href="/Configuracion">
                <p className="block text-lg font-medium text-black hover:text-purple-600">
                  Configuracion
                </p>
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
        </nav>
      </div>
      <div className="text-center">
        <Link href="/Politicas">
          <p className="block text-sm font-medium text-black hover:text-purple-600">
            Políticas de privacidad
          </p>
        </Link>
        <Link href="/Terminos">
          <p className="block text-sm font-medium text-black hover:text-purple-600">
            Términos y condiciones
          </p>
        </Link>
      </div>
    </div>
  )
}

}

export default SideBarLeft;
