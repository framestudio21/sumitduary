// /api/logout.js

export default function handler(req, res) {
    if (req.method === 'POST') {
      // Clear the token by setting the cookie to an empty value and an expired time
      res.setHeader('Set-Cookie', 'token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
  
      return res.status(200).json({ message: 'Logout successful' });
    } else {
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  }
  