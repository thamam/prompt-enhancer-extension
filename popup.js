// Popup script for Prompt Enhancer Pro

// Load and display statistics
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadLLMSettings();

  // Reset button
  document.getElementById('resetStats').addEventListener('click', resetStats);

  // LLM settings event listeners
  document.getElementById('llmEnabled').addEventListener('change', toggleLLMSettings);
  document.getElementById('llmProvider').addEventListener('change', onProviderChange);
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
    llmProvider: 'local',
    llmApiKey: '',
    llmEnabled: false
  }, (result) => {
    document.getElementById('llmEndpoint').value = result.llmEndpoint;
    document.getElementById('llmModel').value = result.llmModel;
    document.getElementById('llmApiType').value = result.llmApiType;
    document.getElementById('llmProvider').value = result.llmProvider;
    document.getElementById('llmApiKey').value = result.llmApiKey;
    document.getElementById('llmEnabled').checked = result.llmEnabled;

    // Show/hide settings based on enabled state
    if (result.llmEnabled) {
      document.getElementById('llmSettings').style.display = 'block';
    }

    // Update UI based on provider
    updateProviderUI(result.llmProvider);
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

// Handle provider change
function onProviderChange() {
  const provider = document.getElementById('llmProvider').value;
  updateProviderUI(provider);
}

// Update UI based on provider selection
function updateProviderUI(provider) {
  const localSettings = document.getElementById('localSettings');
  const remoteSettings = document.getElementById('remoteSettings');
  const modelInput = document.getElementById('llmModel');
  const modelHint = document.getElementById('modelHint');

  if (provider === 'local') {
    localSettings.style.display = 'block';
    remoteSettings.style.display = 'none';
    modelInput.placeholder = 'llama2';
    modelHint.textContent = 'Examples: llama2, mistral, codellama';
  } else {
    localSettings.style.display = 'none';
    remoteSettings.style.display = 'block';

    // Update placeholders based on provider
    if (provider === 'openai') {
      modelInput.placeholder = 'gpt-4';
      modelHint.textContent = 'Examples: gpt-4, gpt-4-turbo, gpt-3.5-turbo';
    } else if (provider === 'anthropic') {
      modelInput.placeholder = 'claude-3-opus-20240229';
      modelHint.textContent = 'Examples: claude-3-opus-20240229, claude-3-sonnet-20240229, claude-3-haiku-20240307';
    } else if (provider === 'google') {
      modelInput.placeholder = 'gemini-pro';
      modelHint.textContent = 'Examples: gemini-pro, gemini-1.5-pro, gemini-1.5-flash';
    } else if (provider === 'openrouter') {
      modelInput.placeholder = 'openai/gpt-4';
      modelHint.textContent = 'Examples: openai/gpt-4, anthropic/claude-3-opus, google/gemini-pro';
    }
  }
}

// Save LLM settings
function saveLLMSettings() {
  const endpoint = document.getElementById('llmEndpoint').value.trim();
  const model = document.getElementById('llmModel').value.trim();
  const apiType = document.getElementById('llmApiType').value;
  const provider = document.getElementById('llmProvider').value;
  const apiKey = document.getElementById('llmApiKey').value.trim();
  const enabled = document.getElementById('llmEnabled').checked;

  if (enabled && !model) {
    showStatus('Please enter a model name', 'error');
    return;
  }

  if (enabled && provider === 'local' && !endpoint) {
    showStatus('Please enter an endpoint URL', 'error');
    return;
  }

  if (enabled && provider !== 'local' && !apiKey) {
    showStatus('Please enter an API key for remote providers', 'error');
    return;
  }

  chrome.storage.local.set({
    llmEndpoint: endpoint,
    llmModel: model,
    llmApiType: apiType,
    llmProvider: provider,
    llmApiKey: apiKey,
    llmEnabled: enabled
  }, () => {
    showStatus('Settings saved successfully!', 'success');
  });
}

// Test LLM connection
async function testLLMConnection() {
  const endpoint = document.getElementById('llmEndpoint').value.trim();
  const apiType = document.getElementById('llmApiType').value;
  const provider = document.getElementById('llmProvider').value;
  const apiKey = document.getElementById('llmApiKey').value.trim();
  const model = document.getElementById('llmModel').value.trim();

  if (provider === 'local' && !endpoint) {
    showStatus('Please enter an endpoint URL', 'error');
    return;
  }

  if (provider !== 'local' && !apiKey) {
    showStatus('Please enter an API key', 'error');
    return;
  }

  const button = document.getElementById('testConnection');
  const originalText = button.textContent;
  button.textContent = 'Testing...';
  button.disabled = true;

  try {
    let isConnected = false;

    if (provider === 'local') {
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

      isConnected = response.ok;

      if (isConnected && apiType === 'ollama') {
        const data = await response.json();
        if (data.models && data.models.length > 0) {
          const modelNames = data.models.map(m => m.name).join(', ');
          showStatus(`✓ Connection successful! Available models: ${modelNames}`, 'success');
          button.textContent = originalText;
          button.disabled = false;
          return;
        }
      }
    } else if (provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        signal: AbortSignal.timeout(5000)
      });
      isConnected = response.ok;
    } else if (provider === 'anthropic') {
      // Validate Anthropic API key format
      isConnected = apiKey.startsWith('sk-ant-');
      if (!isConnected) {
        showStatus('✗ Invalid Anthropic API key format (should start with sk-ant-)', 'error');
        button.textContent = originalText;
        button.disabled = false;
        return;
      }
    } else if (provider === 'google') {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-pro'}?key=${apiKey}`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      isConnected = response.ok;
    } else if (provider === 'openrouter') {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        signal: AbortSignal.timeout(5000)
      });
      isConnected = response.ok;
    }

    if (isConnected) {
      showStatus('✓ Connection successful!', 'success');
    } else {
      showStatus('✗ Connection failed', 'error');
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
