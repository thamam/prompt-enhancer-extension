#!/bin/bash

# Prompt Enhancer Pro - Installation Script
# Installs the Chrome extension to a specified directory

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "============================================"
echo "  Prompt Enhancer Pro - Installation"
echo "============================================"
echo ""

# Default installation directory
DEFAULT_INSTALL_DIR="$HOME/Applications/prompt-enhancer-extension"

# Check if custom directory provided as argument
if [ -n "$1" ]; then
    INSTALL_DIR="$1"
else
    echo -e "${BLUE}Default installation directory: ${NC}${DEFAULT_INSTALL_DIR}"
    echo ""
    read -p "Press Enter to use default, or type a different path: " USER_INPUT

    if [ -n "$USER_INPUT" ]; then
        INSTALL_DIR="$USER_INPUT"
    else
        INSTALL_DIR="$DEFAULT_INSTALL_DIR"
    fi
fi

# Expand ~ to actual home directory
INSTALL_DIR="${INSTALL_DIR/#\~/$HOME}"

echo ""
echo -e "${BLUE}Installing to:${NC} $INSTALL_DIR"
echo ""

# Create installation directory if it doesn't exist
if [ ! -d "$INSTALL_DIR" ]; then
    echo -e "${YELLOW}Creating directory:${NC} $INSTALL_DIR"
    mkdir -p "$INSTALL_DIR"
fi

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# List of files to copy (excluding install script, git, and test files)
FILES_TO_COPY=(
    "manifest.json"
    "background.js"
    "content.js"
    "enhancer.js"
    "security-scanner.js"
    "popup.html"
    "popup.js"
    "icons"
    "README.md"
    "INSTALL.md"
    "CHANGELOG.md"
    "TROUBLESHOOTING.md"
)

# Copy files
echo -e "${YELLOW}Copying extension files...${NC}"
for item in "${FILES_TO_COPY[@]}"; do
    if [ -e "$SCRIPT_DIR/$item" ]; then
        cp -r "$SCRIPT_DIR/$item" "$INSTALL_DIR/"
        echo "  ✓ $item"
    else
        echo -e "  ${RED}⚠ Warning: $item not found${NC}"
    fi
done

echo ""
echo -e "${GREEN}✓ Installation complete!${NC}"
echo ""
echo "============================================"
echo "  Next Steps - Load Extension in Chrome"
echo "============================================"
echo ""
echo -e "${BLUE}1.${NC} Open Chrome and navigate to:"
echo "   chrome://extensions/"
echo ""
echo -e "${BLUE}2.${NC} Enable 'Developer mode' (toggle in top-right corner)"
echo ""
echo -e "${BLUE}3.${NC} Click 'Load unpacked' button"
echo ""
echo -e "${BLUE}4.${NC} Navigate to and select this directory:"
echo "   ${GREEN}${INSTALL_DIR}${NC}"
echo ""
echo -e "${BLUE}5.${NC} The extension should now appear in your extensions list"
echo ""
echo "============================================"
echo "  Usage"
echo "============================================"
echo ""
echo "• Select any text on a web page"
echo "• Right-click to see 'Prompt Enhance →' menu"
echo "• Choose enhancement mode (Zero Shot, Interactive, etc.)"
echo "• Security scanner will warn you about sensitive data"
echo ""
echo "For more information, see:"
echo "  ${INSTALL_DIR}/README.md"
echo ""
echo -e "${GREEN}Happy prompting!${NC}"
echo ""
