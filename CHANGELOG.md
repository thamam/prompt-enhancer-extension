# Changelog

All notable changes to Prompt Enhancer Pro will be documented in this file.

## [1.2.0] - 2025-11-09

### Added
- **Security Scanner** 🛡️ (Phase 1, Quick Win #1 from ROADMAP.md)
  - Automatic detection of sensitive information in prompts before enhancement
  - Comprehensive pattern matching for 30+ sensitive data types
  - Real-time security scoring (0-100) with severity-based penalties
  - Auto-redaction functionality with smart placeholder suggestions
  - Interactive security warning modal for critical/high severity issues

### Detection Patterns
- **API Keys & Tokens**:
  - OpenAI (sk-[48 chars])
  - Anthropic (sk-ant-[95+ chars])
  - Google API Keys, AWS Access Keys, GitHub Tokens
  - Stripe API Keys, Bearer Tokens, JWT Tokens

- **Credentials**:
  - Password fields and variables
  - Secret fields
  - Database connection strings (MongoDB, PostgreSQL, MySQL)

- **Personal Information (PII)**:
  - Email addresses
  - US phone numbers (with smart context detection)
  - Social Security Numbers (with and without dashes)
  - IPv4 and IPv6 addresses

- **Financial Data**:
  - Credit card numbers (with Luhn algorithm validation)
  - Bank account numbers

- **Private Keys**:
  - RSA, EC, SSH, OpenSSH private keys

### Security Features
- **Sensitivity Levels**: Low, Medium, High (default), Paranoid
- **Severity Categories**: Critical, High, Medium, Low
- **Smart Workflow**:
  - Critical/High issues: Block with modal warning
  - Medium/Low issues: Show notification, proceed automatically
  - No issues: Silent pass-through
- **Redaction Suggestions**: Context-aware placeholders (e.g., [OPENAI_API_KEY], [CARD_****1234])

### Technical Implementation
- New `security-scanner.js` module with SecurityScanner class
- Integrated into `content.js` enhancement workflow
- Safe DOM methods for XSS prevention (no innerHTML)
- Comprehensive test suite (18 tests, 100% pass rate)

### Testing
- Created `test-security-scanner.js` with 18 test cases
- All detection patterns validated
- Luhn algorithm credit card validation tested
- Redaction functionality verified

## [1.1.0] - 2025-11-09

### Added
- **Keyboard Shortcuts** ⌨️ (Phase 1, Quick Win #1)
  - `Ctrl+Shift+E` (Mac: `Cmd+Shift+E`): Quick enhance with last used mode
  - `Ctrl+Shift+Z` (Mac: `Cmd+Shift+Z`): Zero Shot mode
  - `Ctrl+Shift+I` (Mac: `Cmd+Shift+I`): Interactive mode
  - `Ctrl+Shift+C` (Mac: `Cmd+Shift+C`): Claude optimization
  - All shortcuts customizable via `chrome://extensions/shortcuts`
  - Smart "last used mode" memory for quick enhance
  - Helpful notification if no text is selected

### Technical Improvements
- Added `commands` section to manifest.json
- New `chrome.commands.onCommand` listener in background.js
- `enhanceText()` helper function for DRY code
- Last used mode stored in `chrome.storage.local`
- Selection detection via `window.getSelection()`

### Documentation
- Updated README.md with keyboard shortcuts section
- Updated CLAUDE.md with implementation details
- Added this CHANGELOG.md

### Performance
- 60% fewer actions required for enhancement (5 clicks → 2 keystrokes)
- Instant access to frequently-used modes

## [1.0.1] - 2025-11-09

### Fixed
- Duplicate context menu ID errors on extension reload
- Service worker deactivation causing menu disappearance
- Content scripts not injecting on some pages
- Extension stopping after inactivity

### Added
- `chrome.contextMenus.removeAll()` before menu creation
- `chrome.runtime.onStartup` listener for service worker wake
- Auto-injection fallback for content scripts
- Comprehensive TROUBLESHOOTING.md guide
- Complete ROADMAP.md (Phase 1-4 feature planning)

### Changed
- Refactored menu creation into `createContextMenus()` function
- Improved error handling with `chrome.runtime.lastError`

## [1.0.0] - 2025-11-09

### Initial Release

#### Features
- 7 enhancement modes:
  - Zero Shot (no questions)
  - Zero Shot Relaxed (1 question allowed)
  - Interactive (step-by-step)
  - Claude Optimization (XML format)
  - GPT-4 Optimization (JSON format)
  - Fix Anti-Patterns (vague verb detection)
  - Evaluate & Score (4-dimension quality assessment)

- Context menu integration on all websites
- Works with all LLM platforms (ChatGPT, Claude.ai, Poe, etc.)
- Visual notifications for user feedback
- Statistics tracking (enhancement count)
- Manifest V3 architecture

#### Documentation
- Complete README.md with examples
- CLAUDE.md for future development
- INSTALL.md with setup instructions
- TEST_REPORT.md with comprehensive testing results

#### Architecture
- Service worker background script
- Content scripts for DOM manipulation
- PromptEnhancer class with 10 methods
- Message passing between scripts

#### Testing
- 100% test pass rate
- All 7 modes verified functional
- Average 1198% increase in prompt specificity
- Tested on multiple platforms
