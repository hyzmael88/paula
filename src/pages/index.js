import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google';
import Link from 'next/link';

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
    <div>
      <h1>Aqui va una pantalla bien chingona</h1>
      <div>
        <Link href={"/Auth/Login"}>
        <button className='px-4 py-2 bg-pink-500 m-4 '>
          Iniciar Sesion
        </button>
        </Link>
      </div>
    </div>
  );
}
