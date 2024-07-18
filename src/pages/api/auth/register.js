// pages/api/auth/register.js
import { createClient } from '@sanity/client';
import bcrypt from 'bcryptjs';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2021-03-25',
  token: process.env.SANITY_WRITE_TOKEN,
});

export default async function registerHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, name } = req.body;

  try {
    const user = await sanityClient.fetch(`*[_type == "usuario" && email == $email][0]`, { email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      _type: 'usuario',
      name,
      email,
      password: hashedPassword,
    };

    await sanityClient.create(newUser);

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
