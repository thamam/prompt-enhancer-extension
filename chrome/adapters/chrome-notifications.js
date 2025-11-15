// Chrome Notification Adapter
// Implements NotificationAdapter using DOM-based notifications

class ChromeNotificationAdapter {
  /**
   * Show success notification
   */
  async showSuccess(message, duration = 3000) {
    this.showNotification(message, '#10b981', duration);
  }

  /**
   * Show error notification
   */
  async showError(message, duration = 3000) {
    this.showNotification(message, '#ef4444', duration);
  }

  /**
   * Show info notification
   */
  async showInfo(message, duration = 3000) {
    this.showNotification(message, '#3b82f6', duration);
  }

  /**
   * Show warning notification
   */
  async showWarning(message, duration = 3000) {
    this.showNotification(message, '#f59e0b', duration);
  }

  /**
   * Show DOM notification
   */
  showNotification(message, color, duration) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${color};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      z-index: 999999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      max-width: 400px;
      word-wrap: break-word;
      animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
}

// Export for window (Chrome extension context)
if (typeof window !== 'undefined') {
  window.ChromeNotificationAdapter = ChromeNotificationAdapter;
}
