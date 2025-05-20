/**
 * Utilities for processing responses from LLMs and formatting them
 * according to the standardized output format
 */

import { createStandardResponse, validateResponse } from './responseFormatter';

/**
 * Extracts structured information from an LLM response and converts it to
 * the standardized format required by the visualization system.
 * 
 * @param {string} llmResponse - Raw text response from the LLM
 * @returns {Object} - Standardized response object or null if extraction fails
 */
export const extractStructuredResponse = (llmResponse) => {
  try {
    // First attempt: look for a JSON block in the response
    const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)```/;
    const jsonMatch = llmResponse.match(jsonBlockRegex);
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1].trim());
        const validation = validateResponse(parsed);
        
        if (validation.valid) {
          return parsed;
        } else {
          console.warn("Extracted JSON has validation errors:", validation.errors);
          // Try to fix the response with defaults
          return createStandardResponse({
            explanation: parsed.explanation || "",
            visualizationParams: parsed.visualizationParams || {},
            educationalContent: parsed.educationalContent || {},
            followUpQuestions: parsed.followUpQuestions || []
          });
        }
      } catch (e) {
        console.warn("Failed to parse extracted JSON:", e);
      }
    }
    
    // Second attempt: Parse the entire response as JSON
    try {
      const parsed = JSON.parse(llmResponse.trim());
      const validation = validateResponse(parsed);
      
      if (validation.valid) {
        return parsed;
      } else {
        console.warn("Full response JSON has validation errors:", validation.errors);
        // Try to fix the response with defaults
        return createStandardResponse({
          explanation: parsed.explanation || "",
          visualizationParams: parsed.visualizationParams || {},
          educationalContent: parsed.educationalContent || {},
          followUpQuestions: parsed.followUpQuestions || []
        });
      }
    } catch (e) {
      console.warn("Failed to parse full response as JSON:", e);
    }
    
    // Third attempt: Try to extract structured information from a free-text response
    return extractFromFreeText(llmResponse);
    
  } catch (error) {
    console.error("Error processing LLM response:", error);
    return null;
  }
};

/**
 * Extracts structured information from a free-text LLM response
 * 
 * @param {string} text - Free-text response from the LLM
 * @returns {Object} - Best-effort structured response
 */
const extractFromFreeText = (text) => {
  // Extract explanation
  const explanation = extractExplanation(text);
  
  // Try to extract visualization parameters
  const visualizationParams = extractVisualizationParams(text);
  
  // Extract educational content sections
  const educationalContent = extractEducationalContent(text);
  
  // Look for follow-up questions or suggestions
  const followUpQuestions = extractFollowUpQuestions(text);
  
  // Create a standardized response with extracted information
  return createStandardResponse({
    explanation,
    visualizationParams,
    educationalContent,
    followUpQuestions
  });
};

/**
 * Extracts the main explanation from a free-text response
 * 
 * @param {string} text - Free-text response
 * @returns {string} - Extracted explanation
 */
const extractExplanation = (text) => {
  // Look for sections that might be the main explanation
  const patterns = [
    /(?:\n|^)(?:Explanation|Overview|Description|Introduction):\s*([\s\S]*?)(?:\n\n|\n#|\n(?:Steps|Key Insights|Exercises|Follow-up):|$)/i,
    // General extraction - first paragraph or two, if nothing else matches
    /^((?:.*\n){1,3})/
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim().length > 10) {
      return match[1].trim();
    }
  }
  
  // Fallback: Just use the first 250 characters
  return text.substring(0, 250).trim();
};

/**
 * Extracts visualization parameters from a free-text response
 * 
 * @param {string} text - Free-text response
 * @returns {Object} - Extracted visualization parameters
 */
const extractVisualizationParams = (text) => {
  // Default parameters
  const params = {
    type: 'function2D',
    title: 'Mathematical Visualization',
    domain: [-10, 10],
    range: [-10, 10]
  };
  
  // Try to identify the visualization type
  const typePatterns = [
    { regex: /\b3D\s+(?:surface|function|plot|graph)\b/i, type: 'function3D' },
    { regex: /\bparametric\s+curve\b/i, type: 'parametric2D' },
    { regex: /\bparametric\s+surface\b/i, type: 'parametric3D' },
    { regex: /\bvector\s+field\b/i, type: 'vectorField' },
    { regex: /\b(?:geometry|geometric|triangle|circle|polygon)\b/i, type: 'geometry' },
    { regex: /\b(?:integral|derivative|calculus)\b/i, type: 'calculus' },
    { regex: /\b(?:probability|distribution|normal|binomial|poisson)\b/i, type: 'probabilityDistribution' },
    { regex: /\b(?:linear\s+algebra|matrix|transformation|eigenvector)\b/i, type: 'linearAlgebra' },
    { regex: /\bmultiple\s+functions\b/i, type: 'functions2D' }
  ];
  
  for (const pattern of typePatterns) {
    if (pattern.regex.test(text)) {
      params.type = pattern.type;
      break;
    }
  }
  
  // Look for mathematical expressions
  const expressionPatterns = [
    /(?:function|equation|expression)(?:[:\s]+)(?:is|given\s+by)?\s*(?:f\(x\)\s*=\s*)?([^.\n,]+)/i,
    /y\s*=\s*([^.\n,]+)/i,
    /f\s*\(\s*x\s*\)\s*=\s*([^.\n,]+)/i
  ];
  
  for (const pattern of expressionPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const expr = match[1].trim();
      
      // Check if this looks like a valid expression
      if (expr.length > 1 && !expr.includes('...')) {
        if (params.type === 'functions2D') {
          params.functions = [{ expression: expr, label: 'f(x)', color: '#3090FF' }];
          
          // Look for a second function
          const secondFuncMatch = text.match(/g\s*\(\s*x\s*\)\s*=\s*([^.\n,]+)/i);
          if (secondFuncMatch && secondFuncMatch[1]) {
            params.functions.push({
              expression: secondFuncMatch[1].trim(),
              label: 'g(x)',
              color: '#FF9030'
            });
          }
        } else {
          params.expression = expr;
        }
        break;
      }
    }
  }
  
  // Try to extract domain/range information
  const domainPattern = /(?:domain|x-values|x\s+(?:is|in|ranges|varies|from))(?:\s+is|\s+are)?(?:\s+from)?\s+(-?\d+\.?\d*)\s+to\s+(-?\d+\.?\d*)/i;
  const domainMatch = text.match(domainPattern);
  
  if (domainMatch && domainMatch[1] && domainMatch[2]) {
    params.domain = [parseFloat(domainMatch[1]), parseFloat(domainMatch[2])];
  }
  
  const rangePattern = /(?:range|y-values|y\s+(?:is|in|ranges|varies|from))(?:\s+is|\s+are)?(?:\s+from)?\s+(-?\d+\.?\d*)\s+to\s+(-?\d+\.?\d*)/i;
  const rangeMatch = text.match(rangePattern);
  
  if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
    params.range = [parseFloat(rangeMatch[1]), parseFloat(rangeMatch[2])];
  }
  
  // Extract a title if possible
  const titlePattern = /\btitle[:\s]+["']?([^"'\n.,]+(?:\s+[^"'\n.,]+){0,6})["']?/i;
  const titleMatch = text.match(titlePattern);
  
  if (titleMatch && titleMatch[1]) {
    params.title = titleMatch[1].trim();
  } else {
    // Try to create a title from the content
    if (params.type === 'function2D' && params.expression) {
      params.title = `Graph of f(x) = ${params.expression}`;
    }
  }
  
  return params;
};

/**
 * Extracts educational content sections from a free-text response
 * 
 * @param {string} text - Free-text response
 * @returns {Object} - Extracted educational content
 */
const extractEducationalContent = (text) => {
  const educationalContent = {
    title: '',
    summary: '',
    steps: [],
    keyInsights: [],
    exercises: []
  };
  
  // Extract title
  const titleMatch = text.match(/(?:\n|^)#\s+([^\n]+)/);
  if (titleMatch && titleMatch[1]) {
    educationalContent.title = titleMatch[1].trim();
  }
  
  // Extract summary
  const summaryPatterns = [
    /(?:\n|^)(?:Summary|Overview):\s*([\s\S]*?)(?:\n\n|\n#|\n(?:Steps|Key Insights|Exercises|Follow-up):|$)/i,
    /(?:\n|^)In\s+summary,\s+([\s\S]*?)(?:\n\n|\n#|\n(?:Steps|Key Insights|Exercises|Follow-up):|$)/i
  ];
  
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim().length > 10) {
      educationalContent.summary = match[1].trim();
      break;
    }
  }
  
  // Extract steps
  const stepsSection = text.match(/(?:\n|^)(?:Steps|Procedure|Method|How to)(?::|\.)\s*([\s\S]*?)(?:\n\n\S|\n#|\n(?:Key Insights|Exercises|Follow-up):|$)/i);
  
  if (stepsSection && stepsSection[1]) {
    const stepText = stepsSection[1].trim();
    const stepsList = stepText.split(/\n(?:\d+\.|\*|\-)\s+/).filter(s => s.trim().length > 0);
    
    stepsList.forEach((step, index) => {
      const stepParts = step.split(':');
      if (stepParts.length > 1) {
        educationalContent.steps.push({
          title: stepParts[0].trim(),
          content: stepParts.slice(1).join(':').trim()
        });
      } else {
        educationalContent.steps.push({
          title: `Step ${index + 1}`,
          content: step.trim()
        });
      }
    });
  }
  
  // Extract key insights
  const insightsSection = text.match(/(?:\n|^)(?:Key\s+Insights|Important\s+Points|Key\s+Takeaways)(?::|\.)\s*([\s\S]*?)(?:\n\n\S|\n#|\n(?:Exercises|Follow-up):|$)/i);
  
  if (insightsSection && insightsSection[1]) {
    const insightsText = insightsSection[1].trim();
    const insightsList = insightsText.split(/\n(?:\d+\.|\*|\-)\s+/).filter(s => s.trim().length > 0);
    
    educationalContent.keyInsights = insightsList.map(s => s.trim());
  }
  
  // Extract exercises
  const exercisesSection = text.match(/(?:\n|^)(?:Exercises|Practice\s+Problems|Problems)(?::|\.)\s*([\s\S]*?)(?:\n\n\S|\n#|\n(?:Follow-up):|$)/i);
  
  if (exercisesSection && exercisesSection[1]) {
    const exercisesText = exercisesSection[1].trim();
    const exercises = [];
    
    // Try to identify question/solution pairs
    const questionPatterns = [
      /\b(?:Question|Problem|Exercise)\s+\d+:\s*([\s\S]*?)(?:\n\s*(?:Solution|Answer):|$)/i,
      /\b\d+\.\s*([\s\S]*?)(?:\n\s*(?:Solution|Answer):|$)/i,
      /\b(?:Q\d+):\s*([\s\S]*?)(?:\n\s*(?:Solution|Answer):|$)/i
    ];
    
    for (const pattern of questionPatterns) {
      let match;
      let lastIndex = 0;
      
      while ((match = pattern.exec(exercisesText.slice(lastIndex))) !== null) {
        const question = match[1].trim();
        lastIndex += match.index + match[0].length;
        
        // Try to find the solution
        const solutionMatch = exercisesText.slice(lastIndex).match(/^(?:Solution|Answer):\s*([\s\S]*?)(?:\n\n\S|\n(?:Question|Problem|Exercise|Q\d+|\d+\.):|$)/i);
        let solution = '';
        
        if (solutionMatch && solutionMatch[1]) {
          solution = solutionMatch[1].trim();
          lastIndex += solutionMatch.index + solutionMatch[0].length;
        }
        
        exercises.push({ question, solution });
      }
    }
    
    if (exercises.length > 0) {
      educationalContent.exercises = exercises;
    }
  }
  
  return educationalContent;
};

/**
 * Extracts follow-up questions from a free-text response
 * 
 * @param {string} text - Free-text response
 * @returns {Array} - Extracted follow-up questions
 */
const extractFollowUpQuestions = (text) => {
  const followUpSection = text.match(/(?:\n|^)(?:Follow-up\s+Questions|Further\s+Exploration|Next\s+Steps|Related\s+Topics)(?::|\.)\s*([\s\S]*?)(?:\n\n\S|\n#|$)/i);
  
  if (followUpSection && followUpSection[1]) {
    const questionsText = followUpSection[1].trim();
    const questionsList = questionsText.split(/\n(?:\d+\.|\*|\-)\s+/).filter(s => s.trim().length > 0);
    
    // Ensure each item actually looks like a question
    return questionsList
      .map(s => s.trim())
      .filter(s => s.includes('?') || /^(?:how|what|why|when|where|is|are|can|could|should|would|will|do|does)/i.test(s))
      .map(s => s.endsWith('?') ? s : `${s}?`);
  }
  
  return [];
};

/**
 * Generates a prompt for the LLM that instructs it to provide a response
 * in the standardized output format
 * 
 * @param {string} userQuery - The user's mathematical query
 * @param {Object} options - Additional options for customizing the prompt
 * @param {string} options.level - User's knowledge level ('beginner', 'intermediate', 'advanced')
 * @param {Array} options.preferredLibraries - Preferred visualization libraries
 * @returns {string} - Formatted prompt for the LLM
 */
export const generateFormattedPrompt = (userQuery, options = {}) => {
  const {
    level = 'intermediate',
    preferredLibraries = []
  } = options;
  
  let libraryPreference = '';
  if (preferredLibraries.length > 0) {
    libraryPreference = `Preferred visualization libraries: ${preferredLibraries.join(', ')}.`;
  }
  
  return `
You are an educational mathematics visualization expert. Please explain the following mathematical concept:

"${userQuery}"

Format your response following this exact JSON structure:

{
  "explanation": "Clear explanation of the mathematical concept",
  "visualizationParams": {
    "type": "visualization_type",
    "title": "Visualization title",
    // Type-specific parameters...
  },
  "educationalContent": {
    "title": "Educational module title",
    "summary": "Brief summary of the concept",
    "steps": [
      {
        "title": "Step 1 title",
        "content": "Step 1 explanation"
      }
      // Additional steps...
    ],
    "keyInsights": [
      "Key insight 1",
      "Key insight 2"
    ],
    "exercises": [
      {
        "question": "Exercise question",
        "solution": "Exercise solution"
      }
      // Additional exercises...
    ]
  },
  "followUpQuestions": [
    "Suggested follow-up question 1?",
    "Suggested follow-up question 2?"
  ]
}

Consider the user's knowledge level (${level}). ${libraryPreference}

Ensure the visualization parameters are appropriate for the mathematical concept. Use one of these visualization types:
- function2D (for 2D functions)
- functions2D (for multiple 2D functions)
- function3D (for 3D surfaces)
- parametric2D (for parametric curves)
- parametric3D (for parametric curves/surfaces in 3D)
- vectorField (for vector fields in 2D or 3D)
- geometry (for geometric constructions)
- calculus (for calculus concepts like integrals or derivatives)
- probabilityDistribution (for statistical distributions)
- linearAlgebra (for linear algebra visualizations)

Ensure the explanation is clear and accurate, the visualization parameters are complete, the educational content is helpful, and the follow-up questions encourage further exploration.

Return your response as a valid JSON object without additional text or explanation.
`;
};

export default {
  extractStructuredResponse,
  generateFormattedPrompt
};