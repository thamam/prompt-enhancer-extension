# Prompt Enhancer Pro for Chrome

Enhance your AI prompts with systematic prompt engineering principles, security scanning, and local/remote LLM support - right in your web browser!

## Features

### 🎯 Enhancement Modes

- **Zero Shot Mode**: Enforce immediate execution without clarifying questions
- **Zero Shot Relaxed**: Allow one clarification question if critically needed
- **Interactive Mode**: Step-by-step execution with mandatory checkpoints
- **Claude Optimization**: XML-structured format optimized for Claude
- **GPT-4 Optimization**: JSON-structured format optimized for GPT-4

### 🔧 Quick Fixes

- **Fix Anti-Patterns**: Automatically detect and fix vague verbs, missing output formats, and success criteria
- **Add Structure**: Add comprehensive prompt structure with requirements, constraints, and examples

### 📊 Analysis

- **Evaluate & Score**: Get a detailed quality assessment with scores for clarity, specificity, completeness, and efficiency

### 🛡️ Security Scanner

- **Automatic Detection**: Scans prompts for sensitive information before enhancement
- **Comprehensive Patterns**: Detects API keys, passwords, PII, credit cards, database connections, private keys
- **Smart Scoring**: 0-100 security score with severity-based penalties
- **Auto-Redaction**: Safely redacts sensitive data while preserving prompt structure

### 🤖 LLM-Powered Enhancement

- **Local LLMs**: Ollama, LM Studio, LocalAI
- **Remote APIs**: OpenAI, Anthropic (Claude), Google (Gemini), OpenRouter
- AI-powered prompt enhancement using state-of-the-art language models

## Installation

### Method 1: Load Unpacked (Development)

1. **Generate Icons** (one-time setup):
   ```bash
   cd prompt-enhancer-extension
   node generate-icons.js
   ```

2. **Open Chrome Extensions Page**:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)

3. **Load Extension**:
   - Click "Load unpacked"
   - Select the `chrome/` directory
   - Extension should now appear in your toolbar

### Method 2: Package for Distribution

```bash
cd chrome
zip -r prompt-enhancer-pro-chrome.zip . -x "*.git*"
```

Then load the .zip file in Chrome Extensions or distribute it.

## Usage

### Context Menu

1. Select any text on a webpage
2. Right-click to open context menu
3. Navigate to "Prompt Enhance" submenu:
   ```
   Prompt Enhance →
     ├── Enforce Mode →
     │   ├── 🎯 Zero Shot (No Questions)
     │   ├── 🎯 Zero Shot Relaxed (1 Question OK)
     │   └── 💬 Interactive (Step-by-Step)
     │
     ├── Optimize for Platform →
     │   ├── 🤖 Optimize for Claude
     │   └── 🧠 Optimize for GPT-4
     │
     ├── Quick Fixes →
     │   ├── 🔧 Fix Anti-Patterns
     │   └── 📋 Add Structure & Format
     │
     ├── 📊 Evaluate & Score
     └── 🤖 Enhance with LLM
   ```
4. Enhanced text replaces your selection

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+E` / `Cmd+Shift+E` | Quick enhance with last used mode |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Zero Shot mode |
| `Ctrl+Shift+I` / `Cmd+Shift+I` | Interactive mode |
| `Ctrl+Shift+C` / `Cmd+Shift+C` | Optimize for Claude |

Customize shortcuts at `chrome://extensions/shortcuts`

### Security Scanner

Before enhancement, the extension automatically scans for sensitive information:

- **Critical/High Issues**: Security warning modal appears with options:
  - **Cancel**: Abort enhancement
  - **Redact & Proceed**: Automatically redact sensitive data (recommended)
  - **Proceed Anyway**: Continue without redaction (not recommended)

- **Medium/Low Issues**: Warning notification appears, enhancement proceeds automatically

- **No Issues**: Enhancement proceeds normally

## Configuration

### Extension Popup

Click the extension icon to:
- View usage statistics
- Configure LLM settings
- Test LLM connection
- View version information

### LLM Settings

#### Local LLM (Ollama, LM Studio, LocalAI)

1. Click extension icon
2. Enable "Enable LLM Enhancement"
3. Select Provider: "Local (Ollama, LM Studio)"
4. Choose API Type (Ollama or OpenAI-compatible)
5. Enter endpoint URL (e.g., `http://localhost:11434`)
6. Enter model name (e.g., `llama2`, `mistral`)
7. Click "Test Connection"
8. Click "Save Settings"

#### Remote LLM (OpenAI, Claude, Gemini, OpenRouter)

1. Click extension icon
2. Enable "Enable LLM Enhancement"
3. Select Provider (OpenAI, Anthropic, Google, or OpenRouter)
4. Enter your API key
5. Enter model name
6. Click "Test Connection"
7. Click "Save Settings"

