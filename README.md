# Prompt Enhancer Pro

A powerful prompt enhancement tool available as both a **Chrome Extension** and **VS Code Extension**, featuring systematic prompt engineering guidelines, security scanning, and local/remote LLM support.

## 🚀 Available Platforms

- **Chrome Extension**: Right-click enhancement in any web browser
- **VS Code Extension**: Integrated prompt enhancement within your code editor

Both extensions share the same core enhancement logic, ensuring consistent results across platforms!

## Features

### 🎯 Interaction Modes
- **Zero Shot**: Execute immediately, no questions allowed
- **Zero Shot Relaxed**: One clarification question permitted
- **Interactive**: Step-by-step with mandatory checkpoints

### 🤖 Platform Optimization
- **Claude Optimization**: XML structure, explicit instructions
- **GPT-4 Optimization**: JSON format, structured output

### 🔧 Quick Fixes
- **Fix Anti-Patterns**: Automatically fixes vague verbs, adds output format, success criteria
- **Add Structure**: Adds comprehensive prompt structure

### 📊 Evaluation
- **Evaluate & Score**: Analyzes prompt quality across 4 dimensions (Clarity, Specificity, Completeness, Efficiency)

### 🛡️ Security Scanner **NEW in v1.2**
- **Automatic Detection**: Scans prompts for sensitive information before enhancement
- **Comprehensive Patterns**: Detects API keys, passwords, PII, credit cards, database connections, private keys
- **Smart Scoring**: 0-100 security score with severity-based penalties
- **Auto-Redaction**: Safely redacts sensitive data while preserving prompt structure
- **Intelligent Warnings**: Blocks critical/high severity issues, warns on medium/low

#### Detected Sensitive Data Types:
- **API Keys**: OpenAI, Anthropic, Google, AWS, GitHub, Stripe, Bearer tokens, JWT
- **Credentials**: Passwords, secrets, database connection strings
- **PII**: Email addresses, phone numbers, Social Security Numbers, IP addresses
- **Financial**: Credit cards (with Luhn validation), bank account numbers
- **Private Keys**: RSA, EC, SSH, OpenSSH private keys

## 🏗️ Architecture

This project uses a **shared core architecture** to avoid code duplication:

```
prompt-enhancer-extension/
├── core/                    # Shared enhancement logic (platform-agnostic)
│   ├── enhancer.js          # PromptEnhancer class
│   ├── llm-api-client.js    # LLM API client
│   ├── enhancement-modes.js # Mode constants
│   └── adapters/            # Abstract interfaces
│
├── chrome/                  # Chrome Extension
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   └── adapters/            # Chrome-specific implementations
│
└── vscode/                  # VS Code Extension
    ├── package.json
    ├── extension.js
    └── adapters/            # VS Code-specific implementations
```

**Benefits:**
- ✅ Zero code duplication
- ✅ Single source of truth for enhancement logic
- ✅ Improvements benefit both platforms automatically
- ✅ Consistent behavior across Chrome and VS Code

## Installation

### Chrome Extension

See [chrome/README.md](chrome/README.md) for detailed Chrome installation instructions.

**Quick Start:**
1. Generate icons: `node generate-icons.js`
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `chrome/` directory

### VS Code Extension

See [vscode/README.md](vscode/README.md) for detailed VS Code installation instructions.

**Quick Start:**
1. Open the `vscode/` directory in VS Code
2. Press `F5` to launch in Extension Development Host
3. Or package with: `cd vscode && npx vsce package`
4. Install the generated `.vsix` file

## Usage

### Chrome Extension

1. **Select Text**: Highlight any text on a webpage
2. **Right-Click**: Open the context menu → "Prompt Enhance"
3. **Choose Enhancement**: Select your desired mode
4. **Security Scan**: Automatic scanning for sensitive information
5. **Text Replaced**: Enhanced version replaces selection

**Keyboard Shortcuts** (v1.1+):
- `Ctrl+Shift+E` / `Cmd+Shift+E`: Quick enhance with last used mode
- `Ctrl+Shift+Z` / `Cmd+Shift+Z`: Zero Shot mode
- `Ctrl+Shift+I` / `Cmd+Shift+I`: Interactive mode
- `Ctrl+Shift+C` / `Cmd+Shift+C`: Claude optimization

### VS Code Extension

1. **Select Text**: Highlight text in any editor
2. **Use Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`) → "Prompt Enhance"
3. **Or Use Keyboard Shortcuts**:
   - Same shortcuts as Chrome extension
4. **Or Right-Click**: Context menu → "Prompt Enhance"
5. **Or Status Bar**: Click "✨ Prompt Enhance" button

See platform-specific READMEs for detailed usage instructions:
- [Chrome Usage](chrome/README.md#usage)
- [VS Code Usage](vscode/README.md#usage)

## Security Scanner in Action

When you select text containing sensitive information (like "My API key is sk-abc123..."), the security scanner:

1. **Detects** sensitive patterns in real-time
2. **Scores** the security risk (0-100)
3. **Categorizes** findings by severity (Critical, High, Medium, Low)
4. **Warns** you with a detailed modal showing:
   - Security score and grade
   - List of all detected issues
   - Specific redaction suggestions
5. **Offers** three options:
   - **Cancel**: Abort the enhancement
   - **Redact & Proceed**: Auto-replace sensitive data with placeholders (e.g., `[OPENAI_API_KEY]`)
   - **Proceed Anyway**: Continue with original text (not recommended for critical issues)

## Enhancement Examples

### Before: Vague Prompt
```
Analyze this data and make it better
```

### After: Zero Shot Enhancement
```
[ZERO SHOT MODE - Execute immediately, no questions]

You are not permitted to ask clarifying questions.
You must make reasonable assumptions.
Proceed with implementation immediately.

