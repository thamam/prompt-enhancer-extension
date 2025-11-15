# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **dual-platform prompt enhancement tool** available as both a **Chrome Extension** (Manifest V3) and a **VS Code Extension**. It uses a **shared core architecture** to avoid code duplication, ensuring improvements to enhancement logic benefit both platforms automatically.

Key features: systematic prompt engineering principles, security scanning, local/remote LLM support, and multiple enhancement modes.

## Architecture (IMPORTANT - Shared Core Design)

### Directory Structure

```
prompt-enhancer-extension/
├── core/                          # 🔥 SHARED enhancement logic (platform-agnostic)
│   ├── enhancer.js                # PromptEnhancer class
│   ├── llm-api-client.js          # LLM API client
│   ├── enhancement-modes.js       # Mode constants & display names
│   ├── security-scanner.js        # Security scanning
│   └── adapters/                  # Abstract adapter interfaces
│       ├── storage-adapter.js     # Abstract storage interface
│       └── notification-adapter.js # Abstract UI notifications
│
├── chrome/                        # Chrome Extension specific
│   ├── manifest.json
│   ├── background.js              # Service worker, context menus
│   ├── content.js                 # DOM manipulation, text replacement
│   ├── popup.html/js              # Extension popup UI
│   ├── adapters/
│   │   ├── chrome-storage.js      # Implements StorageAdapter for Chrome
│   │   └── chrome-notifications.js # Implements NotificationAdapter for Chrome
│   └── icons/
│
├── vscode/                        # VS Code Extension specific
│   ├── package.json               # VS Code extension manifest
│   ├── extension.js               # Main entry point, command registration
│   ├── adapters/
│   │   ├── vscode-storage.js      # Implements StorageAdapter for VS Code
│   │   └── vscode-notifications.js # Implements NotificationAdapter for VS Code
│   └── icon.png
│
└── [legacy files at root]         # For backward compatibility
```

### Core Components (Platform-Agnostic)

**PromptEnhancer** (`core/enhancer.js`): Central enhancement engine
- Mode enforcement: `enforceZeroShot()`, `enforceZeroShotRelaxed()`, `enforceInteractive()`
- Platform optimization: `optimizeForClaude()`, `optimizeForGPT4()`
- Quality improvements: `fixAntiPatterns()`, `addStructure()`
- Analysis: `analyzePrompt()`, `evaluatePrompt()`
- LLM enhancement: `enhanceWithLocalLLM()` - Async enhancement using local/remote LLM
- Entry point: `enhance(mode, prompt)` - Routes to appropriate enhancement method
- **Dependency injection**: Accepts LLMApiClient via constructor

**LLMApiClient** (`core/llm-api-client.js`): Client for local and remote LLM communication
- **Local LLMs**: Ollama, LM Studio, LocalAI
- **Remote APIs**: OpenAI, Anthropic (Claude), Google (Gemini), OpenRouter
- Connection testing and validation
- **Dependency injection**: Accepts StorageAdapter via constructor
- Platform-agnostic fetch with timeout handling

**Enhancement Modes** (`core/enhancement-modes.js`): Shared constants
- `ENHANCEMENT_MODES`: Mode identifiers (zero_shot, interactive, etc.)
- `MODE_DISPLAY_NAMES`: Human-readable names with emojis
- Exported for both Node.js (VS Code) and browser (Chrome) environments

### Adapter Pattern (Critical for Platform Abstraction)

**Storage Adapter** (`core/adapters/storage-adapter.js`): Abstract interface for persistence
- Methods: `get()`, `getMultiple()`, `set()`, `setMultiple()`
- Chrome implementation: Uses `chrome.storage.local` API
- VS Code implementation: Uses `vscode.workspace.getConfiguration()` API

**Notification Adapter** (`core/adapters/notification-adapter.js`): Abstract interface for UI notifications
- Methods: `showSuccess()`, `showError()`, `showInfo()`, `showWarning()`
- Chrome implementation: Creates DOM elements with styled notifications
- VS Code implementation: Uses `vscode.window.showInformationMessage()` API

### Platform-Specific Implementations

**Chrome Extension**:
- **Message Flow**:
  1. User right-clicks selected text → `background.js` creates context menu
  2. Menu selection triggers → `background.js` sends message to content script
  3. `content.js` receives message → instantiates core classes with Chrome adapters
  4. Enhanced text → `content.js` replaces selection in DOM
  5. Visual notification → confirms enhancement

- **DOM Replacement Strategy** (`chrome/content.js`):
  - Maintains `currentSelection` and `currentRange` on mouseup
  - `replaceSelectedText()` handles multiple element types:
    - Textareas/inputs: Direct value replacement
    - ContentEditable: Range-based text node manipulation
    - Fallback: Clipboard-based replacement

**VS Code Extension**:
- **Command Registration** (`vscode/extension.js`):
  1. Extension activates → registers 11 commands
  2. Commands registered with VS Code API
  3. Keyboard shortcuts and context menu integration
  4. Status bar item for quick access

