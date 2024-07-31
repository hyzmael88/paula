export default {
    name: 'categoria',
    title: 'Categoria',
    type: 'document',
    fields: [
        
        {
            name: "nombre",
            title: "Nombre",
            type: "string",
          },
          {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
              source: "nombre",
              maxLength: 200,
            },
            },
            {
                name: "portada",
                title: "Portada",
                type: "image",
            },
            {
                name: "descripcion",
                title: "Descripcion",
                type: "text",
          }
    ],
};