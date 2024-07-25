// pages/api/auth/update-password.js
import bcrypt from 'bcrypt';
import { client } from '@/sanity/lib/client';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { token, email, newPassword } = req.body;

    try {
      // Buscar al usuario por email
      const user = await client.fetch(`*[_type == "usuario" && email == $email][0]`, { email });

      if (!user || user.resetToken !== token) {
        return res.status(400).json({ message: 'Invalid token or email' });
      }

      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar la contraseña y eliminar el token de restablecimiento
      await client
        .patch(user._id)
        .set({ password: hashedPassword, resetToken: null })
        .commit();

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating password', error });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};