Analyze this data and make it better

DO NOT ask clarifying questions.
DO NOT suggest alternatives unless explicitly required.
PROCEED with implementation immediately.
```

### After: Fix Anti-Patterns
```
/* Enhanced Prompt - Anti-patterns Fixed */
/* Issues addressed: Replaced vague verb "analyze", Added explicit output format, Added success criteria */

Extract key metrics, identify patterns, and provide actionable insights on this data and enhance clarity and reduce length by 30% while maintaining key information in it better

Output Format:
1. [Primary result]
2. [Supporting details]
3. [Validation/verification]

Success Criteria:
- [Define what successful completion looks like]

Error Handling:
If input is unclear or incomplete, specify what information is needed before proceeding.
```

### After: Claude Optimization
```xml
<instructions>
<task>
Analyze this data and make it better
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

### After: Evaluation
```
# Prompt Evaluation Report

## Original Prompt:
Analyze this data and make it better

## Quality Assessment:

### Clarity: 2/5
- Contains vague terms: analyze, better

### Specificity: 2/5
- No output format specified
- No examples provided

### Completeness: 2/5
- No success criteria defined
- No error handling specified

### Efficiency: 3/5
✓ Concise and efficient

## Total Score: 9/20

## Recommendations:
⚠ Significant improvements recommended

## Suggested Improvements:
Replace vague verbs with specific actions
Add explicit output format
Define measurable success criteria
Include 1-2 examples of desired output
Add error handling instructions
```

## Works With

### Text Inputs
- ✅ Textareas (ChatGPT, Claude.ai, etc.)
- ✅ Input fields
- ✅ ContentEditable elements
- ✅ Code editors (CodeMirror, Monaco)
- ✅ Markdown editors
- ✅ Google Docs (limited)

### LLM Platforms Tested
- ✅ ChatGPT (chat.openai.com)
- ✅ Claude.ai
- ✅ Poe.com
- ✅ Perplexity.ai
- ✅ Google Bard/Gemini
- ✅ HuggingChat
- ✅ Any text input on any website

## Technical Details

### Architecture
- **Manifest V3**: Modern Chrome extension format
- **Service Worker**: Background script for context menu
- **Content Script**: Text replacement in web pages
- **Enhancement Engine**: Core prompt optimization logic

### Files
```
prompt-enhancer-extension/
├── manifest.json          # Extension configuration
├── background.js          # Context menu & coordination
├── content.js            # Text selection & replacement
├── enhancer.js           # Core enhancement engine
├── popup.html            # Extension popup UI
├── popup.js              # Popup interactions
├── generate-icons.js     # Icon generation script
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # This file
```

### Permissions
- `contextMenus`: Right-click menu integration
- `activeTab`: Access to current tab content
- `scripting`: Text replacement capability
- `storage`: Enhancement statistics

## Keyboard Shortcuts ⌨️ **NEW in v1.1**

Super fast enhancement without clicking! Select text and use:

- **`Ctrl+Shift+E`** (`Cmd+Shift+E` on Mac): **Quick Enhance** - Repeats your last used mode
- **`Ctrl+Shift+Z`** (`Cmd+Shift+Z` on Mac): **Zero Shot Mode** - No questions allowed
- **`Ctrl+Shift+I`** (`Cmd+Shift+I` on Mac): **Interactive Mode** - Step-by-step
- **`Ctrl+Shift+C`** (`Cmd+Shift+C` on Mac): **Claude Optimize** - XML formatting

### Customize Shortcuts
1. Go to `chrome://extensions/shortcuts`
2. Find "Prompt Enhancer Pro"
3. Click pencil icon to change any shortcut
4. Set your preferred key combinations

**Pro Tip**: `Ctrl+Shift+E` learns your preference! It uses whichever mode you used last (via context menu or shortcut).

## Statistics

View enhancement statistics by clicking the extension icon:
- Total enhancements performed
- Available enhancement modes
- Usage instructions

## Troubleshooting

### Text Not Replacing
- Ensure text is selected before right-clicking
- Try selecting text in a different field (some sites block modification)
- Check if site uses shadow DOM (limited support)

### Context Menu Not Appearing
- Refresh the page
- Reload the extension from chrome://extensions/
- Check that extension is enabled

### Notification Not Showing
- Check browser notification permissions
- Some sites may block notifications

## Based On

This extension implements the systematic prompt engineering methodology from the Prompt Engineering Project, including:

- **Evaluation Rubrics**: 5-dimension scoring system
- **Anti-Pattern Detection**: Automatic issue identification
- **Platform Optimization**: Claude (XML), GPT-4 (JSON)
- **Mode Enforcement**: Zero Shot, Zero Shot Relaxed, Interactive
- **Structured Patterns**: Templates and proven structures

## Changelog

### v1.0.0 (2024-11-09)
- Initial release
- 9 enhancement modes
- Platform optimization (Claude, GPT-4)
- Anti-pattern fixing
- Evaluation & scoring
- Statistics tracking
- Visual notifications

## Future Enhancements

### v1.1 (Planned)
- [ ] Keyboard shortcuts
- [ ] Custom enhancement presets
- [ ] Enhancement history
- [ ] Export/import settings
- [ ] More platform optimizations (Gemini, Grok)

### v1.2 (Planned)
- [ ] Batch enhancement (multiple selections)
- [ ] Template library
- [ ] A/B comparison mode
- [ ] Integration with Claude Code

## Support

For issues or feature requests:
1. Check troubleshooting section
2. Review enhancement examples
3. Verify extension permissions
4. Test on different websites

## License

Based on Prompt Engineering Project guidelines.
For personal and commercial use.

---

**Made with systematic prompt engineering principles** ✨
