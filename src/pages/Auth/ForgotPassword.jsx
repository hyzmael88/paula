import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { v4 as uuidv4 } from 'uuid';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Por favor, ingrese un correo electrónico válido.');
      return;
    }

    try {
      // Generar un token único para el restablecimiento de contraseña
      const resetToken = uuidv4();

      // Crear el enlace de restablecimiento de contraseña
      const resetUrl = `${window.location.origin}/Auth/ResetPassword?token=${resetToken}&email=${email}`;

      // Parámetros para el correo electrónico
      const templateParams = {
        to_email: email,
        reset_url: resetUrl,
      };

      // Enviar el correo electrónico con EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID
      );

      // Mostrar un mensaje de éxito
      setMessage('Enlace de restablecimiento enviado con éxito a tu correo electrónico.');
      setError('');
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      setError('Hubo un problema al enviar el correo. Inténtalo de nuevo.');
      setMessage('');
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-[30px] shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Restablecer Contraseña</h1>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-[14px] font-bold">Correo Electrónico</label>
            <input
              name="email"
              type="email"
              placeholder="Ingresa tu correo"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-[20px] mt-1 text-[14px]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-[20px] text-[16px] font-bold shadowButton hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
          >
            Enviar Enlace
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
