// LLM API Client
// Platform-agnostic client for local LLMs and remote APIs
// Supports: Ollama, LM Studio, OpenAI, Claude, Gemini, OpenRouter

class LLMApiClient {
  constructor(storageAdapter = null) {
    this.storageAdapter = storageAdapter;
    this.defaultTimeout = 60000; // 60 seconds
  }

  /**
   * Set storage adapter (for dependency injection)
   */
  setStorageAdapter(storageAdapter) {
    this.storageAdapter = storageAdapter;
  }

  /**
   * Enhance a prompt using local or remote LLM
   */
  async enhancePrompt(prompt, settings) {
    const {
      endpoint = 'http://localhost:11434',
      model = 'llama2',
      apiType = 'ollama',
      provider = 'local',
      apiKey = '',
      temperature = 0.7,
      systemPrompt = this.getDefaultSystemPrompt()
    } = settings;

    try {
      let response;

      // Route to appropriate API based on provider
      if (provider === 'local') {
        if (apiType === 'ollama') {
          response = await this.callOllama(endpoint, model, prompt, systemPrompt, temperature);
        } else if (apiType === 'openai') {
          response = await this.callLocalOpenAI(endpoint, model, prompt, systemPrompt, temperature);
        } else {
          throw new Error(`Unsupported local API type: ${apiType}`);
        }
      } else if (provider === 'openai') {
        response = await this.callRemoteOpenAI(model, prompt, systemPrompt, temperature, apiKey);
      } else if (provider === 'anthropic') {
        response = await this.callAnthropic(model, prompt, systemPrompt, temperature, apiKey);
      } else if (provider === 'google') {
        response = await this.callGemini(model, prompt, systemPrompt, temperature, apiKey);
      } else if (provider === 'openrouter') {
        response = await this.callOpenRouter(model, prompt, systemPrompt, temperature, apiKey);
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }

      return response;
    } catch (error) {
      console.error('LLM API error:', error);
      throw new Error(`Failed to enhance with LLM: ${error.message}`);
    }
  }

  /**
   * Call Ollama API (local)
   */
  async callOllama(endpoint, model, prompt, systemPrompt, temperature) {
    const url = `${endpoint}/api/generate`;

    const requestBody = {
      model: model,
      prompt: `${systemPrompt}\n\nOriginal Prompt:\n${prompt}\n\nEnhanced Prompt:`,
      stream: false,
      options: {
        temperature: temperature
      }
    };

    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || data.text || '';
  }

