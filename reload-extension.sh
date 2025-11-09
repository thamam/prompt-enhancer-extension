#!/bin/bash

echo "🔧 Prompt Enhancer Pro - Extension Reload Helper"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: manifest.json not found. Please run this from the extension directory."
    exit 1
fi

# Validate all JavaScript files
echo "📋 Validating JavaScript files..."
for file in security-scanner.js enhancer.js content.js background.js popup.js; do
    if node --check "$file" 2>/dev/null; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file - SYNTAX ERROR!"
        exit 1
    fi
done

echo ""
echo "✅ All JavaScript files are valid!"
echo ""
echo "📌 NEXT STEPS TO RELOAD THE EXTENSION:"
echo ""
echo "1. Open Chrome and go to: chrome://extensions/"
echo "   - Or click here if running: "
echo "     google-chrome chrome://extensions/"
echo ""
echo "2. Find 'Prompt Enhancer Pro' (version 1.2.0)"
echo ""
echo "3. Click the circular 'Reload' button (🔄)"
echo ""
echo "4. Check for any error messages (in red)"
echo ""
echo "5. Open the test page:"
echo "   file://$(pwd)/test-page.html"
echo ""
echo "6. Or test on any website:"
echo "   - Refresh the page (F5)"
echo "   - Select some text"
echo "   - Right-click → look for 'Prompt Enhance →'"
echo ""
echo "🧪 Test with security scanner:"
echo "   Select this text and right-click:"
echo "   'My API key is sk-1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh1234'"
echo ""
echo "   Expected: Security warning modal should appear!"
echo ""

# Try to open Chrome if requested
if [ "$1" == "--open" ]; then
    echo "🌐 Opening Chrome..."
    google-chrome "chrome://extensions/" &
    sleep 2
    google-chrome "file://$(pwd)/test-page.html" &
    echo ""
    echo "✓ Chrome opened with extensions page and test page"
fi

echo "================================================"
