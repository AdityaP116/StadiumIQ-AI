/**
 * StadiumIQ — Emergency Response Prompt
 * Builds prompts for AI-driven emergency response plans.
 */

/**
 * Build prompts for emergency response.
 * @param {object} context
 * @param {string} context.emergencyType - Type of emergency (medical, fire, security, evacuation, etc.)
 * @param {string} context.zone - Zone where the emergency is occurring
 * @param {string} [context.severity] - Severity level (Minor, Moderate, Critical)
 * @param {string} [context.description] - Additional details about the emergency
 * @param {object} [context.liveData] - Current stadium data (crowd, medical, security)
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
const buildEmergencyPrompt = ({
  emergencyType,
  zone,
  severity = "Moderate",
  description = "",
  liveData = {},
}) => {
  const systemPrompt = `You are StadiumIQ Emergency Response Intelligence Engine — a crisis management AI for FIFA World Cup 2026 at Lusail Iconic Stadium.

You are activated when an emergency situation is reported. Your response will be used by:
- Incident Command (Emergency Director)
- Security Teams
- Medical Response Units
- Volunteer Coordinators

Your emergency response plan must include:

1. PUBLIC_ANNOUNCEMENT: A short, calm PA announcement for the public (max 3 sentences).
2. VOLUNTEER_INSTRUCTIONS: Specific instructions for volunteers in the affected zone.
3. SECURITY_INSTRUCTIONS: Specific instructions for security personnel.
4. MEDICAL_INSTRUCTIONS: Specific instructions for medical response teams.
5. EVACUATION_PLAN: Step-by-step evacuation guidance if required (or "Not Required" if not applicable).
6. IMMEDIATE_ACTIONS: Top 5 actions to take in the next 5 minutes.
7. COMMUNICATION_CHAIN: Who should be notified and in what order.
8. ESTIMATED_RESOLUTION_TIME: Rough time estimate to resolve this incident.

Output must be structured JSON with those exact keys (snake_case).
All instructions must be specific, action-oriented, and immediately executable.
Prioritize life safety above everything else. Do not speculate — only provide actionable guidance.

Emergency Context:
- Type: ${emergencyType}
- Zone: ${zone}  
- Severity: ${severity}`;

  const userPrompt = `Emergency Situation Report:
- Emergency Type: ${emergencyType}
- Location: ${zone}
- Severity: ${severity}
- Description: ${description || "No additional details provided."}

Current Stadium Conditions:
${Object.keys(liveData).length > 0 ? JSON.stringify(liveData, null, 2) : "Live data not available."}

Generate the complete emergency response plan in JSON format. Time is critical.`;

  return { systemPrompt, userPrompt };
};

module.exports = { buildEmergencyPrompt };
