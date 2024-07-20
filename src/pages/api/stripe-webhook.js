import { buffer } from 'micro';
import { createClient } from 'next-sanity';

const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2021-03-25',
  token: process.env.SANITY_WRITE_TOKEN,
});



export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_KEY;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const email = session.customer_details.email;
      const paqueteId = session.metadata.paqueteId;

      try {
        const user = await sanityClient.fetch(`*[_type == "usuario" && email == $email][0]`, { email });

        if (user) {
          await sanityClient
            .patch(user._id)
            .setIfMissing({ paquetesAdquiridos: [] })
            .insert('after', 'paquetesAdquiridos[-1]', [{
              _type: 'reference',
              _ref: paqueteId,
              _key: paqueteId
            }])
            .commit({ publish: true });

          console.log(`Paquete ${paqueteId} añadido al usuario ${user._id}`);
        }
      } catch (error) {
        console.error('Error al actualizar el documento del usuario en Sanity:', error);
        return res.status(500).json({ error: 'Error al actualizar el documento del usuario en Sanity' });
      }
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}