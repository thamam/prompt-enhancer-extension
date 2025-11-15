// Abstract Storage Adapter Interface
// Implementations: Chrome (chrome.storage), VS Code (workspace settings)

class StorageAdapter {
  /**
   * Get a value from storage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {Promise<any>} - Stored value or default
   */
  async get(key, defaultValue) {
    throw new Error('StorageAdapter.get() must be implemented');
  }

  /**
   * Get multiple values from storage
   * @param {Object} defaults - Object with keys and default values
   * @returns {Promise<Object>} - Object with stored values
   */
  async getMultiple(defaults) {
    throw new Error('StorageAdapter.getMultiple() must be implemented');
  }

  /**
   * Set a value in storage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {Promise<void>}
   */
  async set(key, value) {
    throw new Error('StorageAdapter.set() must be implemented');
  }

  /**
   * Set multiple values in storage
   * @param {Object} items - Object with key-value pairs
   * @returns {Promise<void>}
   */
  async setMultiple(items) {
    throw new Error('StorageAdapter.setMultiple() must be implemented');
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageAdapter;
}
if (typeof window !== 'undefined') {
  window.StorageAdapter = StorageAdapter;
}
