/**
 * StadiumIQ — AI Thinking Indicator
 * Three pulsing dots displayed while waiting for an AI response.
 */

const AIThinking = ({ label = 'AI is thinking…' }) => (
  <div className="flex items-center gap-3 text-white/50 text-sm">
    <div className="ai-thinking">
      <span /><span /><span />
    </div>
    <span>{label}</span>
  </div>
);

export default AIThinking;
