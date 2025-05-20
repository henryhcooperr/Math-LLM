import React, { useState, useRef, useEffect } from 'react';
import VisualizationWrapper from './VisualizationWrapper';
import { extractStructuredResponse } from '../utils/llmResponseProcessor';
import './ChatInterface.css';

// MathJax configuration for LaTeX rendering
const initMathJax = () => {
  window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      processEscapes: true,
      processEnvironments: true
    },
    svg: {
      fontCache: 'global'
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
    }
  };

  // Load MathJax dynamically
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  script.async = true;
  document.head.appendChild(script);
};

/**
 * Converts text with LaTeX notation to formatted output
 * @param {string} text - The text possibly containing LaTeX
 * @returns {Array} - Array of React components with formatted math
 */
const formatMathInText = (text) => {
  // Trigger MathJax typesetting
  setTimeout(() => {
    if (window.MathJax && window.MathJax.typeset) {
      window.MathJax.typeset();
    }
  }, 0);

  return text;
};

/**
 * Main Chat Interface Component with math visualization capabilities
 */
const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [apiProvider, setApiProvider] = useState('openai'); // 'openai' or 'anthropic'
  
  const messagesEndRef = useRef(null);
  const apiKeyInputRef = useRef(null);

  // Initialize MathJax and load data from localStorage on component mount
  useEffect(() => {
    initMathJax();
    
    // Log environment variables (for debugging)
    console.log('Environment variables check:');
    console.log('GITHUB_ACTIONS:', !!process.env.GITHUB_ACTIONS);
    console.log('REACT_APP_OPENAI_API_KEY exists:', !!process.env.REACT_APP_OPENAI_API_KEY);
    console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
    console.log('REACT_APP_ANTHROPIC_API_KEY exists:', !!process.env.REACT_APP_ANTHROPIC_API_KEY);
    console.log('ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY);
    
    // Check all possible environment variable names for the API keys
    const openAIKey = process.env.REACT_APP_OPENAI_API_KEY || 
                      process.env.OPENAI_API_KEY || 
                      process.env.OPENAI_KEY;
                      
    const anthropicKey = process.env.REACT_APP_ANTHROPIC_API_KEY || 
                         process.env.ANTHROPIC_API_KEY || 
                         process.env.ANTHROPIC_KEY;
    
    if (openAIKey) {
      console.log('Found OpenAI key');
      setApiKey(openAIKey);
      setApiProvider('openai');
    } else if (anthropicKey) {
      console.log('Found Anthropic key');
      setApiKey(anthropicKey);
      setApiProvider('anthropic');
    } else {
      console.log('No API keys found in environment variables');
    }
    
    // Load saved chat messages from localStorage
    try {
      const savedMessages = localStorage.getItem('mathLLM_chatMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
      
      // Load saved API provider preference
      const savedProvider = localStorage.getItem('mathLLM_apiProvider');
      if (savedProvider) {
        setApiProvider(savedProvider);
      }
      
      // Don't load API key from localStorage for security reasons
    } catch (err) {
      console.error('Error loading from localStorage:', err);
    }
  }, []);

  // Scroll to bottom of chat when messages change and save to localStorage
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Save messages to localStorage
    if (messages.length > 0) {
      try {
        localStorage.setItem('mathLLM_chatMessages', JSON.stringify(messages));
      } catch (err) {
        console.error('Error saving to localStorage:', err);
      }
    }
  }, [messages]);
  
  // Save API provider to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('mathLLM_apiProvider', apiProvider);
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }, [apiProvider]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    if (!apiKey) {
      setError('Please enter an API key to continue.');
      apiKeyInputRef.current?.focus();
      return;
    }
    
    // Add user message to chat
    const userMessage = {
      role: 'user',
      content: input
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Call LLM API based on provider
      const response = await callLLMApi(userMessage.content);
      
      // Process the response
      const formattedResponse = processLLMResponse(response);
      
      // Add assistant message to chat
      setMessages(prevMessages => [...prevMessages, {
        role: 'assistant',
        content: formattedResponse.text,
        visualizationParams: formattedResponse.visualizationParams
      }]);
    } catch (err) {
      console.error('Error calling LLM API:', err);
      setError('An error occurred while processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Call the appropriate LLM API based on provider
  const callLLMApi = async (prompt) => {
    if (apiProvider === 'openai') {
      return callOpenAIApi(prompt);
    } else if (apiProvider === 'anthropic') {
      return callAnthropicApi(prompt);
    }
    throw new Error('Invalid API provider');
  };

  // Call OpenAI API
  const callOpenAIApi = async (prompt) => {
    const mathPrompt = `You are a math expert who provides clear, educational explanations about mathematical concepts. For any math expressions, use LaTeX notation with $ symbols (like $x^2$ for inline and $$\\int f(x) dx$$ for display).

When appropriate, include a visualization by providing parameters in a JSON format inside a <visualization> tag.

For example:
<visualization>
{
  "type": "function2D",
  "expression": "Math.sin(x)",
  "domain": [-Math.PI, Math.PI],
  "range": [-1.5, 1.5]
}
</visualization>

Understand the user's question and provide a helpful, educational response with clear explanations. If the concept can be visualized, include appropriate visualization parameters.

User question: ${prompt}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [{ role: 'user', content: mathPrompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error calling OpenAI API');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  };

  // Call Anthropic API
  const callAnthropicApi = async (prompt) => {
    const mathPrompt = `You are a math expert who provides clear, educational explanations about mathematical concepts. For any math expressions, use LaTeX notation with $ symbols (like $x^2$ for inline and $$\\int f(x) dx$$ for display).

When appropriate, include a visualization by providing parameters in a JSON format inside a <visualization> tag.

For example:
<visualization>
{
  "type": "function2D",
  "expression": "Math.sin(x)",
  "domain": [-Math.PI, Math.PI],
  "range": [-1.5, 1.5]
}
</visualization>

Understand the user's question and provide a helpful, educational response with clear explanations. If the concept can be visualized, include appropriate visualization parameters.

User question: ${prompt}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        messages: [{ role: 'user', content: mathPrompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error calling Anthropic API');
    }

    const data = await response.json();
    return data.content?.[0]?.text || '';
  };

  // Process the LLM response to extract text and visualization parameters
  const processLLMResponse = (responseText) => {
    // Check for visualization JSON
    const visualizationMatch = responseText.match(/<visualization>([\s\S]*?)<\/visualization>/);
    let visualizationParams = null;
    
    if (visualizationMatch && visualizationMatch[1]) {
      try {
        visualizationParams = JSON.parse(visualizationMatch[1].trim());
      } catch (err) {
        console.error('Error parsing visualization params:', err);
      }
    }
    
    // Remove the visualization block from the text
    let cleanText = responseText.replace(/<visualization>[\s\S]*?<\/visualization>/g, '').trim();
    
    // If no visualization block found, try to extract from the response
    if (!visualizationParams) {
      const extractedResponse = extractStructuredResponse(responseText);
      if (extractedResponse && extractedResponse.visualizationParams) {
        visualizationParams = extractedResponse.visualizationParams;
      }
    }
    
    return {
      text: cleanText,
      visualizationParams
    };
  };

  // Toggle API provider
  const toggleApiProvider = () => {
    setApiProvider(prev => prev === 'openai' ? 'anthropic' : 'openai');
    setApiKey(''); // Clear API key when switching providers
  };
  
  // Clear chat history
  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem('mathLLM_chatMessages');
  };

  // Render a chat message
  const renderMessage = (message, index) => {
    const { role, content, visualizationParams } = message;
    
    return (
      <div 
        key={index} 
        className={`chat-message ${role === 'user' ? 'user-message' : 'assistant-message'}`}
      >
        <div className="message-avatar">
          {role === 'user' ? '👤' : '🤖'}
        </div>
        <div className="message-content">
          <div className="message-text">{formatMathInText(content)}</div>
          
          {visualizationParams && (
            <div className="visualization-container">
              <VisualizationWrapper
                {...visualizationParams}
                width="100%"
                height={300}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h1>Math Visualization Assistant</h1>
        <div className="api-settings">
          <select 
            value={apiProvider} 
            onChange={toggleApiProvider}
            className="api-provider-selector"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
          </select>
          <input
            ref={apiKeyInputRef}
            type="password"
            placeholder={`Enter ${apiProvider === 'openai' ? 'OpenAI' : 'Anthropic'} API Key`}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="api-key-input"
          />
          {messages.length > 0 && (
            <button 
              onClick={clearChatHistory}
              className="clear-chat-button"
              title="Clear chat history"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <h2>Welcome to Math Visualization Assistant!</h2>
            <p>Ask any math question or concept you'd like to understand better.</p>
            
            {!apiKey && (
              <div className="api-key-notice">
                <p>⚠️ No API key detected. Please enter your OpenAI or Anthropic API key in the input field above.</p>
                <p><small>Note: If you added an API key via environment variables, you may need to restart the server for changes to take effect.</small></p>
              </div>
            )}
            
            <div className="example-queries">
              <h3>Example questions you can ask:</h3>
              <ul>
                <li onClick={() => setInput("Explain the quadratic formula and show an example")}>
                  Explain the quadratic formula and show an example
                </li>
                <li onClick={() => setInput("What is a sine function and how does it behave?")}>
                  What is a sine function and how does it behave?
                </li>
                <li onClick={() => setInput("Show me the concept of derivatives graphically")}>
                  Show me the concept of derivatives graphically
                </li>
                <li onClick={() => setInput("How do parametric equations work?")}>
                  How do parametric equations work?
                </li>
                <li onClick={() => setInput("Explain vector fields with a visualization")}>
                  Explain vector fields with a visualization
                </li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map(renderMessage)
        )}
        
        {isLoading && (
          <div className="loading-indicator">
            <div className="dot-pulse"></div>
            <span>Thinking...</span>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <span>❌ {error}</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a math question..."
          className="chat-input"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? '⏳' : '📤'}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;