import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

function ModalLogin({ isOpen, onClose }) {
  const { data: session, status } = useSession();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
      onClose(); // Cierra el modal en lugar de redirigir
    }
  };

  if (!isOpen) return null; // No renderiza el modal si no está abierto

  if (status === 'loading') {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" ></div>
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      </>
    );
  }

  if (session) {
    return (
      <>
        
      </>
    );
  }

 

  return (
    <div>
      <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"></div>
      <div className="modal bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <h1 className="text-2xl font-bold mb-4">Necesitas Iniciar sesión</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input name="email" type="email" placeholder="Email" required className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input name="password" type="password" placeholder="Password" required className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full">Log in</button>
        </form>
        <hr className="my-4" />
        <button className="bg-red-500 text-white py-2 px-4 rounded-lg w-full" onClick={() => signIn('google', { redirect: false })}>Log in with Google</button>
      </div>
    </div>
  );
}

export default ModalLogin;