- **Text Replacement**:
  - Uses `editor.edit()` API to replace selected text
  - Atomic replacements ensure undo/redo works correctly
  - Progress indicator for async LLM operations

### Enhancement Modes (10 total)

Defined in `ENHANCEMENT_MODES` constant (background.js:3-14):
- `ZERO_SHOT`: No questions allowed, immediate execution
- `ZERO_SHOT_RELAXED`: One clarification question permitted
- `INTERACTIVE`: Step-by-step with mandatory checkpoints
- `CLAUDE_OPTIMIZE`: XML-structured format for Claude
- `GPT4_OPTIMIZE`: JSON-structured format for GPT-4
- `FIX_ANTIPATTERNS`: Detects and fixes vague verbs, missing output formats, success criteria
- `ADD_STRUCTURE`: Adds comprehensive prompt structure
- `PLATFORM_CONVERT`: Platform-specific formatting (future use)
- `EVALUATE_SCORE`: 4-dimension quality scoring (Clarity, Specificity, Completeness, Efficiency)
- `LOCAL_LLM`: AI-powered enhancement using local LLM (Ollama, LM Studio, etc.)

## Keyboard Shortcuts (v1.1.0+)

### Available Shortcuts
- `Ctrl+Shift+E` (Mac: `Cmd+Shift+E`): Quick enhance with last used mode
- `Ctrl+Shift+Z` (Mac: `Cmd+Shift+Z`): Zero Shot mode
- `Ctrl+Shift+I` (Mac: `Cmd+Shift+I`): Interactive mode
- `Ctrl+Shift+C` (Mac: `Cmd+Shift+C`): Claude optimization

### Implementation Details
- **Manifest**: Commands defined in `manifest.json:35-64`
- **Background Handler**: `chrome.commands.onCommand` listener in `background.js:138-202`
- **Selection Detection**: Uses `chrome.scripting.executeScript` to get `window.getSelection()`
- **Last Used Mode**: Stored in `chrome.storage.local.lastUsedMode`
- **Error Handling**: Shows notification if no text selected

### How It Works
1. User presses shortcut (e.g., `Ctrl+Shift+E`)
2. Background script gets active tab
3. Executes script to read selected text via `window.getSelection()`
4. If no selection: shows red warning notification
5. If selection exists: retrieves appropriate mode (or last used for quick enhance)
6. Calls `enhanceText()` helper function
7. Content script enhances and replaces text

### Customization
Users can customize shortcuts at `chrome://extensions/shortcuts`

## Development Commands

### Chrome Extension

```bash
# Generate icons (one-time setup)
node generate-icons.js

# Load extension for development
# 1. Navigate to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the chrome/ directory

# After modifying code:
# 1. Go to chrome://extensions/
# 2. Click reload icon on "Prompt Enhancer Pro"
# 3. Refresh any open tabs

# Package for distribution
cd chrome
zip -r prompt-enhancer-pro-chrome.zip . -x "*.git*"
```

### VS Code Extension

```bash
cd vscode

# Install dependencies (optional, for development)
npm install

# Run extension in development mode
# Press F5 in VS Code (opens Extension Development Host)

# Package extension
npx vsce package

# Install packaged extension
# Extensions view → "..." menu → "Install from VSIX..."
```

## Code Patterns (CRITICAL - Shared Core Approach)

### Adding New Enhancement Mode (Benefits BOTH Platforms)

**This is the recommended approach - changes automatically benefit both Chrome and VS Code:**

1. **Add mode constant** to `core/enhancement-modes.js`:
   ```javascript
   ENHANCEMENT_MODES.MY_NEW_MODE = 'my_new_mode';
   MODE_DISPLAY_NAMES['my_new_mode'] = '✨ My New Mode';
   ```

2. **Create enhancement method** in `core/enhancer.js`:
   ```javascript
   myNewMode(prompt) {
     // Enhancement logic here
     return enhancedPrompt;
   }
   ```

3. **Add case** to `enhance()` switch statement in `core/enhancer.js`:
   ```javascript
   case 'my_new_mode':
     return this.myNewMode(text);
   ```

4. **Add platform-specific UI**:
   - Chrome: Add context menu item in `chrome/background.js`
   - VS Code: Add command in `vscode/package.json` and register in `vscode/extension.js`

5. **Test on BOTH platforms** to ensure consistency

### Modifying Core Logic (Benefits BOTH Platforms)

**Always modify `core/` files, never duplicate logic in platform-specific files!**

- Edit `core/enhancer.js` for enhancement algorithm changes
- Edit `core/llm-api-client.js` for LLM client changes
- Edit `core/enhancement-modes.js` for mode definitions

### Adding Platform-Specific Features

**Only when feature is truly platform-specific (e.g., Chrome-only security modal):**

- Chrome: Modify `chrome/content.js`, `chrome/background.js`, or `chrome/popup.js`
- VS Code: Modify `vscode/extension.js`

### Adapter Pattern Usage

When core code needs storage or notifications:

