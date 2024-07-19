// schemas/publicaciones.js
export default {
    name: "publicaciones",
    title: "Publicaciones",
    type: "document",
    fields: [
      {
        name: "fotografias",
        title: "Fotografías",
        type: "array",
        of: [{ type: "image" }],
      },
      {
        name: "copy",
        title: "Copy",
        type: "text",
      },
      {
        name: "slug",
        title: "Slug",
        type: "slug",
        options: {
          source: "copy",
          maxLength: 200,
        },
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
  