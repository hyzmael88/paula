// next-seo.config.js
export default {
  title: 'Luvmypack',
  description: 'Descubre contenido exclusivo y personalizado de tus influencers favoritas. Nuestra plataforma combina creatividad humana e inteligencia artificial para ofrecerte experiencias únicas. Suscríbete y accede a contenido innovador y atrevido. ¡Conéctate con el mejor entretenimiento!',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://www.Luvmypack.com/',
    site_name: 'Luvmypack',
    images: [
      {
        url: 'https://www.Luvmypack.com/ogimage.png',
        width: 1200,
        height: 630,
        alt: 'Imagen de Inicio',
      },
    ],
  },
  twitter: {
    handle: '@tu_twitter_handle',
    site: '@tu_twitter_handle',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'Exclusive content, favorite influencers, content subscription, artificial intelligence, bold entertainment, influencer, model, adult entertainment, entertainment, subscription platform, premium content',
    },
    {
      property: 'og:title',
      content: 'Luv My Pack',
    },
    {
      property: 'og:description',
      content: 'Descubre contenido exclusivo y personalizado de tus influencers favoritas. Nuestra plataforma combina creatividad humana e inteligencia artificial para ofrecerte experiencias únicas. Suscríbete y accede a contenido innovador y atrevido. ¡Conéctate con el mejor entretenimiento!',
    },
    {
      property: 'og:image',
      content: '/ogimage.png',
    },
    {
      property: 'og:url',
      content: 'https://www.luvmypack.com',
    },
    {
      name: 'twitter:card',
      content: '/ogimage.png',
    },
    {
      name: 'twitter:image',
      content: '/ogimage.png',
    },
  ],
};