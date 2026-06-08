const TOURNAMENT_KEYWORDS = ['tournament', 'match', 'player', 'franchise', 'partner', 'court', 'doubles', 'badminton', 'schedule', 'fixture', 'prize', 'registration', 'rrc', 'fee', 'bracket', 'group', 'score', 'winner', 'pair', 'sundowner', 'event'];

const SYSTEM_PROMPTS = {
  organizer: `You are the RRC Doubles Cup AI assistant with full access. You help the tournament organizer with financial planning, player management, schedule optimization, and any questions about the event. You have access to all tournament data. Be concise and professional.`,

  franchise_owner: `You are the RRC Doubles Cup AI assistant for franchise owners. You help franchise owners understand their investment, player commitments, match schedules, and prize potential. Only answer questions related to the tournament, their franchise, and badminton. If asked about unrelated topics, politely redirect to tournament topics.`,

  public: `You are the RRC Doubles Cup public information assistant. You can only answer questions about this badminton tournament: format, registration, how to participate, prize structure, event schedule. For anything else, say: "I can only answer questions about the RRC Doubles Cup tournament. Please ask me about registration, prizes, format, or how to join."`
};

// Simple in-memory rate limiting (resets on cold start)
const rateLimits = new Map();
const TIMEOUT_DURATION = 30000; // 30 seconds

import { requireAuth } from './_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message, context, clientId } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  // Verify auth and resolve role server-side (ignore client-supplied role)
  let verifiedRole = 'public';
  try {
    const { role } = await requireAuth(req);
    verifiedRole = role === 'organizer' ? 'organizer'
      : role === 'franchise_owner' ? 'franchise_owner'
      : 'public';
  } catch (authErr) {
    // Unauthenticated users get public-level access
    if (authErr.status === 500) return res.status(500).json({ error: 'Server error' });
    verifiedRole = 'public';
  }
  const role = verifiedRole;

  // Rate limiting for public users
  if (role === 'public') {
    const now = Date.now();
    const clientKey = clientId || req.headers['x-forwarded-for'] || 'unknown';
    const limit = rateLimits.get(clientKey);

    if (limit?.timedOut && now < limit.timedOut) {
      const remaining = Math.ceil((limit.timedOut - now) / 1000);
      return res.status(429).json({
        error: `timeout`,
        message: `Please wait ${remaining} seconds before asking another question.`,
        timeoutSeconds: remaining
      });
    }

    // Check if question is tournament-related
    const msgLower = message.toLowerCase();
    const isTournamentRelated = TOURNAMENT_KEYWORDS.some(kw => msgLower.includes(kw));
    if (!isTournamentRelated) {
      // Set timeout
      rateLimits.set(clientKey, { timedOut: now + TIMEOUT_DURATION });
      return res.status(200).json({
        message: "I can only answer questions about the RRC Doubles Cup tournament. Ask me about registration, prizes, match format, or how to join! You can ask again in 30 seconds.",
        isGuardrail: true
      });
    }

    // Track message count
    rateLimits.set(clientKey, { count: (limit?.count || 0) + 1, timedOut: null });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!openaiKey && !anthropicKey) {
    return res.status(500).json({ error: 'No AI API keys configured' });
  }

  const systemPrompt = SYSTEM_PROMPTS[role] || SYSTEM_PROMPTS.public;
  const contextBlock = context ? `\n\nTournament context:\n${JSON.stringify(context, null, 2)}` : '';

  try {
    // Use Anthropic for organizer (better reasoning), OpenAI for others (faster)
    if (role === 'organizer' && anthropicKey) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: systemPrompt + contextBlock,
          messages: [{ role: 'user', content: message }],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message);
      return res.status(200).json({ message: data.content[0].text, model: 'claude' });
    } else if (openaiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 1024,
          messages: [
            { role: 'system', content: systemPrompt + contextBlock },
            { role: 'user', content: message }
          ],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message);
      return res.status(200).json({ message: data.choices[0].message.content, model: 'gpt' });
    } else {
      // Fallback to Anthropic even for non-organizer
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          system: systemPrompt + contextBlock,
          messages: [{ role: 'user', content: message }],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Anthropic API error');
      return res.status(200).json({ message: data.content[0].text, model: 'claude' });
    }
  } catch (err) {
    return res.status(500).json({ error: `AI error: ${err.message}` });
  }
}
