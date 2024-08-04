
export default {
    name: 'usuario',
    title: 'Usuarios',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (Rule) => Rule.required().email(),
        },
        {
            name: 'password',
            title: 'Password',
            type: 'string',
        },
        {
            name: 'provider',
            title: 'Provider',
            type: 'string',
        },
        {
            name: 'providerAccountId',
            title: 'Provider Account ID',
            type: 'string',
        },
        {
            name: 'image',
            title: 'Image',
            type: 'string',
        },
        {
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            
        },
        {
            name: 'updatedAt',
            title: 'Updated At',
            type: 'datetime',
        },
        {
            name: 'resetToken',
            title: 'Reset Token',
            type: 'string',
          },
        {
            name: 'subscribedModels',
            title: 'Subscribed Models',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'modelos' }] }],
        },
            {
                name: 'compras',
                title: 'Compras',
                type: 'array',
                of: [{ type: 'reference', to: [{ type: 'publicaciones' }] }],
            },
            {
                name: 'paquetesAdquiridos',
                title: 'Paquetes Adquiridos',
                type: 'array',
                of: [{ type: 'reference', to: [{ type: 'paquetes' }] }],
            },
            {
                name:'follows',
                title:'Follows',
                type:'array',
                of: [{ type: 'reference', to: [{ type: 'modelos' }] }],
            }
    ],
    
};