// VS Code Extension for Prompt Enhancer Pro
// Main entry point

const vscode = require('vscode');
const path = require('path');

// Import core modules
const PromptEnhancer = require('../core/enhancer.js');
const LLMApiClient = require('../core/llm-api-client.js');
const { ENHANCEMENT_MODES, MODE_DISPLAY_NAMES } = require('../core/enhancement-modes.js');

// Import VS Code adapters
const VSCodeStorageAdapter = require('./adapters/vscode-storage.js');
const VSCodeNotificationAdapter = require('./adapters/vscode-notifications.js');

// Global instances
let enhancer;
let llmClient;
let storageAdapter;
let notificationAdapter;
let enhancementCount = 0;

/**
 * Activate extension
 */
function activate(context) {
  console.log('Prompt Enhancer Pro is now active');

  // Initialize adapters
  storageAdapter = new VSCodeStorageAdapter();
  notificationAdapter = new VSCodeNotificationAdapter();

  // Initialize LLM client with storage adapter
  llmClient = new LLMApiClient(storageAdapter);

  // Initialize enhancer with LLM client
  enhancer = new PromptEnhancer(llmClient);

  // Register commands
  registerCommands(context);

  // Show status bar item
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = '$(sparkle) Prompt Enhance';
  statusBarItem.tooltip = 'Click to enhance selected text';
  statusBarItem.command = 'promptEnhancer.quickEnhance';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
}

/**
 * Register all commands
 */
function registerCommands(context) {
  // Mode enhancement commands
  context.subscriptions.push(
    vscode.commands.registerCommand('promptEnhancer.enhanceZeroShot', () =>
      enhanceSelection(ENHANCEMENT_MODES.ZERO_SHOT)
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('promptEnhancer.enhanceZeroShotRelaxed', () =>
      enhanceSelection(ENHANCEMENT_MODES.ZERO_SHOT_RELAXED)
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('promptEnhancer.enhanceInteractive', () =>
      enhanceSelection(ENHANCEMENT_MODES.INTERACTIVE)
    )
  );

  // Platform optimization commands
  context.subscriptions.push(
    vscode.commands.registerCommand('promptEnhancer.optimizeClaude', () =>
      enhanceSelection(ENHANCEMENT_MODES.CLAUDE_OPTIMIZE)
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('promptEnhancer.optimizeGPT4', () =>
      enhanceSelection(ENHANCEMENT_MODES.GPT4_OPTIMIZE)
    )
  );

  // Quick fix commands
  context.subscriptions.push(
    vscode.commands.registerCommand('promptEnhancer.fixAntiPatterns', () =>
      enhanceSelection(ENHANCEMENT_MODES.FIX_ANTIPATTERNS)
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('promptEnhancer.addStructure', () =>
      enhanceSelection(ENHANCEMENT_MODES.ADD_STRUCTURE)
    )
  );

  // Advanced commands
  context.subscriptions.push(
    vscode.commands.registerCommand('promptEnhancer.evaluateScore', () =>
      enhanceSelection(ENHANCEMENT_MODES.EVALUATE_SCORE)
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('promptEnhancer.enhanceWithLLM', () =>
      enhanceSelection(ENHANCEMENT_MODES.LOCAL_LLM)
    )
  );

  // Quick enhance (uses last mode)
  context.subscriptions.push(
    vscode.commands.registerCommand('promptEnhancer.quickEnhance', async () => {
      const lastMode = await storageAdapter.get('lastUsedMode', ENHANCEMENT_MODES.FIX_ANTIPATTERNS);
      enhanceSelection(lastMode);
    })
  );

  // Configuration command
  context.subscriptions.push(
    vscode.commands.registerCommand('promptEnhancer.configureLLM', () => {
      vscode.commands.executeCommand('workbench.action.openSettings', 'promptEnhancer.llm');
    })
  );
}

/**
 * Enhance selected text with given mode
 */
async function enhanceSelection(mode) {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    notificationAdapter.showError('No active text editor');
    return;
  }

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);

  if (!selectedText || selectedText.trim() === '') {
    notificationAdapter.showWarning('Please select some text to enhance');
    return;
  }

  try {
    // Store last used mode
    await storageAdapter.set('lastUsedMode', mode);

    // Show progress for async operations
    if (mode === ENHANCEMENT_MODES.LOCAL_LLM) {
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Enhancing with LLM...',
        cancellable: false
      }, async (progress) => {
        const enhancedText = await enhancer.enhance(selectedText, mode);
        await replaceSelection(editor, selection, enhancedText);

        const modeName = MODE_DISPLAY_NAMES[mode] || mode;
        notificationAdapter.showSuccess(`Prompt enhanced with ${modeName}`);
        enhancementCount++;
      });
    } else {
      // Synchronous enhancement
      const enhancedText = await enhancer.enhance(selectedText, mode);
      await replaceSelection(editor, selection, enhancedText);

      const modeName = MODE_DISPLAY_NAMES[mode] || mode;
      notificationAdapter.showSuccess(`Prompt enhanced with ${modeName}`);
      enhancementCount++;
    }
  } catch (error) {
    console.error('Enhancement error:', error);
    notificationAdapter.showError(`Error: ${error.message}`);
  }
}

/**
 * Replace selected text with enhanced version
 */
async function replaceSelection(editor, selection, newText) {
  await editor.edit(editBuilder => {
    editBuilder.replace(selection, newText);
  });
}

/**
 * Deactivate extension
 */
function deactivate() {
  console.log('Prompt Enhancer Pro deactivated');
  console.log(`Total enhancements performed: ${enhancementCount}`);
}

module.exports = {
  activate,
  deactivate
};
