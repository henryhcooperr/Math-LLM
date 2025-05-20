/**
 * Expression Parser
 * Utilities for parsing and evaluating mathematical expressions
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
    let preparedExpression = expression
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/exp\(/g, 'Math.exp(')
      .replace(/log\(/g, 'Math.log(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/pow\(/g, 'Math.pow(')
      .replace(/abs\(/g, 'Math.abs(')
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
    
    console.log('Processed expression:', expression, '->', preparedExpression);
    
    // Create variables object with x and any additional variables
    const variables = { x, ...additionalVariables };
    
    // Create a function with all the variables as parameters
    const varNames = Object.keys(variables);
    const varValues = Object.values(variables);
    
    // Create the function dynamically
    const fn = new Function(...varNames, `return ${preparedExpression};`);
    
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
      const result = evaluateExpression(expression, t, { t });
      
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

export default {
  evaluateExpression,
  createFunction,
  createParametricFunction
};