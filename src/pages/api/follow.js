import { getSession } from "next-auth/react";
import { createClient } from "next-sanity";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2021-03-25',
  token: process.env.SANITY_WRITE_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { modeloId, email } = req.body;
    

    if (!email) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    

    try {
        const user = await sanityClient.fetch(`*[_type == "usuario" && email == $email][0]`, { email });

        if (user) {
         if(modeloId){
          console.log("entre en modelo")
          await sanityClient
          .patch(user._id)
          .setIfMissing({ follows: [] })
          .insert('after', 'follows[-1]', [{
            _type: 'reference',
            _ref: modeloId,
            _key: modeloId
          }])
          .commit({ publish: true });

      res.status(200).json({ message: 'Modelo seguido con éxito' })
        }}
    } catch (error) {
      console.error('Error al seguir al modelo:', error);
      res.status(500).json({ error: 'Error al seguir al modelo' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Método no permitido');
  }
}