```javascript
// In core/ code - use adapter methods
await storageAdapter.get('key', defaultValue);
await notificationAdapter.showSuccess('Message');

// In platform code - instantiate correct adapter
const storageAdapter = new ChromeStorageAdapter(); // or VSCodeStorageAdapter
const notificationAdapter = new ChromeNotificationAdapter(); // or VSCodeNotificationAdapter

// Inject into core classes
const llmClient = new LLMApiClient(storageAdapter);
const enhancer = new PromptEnhancer(llmClient);
```

## Manifest V3 Considerations

- Background script runs as **service worker** (not persistent)
- Content scripts injected via `content_scripts` in manifest
- No inline JavaScript in HTML files
- Uses `chrome.scripting` for dynamic content injection
- All frames supported (`all_frames: true`)

## Browser Compatibility

- Works on all URLs (`<all_urls>` permission)
- Tested platforms: ChatGPT, Claude.ai, Poe, Perplexity, Bard/Gemini, HuggingChat
- Supports: textareas, inputs, contentEditable, CodeMirror, Monaco editors

## LLM Configuration (v1.3.0+, Remote APIs v1.4.0+)

### Supported LLM Providers

#### Local LLMs (No API key required)
- **Ollama**: Default endpoint `http://localhost:11434`
  - Models: llama2, mistral, codellama, etc.
- **LM Studio**: OpenAI-compatible, typically `http://localhost:1234`
  - Any model supported by LM Studio
- **LocalAI**: OpenAI-compatible
  - Custom local models

#### Remote APIs (API key required)
- **OpenAI**: `https://api.openai.com`
  - Models: gpt-4, gpt-4-turbo, gpt-3.5-turbo
  - API key format: `sk-...`
- **Anthropic (Claude)**: `https://api.anthropic.com`
  - Models: claude-3-opus-20240229, claude-3-sonnet-20240229, claude-3-haiku-20240307
  - API key format: `sk-ant-...`
- **Google (Gemini)**: `https://generativelanguage.googleapis.com`
  - Models: gemini-pro, gemini-1.5-pro, gemini-1.5-flash
  - Uses Google AI API key
- **OpenRouter**: `https://openrouter.ai`
  - Models: openai/gpt-4, anthropic/claude-3-opus, google/gemini-pro, and more
  - Unified access to multiple providers

### Configuration Steps

#### For Local LLMs:
1. Click extension icon to open popup
2. Enable "Enable LLM Enhancement" checkbox
3. Select Provider: "Local (Ollama, LM Studio)"
4. Select Local API Type (Ollama or OpenAI-compatible)
5. Enter endpoint URL (e.g., `http://localhost:11434`)
6. Enter model name (e.g., `llama2`, `mistral`)
7. Click "Test Connection" to verify
8. Click "Save Settings"

#### For Remote APIs:
1. Click extension icon to open popup
2. Enable "Enable LLM Enhancement" checkbox
3. Select Provider (OpenAI, Anthropic, Google, or OpenRouter)
4. Enter your API key (kept secure in browser storage)
5. Enter model name (see examples in UI)
6. Click "Test Connection" to verify
7. Click "Save Settings"

### Using LLM Enhancement
1. Select text on any webpage
2. Right-click → "Prompt Enhance" → "🤖 Enhance with LLM"
3. Wait for LLM to process (loading notification appears)
4. Enhanced text replaces selection

### Implementation Details
- **Async Enhancement**: `enhanceWithLocalLLM()` returns a Promise (works for both local and remote)
- **Connection Testing**: Verifies endpoint/API key before enhancement
- **Error Handling**: Clear error messages for connection/auth failures
- **Settings Storage**: Uses `chrome.storage.local` for persistence
- **API Key Security**: Stored locally in browser extension storage (not transmitted elsewhere)
- **Host Permissions**:
  - Local: `http://localhost/*` and `http://127.0.0.1/*`
  - Remote: `https://api.openai.com/*`, `https://api.anthropic.com/*`, `https://generativelanguage.googleapis.com/*`, `https://openrouter.ai/*`

### System Prompt
Default system prompt instructs the LLM to:
- Make prompts more specific and actionable
- Add clear output format specifications
- Include success criteria and constraints
- Remove vague language
- Add structure and organization
- Maintain original intent while improving clarity

## Common Issues

**Text not replacing**: Some sites use shadow DOM or block modifications. The extension attempts multiple replacement strategies but may fail on heavily restricted sites.

**Context menu not appearing**: Extension must be reloaded after code changes. Content scripts only inject on page load.

**Notification positioning**: Uses fixed positioning (top-right). Some sites with z-index conflicts may hide notifications.

**Local LLM connection fails**: Ensure the LLM server is running and accessible at the configured endpoint. Check firewall settings and CORS if needed.

**Remote API authentication fails**:
- Verify your API key is correct and has not expired
- OpenAI keys start with `sk-`
- Anthropic keys start with `sk-ant-`
- Check that you have sufficient credits/quota with the provider
- Ensure your API key has the necessary permissions

**API rate limits**: Remote providers may have rate limits. If you receive rate limit errors, wait a few moments before trying again or consider upgrading your API plan.
