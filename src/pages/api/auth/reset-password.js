// pages/api/auth/reset-password.js
import { createTransport } from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { client } from '@/sanity/lib/client';

const transporter = createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async (req, res) => {
  if (req.method === 'POST') {
    const { email } = req.body;

    try {
      // Generar un token único
      const resetToken = uuidv4();

      // Buscar al usuario por email y agregar el token de restablecimiento
      const user = await client.fetch(`*[_type == "usuario" && email == $email][0]`, { email });

      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      // Almacenar el token en Sanity con la dirección de correo electrónico del usuario
      await client
        .patch(user._id)
        .set({ resetToken })
        .commit();

      // Crear la URL de restablecimiento de contraseña
      const resetUrl = `${process.env.NEXT_PUBLIC_URL}/auth/reset-password?token=${resetToken}&email=${email}`;

      // Configurar las opciones del correo electrónico
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`,
      };

      // Enviar el correo electrónico
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Error sending email', error });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};
