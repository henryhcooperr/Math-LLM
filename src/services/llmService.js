/**
 * LLM Service for Math-LLM
 * Provides integration with Large Language Models for math problem analysis,
 * visualization parameter generation, and educational content creation.
 */

// Default configuration for LLM requests
const DEFAULT_CONFIG = {
  model: 'gpt-4', // Default to a model with strong mathematical reasoning
  temperature: 0.3, // Low temperature for more deterministic, precise responses
  responseFormat: 'json', // Always expect JSON responses
  maxTokens: 2048 // Allow for detailed responses with visualization parameters
};

/**
 * LLM Service class for handling interactions with external LLM APIs
 */
class LLMService {
  constructor(options = {}) {
    this.options = {
      ...DEFAULT_CONFIG,
      ...options
    };
    
    // API key and endpoint should be configured securely
    this.apiKey = options.apiKey || process.env.LLM_API_KEY;
    this.apiEndpoint = options.apiEndpoint || process.env.LLM_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
    
    // Set up retry and rate limiting
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000; // ms
    
    // Initialize conversation context
    this.conversationContext = [];
    
    // Load system prompts
    this.systemPrompts = this.loadSystemPrompts();
  }
  
  /**
   * Load system prompts for different types of math problems
   */
  loadSystemPrompts() {
    return {
      base: `You are a math visualization assistant that explains concepts clearly and provides parameters for interactive visualizations. 

Your task is to:
1. Analyze the mathematical concept in the user's query
2. Provide a clear, conversational explanation
3. Generate precise parameters for visualization
4. Create educational content with step-by-step explanations

ALWAYS structure your response as a valid JSON object with these fields:
{
  "explanation": "Conversational explanation of the concept",
  "visualizationParams": {
    "type": "function2D|function3D|geometry|vectorField|...",
    "title": "Title for the visualization",
    "expression": "Mathematical expression in JavaScript syntax",
    "domain": [min, max],
    "range": [min, max],
    "recommendedLibrary": "mafs|mathbox|jsxgraph|...",
    // Type-specific parameters...
  },
  "educationalContent": {
    "title": "Concept title",
    "summary": "Brief summary",
    "steps": [
      {"title": "Step 1", "content": "Explanation of step 1"},
      // More steps...
    ],
    "keyInsights": ["Insight 1", "Insight 2", ...],
    "exercises": [
      {"question": "Question text", "solution": "Solution explanation"}
      // More exercises...
    ]
  },
  "followUpQuestions": ["Related question 1?", "Related question 2?", ...]
}

For visualization parameters, be precise and use JavaScript syntax for expressions. For example, use "Math.sin(x)" instead of "sin(x)" and "x**2" for x².`,
      
      function2D: `For function2D visualizations, include these additional parameters:
- "expression": JavaScript function expression (e.g., "Math.sin(x) * Math.exp(-0.1 * x * x)")
- "domain": x-axis range as [min, max]
- "range": y-axis range as [min, max]
- "specialPoints": array of points to highlight, e.g.,
  [
    {"x": value, "y": value, "label": "name", "description": "explanation"}
  ]
- "recommendedLibrary": "mafs" (preferred for 2D functions)`,
      
      function3D: `For function3D visualizations, include these additional parameters:
- "expression": JavaScript function of two variables (e.g., "Math.sin(x) * Math.cos(y)")
- "domainX": x-axis range as [min, max]
- "domainY": y-axis range as [min, max]
- "range": z-axis range as [min, max]
- "resolution": grid resolution (typically 64)
- "colormap": color scheme ("rainbow", "thermal", etc.)
- "recommendedLibrary": "mathbox" (preferred for 3D functions)`,
      
      geometry: `For geometry visualizations, include these additional parameters:
- "elements": array of geometric elements, each with:
  - "type": "point|line|circle|polygon|..."
  - "id": unique identifier
  - "label": display label
  - Type-specific properties (coordinates, radius, etc.)
- "constructions": array of geometric constructions
- "recommendedLibrary": "jsxgraph" (preferred for geometry)`,
      
      calculus: `For calculus visualizations, include these additional parameters:
- "subtype": "derivative|integral|limit"
- "function": { "expression": "x**2", "color": "#3090FF" }
- Derivative-specific: { "order": 1, "point": 2 }
- Integral-specific: { "lowerBound": 0, "upperBound": 1, "fillColor": "#FF9030" }
- Limit-specific: { "point": 0, "approach": "left|right|both" }
- "recommendedLibrary": "mafs" or "jsxgraph" depending on complexity`
    };
  }
  
