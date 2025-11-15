// Chrome Storage Adapter
// Implements StorageAdapter using chrome.storage.local API

class ChromeStorageAdapter {
  /**
   * Get a value from Chrome storage
   */
  async get(key, defaultValue) {
    return new Promise((resolve) => {
      chrome.storage.local.get({ [key]: defaultValue }, (result) => {
        resolve(result[key]);
      });
    });
  }

  /**
   * Get multiple values from Chrome storage
   */
  async getMultiple(defaults) {
    return new Promise((resolve) => {
      chrome.storage.local.get(defaults, (result) => {
        resolve(result);
      });
    });
  }

  /**
   * Set a value in Chrome storage
   */
  async set(key, value) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve();
      });
    });
  }

  /**
   * Set multiple values in Chrome storage
   */
  async setMultiple(items) {
    return new Promise((resolve) => {
      chrome.storage.local.set(items, () => {
        resolve();
      });
    });
  }
}

// Export for window (Chrome extension context)
if (typeof window !== 'undefined') {
  window.ChromeStorageAdapter = ChromeStorageAdapter;
}
