// Next.js API route to proxy 1inch balance requests and avoid CORS issues

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { chainId, address } = req.query;

  if (!chainId || !address) {
    return res.status(400).json({ message: 'Missing chainId or address parameter' });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_1INCH_API;
    
    if (!apiKey) {
      return res.status(500).json({ message: 'API key not configured' });
    }

    const response = await fetch(`https://api.1inch.dev/balance/v1.2/${chainId}/balances/${address}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('1inch API Error:', response.status, errorText);
      return res.status(response.status).json({ 
        message: '1inch API Error', 
        details: errorText 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('API Route Error:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      details: error.message 
    });
  }
}