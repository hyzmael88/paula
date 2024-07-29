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
      <img src='/logo.png' alt='logo' className=' object-cover' />
      <p className='max-w-xl text-center text-[16px]'>Explora contenido exclusivo y personalizado, creado por talentosos influencers y potenciado por inteligencia artificial. Suscríbete para una experiencia única y atrevida que va más allá de lo convencional.</p>
      <div>
        <Link href={"/Auth/Signup"}>
        <button className='px-8 py-3 bg-[#602AB1] m-4 text-white font-inter font-bold rounded-[34px] text-[20px] '>
          Registrarse
        </button>
        </Link>
        <Link href={"/Auth/Login"}>
        <button className='px-6 py-3 m-4 text-white font-inter font-bold rounded-[34px] text-[20px]'
        style={{ background: 'linear-gradient(180deg, #FF66AE 0%, #6E26B6 100%)' }}
        >
          Iniciar Sesion
        </button>
        </Link>
      </div>
    </div>
    </>
  );
}
