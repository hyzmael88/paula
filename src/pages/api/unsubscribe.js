import { createClient } from 'next-sanity';
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2021-03-25',
  token: process.env.SANITY_WRITE_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { modelId, subscriptionId,email } = req.body;

    try {
      // Cancelar la suscripción en Stripe
      const deletedSubscription = await stripe.subscriptions.cancel(subscriptionId);
      if (deletedSubscription.status !== 'canceled') {
        throw new Error('No se pudo cancelar la suscripción en Stripe.');
      }

      // Buscar el usuario en Sanity
      const user = await sanityClient.fetch(
        `*[_type == "usuario" && email == $email][0]`,
        { email: req.body.email }
      );

      if (user) {
        // Actualizar el documento del usuario en Sanity
        await sanityClient
          .patch(user._id)
          .unset([`subscribedModels[subscriptionId=="${subscriptionId}"]`])
          .commit({ publish: true });

        res.status(200).json({ message: 'Suscripción cancelada con éxito.' });
      } else {
        res.status(404).json({ error: 'Usuario no encontrado.' });
      }
    } catch (error) {
      console.error('Error al cancelar la suscripción:', error);
      res.status(500).json({ error: 'Error al cancelar la suscripción.' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Método no permitido');
  }
}
