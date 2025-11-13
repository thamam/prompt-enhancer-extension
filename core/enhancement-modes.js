// Enhancement modes based on project guidelines
// Shared across all platforms (Chrome, VS Code, etc.)

const ENHANCEMENT_MODES = {
  ZERO_SHOT: 'zero_shot',
  ZERO_SHOT_RELAXED: 'zero_shot_relaxed',
  INTERACTIVE: 'interactive',
  CLAUDE_OPTIMIZE: 'claude_optimize',
  GPT4_OPTIMIZE: 'gpt4_optimize',
  FIX_ANTIPATTERNS: 'fix_antipatterns',
  ADD_STRUCTURE: 'add_structure',
  PLATFORM_CONVERT: 'platform_convert',
  EVALUATE_SCORE: 'evaluate_score',
  LOCAL_LLM: 'local_llm'
};

// Human-readable mode names
const MODE_DISPLAY_NAMES = {
  [ENHANCEMENT_MODES.ZERO_SHOT]: '🎯 Zero Shot (No Questions)',
  [ENHANCEMENT_MODES.ZERO_SHOT_RELAXED]: '🎯 Zero Shot Relaxed (1 Question OK)',
  [ENHANCEMENT_MODES.INTERACTIVE]: '💬 Interactive (Step-by-Step)',
  [ENHANCEMENT_MODES.CLAUDE_OPTIMIZE]: '🤖 Optimize for Claude',
  [ENHANCEMENT_MODES.GPT4_OPTIMIZE]: '🧠 Optimize for GPT-4',
  [ENHANCEMENT_MODES.FIX_ANTIPATTERNS]: '🔧 Fix Anti-Patterns',
  [ENHANCEMENT_MODES.ADD_STRUCTURE]: '📋 Add Structure & Format',
  [ENHANCEMENT_MODES.EVALUATE_SCORE]: '📊 Evaluate & Score',
  [ENHANCEMENT_MODES.LOCAL_LLM]: '🤖 Enhance with LLM'
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ENHANCEMENT_MODES, MODE_DISPLAY_NAMES };
}
if (typeof window !== 'undefined') {
  window.ENHANCEMENT_MODES = ENHANCEMENT_MODES;
  window.MODE_DISPLAY_NAMES = MODE_DISPLAY_NAMES;
}
