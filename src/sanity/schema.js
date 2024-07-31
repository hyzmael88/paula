import carrousel from "./carrousel";
import categorias from "./categorias";
import compras from "./compras";
import modelos from "./modelos";
import paquetes from "./paquetes";
import publicaciones from "./publicaciones";
import publicacionesGratuitas from "./publicacionesGratuitas";
import usuarios from "./usuarios";

export const schema = {
  types: [usuarios,modelos, publicaciones, paquetes, compras, carrousel, publicacionesGratuitas, categorias],
}
