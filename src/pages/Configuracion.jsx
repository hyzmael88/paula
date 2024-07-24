import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { createClient } from 'next-sanity';


const Configuracion = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updated, setUpdated] = useState(false);
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

  if (loading) return <div className="text-center p-6">Cargando...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl h-[85vh] mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Configuración de la Cuenta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            name="name"
            value={user.name || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={user.email || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Guardar Cambios
          </button>
        </div>
        {updated && <p className="text-green-500">Datos actualizados correctamente.</p>}
      </form>
    </div>
  );
};

export default Configuracion;