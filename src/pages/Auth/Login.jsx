// pages/auth/login.js
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

function Login() {
  const { data: session, status } = useSession();
  const [error, setError] = useState(null);
  const [emailForReset, setEmailForReset] = useState('');
  const [resetError, setResetError] = useState(null);
  const [resetMessage, setResetMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: `${window.location.origin}/Home`
    });

    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
      window.location.href = '/';
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/auth/reset-password', { email: emailForReset });
      setResetMessage('Please check your email for the password reset link.');
      setResetError(null);
    } catch (error) {
      setResetError('Error sending reset password email. Please try again.');
      setResetMessage(null);
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
    <div className="flex flex-col md:flex-row w-full h-full">
      <div className='w-full h-full relative'>
        <img src="/loginImgMovil.png" alt="Logo" className="w-full h-full mx-auto " />
          <img src="/logoLoginImgMovil.png" alt="Logo" className=" mx-auto absolute top-16 left-0 right-0 " />
        
      </div>
      <div className="flex flex-col justify-center w-full md:w-1/2 p-8 ">
        <h1 className="text-4xl font-bold mb-6 ">Inicia Sesión</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
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
              className="w-full p-2  mt-1  rounded-[34px] bg-[#F2F4F8] inputLogin placeholder:text-[#B9B9B9] placeholder:text-[16px]"
            />
            {/* <p className="text-xs text-gray-500 mt-1">It must be a combination of minimum 8 letters, numbers, and symbols.</p> */}
          </div>
          <p className="mt-6 text-right">
          <a href="#" className="text-[#602AB1] text-[14px]" onClick={() => setResetMessage(true)}>¿Olvidaste la contraseña?</a>
        </p>
          <button type="submit" className="w-full loginButton font-bold text-white py-2 rounded-[34px]">Inicia Sesión</button>
        </form>
        <button
          onClick={() => signIn('google', { callbackUrl: '/Home' })}
          className="w-full max-w-md bg-[#4F70D0] border border-gray-300 text-white font-bold py-2 rounded flex items-center justify-center rounded-[34px] mt-2"
        >
          <img src="/icons/google.svg" alt="Google Logo" className="w-5 h-5 mr-2  " />
          Inicia sesión con Google
        </button>
        <p className="mt-6 text-left text-[#602AB1] text-[14px] ">
          ¿No tienes una cuenta? <Link href="/Auth/Signup"> <span  className="text-[#602AB1]">Regístrate aquí</span></Link>
        </p>
        
        {resetMessage && (
          <form onSubmit={handleResetPassword} className="w-full max-w-md space-y-4 mt-4">
            <div>
              <label htmlFor="resetEmail" className="block text-gray-700">Enter your email to reset password</label>
              <input
                name="resetEmail"
                type="email"
                placeholder="Email"
                required
                value={emailForReset}
                onChange={(e) => setEmailForReset(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Reset Password</button>
            {resetError && <p className="text-red-500">{resetError}</p>}
            {resetMessage && <p className="text-green-500">{resetMessage}</p>}
          </form>
        )}
      </div>
      <div className="hidden md:flex md:w-1/2 bg-pink-500">
        {/* You can add an image or any other content here */}
      </div>
    </div>
  );
}

export default Login;
