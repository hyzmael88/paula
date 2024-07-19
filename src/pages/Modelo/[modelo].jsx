import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '../../sanity/lib/client';

function Modelo() {
  const [modelo, setModelo] = useState(null);
  const router = useRouter();
  const { modelo: slug } = router.query; // Asume que el archivo se llama [modelo].jsx

  useEffect(() => {
    if (slug) {
        console.log(slug)
      const query = `*[_type == "modelos" && slug.current == $slug][0]`;
      client.fetch(query, { slug })
        .then((data) => {
          setModelo(data);
        })
        .catch(console.error);
    }
  }, [slug]);

  if (!modelo) return <div>Loading...</div>;

  return (
    <div>
      <h1>{modelo.nombre}</h1>
      {/* Muestra más detalles de la modelo como desees */}
    </div>
  );
}

export default Modelo;