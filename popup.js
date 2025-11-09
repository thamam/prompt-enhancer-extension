// Popup script for Prompt Enhancer Pro

// Load and display statistics
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadLLMSettings();

  // Reset button
  document.getElementById('resetStats').addEventListener('click', resetStats);

  // LLM settings event listeners
  document.getElementById('llmEnabled').addEventListener('change', toggleLLMSettings);
  document.getElementById('saveSettings').addEventListener('click', saveLLMSettings);
  document.getElementById('testConnection').addEventListener('click', testLLMConnection);
});

function loadStats() {
  chrome.storage.local.get(['enhancementCount'], (result) => {
    const count = result.enhancementCount || 0;
    document.getElementById('enhancementsCount').textContent = count;
  });
}

function resetStats() {
  if (confirm('Reset enhancement statistics?')) {
    chrome.storage.local.set({ enhancementCount: 0 }, () => {
      document.getElementById('enhancementsCount').textContent = '0';

      // Show confirmation
      const button = document.getElementById('resetStats');
      const originalText = button.textContent;
      button.textContent = '✓ Reset Complete';
      button.style.background = 'rgba(16, 185, 129, 0.3)';

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
    });
  }
}

// Load LLM settings from storage
function loadLLMSettings() {
  chrome.storage.local.get({
    llmEndpoint: 'http://localhost:11434',
    llmModel: 'llama2',
    llmApiType: 'ollama',
    llmEnabled: false
  }, (result) => {
    document.getElementById('llmEndpoint').value = result.llmEndpoint;
    document.getElementById('llmModel').value = result.llmModel;
    document.getElementById('llmApiType').value = result.llmApiType;
    document.getElementById('llmEnabled').checked = result.llmEnabled;

    // Show/hide settings based on enabled state
    if (result.llmEnabled) {
      document.getElementById('llmSettings').style.display = 'block';
    }
  });
}

// Toggle LLM settings visibility
function toggleLLMSettings() {
  const enabled = document.getElementById('llmEnabled').checked;
  const settingsDiv = document.getElementById('llmSettings');

  if (enabled) {
    settingsDiv.style.display = 'block';
  } else {
    settingsDiv.style.display = 'none';
  }

  // Auto-save enabled state
  chrome.storage.local.set({ llmEnabled: enabled });
}

// Save LLM settings
function saveLLMSettings() {
  const endpoint = document.getElementById('llmEndpoint').value.trim();
  const model = document.getElementById('llmModel').value.trim();
  const apiType = document.getElementById('llmApiType').value;
  const enabled = document.getElementById('llmEnabled').checked;

  if (enabled && (!endpoint || !model)) {
    showStatus('Please fill in all fields', 'error');
    return;
  }

  chrome.storage.local.set({
    llmEndpoint: endpoint,
    llmModel: model,
    llmApiType: apiType,
    llmEnabled: enabled
  }, () => {
    showStatus('Settings saved successfully!', 'success');
  });
}

// Test LLM connection
async function testLLMConnection() {
  const endpoint = document.getElementById('llmEndpoint').value.trim();
  const apiType = document.getElementById('llmApiType').value;

  if (!endpoint) {
    showStatus('Please enter an endpoint URL', 'error');
    return;
  }

  const button = document.getElementById('testConnection');
  const originalText = button.textContent;
  button.textContent = 'Testing...';
  button.disabled = true;

  try {
    let url;
    if (apiType === 'ollama') {
      url = `${endpoint}/api/tags`;
    } else {
      url = `${endpoint}/v1/models`;
    }

    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      showStatus('✓ Connection successful!', 'success');

      // Try to load available models
      if (apiType === 'ollama') {
        const data = await response.json();
        if (data.models && data.models.length > 0) {
          const modelNames = data.models.map(m => m.name).join(', ');
          showStatus(`✓ Connection successful! Available models: ${modelNames}`, 'success');
        }
      }
    } else {
      showStatus('✗ Connection failed: ' + response.statusText, 'error');
    }
  } catch (error) {
    showStatus('✗ Connection failed: ' + error.message, 'error');
  } finally {
    button.textContent = originalText;
    button.disabled = false;
  }
}

// Show status message
function showStatus(message, type) {
  const statusDiv = document.getElementById('connectionStatus');
  statusDiv.textContent = message;
  statusDiv.style.display = 'block';

  if (type === 'success') {
    statusDiv.style.background = 'rgba(16, 185, 129, 0.2)';
    statusDiv.style.color = '#10b981';
    statusDiv.style.border = '1px solid rgba(16, 185, 129, 0.3)';
  } else {
    statusDiv.style.background = 'rgba(239, 68, 68, 0.2)';
    statusDiv.style.color = '#ef4444';
    statusDiv.style.border = '1px solid rgba(239, 68, 68, 0.3)';
  }

  // Auto-hide after 5 seconds
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 5000);
}
