# Quick Start & Troubleshooting Guide

## Initial Setup

### 1. Reload the Extension

After making changes, always reload:

1. Open `chrome://extensions/`
2. Find "Prompt Enhancer Pro"
3. Click the **Reload** button (circular arrow icon)
4. Check for any errors in red text

### 2. Refresh Your Webpage

After reloading the extension:
1. Go to the tab where you want to use it (e.g., ChatGPT, Claude.ai)
2. Press `F5` or `Ctrl+R` to refresh the page
3. This ensures content scripts are injected

### 3. Test the Context Menu

1. **Select some text** on the page (any text)
2. **Right-click** on the selection
3. You should see **"Prompt Enhance →"** in the context menu
4. Hover to see submenu with enhancement options

## Keyboard Shortcuts (Custom Configuration Needed)

⚠️ **Default shortcuts conflict with browser shortcuts!**

### Current Conflicts:
- `Ctrl+Shift+I` = Browser DevTools (conflicts with Interactive mode)
- `Ctrl+Shift+C` = Browser Inspect Element (conflicts with Claude mode)
- `Ctrl+Shift+E` = May conflict with other extensions
- `Ctrl+Shift+Z` = May conflict with other extensions

### How to Change Shortcuts:

1. Go to `chrome://extensions/shortcuts`
2. Find "Prompt Enhancer Pro"
3. Click the pencil icon next to each command
4. Set new shortcuts that don't conflict, for example:
   - **Quick Enhance**: `Alt+Shift+E`
   - **Zero Shot**: `Alt+Shift+Z`
   - **Interactive**: `Alt+Shift+I`
   - **Claude Optimize**: `Alt+Shift+C`

## Troubleshooting

### Context Menu Not Appearing

**Check 1: Is the extension loaded?**
```bash
1. Open chrome://extensions/
2. Verify "Prompt Enhancer Pro" is enabled (toggle is blue)
3. Check for error messages in red
```

**Check 2: Are content scripts injected?**
```bash
1. Open DevTools (F12) on your page
2. Go to Console tab
3. You should see: "Prompt Enhancer Pro: Content script loaded"
4. If not, refresh the page (F5)
```

**Check 3: Service worker errors?**
```bash
1. Go to chrome://extensions/
2. Find "Prompt Enhancer Pro"
3. Click "service worker" link (if visible)
4. Check console for errors
```

### Extension Stopped Working After Some Time

This is the service worker lifecycle issue. **Solution:**

1. Go to `chrome://extensions/`
2. Click **Reload** on the extension
3. Refresh your webpage
4. Try again

### Security Scanner Not Showing

The security scanner only triggers when:
- You select text containing **critical or high severity** issues (API keys, passwords, SSN, etc.)
- For medium/low issues, you'll just see a warning notification

**Test it:**
1. Select this text: `My API key is sk-1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh1234`
2. Right-click → Prompt Enhance → any option
3. You should see a security warning modal

### Still Not Working?

**Full Reset:**
```bash
1. Go to chrome://extensions/
2. Remove "Prompt Enhancer Pro" completely
3. Close all Chrome windows
4. Reopen Chrome
5. Go to chrome://extensions/
6. Enable "Developer mode" (top right)
7. Click "Load unpacked"
8. Select the prompt-enhancer-extension folder
9. Refresh your webpage
10. Test context menu
```

## Testing the Extension

### Quick Test on a Simple Page

1. Open a new tab
2. Go to `https://www.google.com`
3. Type some text in the search box
4. Select the text
5. Right-click → Should see "Prompt Enhance →"

### Test Security Scanner

1. Go to any text input (ChatGPT, Claude.ai, etc.)
2. Type or paste: `My OpenAI key is sk-1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh1234`
3. Select all the text
4. Right-click → Prompt Enhance → Zero Shot
5. **Expected**: Security warning modal should appear showing:
   - Security Score: 70/100
   - 1 Critical issue detected (OpenAI API Key)
   - Options: Cancel, Redact & Proceed, Proceed Anyway

### Test Enhancement (No Security Issues)

1. Type: `analyze this data`
2. Select the text
3. Right-click → Prompt Enhance → Zero Shot
4. **Expected**: Text is immediately replaced with enhanced version
5. Green notification appears: "✓ Prompt enhanced with Zero Shot Mode"

## Common Issues

### "No text selection found" Error

- Make sure text is **actually selected** (highlighted in blue)
- Try selecting again before right-clicking
- Some websites block text selection (try a different site)

### Context Menu Appears But Nothing Happens

- Check browser console (F12 → Console tab) for errors
- Reload the extension
- Refresh the webpage
- Try a different website

### Modal/Notification Not Appearing

- Check if website has CSP (Content Security Policy) that blocks it
- Try on a simpler website like google.com
- Check browser console for errors

## Best Practices

1. **Always reload extension** after code changes
2. **Always refresh webpage** after reloading extension
3. **Test on simple pages first** (google.com) before complex apps
4. **Check DevTools console** for errors
5. **Use custom keyboard shortcuts** (avoid browser defaults)

## Support

If issues persist:
1. Check the extension's service worker console for errors
2. Check the webpage's console for errors
3. Try disabling other extensions temporarily
4. Test in Incognito mode (make sure extension is enabled in Incognito)
