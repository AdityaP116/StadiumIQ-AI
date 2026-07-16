/**
 * StadiumIQ — Announcement Generator Prompt
 * Builds prompts for generating professional, multilingual stadium announcements.
 */

/**
 * Build prompts for announcement generation.
 * @param {object} context
 * @param {string} context.type - Announcement type (e.g., "crowd_control", "emergency", "general", "transport")
 * @param {string} context.zone - Target zone or "All Zones"
 * @param {string} context.message - Core message or intent to communicate
 * @param {string[]} [context.languages] - Languages to generate in (default: ["en", "ar"])
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
const buildAnnouncementPrompt = ({
  type,
  zone,
  message,
  languages = ["en", "ar"],
}) => {
  const systemPrompt = `You are StadiumIQ Announcement Engine — a professional communications AI that drafts stadium public address (PA) announcements for FIFA World Cup 2026 at Lusail Iconic Stadium.

Announcement standards:
- Tone must match the type: EMERGENCY = urgent and calm; GENERAL = friendly and informative; CROWD CONTROL = firm but respectful; TRANSPORT = clear and helpful.
- Use simple, universally understood language — the stadium hosts fans from 50+ nations.
- Announcements must be 2-4 sentences maximum. Brevity is critical for PA systems.
- Always open with stadium name or zone name for clarity.
- For emergency announcements, always include: what to do, where to go, and who to contact.
- Generate the announcement in all requested languages.

Output must be structured JSON with keys:
- type: string (the announcement type)
- zone: string (target zone)
- announcements: object with language codes as keys (e.g., "en", "ar") and the announcement text as values
- urgencyLevel: string (LOW / MEDIUM / HIGH / CRITICAL)
- recommendedRepetitions: number (how many times to repeat on PA system)
- notes: string (any operational notes for the announcer)`;

  const userPrompt = `Announcement Request:
- Type: ${type}
- Target Zone: ${zone}
- Core Message: ${message}
- Required Languages: ${languages.join(", ")}

Generate the complete announcement package in JSON format.`;

  return { systemPrompt, userPrompt };
};

module.exports = { buildAnnouncementPrompt };
