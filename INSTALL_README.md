# Installation Instructions

## Quick Install

Run the installation script:

```bash
cd ~/tools/prompt-enhancer-extension
./install.sh
```

This will:
1. Prompt you for installation directory (default: `~/Applications/prompt-enhancer-extension`)
2. Copy all necessary extension files
3. Display instructions for loading the extension in Chrome

## Custom Installation Directory

You can specify a custom directory:

```bash
./install.sh /path/to/custom/directory
```

Or:

```bash
./install.sh ~/my-chrome-extensions/prompt-enhancer
```

## After Installation

### Chrome Extension

1. Open Chrome and go to: `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Navigate to the installation directory and select the `chrome/` subdirectory
5. Extension is now loaded!

### VS Code Extension

1. Open the `vscode/` directory in VS Code
2. Press `F5` to launch in Extension Development Host
3. Or package with: `cd vscode && npx vsce package`
4. Install the generated `.vsix` file via Extensions view → "..." menu → "Install from VSIX..."

## Updating the Extension

To update after making changes:

1. Make your changes in `~/tools/prompt-enhancer-extension/`
2. Run `./install.sh` again (it will overwrite existing files)
3. Go to `chrome://extensions/`
4. Click the reload button (🔄) on the "Prompt Enhancer Pro" card

## Files Installed

The install script copies:
- `manifest.json` - Extension configuration
- `background.js` - Service worker (context menus)
- `content.js` - Main content script
- `enhancer.js` - Prompt enhancement engine
- `security-scanner.js` - Security scanning module
- `popup.html` - Extension popup interface
- `popup.js` - Popup logic
- `icons/` - Extension icons
- Documentation files (README.md, etc.)

## Configuring LLM Enhancement (Optional but Recommended)

Both Chrome and VS Code extensions support AI-powered prompt enhancement using:
- **Local LLMs**: Ollama, LM Studio, LocalAI (free, private, offline)
- **Remote APIs**: OpenAI, Anthropic/Claude, Google/Gemini, OpenRouter (requires API key)

### Chrome Extension Setup

1. Click the extension icon in Chrome toolbar
2. Enable "Enable LLM Enhancement"
3. Select provider and configure:
   - **Local**: No API key needed - just endpoint URL and model name
   - **Remote**: Enter your API key (e.g., `sk-...` for OpenAI, `sk-ant-...` for Claude)
4. Click "Test Connection" to verify
5. Click "Save Settings"

### VS Code Extension Setup

1. Open Settings: File → Preferences → Settings
2. Search for "Prompt Enhancer"
3. Configure:
   - `promptEnhancer.llm.enabled`: true
   - `promptEnhancer.llm.provider`: "local", "openai", "anthropic", "google", or "openrouter"
   - `promptEnhancer.llm.apiKey`: Your API key (for remote providers)
   - `promptEnhancer.llm.model`: Model name (e.g., "gpt-4", "claude-3-opus-20240229")

**See INSTALL.md for detailed LLM configuration examples and model names.**

## Troubleshooting

If the extension doesn't load:
- Check the installation directory path is correct
- Ensure all files were copied successfully
- For Chrome: Make sure to select the `chrome/` subdirectory, not the root
- For VS Code: Open the `vscode/` subdirectory

If LLM enhancement isn't working:
- Local: Ensure your LLM server (Ollama, LM Studio) is running
- Remote: Verify your API key is valid and has credits/quota
- Click "Test Connection" in Chrome popup to diagnose issues
- See `INSTALL.md` for detailed LLM troubleshooting

## Development Workflow

1. Edit files in `~/tools/prompt-enhancer-extension/`
2. Run `./install.sh` to copy to installation directory
3. Reload extension in Chrome (`chrome://extensions/` → 🔄)
4. Test changes
5. Commit to git when ready

```bash
cd ~/tools/prompt-enhancer-extension
git add .
git commit -m "Your commit message"
```
