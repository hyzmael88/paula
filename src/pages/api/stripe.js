const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

async function handler(req, res) {
    if (req.method === 'POST') {
        const { paquete } = req.body;
        const { nombre, descripcion, precio, portadas } = paquete;
        const previousUrl = req.headers.referer || 'https://localhost:3000';


        const imageUrl = portadas[0].asset._ref
            .replace("image-", "https://cdn.sanity.io/images/aw6296fu/production/")
            .replace("-png", ".png");

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card', 'oxxo'],
                line_items: [{
                    price_data: {
                        currency: 'mxn',
                        product_data: {
                            name: nombre,
                            description: descripcion,
                            images: [imageUrl],
                        },
                        unit_amount: precio * 100, // Precio en centavos
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: `${previousUrl}`,

                cancel_url: 'https://localhost:3000/cancel',
            });

            res.status(200).json(session);
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