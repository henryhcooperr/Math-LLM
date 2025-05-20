/**
 * Expression Parser (Fixed Version)
 * Utilities for parsing and evaluating mathematical expressions with improved robustness
 */

/**
 * Parse and evaluate a mathematical expression
 * @param {string} expression - The mathematical expression to evaluate
 * @param {number} x - The x value
 * @param {Object} additionalVariables - Optional additional variables
 * @returns {number} - The result of evaluating the expression
 */
export function evaluateExpression(expression, x, additionalVariables = {}) {
  try {
    // If expression is empty or not a string, return 0
    if (!expression || typeof expression !== 'string') {
      return 0;
    }

    // First pass: Replace common math functions with Math.* equivalents
    // Ensure we only replace whole words with word boundaries
    let preparedExpression = expression
      .replace(/\bsin\b(?!\w)/g, 'Math.sin')
      .replace(/\bcos\b(?!\w)/g, 'Math.cos')
      .replace(/\btan\b(?!\w)/g, 'Math.tan')
      .replace(/\bexp\b(?!\w)/g, 'Math.exp')
      .replace(/\blog\b(?!\w)/g, 'Math.log')
      .replace(/\bln\b(?!\w)/g, 'Math.log')
      .replace(/\bsqrt\b(?!\w)/g, 'Math.sqrt')
      .replace(/\bpow\b(?!\w)/g, 'Math.pow')
      .replace(/\babs\b(?!\w)/g, 'Math.abs')
      .replace(/\^/g, '**'); // Convert caret operator to JS exponentiation
    
    // Second pass: Handle implicit multiplication with variables
    // Replace patterns like 7x with 7*x to make it valid JavaScript
    preparedExpression = preparedExpression.replace(/([0-9])([a-zA-Z])/g, '$1*$2');
    
    // Third pass: Handle implicit multiplication without spaces
    // e.g., (x+1)(x-1) -> (x+1)*(x-1)
    preparedExpression = preparedExpression.replace(/\)\(/g, ')*(');
    
    // Fourth pass: Handle coefficient multiplication with parentheses
    // e.g., 3(x+1) -> 3*(x+1)
    preparedExpression = preparedExpression.replace(/([0-9])\(/g, '$1*(');
    
    // Fifth pass: Handle special constants
    preparedExpression = preparedExpression
      .replace(/\bpi\b/gi, 'Math.PI')
      .replace(/\be\b/g, 'Math.E');
    
    console.log('Processed expression:', expression, '->', preparedExpression);
    
    // Create variables object with x and any additional variables
    const variables = { x, ...additionalVariables };
    
    // Create a function with all the variables as parameters
    const varNames = Object.keys(variables);
    const varValues = Object.values(variables);
    
    // Create the function dynamically with a more robust approach
    // Wrap the evaluation in a try-catch to handle errors more gracefully
    const fnBody = `
      try {
        return ${preparedExpression};
      } catch (e) {
        console.error('Error in expression evaluation:', e);
        return 0;
      }
    `;
    
    const fn = new Function(...varNames, fnBody);
    
    // Evaluate and return
    return fn(...varValues);
  } catch (e) {
    console.error('Error evaluating expression:', e, 'Original:', expression);
    return 0;
  }
}

/**
 * Parse an expression and generate a function
 * @param {string} expression - The mathematical expression
 * @returns {Function} - A function that takes x as input and returns the result
 */
export function createFunction(expression) {
  return (x) => evaluateExpression(expression, x);
}

/**
 * Parse a parametric expression and generate a function
 * @param {string} expression - The parametric expression that should return [x, y]
 * @returns {Function} - A function that takes t as input and returns [x, y]
 */
export function createParametricFunction(expression) {
  return (t) => {
    try {
      // If expression is empty, return a point on a circle
      if (!expression) {
        return [Math.cos(t), Math.sin(t)];
      }
      
      // Try to evaluate the expression as a parametric function
      let result;
      
      // Check if the expression is already in array notation [x(t), y(t)]
      if (expression.startsWith('[') && expression.endsWith(']')) {
        // Directly evaluate the array expression
        result = evaluateExpression(expression, t, { t });
      } else {
        // Try to evaluate as a single function that returns coordinates
        result = evaluateExpression(expression, t, { t });
      }
      
      // If result is an array, return it
      if (Array.isArray(result) && result.length >= 2) {
        return [result[0], result[1]];
      } else {
        // If not an array, return a point on a circle
        return [Math.cos(t), Math.sin(t)];
      }
    } catch (e) {
      console.error('Error in parametric function:', e);
      return [Math.cos(t), Math.sin(t)]; // Default to a circle
    }
  };
}

/**
 * Normalize a mathematical expression for display
 * @param {string} expression - The expression to normalize
 * @returns {string} - The normalized expression
 */
export function normalizeExpression(expression) {
  if (!expression || typeof expression !== 'string') {
    return 'x';
  }
  
  let normalized = expression
    // Remove Math. prefixes
    .replace(/Math\./g, '')
    // Convert ** back to ^
    .replace(/\*\*/g, '^')
    // Simplify unnecessary parentheses
    .replace(/\(\(([^()]+)\)\)/g, '($1)')
    // Fix spacing around operators
    .replace(/(\w)\s*([+\-*/^])\s*(\w)/g, '$1$2$3');
  
  return normalized;
}

/**
 * Validate if an expression can be safely evaluated
 * @param {string} expression - The expression to validate
 * @returns {boolean} - Whether the expression is valid
 */
export function isValidExpression(expression) {
  if (!expression || typeof expression !== 'string') {
    return false;
  }
  
  try {
    // Check for potentially unsafe constructs
    const unsafePatterns = [
      /eval\s*\(/i,
      /function\s*\(/i,
      /new\s+Function/i,
      /setTimeout\s*\(/i,
      /setInterval\s*\(/i,
      /fetch\s*\(/i,
      /\bwindow\b/i,
      /\bdocument\b/i,
      /\bconsole\b/i,
      /\balert\b/i,
      /\blocation\b/i
    ];
    
    // If any unsafe pattern is found, return false
    if (unsafePatterns.some(pattern => pattern.test(expression))) {
      return false;
    }
    
    // Try creating a function to test if it's syntactically valid
    // No need to actually execute it
    new Function('x', `return ${expression};`);
    
    return true;
  } catch (e) {
    return false;
  }
}

export default {
  evaluateExpression,
  createFunction,
  createParametricFunction,
  normalizeExpression,
  isValidExpression
};