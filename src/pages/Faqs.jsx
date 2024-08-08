import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

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
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    if (index === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="p-6 max-w-4xl w-full lg:w-1/3  h-full lg:h-screen mx-auto">
      <h1 className="text-[32px] font-bold mb-8 text-center lg:mt-[75px]">FAQs</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border  rounded-lg s faqs"
          
          >
            <div
              className="px-[31px] py-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleFaq(index)}
            >
              <h2 className="text-[16px] font-semibold">{faq.question}</h2>
              <span>
                {activeIndex === index ? <img src='/icons/zoomLess.svg' className='w-[10px]' /> : <img src='/icons/zoomPlus.svg' className='w-[10px]' />}
              </span>
            </div>
            {activeIndex === index && (
              <div className="p-4 border-t border-gray-200 px-[31px]">
                <p className="text-gray-700 text-[12px]">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faqs;
