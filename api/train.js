export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL || 'https://wsucqpunleplgyrrroae.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!anthropicKey) return res.status(500).json({ error: 'Anthropic key not configured' });

  const { tournamentData } = req.body;

  // Generate a structured knowledge summary using Claude
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: `Convert this tournament data into a structured FAQ knowledge base. Create 15-20 Q&A pairs covering: registration, prizes, format, financials, schedules, and how to participate. Return as JSON array of {question, answer} objects.\n\nData: ${JSON.stringify(tournamentData)}`
        }],
      }),
    });
    const data = await response.json();
    const knowledgeBase = JSON.parse(data.content[0].text);

    // Store in Supabase chatbot_knowledge table (already exists)
    if (supabaseKey) {
      const sbRes = await fetch(`${supabaseUrl}/rest/v1/chatbot_knowledge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify(knowledgeBase.map(item => ({
          topic: 'rrc_tournament',
          question: item.question,
          answer: item.answer,
          source: 'auto_trained',
        }))),
      });
    }

    res.status(200).json({ success: true, count: knowledgeBase.length });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}
