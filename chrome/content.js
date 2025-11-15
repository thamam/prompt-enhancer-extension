// Content script for Prompt Enhancer Pro
// Handles text selection and replacement in web pages

// Only initialize once
if (!window.promptEnhancerLoaded) {
  window.promptEnhancerLoaded = true;

// Initialize adapters
const storageAdapter = new window.ChromeStorageAdapter();
const notificationAdapter = new window.ChromeNotificationAdapter();

// Initialize LLM client with storage adapter
const llmClient = new window.LLMApiClient(storageAdapter);

// Initialize enhancer with LLM client
const enhancer = new window.PromptEnhancer(llmClient);
const securityScanner = new window.SecurityScanner();

// Store the current selection range
let currentRange = null;
let currentSelection = null;

// Track selection to maintain range
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (selection.toString().length > 0) {
    currentSelection = selection;
    // Clone the range to preserve it even if selection changes
    currentRange = selection.getRangeAt(0).cloneRange();
  }
});

// Listen for enhancement requests from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'enhancePrompt') {
    enhanceAndReplace(request.text, request.mode);
  }
});

function enhanceAndReplace(text, mode) {
  if (!currentRange) {
    notificationAdapter.showError('Error: No text selection found');
    return;
  }

  // First, run security scan on the text
  const scanResult = securityScanner.scan(text);

  // If critical or high security issues found, show warning
  if (scanResult.hasCriticalIssues || scanResult.hasHighIssues) {
    showSecurityWarning(text, mode, scanResult);
    return; // Wait for user decision
  }

  // If medium or low issues, show quick notification but proceed
  if (scanResult.hasMediumIssues || scanResult.hasLowIssues) {
    notificationAdapter.showWarning(`⚠️ Security Score: ${scanResult.score}/100 - ${scanResult.totalIssues} issue(s) detected`);
  }

  // Proceed with enhancement
  performEnhancement(text, mode);
}

async function performEnhancement(text, mode, isRedacted = false) {
  try {
    // Show loading notification for async operations
    if (mode === 'local_llm') {
      notificationAdapter.showInfo('🤖 Enhancing with LLM...');
    }

    // Enhance the prompt
    const enhancedText = await Promise.resolve(enhancer.enhance(text, mode));

    // Get the mode name for notification
    const modeName = getModeDisplayName(mode);

    // Replace the selected text
    replaceSelectedText(enhancedText);

    // Show success notification
    const securityNote = isRedacted ? ' (redacted)' : '';
    notificationAdapter.showSuccess(`✓ Prompt enhanced with ${modeName}${securityNote}`);

    // Clear selection
    window.getSelection().removeAllRanges();
    // Note: Don't clear currentRange here in case we need it for modal interactions

  } catch (error) {
    console.error('Enhancement error:', error);
    console.error('Error stack:', error.stack);
    notificationAdapter.showError('Error: ' + error.message);
  }
}