**Example Model Names:**
- **OpenAI**: `gpt-4`, `gpt-4-turbo`, `gpt-3.5-turbo`
- **Anthropic**: `claude-3-opus-20240229`, `claude-3-sonnet-20240229`
- **Google**: `gemini-pro`, `gemini-1.5-pro`
- **OpenRouter**: `openai/gpt-4`, `anthropic/claude-3-opus`

## Compatibility

Works on all websites including:
- ChatGPT
- Claude.ai
- Poe
- Perplexity
- Google Bard/Gemini
- HuggingChat
- Any text input field

Supports:
- Textareas
- Input fields
- ContentEditable elements
- CodeMirror editors
- Monaco editors

## Examples

### Before: Fix Anti-Patterns
```
analyze the data
```

### After: Fix Anti-Patterns
```
/* Enhanced Prompt - Anti-patterns Fixed */
/* Issues addressed: Replaced vague verb "analyze" with specific action, Added explicit output format specification, Added success criteria section, Added error handling instructions */

Extract key metrics, identify patterns, and provide actionable insights on the data

Output Format:
1. [Primary result]
2. [Supporting details]
3. [Validation/verification]

Success Criteria:
- [Define what successful completion looks like]

Error Handling:
If input is unclear or incomplete, specify what information is needed before proceeding.
```

### After: Optimize for Claude
```xml
<instructions>
<task>
analyze the data
</task>

<requirements>
- Define clear success criteria
- Specify output format
- Include validation steps
</requirements>

<output_format>
<response>
  <analysis>Your analysis here</analysis>
  <implementation>Your implementation here</implementation>
  <validation>Verification steps</validation>
</response>
</output_format>

<constraints>
- Use explicit, structured instructions
- Follow XML formatting for outputs
- Include error handling
- Document assumptions
</constraints>
</instructions>
```

## Architecture

This extension shares its core enhancement logic with the VS Code extension:

- **`../core/`**: Shared enhancement logic (platform-agnostic)
- **`./adapters/`**: Chrome-specific implementations for storage and notifications
- **`./background.js`**: Service worker for context menu and command handling
- **`./content.js`**: Content script for text replacement and security scanning
- **`./popup.html/js`**: Extension popup UI

## Development

### Prerequisites

- Node.js (for icon generation)
- Chrome/Chromium browser

### File Structure

```
chrome/
├── manifest.json          # Extension manifest
├── background.js          # Service worker
├── content.js            # Content script
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic
├── adapters/
│   ├── chrome-storage.js     # Chrome storage implementation
│   └── chrome-notifications.js # Chrome notifications
└── icons/                # Extension icons
```

### Testing

1. Make changes to code
2. Go to `chrome://extensions/`
3. Click reload icon on "Prompt Enhancer Pro"
4. Refresh any open tabs
5. Test enhancement functionality

### Adding New Enhancement Mode

1. Add mode to `../core/enhancement-modes.js`
2. Implement method in `../core/enhancer.js`
3. Add case to `enhance()` switch statement
4. Add context menu item in `background.js`
5. Test on Chrome

Changes automatically benefit VS Code extension too!

## Troubleshooting

### Extension Not Working

- Reload the extension at `chrome://extensions/`
- Refresh the webpage you're testing on
- Check browser console for errors (F12)

### Text Not Replacing

- Some sites use shadow DOM or block modifications
- Try on a different website to verify functionality
- Check if site has strict Content Security Policy

### LLM Connection Issues

**Local LLM:**
- Ensure LLM server is running
- Verify endpoint URL is correct
- Check firewall settings
- Test with: `curl http://localhost:11434/api/tags`

**Remote API:**
- Verify API key is correct and active
- Check you have sufficient credits/quota
- Ensure API key has necessary permissions
- Test connection in extension popup

## Contributing

See main [README.md](../README.md) for contribution guidelines.

## License

MIT License - see LICENSE file for details

## Links

- [Main Repository](../)
- [VS Code Extension](../vscode/)
- [GitHub Issues](https://github.com/thamam/prompt-enhancer-extension/issues)

## Changelog

### 1.4.0
- Refactored to shared core architecture
- Added remote LLM API support (OpenAI, Claude, Gemini, OpenRouter)
- Improved code organization
- VS Code extension compatibility

### 1.3.0
- Added local LLM support (Ollama, LM Studio)
- LLM-powered prompt enhancement
- Connection testing

### 1.2.0
- Added comprehensive security scanner
- Auto-redaction for sensitive data
- Security scoring system

### 1.1.0
- Added keyboard shortcuts
- Last used mode tracking
- Improved error handling

### 1.0.0
- Initial release
- 10 enhancement modes
- Security scanning
- Multi-site compatibility
