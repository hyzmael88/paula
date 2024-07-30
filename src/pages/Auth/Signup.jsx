// pages/auth/signup.js
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import PieLogin from '@/components/PieLogin';

function Signup() {
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    const name = event.target.name.value;

    try {
      const response = await axios.post('/api/auth/register', { email, password, name });

      if (response.status === 201) {
        const result = await signIn('credentials', {
          redirect: false, // Desactiva la redirección automática
          email,
          password,
          callbackUrl: `${window.location.origin}/Home` // Especifica la URL a la que quieres redirigir después del signIn
        });

        if (result.error) {
          setError(result.error);
        } else {
          setError(null);
          window.location.href = '/';
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An unexpected error occurred');
    }
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">You are already signed in</h1>
        <button
          onClick={() => signOut()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full h-full items-center">
      <div className='w-full h-full relative lg:hidden'>
        <img src="/loginImgMovil.png" alt="Logo" className="w-full h-full mx-auto" />
        <img src="/logoLoginImgMovil.png" alt="Logo" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="flex flex-col justify-center lg:items-center w-full md:w-1/2 p-8">
        <h1 className="text-4xl font-bold mb-6">Regístrate</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-[14px]">Nombre</label>
            <input
              name="name"
              type="text"
              placeholder="Nombre"
              required
              className="w-full p-2 mt-1 rounded-[34px] bg-[#F2F4F8] inputLogin placeholder:text-[#B9B9B9] placeholder:text-[16px]"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-[14px]">Correo electrónico</label>
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              required
              className="w-full p-2 mt-1 rounded-[34px] bg-[#F2F4F8] inputLogin placeholder:text-[#B9B9B9] placeholder:text-[16px]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-[14px]">Contraseña</label>
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              required
              className="w-full p-2 mt-1 rounded-[34px] bg-[#F2F4F8] inputLogin placeholder:text-[#B9B9B9] placeholder:text-[16px]"
            />
            <p className="text-xs text-gray-500 mt-1">Debe ser una combinación de al menos 8 letras, números y símbolos.</p>
          </div>
          
          <button type="submit" className="w-full loginButton font-bold text-white py-2 rounded-[34px]">Regístrate</button>
        </form>
        <button
          onClick={() => signIn('google', { callbackUrl: '/Home' })}
          className="w-full  bg-[#4F70D0] border border-gray-300 text-white font-bold py-2 rounded flex items-center justify-center rounded-[34px] mt-2"
        >
          <img src="/icons/google.svg" alt="Google Logo" className="w-5 h-5 mr-2" />
          Regístrate con Google
        </button>
        <p className="text-[10px] text-gray-500 mt-4">*Al hacer clic en Regístrate, aceptas nuestros <Link href="/Terms">Términos de servicio</Link> y nuestra <Link href="/Privacy">Política de privacidad</Link>.</p>
        <p className="mt-6 text-left text-[#602AB1] text-[14px]">
          ¿Ya tienes una cuenta? <Link href="/Auth/Login"> <span className="text-[#602AB1]">Inicia sesión aquí</span></Link>
        </p>
        <div className='hidden lg:block'>
          <PieLogin />
        </div>
      </div>
      <div className="hidden lg:flex md:w-1/2 bg-pink-500 relative">
        <img src="/loginImgDesktop.png" alt="Logo" className="w-full h-screen object-cover" />
        <img src="/logoLoginImgMovil.png" alt="Logo" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}

export default Signup;
