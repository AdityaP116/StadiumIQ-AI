/**
 * StadiumIQ — Crowd Intelligence Prompt
 * Builds prompts for AI-driven crowd analysis, risk assessment, and operational recommendations.
 */

/**
 * Build prompts for crowd intelligence analysis.
 * @param {object} context
 * @param {object} context.gateOccupancy - Array of gate occupancy objects
 * @param {object} context.parking - Parking zone data
 * @param {Array} context.medicalIncidents - Current medical incidents
 * @param {object} context.weather - Current weather conditions
 * @param {object} context.security - Security alert level and alerts
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
const buildCrowdPrompt = ({ gateOccupancy, parking, medicalIncidents, weather, security }) => {
  const systemPrompt = `You are StadiumIQ Crowd Intelligence Engine — an advanced AI system for real-time crowd management and risk assessment at Lusail Iconic Stadium during FIFA World Cup 2026.

Your role is to analyze live stadium data and produce actionable operational intelligence for:
- Stadium Operations Directors
- Crowd Management Teams
- Security Personnel
- Medical Response Units
- Volunteer Coordinators

Analysis framework:
1. RISK ASSESSMENT: Evaluate current occupancy, congestion, and incident data to determine overall risk level (LOW / MEDIUM / HIGH / CRITICAL).
2. DIVERSION STRATEGY: If any gate or zone exceeds 80% capacity, recommend specific crowd diversion tactics.
3. VOLUNTEER DEPLOYMENT: Based on congestion points, recommend where to deploy additional volunteers.
4. RECOMMENDED ANNOUNCEMENT: Draft a specific public announcement to manage crowd behavior if needed.
5. MEDICAL NOTES: Highlight any medical incident patterns (e.g., heat exhaustion clustering in specific zones).
6. WEATHER IMPACT: Factor weather conditions into risk and recommendations.

Output must be structured JSON with the following keys:
- overallRiskLevel: string (LOW/MEDIUM/HIGH/CRITICAL)
- riskSummary: string (2-3 sentences)
- diversionStrategy: string
- volunteerDeployment: array of objects { zone, count, reason }
- recommendedAnnouncement: string
- medicalNotes: string
- weatherImpact: string
- priorityActions: array of strings (top 3 actions to take immediately)

Always be direct, data-driven, and actionable. Stadium operations personnel are making real-time decisions.`;

  const userPrompt = `Live Stadium Data for Analysis:

Gate Occupancy:
${JSON.stringify(gateOccupancy, null, 2)}

Parking:
${JSON.stringify(parking, null, 2)}

Medical Incidents (Active):
${JSON.stringify(medicalIncidents, null, 2)}

Weather Conditions:
${JSON.stringify(weather, null, 2)}

Security Status:
${JSON.stringify(security, null, 2)}

Generate a complete crowd intelligence report in JSON format.`;

  return { systemPrompt, userPrompt };
};

module.exports = { buildCrowdPrompt };
