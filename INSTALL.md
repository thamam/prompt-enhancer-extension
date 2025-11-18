# Quick Installation Guide

## 🚀 Install in 3 Steps

### Step 1: Navigate to Extensions
1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)

### Step 2: Load Extension
1. Click **"Load unpacked"** button
2. Navigate to and select the `prompt-enhancer-extension` folder
3. Extension appears in toolbar

### Step 3: Test It!
1. Go to any website with text input (e.g., ChatGPT, Claude.ai)
2. Select some text
3. Right-click → **Prompt Enhance** → Choose a mode
4. Watch your text transform! ✨

## First Use Example

1. Visit https://chat.openai.com or https://claude.ai
2. Type a simple prompt: `Analyze this data`
3. Select the text
4. Right-click → Prompt Enhance → Quick Fixes → Fix Anti-Patterns
5. Your prompt is now enhanced with:
   - Specific action verbs
   - Output format
   - Success criteria
   - Error handling

## Available Enhancement Modes

### 🎯 Enforce Mode
- **Zero Shot**: Adds strict "no questions" enforcement
- **Zero Shot Relaxed**: Allows one clarification
- **Interactive**: Adds step-by-step checkpoints

### 🤖 Optimize for Platform
- **Claude**: Converts to XML structure
- **GPT-4**: Converts to JSON format

### 🔧 Quick Fixes
- **Fix Anti-Patterns**: Auto-fixes vague verbs, adds structure
- **Add Structure**: Adds comprehensive prompt template

### 📊 Evaluate & Score
- Analyzes prompt quality
- Scores across 4 dimensions
- Provides improvement recommendations

### 🤖 AI-Powered Enhancement (v1.3.0+)
- **Enhance with LLM**: Use local or remote AI models to enhance prompts
- Supports local LLMs (Ollama, LM Studio, LocalAI)
- Supports remote APIs (OpenAI, Anthropic/Claude, Google/Gemini, OpenRouter)

## Troubleshooting

### Extension Not Working?
- Refresh the webpage after installing
- Check that extension is enabled
- Try selecting text in a different field

### No Context Menu?
- Make sure text is selected before right-clicking
- Reload extension from chrome://extensions/

### Text Not Replacing?
- Some sites may block modification
- Try in a different text field
- Works best with standard inputs/textareas

## Configuring LLM Enhancement (Optional)

### Chrome Extension

1. Click the extension icon in your toolbar
2. Enable "Enable LLM Enhancement" checkbox
3. Choose your provider:
   - **Local (Ollama, LM Studio)**: For privacy and offline use
   - **OpenAI**: Requires API key (starts with `sk-`)
   - **Anthropic (Claude)**: Requires API key (starts with `sk-ant-`)
   - **Google (Gemini)**: Requires Google AI API key
   - **OpenRouter**: Unified access to multiple providers

#### For Local LLMs:
4. Select Local API Type (Ollama or OpenAI-compatible)
5. Enter endpoint URL (default: `http://localhost:11434`)
6. Enter model name (e.g., `llama2`, `mistral`)
7. Click "Test Connection" → "Save Settings"

#### For Remote APIs:
4. Enter your API key (kept secure in browser storage)
5. Enter model name:
   - OpenAI: `gpt-4`, `gpt-4-turbo`, `gpt-3.5-turbo`
   - Anthropic: `claude-3-opus-20240229`, `claude-3-sonnet-20240229`
   - Google: `gemini-pro`, `gemini-1.5-pro`
   - OpenRouter: `openai/gpt-4`, `anthropic/claude-3-opus`
6. Click "Test Connection" → "Save Settings"

### VS Code Extension

1. Open VS Code Settings (File → Preferences → Settings)
2. Search for "Prompt Enhancer"
3. Configure LLM settings:

**For Local LLMs:**
```json
{
  "promptEnhancer.llm.enabled": true,
  "promptEnhancer.llm.provider": "local",
  "promptEnhancer.llm.apiType": "ollama",
  "promptEnhancer.llm.endpoint": "http://localhost:11434",
  "promptEnhancer.llm.model": "llama2"
}
```

**For Remote APIs:**
```json
{
  "promptEnhancer.llm.enabled": true,
  "promptEnhancer.llm.provider": "openai",
  "promptEnhancer.llm.model": "gpt-4",
  "promptEnhancer.llm.apiKey": "sk-your-api-key-here"
}
```

**Security Note**: API keys are stored locally and never transmitted except to the configured LLM provider.

## Pro Tips

1. **Start Simple**: Try "Fix Anti-Patterns" first
2. **Platform-Specific**: Use Claude/GPT-4 optimization before copying to those platforms
3. **Evaluate First**: Run "Evaluate & Score" to see what needs improvement
4. **Stats**: Click extension icon to see usage statistics
5. **AI Enhancement**: For best results with LLM enhancement, use GPT-4, Claude Opus, or Gemini Pro
6. **Privacy**: Use local LLMs (Ollama) if you're working with sensitive prompts

## Next Steps

- Read full README.md for detailed examples
- Check popup by clicking extension icon
- Try all 9 enhancement modes
- Provide feedback for v1.1 features!

---

**Happy Prompt Engineering!** 🎯✨
