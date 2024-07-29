export default {
    name: 'carousel',
    title: 'Carousel',
    type: 'document',
    fields: [
        
        {
            name: "fotografias",
            title: "Fotografías",
            type: "array",
            of: [{ type: "image" }],
          },
    ],
};