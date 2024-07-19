// schemas/paquetes.js
export default {
    name: "paquetes",
    title: "Paquetes",
    type: "document",
    fields: [
      {
        name: "nombre",
        title: "Nombre Paquete",
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
        name: "fotografias",
        title: "Fotografías",
        type: "array",
        of: [{ type: "image" }],
      },
      {
        name: "portadas",
        title: "Portadas",
        type: "array",
        of: [{ type: "image" }],
      },
      {
        name: "copy",
        title: "Copy",
        type: "text",
      },
      {
        name: "precio",
        title: "Precio",
        type: "number",
      },
      {
        name: "modelo",
        title: "Modelo",
        type: "reference",
        to: [{ type: "modelos" }],
      },
    ],
  };
  