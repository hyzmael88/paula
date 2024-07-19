import modelos from "./modelos";
import paquetes from "./paquetes";
import publicaciones from "./publicaciones";
import usuarios from "./usuarios";

export const schema = {
  types: [usuarios,modelos, publicaciones, paquetes],
}
