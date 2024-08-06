// pages/api/stripe-subscription.js
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

async function handler(req, res) {
  if (req.method === 'POST') {
    const { precio, email, nombre, fotoPerfil, modelo_id } = req.body;
    console.log('req.body:', req.body); 

    const imageUrl = fotoPerfil.asset._ref
      .replace("image-", "https://cdn.sanity.io/images/aw6296fu/production/")
      .replace("-png", ".png")
      .replace("-jpg", ".jpg");

    const previousUrl = req.headers.referer || 'https://localhost:3000';

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [{
          price_data: {
            currency: 'mxn',
            product_data: {
              name: nombre,
              description: `Suscripción mensual para acceder al contenido exclusivo de ${nombre}`,
              images: [imageUrl],
            },
            unit_amount: precio * 100,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${previousUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${previousUrl}`,
        metadata: {
          modeloId: modelo_id, 

        },
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error('Error al crear la sesión de pago:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

export default handler;
