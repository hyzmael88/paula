import React from 'react';

const Privacidad = () => {
  return (
    <div className="p-4 w-full lg:w-1/3">
      <h1 className="text-[32px] font-bold text-center mb-4 ">Política de Privacidad</h1>
      <p className="mb-4 text-[12px]">
        Esta política de privacidad establece cómo [Nombre de la Empresa] usa y protege cualquier información que usted proporciona cuando usa este sitio web.
      </p>
      <h2 className="text-2xl text-[#602AB1] text-[12px] font-bold mb-2">Información que Recopilamos</h2>
      <p className="mb-4 text-[12px]">
        Podemos recopilar la siguiente información:
        <ul className="list-disc list-inside">
          <li>Nombre y título del trabajo</li>
          <li>Información de contacto incluyendo dirección de correo electrónico</li>
          <li>Información demográfica como código postal, preferencias e intereses</li>
          <li>Otra información relevante para encuestas y/o ofertas de clientes</li>
        </ul>
      </p>
      <h2 className="text-2xl text-[#602AB1] text-[12px] font-bold mb-2">Qué Hacemos con la Información que Recopilamos</h2>
      <p className="mb-4 text-[12px]">
        Necesitamos esta información para comprender sus necesidades y brindarle un mejor servicio, y en particular por las siguientes razones:
        <ul className="list-disc list-inside">
          <li>Mantenimiento de registros internos.</li>
          <li>Podemos usar la información para mejorar nuestros productos y servicios.</li>
          <li>Podemos enviar periódicamente correos electrónicos promocionales sobre nuevos productos, ofertas especiales u otra información que creemos que puede resultarle interesante utilizando la dirección de correo electrónico que usted ha proporcionado.</li>
          <li>De vez en cuando, también podemos usar su información para contactarlo con fines de investigación de mercado. Podemos contactarlo por correo electrónico, teléfono, fax o correo.</li>
        </ul>
      </p>
      <h2 className="text-2xl text-[#602AB1] text-[12px] font-bold mb-2">Seguridad</h2>
      <p className="mb-4 text-[12px]">
        Nos comprometemos a garantizar que su información esté segura. Con el fin de prevenir el acceso no autorizado o divulgación, hemos puesto en lugar procedimientos físicos, electrónicos y administrativos adecuados para salvaguardar y asegurar la información que recopilamos en línea.
      </p>
      <h2 className="text-2xl text-[#602AB1] text-[12px] font-bold mb-2">Cómo Usamos las Cookies</h2>
      <p className="mb-4 text-[12px]">
        Una cookie es un pequeño archivo que pide permiso para ser colocado en el disco duro de su computadora. Una vez que acepta, el archivo se agrega y la cookie ayuda a analizar el tráfico web o le permite saber cuándo visita un sitio en particular. Las cookies permiten que las aplicaciones web le respondan como individuo. La aplicación web puede adaptar sus operaciones a sus necesidades, gustos y disgustos reuniendo y recordando información sobre sus preferencias.
      </p>
      <h2 className="text-2xl text-[#602AB1] text-[12px] font-bold mb-2">Enlaces a Otros Sitios Web</h2>
      <p className="mb-4 text-[12px]">
        Nuestro sitio web puede contener enlaces a otros sitios de interés. Sin embargo, una vez que haya usado estos enlaces para salir de nuestro sitio, debe tener en cuenta que no tenemos ningún control sobre ese otro sitio web. Por lo tanto, no podemos ser responsables de la protección y privacidad de cualquier información que proporcione mientras visita dichos sitios y dichos sitios no se rigen por esta declaración de privacidad. Debe tener cuidado y consultar la declaración de privacidad aplicable al sitio web en cuestión.
      </p>
      <h2 className="text-2xl text-[#602AB1] text-[12px] font-bold mb-2">Control de su Información Personal</h2>
      <div className="mb-4 text-[12px]">
        Puede optar por restringir la recopilación o el uso de su información personal de las siguientes maneras:
        <ul className="list-disc list-inside">
          <li>Siempre que se le solicite que complete un formulario en el sitio web, busque la casilla en la que puede hacer clic para indicar que no desea que la información sea utilizada por nadie con fines de marketing directo.</li>
          <li>Si anteriormente ha acordado que usemos su información personal con fines de marketing directo, puede cambiar de opinión en cualquier momento escribiéndonos o enviándonos un correo electrónico a [Correo Electrónico].</li>
        </ul>
      </div>
    </div>
  );
};

export default Privacidad;
