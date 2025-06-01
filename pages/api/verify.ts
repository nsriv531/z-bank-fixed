// /pages/api/verify.ts
import { supabase } from '../../lib/supabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid email' });
  }

  const { error } = await supabase
    .from('accountdetails')
    .update({ verified: true })
    .eq('email', email);

  if (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Verification failed' });
  }

  return res.status(200).send(`
    <html>
      <body style="font-family: sans-serif; padding: 2rem;">
        <h1>Email Verified ✅</h1>
        <p>Your email has been verified successfully.</p>
        <a href="/">Go back to homepage</a>
      </body>
    </html>
  `);
}
