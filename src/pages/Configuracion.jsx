import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { createClient } from 'next-sanity';


const Configuracion = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const router = useRouter();

  const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: '2021-03-25',
    token: process.env.SANITY_WRITE_TOKEN,
  });
  

  useEffect(() => {
    if (session) {
      const fetchUser = async () => {
        try {
          const userData = await sanityClient.fetch(`*[_type == "usuario" && email == $email][0]`, {
            email: session.user.email,
          });
          setUser(userData);
          setLoading(false);
        } catch (error) {
          setError('Error al cargar los datos del usuario.');
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user)
    try {
      await sanityClient.patch(user._id)
        .set({
          name: user.name,
          email: user.email
        })
        .commit();
      setUpdated(true);
    } catch (error) {
      console.log(error)
      setError('Error al actualizar los datos del usuario.');
    }
  };

  useEffect(() => {
    if (status === 'loading') {
      // Esperar a que la sesión termine de cargar
      return;
    }
    if (!session) {
      // Redirigir al login si no hay sesión
      router.push('/Auth/Login');
    }
  }, [session, status, router]);

  

  if (!session) {
    return null; // Retorna null para evitar renderizar el componente antes de redirigir
  }

  if (loading) return <div className="text-center p-6">Cargando...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl w-full lg:w-1/3  h-full lg:h-[85vh] mx-auto p-6">
      <h1 className="text-[35px] text-center font-bold mb-6 lg:mt-[75px]">Configuración</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Nombre</label>
          <input
      type="text"
      name="name"
      value={user.name || ''}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      className={`w-full px-[28px] py-4 border rounded faqs focus-visible:border-[#FF66AE] `}
    />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={user.email || ''}
            onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      className={`w-full px-[28px] py-4 border rounded focus-visible:border-custom-focus faqs `}
    />
          
        </div>
        
        <div className='w-full flex justify-between items-center'>
          <button type="submit" className="paqueteButton text-white px-4 py- rounded-[23px]">
            Guardar Cambios
          </button>
          <span className='text-[12px] text-[#6E26B6] cursor-pointer'
          onClick={() => router.push('/Auth/ResetPassword')}
          >
          ¿Olvidaste tu contraseña?
          </span>
        </div>
        {updated && <p className="text-green-500">Datos actualizados correctamente.</p>}
      </form>
    </div>
  );
};

export default Configuracion;
