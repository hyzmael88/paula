import { createClient } from 'next-sanity';
import bcrypt from 'bcryptjs';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2021-03-25',
  token: process.env.SANITY_WRITE_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

/*   const { token, email, newPassword } = req.body;
 */  const {  email, newPassword } = req.body;

 /*  if (!token || !email || !newPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  } */
  if ( !email || !newPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Verificar que el usuario exista y que el token sea válido
    /* const user = await sanityClient.fetch(`*[_type == "usuario" && email == $email && resetToken == $token][0]`, { email, token }); */
    const user = await sanityClient.fetch(`*[_type == "usuario" && email == $email][0]`, { email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid token or user not found' });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña en Sanity y eliminar el resetToken
    await sanityClient.patch(user._id)
      .set({ password: hashedPassword })
      .unset(['resetToken'])
      .commit({ publish: true });

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ error: 'Failed to update password' });
  }
}
