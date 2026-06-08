import { requireAuth } from './_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { role } = await requireAuth(req);
    if (role !== 'organizer') return res.status(403).json({ error: 'Organizer access required' });
  } catch (authErr) {
    return res.status(authErr.status || 401).json({ error: authErr.message });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!openaiKey && !anthropicKey) {
    return res.status(500).json({ error: 'No AI API keys configured on server' });
  }

  try {
    if (openaiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: data.error?.message || 'OpenAI API error' });
      }
      return res.status(200).json(data);
    } else {
      // Fallback to Anthropic
      const userMessage = req.body.messages?.find(m => m.role === 'user')?.content || '';
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4096,
          messages: [{ role: 'user', content: userMessage }],
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: data.error?.message || 'Anthropic API error' });
      }
      // Wrap in OpenAI-compatible shape so the frontend parse works
      return res.status(200).json({
        choices: [{ message: { content: data.content[0].text } }]
      });
    }
  } catch (err) {
    return res.status(500).json({ error: `Proxy error: ${err.message}` });
  }
}
