/**
 * StadiumIQ — Navigation Prompt
 * Builds prompts for generating human-friendly stadium navigation directions.
 */

/**
 * Build prompts for navigation routing.
 * @param {object} context
 * @param {string} context.currentLocation - Fan's current position
 * @param {string} context.destination - Where the fan wants to go
 * @param {object} [context.stadiumData] - Optional stadium layout data for context
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
const buildNavigationPrompt = ({ currentLocation, destination, stadiumData = null }) => {
  const stadiumContext = stadiumData
    ? `\nStadium Layout Reference:\n${JSON.stringify(stadiumData, null, 2)}`
    : "";

  const systemPrompt = `You are StadiumIQ Navigation Engine — an expert indoor and outdoor navigation AI for Lusail Iconic Stadium, Qatar, during FIFA World Cup 2026.

Your task is to generate clear, human-friendly, step-by-step directions within the stadium grounds.

Navigation rules:
- Use natural landmarks (gates, stands, food courts, screens, escalators) as waypoints — not technical coordinates.
- Mention estimated walking time for each major segment.
- Flag any accessibility considerations (ramps, elevators, accessible routes).
- If the route passes through a crowded area, suggest an alternative if one exists.
- Always end with a confirmation of the destination and what the fan will see when they arrive.
- Write directions as if guiding someone who has never been to this stadium before.
- Keep language simple, clear, and reassuring.
${stadiumContext}`;

  const userPrompt = `Navigation Request:
- Current Location: ${currentLocation}
- Destination: ${destination}

Please provide:
1. Step-by-step walking directions
2. Estimated total walking time
3. Any accessibility notes
4. What to look for when arriving at the destination`;

  return { systemPrompt, userPrompt };
};

module.exports = { buildNavigationPrompt };
