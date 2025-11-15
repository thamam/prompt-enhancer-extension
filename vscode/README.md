# Prompt Enhancer Pro for VS Code

Enhance your AI prompts with systematic prompt engineering principles, security scanning, and local/remote LLM support - all within Visual Studio Code!

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

### 🤖 LLM-Powered Enhancement

- **Local LLMs**: Ollama, LM Studio, LocalAI
- **Remote APIs**: OpenAI, Anthropic (Claude), Google (Gemini), OpenRouter
- AI-powered prompt enhancement using state-of-the-art language models

## Installation

### From Source

1. Clone the repository:
   ```bash
   git clone https://github.com/thamam/prompt-enhancer-extension.git
   cd prompt-enhancer-extension/vscode
   ```

2. Install dependencies (optional, for development):
   ```bash
   npm install
   ```

3. Open the `vscode` directory in VS Code:
   ```bash
   code .
   ```

4. Press `F5` to launch the extension in a new Extension Development Host window

### From VSIX

1. Package the extension:
   ```bash
   cd vscode
   npx vsce package
   ```

2. Install the generated `.vsix` file:
   - Open VS Code
   - Go to Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`)
   - Click "..." menu → "Install from VSIX..."
   - Select the generated `prompt-enhancer-pro-1.4.0.vsix` file

## Usage

### Quick Start

1. Select text in any editor
2. Use keyboard shortcuts or command palette:
   - `Ctrl+Shift+E` / `Cmd+Shift+E`: Quick enhance (last used mode)
   - `Ctrl+Shift+Z` / `Cmd+Shift+Z`: Zero Shot mode
   - `Ctrl+Shift+I` / `Cmd+Shift+I`: Interactive mode
   - `Ctrl+Shift+C` / `Cmd+Shift+C`: Optimize for Claude

### Command Palette

Press `Ctrl+Shift+P` / `Cmd+Shift+P` and type "Prompt Enhance" to see all available commands:

- **Prompt Enhance: ⚡ Quick Enhance (Last Used)**
- **Prompt Enhance: 🎯 Zero Shot (No Questions)**
- **Prompt Enhance: 🎯 Zero Shot Relaxed (1 Question OK)**
- **Prompt Enhance: 💬 Interactive (Step-by-Step)**
- **Prompt Enhance: 🤖 Optimize for Claude**
- **Prompt Enhance: 🧠 Optimize for GPT-4**
- **Prompt Enhance: 🔧 Fix Anti-Patterns**
- **Prompt Enhance: 📋 Add Structure & Format**
- **Prompt Enhance: 📊 Evaluate & Score**
- **Prompt Enhance: 🤖 Enhance with LLM**
- **Prompt Enhance: ⚙️ Configure LLM Settings**

### Context Menu

1. Select text in any editor
2. Right-click to open context menu
3. Navigate to "Prompt Enhance" submenu
4. Select your desired enhancement mode

### Status Bar

Click the "✨ Prompt Enhance" button in the status bar to quickly enhance selected text with the last used mode.

## Configuration

### LLM Settings

Access settings via:
- Command Palette: "Prompt Enhance: ⚙️ Configure LLM Settings"
- Or: File → Preferences → Settings → Search for "Prompt Enhancer"

#### Local LLM (Ollama, LM Studio, LocalAI)

```json
{
  "promptEnhancer.llm.enabled": true,
  "promptEnhancer.llm.provider": "local",
  "promptEnhancer.llm.apiType": "ollama",
  "promptEnhancer.llm.endpoint": "http://localhost:11434",
  "promptEnhancer.llm.model": "llama2",
  "promptEnhancer.llm.temperature": 0.7
}
```

#### Remote LLM (OpenAI, Claude, Gemini, OpenRouter)

```json
{
  "promptEnhancer.llm.enabled": true,
  "promptEnhancer.llm.provider": "openai",
  "promptEnhancer.llm.model": "gpt-4",
  "promptEnhancer.llm.apiKey": "sk-...",
  "promptEnhancer.llm.temperature": 0.7
}
```

**Supported Providers:**
- `local`: Ollama, LM Studio, LocalAI
- `openai`: OpenAI (GPT-4, GPT-3.5-turbo, etc.)
- `anthropic`: Anthropic Claude
- `google`: Google Gemini
- `openrouter`: OpenRouter (unified access to multiple providers)

### Available Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `promptEnhancer.llm.enabled` | boolean | false | Enable LLM-powered enhancement |
| `promptEnhancer.llm.provider` | string | "local" | LLM provider (local, openai, anthropic, google, openrouter) |
| `promptEnhancer.llm.apiType` | string | "ollama" | Local API type (ollama or openai-compatible) |
| `promptEnhancer.llm.endpoint` | string | "http://localhost:11434" | Local LLM endpoint URL |
| `promptEnhancer.llm.model` | string | "llama2" | LLM model name |
| `promptEnhancer.llm.apiKey` | string | "" | API key for remote providers |
| `promptEnhancer.llm.temperature` | number | 0.7 | LLM temperature (0-2) |
| `promptEnhancer.lastUsedMode` | string | "fix_antipatterns" | Last used enhancement mode |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+E` / `Cmd+Shift+E` | Quick enhance with last used mode |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Zero Shot mode |
| `Ctrl+Shift+I` / `Cmd+Shift+I` | Interactive mode |
| `Ctrl+Shift+C` / `Cmd+Shift+C` | Optimize for Claude |

You can customize these shortcuts in VS Code's Keyboard Shortcuts editor:
- File → Preferences → Keyboard Shortcuts
- Search for "Prompt Enhance"

## Examples

### Before Enhancement
```
analyze the data
```

### After "Fix Anti-Patterns"
```
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

### After "Optimize for Claude"
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

This extension shares its core enhancement logic with the Chrome extension version, ensuring consistency across platforms:

- **`../core/`**: Shared enhancement logic (platform-agnostic)
- **`./adapters/`**: VS Code-specific implementations for storage and notifications
- **`./extension.js`**: VS Code extension entry point and command handlers

## Troubleshooting

### LLM Connection Issues

**Local LLM not connecting:**
- Ensure your local LLM server (Ollama, LM Studio, etc.) is running
- Verify the endpoint URL is correct
- Check firewall settings

**Remote API authentication fails:**
- Verify your API key is correct and has not expired
- Ensure you have sufficient credits/quota with the provider
- Check that your API key has the necessary permissions

### Extension Not Working

1. Check the Output panel (View → Output → Select "Prompt Enhancer Pro")
2. Try reloading the window (Ctrl+Shift+P / Cmd+Shift+P → "Developer: Reload Window")
3. Ensure you have text selected before running commands

## Development

### Prerequisites

- Node.js 18+
- VS Code 1.75.0+

### Setup

```bash
cd vscode
npm install
```

### Running

Press `F5` in VS Code to launch the Extension Development Host

### Packaging

```bash
npm run package
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both Chrome and VS Code extensions
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Links

- [GitHub Repository](https://github.com/thamam/prompt-enhancer-extension)
- [Chrome Extension](../chrome/)
- [Issues](https://github.com/thamam/prompt-enhancer-extension/issues)

## Changelog

### 1.4.0
- Initial VS Code extension release
- Shared core with Chrome extension
- Full LLM support (local and remote)
- All enhancement modes supported
- Context menu integration
- Status bar quick access
