// VS Code Storage Adapter
// Implements StorageAdapter using VS Code workspace configuration API

const vscode = require('vscode');

class VSCodeStorageAdapter {
  /**
   * Get a value from VS Code settings
   */
  async get(key, defaultValue) {
    const config = vscode.workspace.getConfiguration('promptEnhancer');
    return config.get(key, defaultValue);
  }

  /**
   * Get multiple values from VS Code settings
   */
  async getMultiple(defaults) {
    const config = vscode.workspace.getConfiguration('promptEnhancer');
    const result = {};

    for (const [key, defaultValue] of Object.entries(defaults)) {
      result[key] = config.get(key, defaultValue);
    }

    return result;
  }

  /**
   * Set a value in VS Code settings
   */
  async set(key, value) {
    const config = vscode.workspace.getConfiguration('promptEnhancer');
    await config.update(key, value, vscode.ConfigurationTarget.Global);
  }

  /**
   * Set multiple values in VS Code settings
   */
  async setMultiple(items) {
    const config = vscode.workspace.getConfiguration('promptEnhancer');

    for (const [key, value] of Object.entries(items)) {
      await config.update(key, value, vscode.ConfigurationTarget.Global);
    }
  }
}

module.exports = VSCodeStorageAdapter;
