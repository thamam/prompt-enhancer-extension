// Abstract Notification Adapter Interface
// Implementations: Chrome (DOM notifications), VS Code (window.showInformationMessage)

class NotificationAdapter {
  /**
   * Show success notification
   * @param {string} message - Message to display
   * @param {number} duration - Duration in milliseconds (optional)
   * @returns {Promise<void>}
   */
  async showSuccess(message, duration = 3000) {
    throw new Error('NotificationAdapter.showSuccess() must be implemented');
  }

  /**
   * Show error notification
   * @param {string} message - Message to display
   * @param {number} duration - Duration in milliseconds (optional)
   * @returns {Promise<void>}
   */
  async showError(message, duration = 3000) {
    throw new Error('NotificationAdapter.showError() must be implemented');
  }

  /**
   * Show info notification
   * @param {string} message - Message to display
   * @param {number} duration - Duration in milliseconds (optional)
   * @returns {Promise<void>}
   */
  async showInfo(message, duration = 3000) {
    throw new Error('NotificationAdapter.showInfo() must be implemented');
  }

  /**
   * Show warning notification
   * @param {string} message - Message to display
   * @param {number} duration - Duration in milliseconds (optional)
   * @returns {Promise<void>}
   */
  async showWarning(message, duration = 3000) {
    throw new Error('NotificationAdapter.showWarning() must be implemented');
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationAdapter;
}
if (typeof window !== 'undefined') {
  window.NotificationAdapter = NotificationAdapter;
}
