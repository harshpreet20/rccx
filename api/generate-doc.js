export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Anthropic API key not configured' });

  const { docType, eventData } = req.body;
  // docType: 'partner_pitch' | 'event_pl' | 'franchise_report'

  const prompts = {
    partner_pitch: `You are a professional sports marketing writer. Generate a compelling partner pitch document for a badminton doubles tournament called "${eventData.eventName}".

Event details:
- ${eventData.eventDays}-day event
- ${eventData.totalPartners} franchise partners (${eventData.brandCount} brand + ${eventData.communityCount} community)
- Total players: ${eventData.totalPlayers}
- Prize pool: Rs 45,000 (1st: Rs 25,000, 2nd: Rs 15,000, 3rd: Rs 5,000)
- Sundowner party with DJ
- Professional photography

Brand Partner Package (Rs 1,50,000):
- ${eventData.brandPairs} doubles pairs per franchise
- Court branding, PA mentions, social media coverage
- Professional video reel of franchise matches

Community Partner Package (Rs 40,000):
- 1 doubles pair
- Community banner, event certificates, sundowner passes

Generate a professional HTML document with:
1. Executive summary
2. Brand partner package details with ROI analysis
3. Community partner package details
4. Event format and schedule
5. Prize structure
6. Why participate section
7. Investment analysis table

Format as clean, print-ready HTML with inline CSS. Use a professional color scheme (navy blue #1e40af, white, light grey). Make it look like a premium sports franchise pitch deck.`,

    event_pl: `You are a financial analyst specializing in sports events. Generate a detailed Profit and Loss report for "${eventData.eventName}".

Revenue:
- Brand partner fees: ${eventData.brandRevenue}
- Community partner fees: ${eventData.communityRevenue}
- Player entry fees: ${eventData.playerFeeRevenue}
- Registration fees: ${eventData.registrationRevenue}
- Vendor stalls: ${eventData.vendorRevenue}
- Sundowner: ${eventData.sundownerRevenue}
- Total Revenue: ${eventData.totalRevenue}

Costs:
${eventData.costsBreakdown}
- Total Costs: ${eventData.totalCosts}

Surplus: ${eventData.grossSurplus}
RRC Earnings: ${eventData.rrcEarnings}
Target: ${eventData.targetEarnings}

Generate a professional HTML financial report with:
1. Executive P&L summary with color-coded figures
2. Revenue breakdown with percentage contributions
3. Cost breakdown by category
4. Variance analysis vs target
5. Per-partner financial summary
6. Recommendations for Season 2

Format as clean print-ready HTML with inline CSS. Professional finance report style.`,

    franchise_report: `Generate a franchise owner report for ${eventData.franchiseName} in "${eventData.eventName}".

Investment: Rs ${eventData.franchiseFee} (franchise fee) + Rs 5,000 (registration) = Rs ${eventData.totalInvested}
Players: ${eventData.playerCount} confirmed
Event: ${eventData.eventDays} days

Prize scenarios:
- 1st place: Rs 25,000 back, net cost Rs ${eventData.totalInvested - 25000}
- 2nd place: Rs 15,000 back, net cost Rs ${eventData.totalInvested - 15000}
- 3rd place: Rs 5,000 back, net cost Rs ${eventData.totalInvested - 5000}

Generate an HTML report showing investment breakdown, prize ROI scenarios, per-player cost analysis, and what the franchise receives as a package.`
  };

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompts[docType] || prompts.partner_pitch }],
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Anthropic API error');
    const htmlContent = data.content[0].text;
    res.status(200).json({ html: htmlContent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
