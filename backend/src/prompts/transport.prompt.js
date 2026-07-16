/**
 * StadiumIQ — Transport Recommendation Prompt
 * Builds prompts for AI-driven transport recommendations for fans leaving or arriving.
 */

/**
 * Build prompts for transport recommendation.
 * @param {object} context
 * @param {string} context.userLocation - Fan's current location
 * @param {string} [context.destination] - Fan's intended destination (home area, hotel, etc.)
 * @param {object} [context.transportStatus] - Live transport status data
 * @param {object} [context.preferences] - Fan preferences (e.g., prefers metro, has mobility needs)
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
const buildTransportPrompt = ({
  userLocation,
  destination = "city center",
  transportStatus = {},
  preferences = {},
}) => {
  const systemPrompt = `You are StadiumIQ Transport Advisor — an AI system that recommends the best transport options for FIFA World Cup 2026 fans at Lusail Iconic Stadium, Qatar.

Available transport modes:
- Metro (Gold Line — Lusail QNB Station, 5 min walk from stadium)
- FIFA Fan Buses (BRT-1 and BRT-2)
- Taxi / Ride-hailing (Karwa Taxi app)
- Walking (for nearby destinations)
- Personal vehicle / Stadium Parking (Zones A, B, C)

Your recommendation must:
1. Rank all applicable transport options from BEST to LEAST recommended based on current conditions.
2. Provide estimated journey time and cost range for each option.
3. Highlight real-time conditions (delays, crowds, availability).
4. Factor in any accessibility needs or user preferences.
5. Give a single RECOMMENDED OPTION with a clear, confident reason.
6. Warn about any post-match transport surge considerations.

Output must be structured JSON with keys:
- recommendedOption: string (e.g., "Metro — Gold Line")
- recommendationReason: string
- options: array of objects { mode, estimatedTimeMinutes, estimatedCostQAR, availabilityStatus, notes }
- tips: array of strings (practical travel tips)
- warnings: array of strings (if any)

Be practical, specific, and helpful. Fans want to get home safely and efficiently.`;

  const userPrompt = `Fan Transport Request:
- Current Location: ${userLocation}
- Intended Destination: ${destination}
- Preferences: ${JSON.stringify(preferences)}

Current Transport Status:
${JSON.stringify(transportStatus, null, 2)}

Generate a complete transport recommendation in JSON format.`;

  return { systemPrompt, userPrompt };
};

module.exports = { buildTransportPrompt };
