
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);



export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;
    try {
      const session = await stripe.checkout.sessions.create({
    
        payment_method_types: ['card'],
        line_items: [
            {
              price: '{{PRICE_ID}}',
              quantity: 1,
            },
          ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
        customer_email: email,
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
