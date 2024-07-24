import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="p-4 bg-gray-800 text-white text-center">
      <div>
        <Link href="/terminos">
          <p className="mr-4">Términos y Condiciones</p>
        </Link>
        <Link href="/privacidad">
          <p>Política de Privacidad</p>
        </Link>
      </div>
      <p className="mt-4">© 2023 [Nombre de la Empresa]. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
