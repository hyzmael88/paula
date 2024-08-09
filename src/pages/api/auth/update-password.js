// /pages/api/update-password.js
import { createClient } from 'next-sanity';
import bcrypt from 'bcryptjs';
import { getSession } from 'next-auth/react';

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

  const {session, newPassword, email} = req.body;


  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
;

  if (!newPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Fetch the user from Sanity using the session's email
    const user = await sanityClient.fetch(`*[_type == "usuario" && email == $email][0]`, {
      email: session.user.email,
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in Sanity
    await sanityClient.patch(user._id).set({
      password: hashedPassword,
    }).commit();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ error: 'Failed to update password' });
  }
}