  /**
   * Process a math problem using an LLM
   * @param {string} problem - The math problem or question
   * @param {Object} options - Processing options
   * @returns {Promise<Object>} - Structured response with visualization parameters
   */
  async processMathProblem(problem, options = {}) {
    try {
      // Determine the prompt type based on problem
      const promptType = this.determineProblemType(problem);
      
      // Build the appropriate prompt
      const prompt = this.buildPrompt(problem, promptType, options);
      
      // Call the LLM API with retry logic
      const response = await this.callLLMWithRetry(prompt);
      
      // Parse and validate the response
      const parsedResponse = this.parseResponse(response);
      
      // Update conversation context if needed
      if (options.maintainContext) {
        this.updateConversationContext(problem, parsedResponse);
      }
      
      return parsedResponse;
    } catch (error) {
      console.error('Error processing math problem with LLM:', error);
      throw new Error(`Failed to process problem: ${error.message}`);
    }
  }
  
  /**
   * Determine the type of math problem for appropriate prompting
   * @param {string} problem - The math problem text
   * @returns {string} - Problem type (function2D, function3D, geometry, etc.)
   */
  determineProblemType(problem) {
    const problemLower = problem.toLowerCase();
    
    // Check for 3D functions
    if (problemLower.includes('3d') || 
        problemLower.includes('three dimension') || 
        problemLower.includes('f(x,y)') || 
        problemLower.includes('surface') || 
        problemLower.includes('z =')) {
      return 'function3D';
    }
    
    // Check for geometric problems
    if (problemLower.includes('triangle') || 
        problemLower.includes('circle') || 
        problemLower.includes('polygon') || 
        problemLower.includes('point') || 
        problemLower.includes('coordinate') || 
        problemLower.includes('vertices') ||
        problemLower.includes('geometry')) {
      return 'geometry';
    }
    
    // Check for calculus problems
    if (problemLower.includes('derivative') || 
        problemLower.includes('integral') || 
        problemLower.includes('limit') || 
        problemLower.includes('differentiate') || 
        problemLower.includes('integrate') ||
        problemLower.includes('calculus')) {
      return 'calculus';
    }
    
    // Default to 2D function
    return 'function2D';
  }
  
  /**
   * Build a prompt for the LLM based on problem type
   * @param {string} problem - The math problem
   * @param {string} promptType - Type of math problem
   * @param {Object} options - Additional options
   * @returns {Array} - Array of message objects for the LLM
   */
  buildPrompt(problem, promptType, options) {
    // Base system prompt
    const systemPrompt = {
      role: 'system',
      content: this.systemPrompts.base
    };
    
    // Add type-specific prompt details if available
    if (this.systemPrompts[promptType]) {
      systemPrompt.content += '\n\n' + this.systemPrompts[promptType];
    }
    
    // Create messages array
    const messages = [systemPrompt];
    
    // Add conversation context if maintaining context
    if (options.maintainContext && this.conversationContext.length > 0) {
      messages.push(...this.conversationContext);
    }
    
    // Add the current user query
    messages.push({
      role: 'user',
      content: problem
    });
    
    return messages;
  }
  
