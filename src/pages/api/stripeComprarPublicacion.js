const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { precio, nombre, slug, email } = req.body; // Recibe el correo electrónico aquí

  

    const previousUrl = req.headers.referer || 'https://localhost:3000';

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'oxxo'],
        line_items: [
          {
            price_data: {
              currency: 'mxn',
              product_data: {
                name:nombre ,
                description: `Publicacion de ${nombre}`,
              },
              unit_amount: precio * 100, // Asegurándose de que el precio esté en centavos
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${previousUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${previousUrl}`,
        metadata: {
          publicacionSlug: slug,
        },
        customer_email: email, 
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error('Error al crear la sesión de pago:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
