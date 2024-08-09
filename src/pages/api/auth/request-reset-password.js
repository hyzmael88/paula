// /pages/api/request-reset-password.js
import { createClient } from 'next-sanity';
import { v4 as uuidv4 } from 'uuid';

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
  
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    try {
      const user = await sanityClient.fetch(`*[_type == "usuario" && email == $email][0]`, { email });
  
      if (!user) {
        return res.status(400).json({ error: 'No user found with this email' });
      }
  
      const resetToken = uuidv4();
  
      await sanityClient.patch(user._id).set({
        resetToken,
      }).commit({ publish: true });
  
      const resetUrl = `${process.env.NEXTAUTH_URL}/Auth/ResetPassword?token=${resetToken}&email=${email}`;
  
      const templateParams = {
        to_email: email,
        reset_url: resetUrl,
      };
  
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          user_id: process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
          template_params: templateParams,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send email: ${errorText}`);
      }
  
      return res.status(200).json({ message: 'Reset link sent successfully' });
    } catch (error) {
      console.error('Error sending reset password email:', error);
      return res.status(500).json({ error: `Failed to send reset email: ${error.message}` });
    }
  }
