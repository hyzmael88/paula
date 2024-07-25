import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/Home');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <>
    <NextSeo
      title="Inicio"
      description="Esta es la descripción de la página de inicio"
      openGraph={{
        title: 'Página de Inicio',
        description: 'Esta es la descripción de la página de inicio',
        images: [
          {
            url: 'https://www.tusitioweb.com/imagen-inicio-og.png',
            width: 800,
            height: 600,
            alt: 'Imagen de Inicio',
          },
        ],
      }}
    />
    <div className='w-full h-[90vh] flex flex-col justify-center items-center'>
      <h1>Aqui va una pantalla bien chingona</h1>
      <div>
        <Link href={"/Auth/Signup"}>
        <button className='px-4 py-2 bg-pink-500 m-4 '>
          Registrarse
        </button>
        </Link>
        <Link href={"/Auth/Login"}>
        <button className='px-4 py-2 bg-pink-500 m-4 '>
          Iniciar Sesion
        </button>
        </Link>
      </div>
    </div>
    </>
  );
}
