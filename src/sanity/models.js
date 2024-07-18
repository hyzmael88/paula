export default {
    name: 'modelos',
    title: 'Modelos',
    type: 'document',
    fields: [
        {
            name: 'nombre',
            title: 'Nombre',
            type: 'string',
        },
            {
                name: 'slug',
                title: 'Slug',
                type: 'slug',
                options: {
                    source: 'nombre',
                    maxLength: 200,
                },
            },
        {
            name: 'biografia',
            title: 'Biografía',
            type: 'text',
        },
        {
            name: 'edad',
            title: 'Edad',
            type: 'number',
        },
        {
            name: 'cumpleanos',
            title: 'Cumpleaños',
            type: 'date',
        },
        {
            name: 'instagram',
            title: 'Instagram URL',
            type: 'url',
        },
        {
            name: 'twitter',
            title: 'Twitter URL',
            type: 'url',
        },
        {
            name: 'tiktok',
            title: 'TikTok URL',
            type: 'url',
        },
        {
            name: 'publicaciones',
            title: 'Publicaciones',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'fotografias',
                            title: 'Fotografías',
                            type: 'array',
                            of: [{ type: 'image' }],
                        },
                        {
                            name: 'copy',
                            title: 'Copy',
                            type: 'text',
                        },
                        {
                            name: 'precio',
                            title: 'Precio',
                            type: 'number',
                        },
                    ],
                },
            ],
        },
        {
            name: 'paquetes',
            title: 'Paquetes',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'fotografias',
                            title: 'Fotografías',
                            type: 'array',
                            of: [{ type: 'image' }],
                        },
                        {
                            name: 'portadas',
                            title: 'Portadas',
                            type: 'array',
                            of: [{ type: 'image' }],
                        },
                        {
                            name: 'copy',
                            title: 'Copy',
                            type: 'text',
                        },
                        {
                            name: 'precio',
                            title: 'Precio',
                            type: 'number',
                        },
                    ],
                },
            ],
        },
    ],
};