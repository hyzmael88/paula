import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import CarrouselIndex from '@/components/CarrouselIndex';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';


const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const query = `*[_type == "carousel"]{
        fotografias[]{
          asset->{
            _id,
            url
          }
        }
      }`;
      const result = await client.fetch(query);
      if (result.length > 0) {
        const fetchedPhotos = result[0].fotografias.map(foto => urlFor(foto).url());
        setPhotos(fetchedPhotos);
      }
    };

    fetchPhotos();
  }, []);

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
    <div className='w-full h-full xl:h-[94vh] relative overflow-hidden'>
   <CarrouselIndex photos={photos} />
    <div className='w-full h-[95vh] flex flex-col justify-end items-center pb-[39px] xl:pb-[100px] px-4 '>
      <img src='/Logo.png' alt='logo' className=' object-cover' />
      <p className='max-w-sm xl:max-w-xl text-center text-[13px] xl:text-[16px] mt-[10px] xl:mt-[27px]'>Explora contenido exclusivo y personalizado, creado por talentosos influencers y potenciado por inteligencia artificial. Suscríbete para una experiencia única y atrevida que va más allá de lo convencional.</p>
      <div className='w-full max-w-sm mt-[20px] xl:mt-[39px] flex justify-between gap-4 xl:gap-[50px]'>
        <Link href={"/Auth/Signup"}
        
        >
        <button className='w-[145px] h-[50px] bg-[#602AB1] m-4 text-white font-inter font-bold rounded-[34px] text-[16px] xl:text-[20px] shadowButton '>
          Registrate
        </button>
        </Link>
        <Link href={"/Auth/Login"}
        
        >
        <button className='w-[145px] h-[50px] m-4 text-white font-inter font-bold rounded-[34px] text-[16px] xl:text-[20px] shadowButton flex-nowrap'
        style={{ background: 'linear-gradient(180deg, #FF66AE 0%, #6E26B6 100%)' }}
        >
          Iniciar Sesión
        </button>
        </Link>
      </div>
    </div>
          </div>
    </>
  );
}
