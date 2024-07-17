// /d:/ReactJSProyectos/paula/src/sanity/usuarios.js

export default {
    name: 'usuario',
    title: 'Usuarios',
    type: 'document',
    fields: [
        {
            name: 'nombre',
            title: 'Nombre',
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
            name: 'contrasena',
            title: 'Contraseña',
            type: 'string',
            validation: (Rule) => Rule.required(),
        },
        // Otros campos que desees almacenar para cada usuario
    ],
};