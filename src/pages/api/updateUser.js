import { createClient } from 'next-sanity';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2021-03-25',
  token: process.env.SANITY_WRITE_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, name, email } = req.body;

    try {
      await sanityClient
        .patch(userId)
        .set({ name })
        .commit({ publish: true });

      res.status(200).json({ message: 'Usuario actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el usuario en Sanity:', error);
      res.status(500).json({ error: 'Error al actualizar el usuario en Sanity' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Método no permitido');
  }
}