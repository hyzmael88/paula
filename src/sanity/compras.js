export default {
    name: 'compra',
    title: 'Compra',
    type: 'document',
    fields: [
        {
            name: 'stripeId',
            title: 'Stripe ID',
            type: 'string',
        },
        {
            name: 'tipo',
            title: 'Tipo',
            type: 'string',
            options: {
                list: [
                    { title: 'Publicación', value: 'publicacion' },
                    { title: 'Paquete', value: 'paquete' },
                ],
            },
        },
        {
            name: 'referencia',
            title: 'Referencia',
            type: 'reference',
            to: [{ type: 'publicaciones' }, { type: 'paquetes' }],
        },
        // Agrega cualquier otro campo relevante aquí
    ],
};