  /**
   * Call the LLM API with retry logic for resilience
   * @param {Array} messages - Array of message objects for the LLM
   * @returns {Promise<string>} - Raw LLM response
   */
  async callLLMWithRetry(messages) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await this.callLLM(messages);
      } catch (error) {
        lastError = error;
        
        // Don't retry if it's not a retryable error
        if (!this.isRetryableError(error)) {
          break;
        }
        
        // Wait before retrying (with exponential backoff)
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError || new Error('Failed to call LLM API');
  }
  
  /**
   * Determine if an error is retryable
   * @param {Error} error - The error to check
   * @returns {boolean} - Whether the error is retryable
   */
  isRetryableError(error) {
    // Consider network errors and rate limits as retryable
    return (
      error.message.includes('timeout') ||
      error.message.includes('network') ||
      error.message.includes('rate limit') ||
      error.message.includes('429') || // Rate limit status code
      error.message.includes('503') || // Service unavailable
      error.message.includes('504')    // Gateway timeout
    );
  }
  
  /**
   * Make the actual LLM API call
   * @param {Array} messages - Array of message objects for the LLM
   * @returns {Promise<string>} - Raw LLM response
   */
  async callLLM(messages) {
    try {
      // Use the appropriate API endpoint and format based on the provider
      const requestBody = {
        model: this.options.model,
        messages: messages,
        temperature: this.options.temperature,
        max_tokens: this.options.maxTokens,
        response_format: { type: this.options.responseFormat }
      };
      
      // Make the API request
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`LLM API Error (${response.status}): ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling LLM API:', error);
      throw error;
    }
  }
  
  /**
   * Parse and validate the LLM response
   * @param {string} responseText - Raw response from the LLM
   * @returns {Object} - Parsed and validated response object
   */
  parseResponse(responseText) {
    try {
      // Try to parse as JSON
      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch (error) {
        // Try to extract JSON from markdown or text
        const jsonMatch = responseText.match(/```json([\s\S]*?)```|({[\s\S]*})/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[1] || jsonMatch[2]);
          } catch (e) {
            throw new Error('Could not parse response as JSON');
          }
        } else {
          throw new Error('Response does not contain valid JSON');
        }
      }
      
      // Validate required fields
      this.validateResponse(parsed);
      
      return parsed;
    } catch (error) {
      console.error('Error parsing LLM response:', error);
      throw error;
    }
  }
  
  /**
   * Validate the response has all required fields
   * @param {Object} response - Parsed response to validate
   * @throws {Error} If validation fails
   */
  validateResponse(response) {
    // Check for required top-level fields
    const requiredFields = ['explanation', 'visualizationParams'];
    for (const field of requiredFields) {
      if (!response[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Validate visualization parameters
    const params = response.visualizationParams;
    if (!params.type) {
      throw new Error('Visualization parameters missing required type');
    }
    
    // Type-specific validation
    switch (params.type) {
      case 'function2D':
        if (!params.expression) {
          throw new Error('function2D missing required expression');
        }
        if (!params.domain || !Array.isArray(params.domain) || params.domain.length !== 2) {
          throw new Error('function2D missing valid domain parameter');
        }
        break;
      case 'function3D':
        if (!params.expression) {
          throw new Error('function3D missing required expression');
        }
        break;
      case 'geometry':
        if (!params.elements || !Array.isArray(params.elements)) {
          throw new Error('geometry missing required elements array');
        }
        break;
      // Add cases for other types
    }
  }
  
  /**
   * Update the conversation context with new messages
   * @param {string} userQuery - The user's query
   * @param {Object} response - The parsed LLM response
   */
  updateConversationContext(userQuery, response) {
    // Add the user query
    this.conversationContext.push({
      role: 'user',
      content: userQuery
    });
    
    // Add the assistant response (simplified to avoid context bloat)
    this.conversationContext.push({
      role: 'assistant',
      content: JSON.stringify({
        explanation: response.explanation,
        visualizationSummary: {
          type: response.visualizationParams.type,
          title: response.visualizationParams.title
        }
      })
    });
    
    // Limit context size to avoid token limits
    if (this.conversationContext.length > 10) {
      // Keep only the most recent messages
      this.conversationContext = this.conversationContext.slice(-10);
    }
  }
  
  /**
   * Clear the conversation context
   */
  clearConversationContext() {
    this.conversationContext = [];
  }
}

export default LLMService;