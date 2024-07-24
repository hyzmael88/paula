import React from 'react';

const faqs = [
  {
    question: "¿Cómo puedo suscribirme?",
    answer: "Puedes suscribirte haciendo clic en el botón de suscripción en la página del modelo. Serás redirigido a una página de pago segura donde podrás completar tu suscripción."
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos tarjetas de crédito y débito, así como pagos a través de Stripe. Próximamente, también ofreceremos pagos mediante OXXO."
  },
  {
    question: "¿Puedo cancelar mi suscripción?",
    answer: "Sí, puedes cancelar tu suscripción en cualquier momento desde tu cuenta. Una vez cancelada, tendrás acceso al contenido hasta el final del periodo de facturación actual."
  },
  {
    question: "¿Cómo puedo contactar con el soporte?",
    answer: "Puedes contactarnos enviando un correo electrónico a soporte@tusitio.com. Estaremos encantados de ayudarte con cualquier duda o problema que tengas."
  },
  {
    question: "¿Qué hago si tengo problemas con mi cuenta?",
    answer: "Si tienes problemas con tu cuenta, por favor contacta con nuestro soporte a través del correo electrónico soporte@tusitio.com. Haremos todo lo posible para resolver tu problema lo antes posible."
  }
];

const Faqs = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Preguntas Frecuentes (FAQs)</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">{faq.question}</h2>
            <p className="text-gray-700">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faqs;
