// pages/api/sendVerification.ts
import { Resend } from 'resend';
import type { NextApiRequest, NextApiResponse } from 'next';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, firstName } = req.body;

    if (!email || !firstName) {
      return res.status(400).json({ message: 'Missing email or name' });
    }

    const verificationLink = `http://localhost:3000/api/verify?email=${encodeURIComponent(email)}`;

    try {
      const emailResponse = await resend.emails.send({
        from: 'YourApp <verify@avinashdashin.com>',
        to: email,
        subject: 'Verify your email',
        html: `<p>Hello ${firstName},</p>
               <p>Please verify your email:</p>
               <a href="${verificationLink}">Verify Email</a>`,
      });

      // ✅ Log the full response from Resend
      console.log('📩 Email Response:', emailResponse);

      res.status(200).json({ message: 'Email sent' });
    } catch (error) {
      console.error('❌ Resend error:', error);
      res.status(500).json({ message: 'Error sending email' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
