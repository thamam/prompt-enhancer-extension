// Local LLM API Client
// Supports Ollama, LM Studio, and OpenAI-compatible endpoints

// Only define if not already defined
if (typeof window.LLMApiClient === 'undefined') {

window.LLMApiClient = class LLMApiClient {

  constructor() {
    this.defaultTimeout = 60000; // 60 seconds
  }

  /**
   * Enhance a prompt using a local LLM
   * @param {string} prompt - The original prompt to enhance
   * @param {object} settings - LLM settings (endpoint, model, apiType)
   * @returns {Promise<string>} - Enhanced prompt
   */
  async enhancePrompt(prompt, settings) {
    const {
      endpoint = 'http://localhost:11434',
      model = 'llama2',
      apiType = 'ollama',
      temperature = 0.7,
      systemPrompt = this.getDefaultSystemPrompt()
    } = settings;

    try {
      let response;

      if (apiType === 'ollama') {
        response = await this.callOllama(endpoint, model, prompt, systemPrompt, temperature);
      } else if (apiType === 'openai') {
        response = await this.callOpenAI(endpoint, model, prompt, systemPrompt, temperature);
      } else {
        throw new Error(`Unsupported API type: ${apiType}`);
      }

      return response;
    } catch (error) {
      console.error('LLM API error:', error);
      throw new Error(`Failed to enhance with local LLM: ${error.message}`);
    }
  }

  /**
   * Call Ollama API
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

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(this.defaultTimeout)
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || data.text || '';
  }

  /**
   * Call OpenAI-compatible API (LM Studio, LocalAI, etc.)
   */
  async callOpenAI(endpoint, model, prompt, systemPrompt, temperature) {
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

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(this.defaultTimeout)
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Test connection to LLM endpoint
   */
  async testConnection(endpoint, apiType = 'ollama') {
    try {
      let url;
      if (apiType === 'ollama') {
        url = `${endpoint}/api/tags`;
      } else if (apiType === 'openai') {
        url = `${endpoint}/v1/models`;
      } else {
        throw new Error('Unsupported API type');
      }

      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });

      return response.ok;
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
        const response = await fetch(url, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data.models?.map(m => m.name) || [];
      } else if (apiType === 'openai') {
        url = `${endpoint}/v1/models`;
        const response = await fetch(url, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });

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
    return new Promise((resolve) => {
      chrome.storage.local.get({
        llmEndpoint: 'http://localhost:11434',
        llmModel: 'llama2',
        llmApiType: 'ollama',
        llmTemperature: 0.7,
        llmEnabled: false
      }, (result) => {
        resolve({
          endpoint: result.llmEndpoint,
          model: result.llmModel,
          apiType: result.llmApiType,
          temperature: result.llmTemperature,
          enabled: result.llmEnabled
        });
      });
    });
  }

  /**
   * Save LLM settings to storage
   */
  async saveSettings(settings) {
    return new Promise((resolve) => {
      chrome.storage.local.set({
        llmEndpoint: settings.endpoint,
        llmModel: settings.model,
        llmApiType: settings.apiType,
        llmTemperature: settings.temperature,
        llmEnabled: settings.enabled
      }, () => {
        resolve();
      });
    });
  }

} // End of LLMApiClient class

} // End of if for duplicate prevention

// Export for use in content script (Node.js compatibility)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.LLMApiClient || LLMApiClient;
}
