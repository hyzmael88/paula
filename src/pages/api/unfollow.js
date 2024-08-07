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
    const { modeloId, email } = req.body;

    try {
      const user = await sanityClient.fetch(`*[_type == "usuario" && email == $email][0]`, { email });

      if (user) {
        const follows = user.follows.filter(follow => follow._ref !== modeloId);

        await sanityClient
          .patch(user._id)
          .set({ follows })
          .commit({ publish: true });

        res.status(200).json({ message: `Modelo ${modeloId} eliminado de los follows del usuario ${user._id}` });
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar el documento del usuario en Sanity:', error);
      res.status(500).json({ error: 'Error al actualizar el documento del usuario en Sanity' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