  /**
   * Call local OpenAI-compatible API (LM Studio, LocalAI, etc.)
   */
  async callLocalOpenAI(endpoint, model, prompt, systemPrompt, temperature) {
    const url = `${endpoint}/v1/chat/completions`;

    const requestBody = {
      model: model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Please enhance the following prompt to make it more effective, clear, and specific:\n\n${prompt}`
        }
      ],
      temperature: temperature,
      max_tokens: 2000
    };

    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Local OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Call remote OpenAI API
   */
  async callRemoteOpenAI(model, prompt, systemPrompt, temperature, apiKey) {
    const url = 'https://api.openai.com/v1/chat/completions';

    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }

    const requestBody = {
      model: model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Please enhance the following prompt to make it more effective, clear, and specific:\n\n${prompt}`
        }
      ],
      temperature: temperature,
      max_tokens: 2000
    };

    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Call Anthropic Claude API
   */
  async callAnthropic(model, prompt, systemPrompt, temperature, apiKey) {
    const url = 'https://api.anthropic.com/v1/messages';

    if (!apiKey) {
      throw new Error('Anthropic API key is required');
    }

    const requestBody = {
      model: model,
      max_tokens: 2000,
      temperature: temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Please enhance the following prompt to make it more effective, clear, and specific:\n\n${prompt}`
        }
      ]
    };

    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Anthropic API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || '';
  }

  /**
   * Call Google Gemini API
   */
  async callGemini(model, prompt, systemPrompt, temperature, apiKey) {
    if (!apiKey) {
      throw new Error('Google API key is required');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\nPlease enhance the following prompt to make it more effective, clear, and specific:\n\n${prompt}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: 2000
      }
    };

    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  /**
   * Call OpenRouter API
   */
  async callOpenRouter(model, prompt, systemPrompt, temperature, apiKey) {
    const url = 'https://openrouter.ai/api/v1/chat/completions';

    if (!apiKey) {
      throw new Error('OpenRouter API key is required');
    }

    const requestBody = {
      model: model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Please enhance the following prompt to make it more effective, clear, and specific:\n\n${prompt}`
        }
      ],
      temperature: temperature,
      max_tokens: 2000
    };

    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://prompt-enhancer-extension',
        'X-Title': 'Prompt Enhancer Pro'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Test connection to LLM endpoint
   */
  async testConnection(endpoint, apiType = 'ollama', provider = 'local', apiKey = '', model = '') {
    try {
      if (provider === 'local') {
        let url;
        if (apiType === 'ollama') {
          url = `${endpoint}/api/tags`;
        } else if (apiType === 'openai') {
          url = `${endpoint}/v1/models`;
        } else {
          throw new Error('Unsupported API type');
        }

        const response = await this.fetchWithTimeout(url, {
          method: 'GET'
        }, 5000);

        return response.ok;
      } else if (provider === 'openai') {
        const response = await this.fetchWithTimeout('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        }, 5000);
        return response.ok;
      } else if (provider === 'anthropic') {
        // Anthropic doesn't have a simple health check endpoint, so we'll just validate the key format
        return apiKey && apiKey.startsWith('sk-ant-');
      } else if (provider === 'google') {
        // Test with a simple request
        const response = await this.fetchWithTimeout(
          `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-pro'}?key=${apiKey}`,
          { method: 'GET' },
          5000
        );
        return response.ok;
      } else if (provider === 'openrouter') {
        const response = await this.fetchWithTimeout('https://openrouter.ai/api/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        }, 5000);
        return response.ok;
      }

      return false;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available models from the endpoint
   */
  async getAvailableModels(endpoint, apiType = 'ollama') {
    try {
      let url;
      if (apiType === 'ollama') {
        url = `${endpoint}/api/tags`;
        const response = await this.fetchWithTimeout(url, { method: 'GET' }, 5000);

        if (!response.ok) return [];

        const data = await response.json();
        return data.models?.map(m => m.name) || [];
      } else if (apiType === 'openai') {
        url = `${endpoint}/v1/models`;
        const response = await this.fetchWithTimeout(url, { method: 'GET' }, 5000);

        if (!response.ok) return [];

        const data = await response.json();
        return data.data?.map(m => m.id) || [];
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch models:', error);
      return [];
    }
  }

  /**
   * Default system prompt for prompt enhancement
   */
  getDefaultSystemPrompt() {
    return `You are an expert prompt engineer specializing in improving prompts for large language models. Your task is to enhance prompts by:

1. Making them more specific and actionable
2. Adding clear output format specifications
3. Including success criteria and constraints
4. Removing vague language and replacing it with concrete instructions
5. Adding structure and organization
6. Ensuring the prompt is clear, complete, and efficient

When enhancing a prompt, maintain the original intent but improve clarity, specificity, and effectiveness. Return ONLY the enhanced prompt without explanations or meta-commentary.`;
  }

  /**
   * Get LLM settings from storage
   */
  async getSettings() {
    if (!this.storageAdapter) {
      throw new Error('Storage adapter not set');
    }

    return await this.storageAdapter.getMultiple({
      llmEndpoint: 'http://localhost:11434',
      llmModel: 'llama2',
      llmApiType: 'ollama',
      llmProvider: 'local',
      llmApiKey: '',
      llmTemperature: 0.7,
      llmEnabled: false
    }).then(result => ({
      endpoint: result.llmEndpoint,
      model: result.llmModel,
      apiType: result.llmApiType,
      provider: result.llmProvider,
      apiKey: result.llmApiKey,
      temperature: result.llmTemperature,
      enabled: result.llmEnabled
    }));
  }

  /**
   * Save LLM settings to storage
   */
  async saveSettings(settings) {
    if (!this.storageAdapter) {
      throw new Error('Storage adapter not set');
    }

    return await this.storageAdapter.setMultiple({
      llmEndpoint: settings.endpoint,
      llmModel: settings.model,
      llmApiType: settings.apiType,
      llmProvider: settings.provider,
      llmApiKey: settings.apiKey || '',
      llmTemperature: settings.temperature,
      llmEnabled: settings.enabled
    });
  }

  /**
   * Fetch with timeout helper
   */
  async fetchWithTimeout(url, options = {}, timeout = this.defaultTimeout) {
    // Use AbortSignal if available (browsers)
    if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(timeout)
      });
    }

    // Fallback for environments without AbortSignal.timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LLMApiClient;
}
if (typeof window !== 'undefined') {
  window.LLMApiClient = LLMApiClient;
}
