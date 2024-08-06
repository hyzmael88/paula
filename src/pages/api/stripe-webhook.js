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
      const modeloId = session.metadata.modeloId;
      const publicacionId = session.metadata.publicacionId;
      const subscriptionId = session.subscription; // Obtener el ID de la suscripción de Stripe


      try {
        const user = await sanityClient.fetch(`*[_type == "usuario" && email == $email][0]`, { email });

        if (user) {
          if(paqueteId){
            console.log("entre en paquete");
            await sanityClient
              .patch(user._id)
              .setIfMissing({ paquetesAdquiridos: [] })
              .insert('after', 'paquetesAdquiridos[-1]', [{
                _type: 'reference',
                _ref: paqueteId,
                key: paqueteId
              }])
              .commit({ publish: true });

            console.log(`Paquete ${paqueteId} añadido al usuario ${user._id}`);
          }
          if(publicacionId){
            await sanityClient
              .patch(user._id)
              .setIfMissing({ compras: [] })
              .insert('after', 'compras[-1]', [{
                _type: 'reference',
                _ref: publicacionId,
                key: publicacionId
              }])
              .commit({ publish: true });

            console.log(`Publicacion ${publicacionId} añadido al usuario ${user._id}`);
          }
          
          if(session.mode == "subscription"){
            console.log("entre en modelo");
            await sanityClient
              .patch(user._id)
              .setIfMissing({ subscribedModels: [] })
              .insert('after', 'subscribedModels[-1]', [{
                _type: 'reference', // Define el tipo del objeto
                ref: { _type: 'reference', _ref: modeloId },
                key: modeloId,
                /* subscriptionId // Añadir el ID de la suscripción de Stripe  */
              }])
              .commit({ publish: true });
            console.log(`Modelo ${modeloId} añadido al usuario ${user._id}`);
          }
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