function showSecurityWarning(text, mode, scanResult) {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999998;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  // Create modal container
  const modal = document.createElement('div');
  modal.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 24px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  `;

  // Header
  const header = document.createElement('div');
  header.style.cssText = 'margin-bottom: 20px;';

  const title = document.createElement('h2');
  title.style.cssText = 'margin: 0 0 8px 0; color: #dc2626; font-size: 20px; font-weight: 600;';
  title.textContent = '🛑 Security Warning';

  const subtitle = document.createElement('p');
  subtitle.style.cssText = 'margin: 0; color: #6b7280; font-size: 14px;';
  subtitle.textContent = 'Sensitive information detected in your prompt';

  header.appendChild(title);
  header.appendChild(subtitle);

  // Score section
  const scoreSection = document.createElement('div');
  scoreSection.style.cssText = `
    background: #fef2f2;
    border: 2px solid #fecaca;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
  `;

  const scoreTitle = document.createElement('div');
  scoreTitle.style.cssText = 'font-weight: 600; margin-bottom: 8px; color: #991b1b;';
  scoreTitle.textContent = 'Security Score: ' + scanResult.score + '/100';

  const recommendation = document.createElement('div');
  recommendation.style.cssText = 'font-size: 14px; color: #991b1b;';
  recommendation.textContent = scanResult.recommendation.message;

  scoreSection.appendChild(scoreTitle);
  scoreSection.appendChild(recommendation);

  // Findings summary
  const summary = document.createElement('div');
  summary.style.cssText = 'margin-bottom: 20px;';

  const summaryTitle = document.createElement('div');
  summaryTitle.style.cssText = 'font-weight: 600; margin-bottom: 8px; color: #374151;';
  summaryTitle.textContent = 'Issues Found: ' + scanResult.totalIssues;

  const severityBadges = document.createElement('div');
  severityBadges.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';

  if (scanResult.hasCriticalIssues) {
    const badge = createSeverityBadge('Critical', scanResult.findings.filter(f => f.severity === 'critical').length, '#7f1d1d', '#fef2f2');
    severityBadges.appendChild(badge);
  }
  if (scanResult.hasHighIssues) {
    const badge = createSeverityBadge('High', scanResult.findings.filter(f => f.severity === 'high').length, '#991b1b', '#fef2f2');
    severityBadges.appendChild(badge);
  }
  if (scanResult.hasMediumIssues) {
    const badge = createSeverityBadge('Medium', scanResult.findings.filter(f => f.severity === 'medium').length, '#d97706', '#fffbeb');
    severityBadges.appendChild(badge);
  }
  if (scanResult.hasLowIssues) {
    const badge = createSeverityBadge('Low', scanResult.findings.filter(f => f.severity === 'low').length, '#65a30d', '#f7fee7');
    severityBadges.appendChild(badge);
  }

  summary.appendChild(summaryTitle);
  summary.appendChild(severityBadges);

  // Findings list
  const findingsList = document.createElement('div');
  findingsList.style.cssText = 'margin-bottom: 20px; max-height: 200px; overflow-y: auto;';

  const findingsTitle = document.createElement('div');
  findingsTitle.style.cssText = 'font-weight: 600; margin-bottom: 8px; color: #374151;';
  findingsTitle.textContent = 'Detected Issues:';
  findingsList.appendChild(findingsTitle);

  scanResult.findings.slice(0, 10).forEach(finding => {
    const item = document.createElement('div');
    item.style.cssText = `
      background: #f9fafb;
      border-left: 3px solid ${getSeverityColor(finding.severity)};
      padding: 8px 12px;
      margin-bottom: 8px;
      border-radius: 4px;
      font-size: 13px;
    `;

    const typeLabel = document.createElement('div');
    typeLabel.style.cssText = 'font-weight: 600; color: #374151; margin-bottom: 4px;';
    typeLabel.textContent = finding.type + ' (' + finding.severity + ')';

    const preview = document.createElement('div');
    preview.style.cssText = 'color: #6b7280; font-family: monospace; font-size: 12px; margin-bottom: 4px;';
    preview.textContent = 'Preview: ' + finding.match.substring(0, 30) + (finding.match.length > 30 ? '...' : '');

    const suggestion = document.createElement('div');
    suggestion.style.cssText = 'color: #059669; font-size: 12px;';
    suggestion.textContent = 'Suggestion: ' + finding.suggestion;

    item.appendChild(typeLabel);
    item.appendChild(preview);
    item.appendChild(suggestion);
    findingsList.appendChild(item);
  });

  if (scanResult.findings.length > 10) {
    const more = document.createElement('div');
    more.style.cssText = 'color: #6b7280; font-size: 13px; font-style: italic; margin-top: 8px;';
    more.textContent = '... and ' + (scanResult.findings.length - 10) + ' more issue(s)';
    findingsList.appendChild(more);
  }

  // Buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = 'display: flex; gap: 12px; justify-content: flex-end;';

  const cancelBtn = document.createElement('button');
  cancelBtn.style.cssText = `
    padding: 10px 20px;
    background: #e5e7eb;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    font-size: 14px;
    color: #374151;
  `;
  cancelBtn.textContent = 'Cancel';
  cancelBtn.onclick = () => {
    // Remove all overlays
    const allOverlays = document.querySelectorAll('div[style*="z-index: 999998"]');
    allOverlays.forEach(o => o.remove());
  };

  const redactBtn = document.createElement('button');
  redactBtn.style.cssText = `
    padding: 10px 20px;
    background: #059669;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    font-size: 14px;
    color: white;
  `;
  redactBtn.textContent = 'Redact & Proceed';
  redactBtn.onclick = () => {
    console.log('Redact button clicked');
    console.log('Overlay element:', overlay);
    console.log('Overlay parent:', overlay.parentNode);
    const redactedText = securityScanner.redact(text, scanResult.findings);
    console.log('Text redacted:', redactedText.substring(0, 100));

    try {
      // Check for multiple overlays
      const allOverlays = document.querySelectorAll('div[style*="z-index: 999998"]');
      console.log('Total overlays found:', allOverlays.length);

      // Remove all overlays with this z-index
      allOverlays.forEach(o => o.remove());

      console.log('All overlays removed');
    } catch (e) {
      console.error('Error removing overlay:', e);
    }

    performEnhancement(redactedText, mode, true);
    console.log('Enhancement completed');
  };

  const proceedBtn = document.createElement('button');
  proceedBtn.style.cssText = `
    padding: 10px 20px;
    background: #dc2626;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    font-size: 14px;
    color: white;
  `;
  proceedBtn.textContent = 'Proceed Anyway (Not Recommended)';
  proceedBtn.onclick = () => {
    // Remove all overlays
    const allOverlays = document.querySelectorAll('div[style*="z-index: 999998"]');
    console.log('Proceed button: Total overlays found:', allOverlays.length);
    allOverlays.forEach(o => o.remove());

    performEnhancement(text, mode, false);
  };

  buttonContainer.appendChild(cancelBtn);
  buttonContainer.appendChild(redactBtn);
  buttonContainer.appendChild(proceedBtn);

  // Assemble modal
  modal.appendChild(header);
  modal.appendChild(scoreSection);
  modal.appendChild(summary);
  modal.appendChild(findingsList);
  modal.appendChild(buttonContainer);
  overlay.appendChild(modal);

  // Add to page
  document.body.appendChild(overlay);
}

function createSeverityBadge(label, count, color, bgColor) {
  const badge = document.createElement('span');
  badge.style.cssText = `
    display: inline-block;
    padding: 4px 12px;
    background: ${bgColor};
    color: ${color};
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  `;
  badge.textContent = label + ': ' + count;
  return badge;
}

function getSeverityColor(severity) {
  const colors = {
    critical: '#7f1d1d',
    high: '#991b1b',
    medium: '#d97706',
    low: '#65a30d'
  };
  return colors[severity] || '#6b7280';
}

function replaceSelectedText(newText) {
  // Check if we have a valid range
  if (!currentRange) {
    notificationAdapter.showError('Error: Text selection was lost. Please select the text again.');
    throw new Error('No valid selection range available');
  }

  // Delete the current selection
  currentRange.deleteContents();

  // Check if we're in a text input/textarea
  const activeElement = document.activeElement;
  const isEditable = activeElement.tagName === 'TEXTAREA' || 
                     activeElement.tagName === 'INPUT' ||
                     activeElement.isContentEditable;
  
  if (isEditable) {
    // For editable elements, use different approach
    if (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      const text = activeElement.value;
      
      activeElement.value = text.substring(0, start) + newText + text.substring(end);
      activeElement.selectionStart = activeElement.selectionEnd = start + newText.length;
      
      // Trigger input event for frameworks
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // ContentEditable
      const textNode = document.createTextNode(newText);
      currentRange.insertNode(textNode);
      
      // Trigger input event
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  } else {
    // For non-editable content, insert text node
    const textNode = document.createTextNode(newText);
    currentRange.insertNode(textNode);
  }
}

function getModeDisplayName(mode) {
  // Use MODE_DISPLAY_NAMES if available, otherwise fallback
  if (typeof window.MODE_DISPLAY_NAMES !== 'undefined') {
    return window.MODE_DISPLAY_NAMES[mode] || mode;
  }

  // Fallback names if MODE_DISPLAY_NAMES not loaded
  const names = {
    'zero_shot': 'Zero Shot Mode',
    'zero_shot_relaxed': 'Zero Shot Relaxed',
    'interactive': 'Interactive Mode',
    'claude_optimize': 'Claude Optimization',
    'gpt4_optimize': 'GPT-4 Optimization',
    'fix_antipatterns': 'Anti-Pattern Fixes',
    'add_structure': 'Structure Enhancement',
    'evaluate_score': 'Evaluation & Scoring',
    'local_llm': 'LLM'
  };
  return names[mode] || mode;
}

// Initialize
console.log('Prompt Enhancer Pro: Content script loaded');

} // End of if for duplicate prevention
