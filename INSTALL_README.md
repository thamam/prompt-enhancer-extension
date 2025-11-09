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

1. Open Chrome and go to: `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Navigate to the installation directory
5. Select the directory
6. Extension is now loaded!

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

## Troubleshooting

If the extension doesn't load:
- Check the installation directory path is correct
- Ensure all files were copied successfully
- See `TROUBLESHOOTING.md` for common issues

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
