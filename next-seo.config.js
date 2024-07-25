// next-seo.config.js
export default {
    title: 'Prime Beauties',
    description: 'Descripción de tu sitio web',
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      url: 'https://www.tusitioweb.com/',
      site_name: 'Prime Beauties',
      images: [
        {
          url: 'https://www.tusitioweb.com/imagen-og.png',
          width: 800,
          height: 600,
          alt: 'Imagen Alternativa',
        },
      ],
    },
    twitter: {
      handle: '@tusitioweb',
      site: '@tusitioweb',
      cardType: 'summary_large_image',
    },
  };
  