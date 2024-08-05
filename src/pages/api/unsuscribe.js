// pages/api/unsubscribe.js
import { getSession } from "next-auth/react";
import { createClient } from "next-sanity";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2021-03-25',
  token: process.env.SANITY_WRITE_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { modeloId, subscriptionId } = req.body;
    const session = await getSession({ req });
    
    if (!session) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    try {
      // Cancelar suscripción en Stripe
      const deletedSubscription = await stripe.subscriptions.del(subscriptionId);

      // Actualizar Sanity
      const userId = session.user.id;
      await sanityClient
        .patch(userId)
        .unset([`subscribedModels[_ref=="${modeloId}"]`])
        .commit();

      res.status(200).json({ message: 'Suscripción cancelada con éxito', deletedSubscription });
    } catch (error) {
      console.error('Error al cancelar la suscripción:', error);
      res.status(500).json({ error: 'Error al cancelar la suscripción' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Método no permitido');
  }
}
