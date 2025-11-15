// VS Code Notification Adapter
// Implements NotificationAdapter using VS Code window API

const vscode = require('vscode');

class VSCodeNotificationAdapter {
  /**
   * Show success notification
   */
  async showSuccess(message, duration = 3000) {
    vscode.window.showInformationMessage(`✓ ${message}`);
  }

  /**
   * Show error notification
   */
  async showError(message, duration = 3000) {
    vscode.window.showErrorMessage(message);
  }

  /**
   * Show info notification
   */
  async showInfo(message, duration = 3000) {
    vscode.window.showInformationMessage(message);
  }

  /**
   * Show warning notification
   */
  async showWarning(message, duration = 3000) {
    vscode.window.showWarningMessage(message);
  }
}

module.exports = VSCodeNotificationAdapter;
