/**
 * Math Visualization System
 * Main entry point for the application that processes math problems and generates
 * appropriate visualizations using optimal libraries.
 */

// Import the main.js file which sets up the user interface
import './main';

import { analyzeMathProblem } from './analyzer/mathAnalyzer';
import { selectLibrary } from './libraries/librarySelector';
import { generateVisualization } from './generators/visualizationGenerator';
import { createEducationalContent } from './content/educationalContent';
import { generateSolutionExplanation } from './content/solutionExplanationGenerator';
import wolframAlphaService from './services/wolframAlphaService';

/**
 * Process a math problem and generate appropriate visualization and educational content
 * @param {string} problem - The math problem or question in natural language
 * @returns {Object} - Complete solution with visualization code and educational content
 */
export async function processMathProblem(problem) {
  // 1. Analyze the problem to extract mathematical concepts and requirements
  const analysis = await analyzeMathProblem(problem);
  
  // 2. Select the optimal library based on the concept type and visualization needs
  const selectedLibrary = selectLibrary(analysis);
  
  // 3. Generate visualization code tailored to the selected library
  const visualizationCode = generateVisualization(analysis, selectedLibrary);
  
  // 4. Create educational content to accompany the visualization
  const educationalContent = createEducationalContent(analysis);
  
  // 5. Generate step-by-step solution explanation
  const solutionExplanation = await generateSolutionExplanation(problem, analysis);
  
  // 6. Combine elements into a complete solution
  return {
    analysis,
    selectedLibrary,
    visualizationCode,
    educationalContent,
    solutionExplanation
  };
}

/**
 * Render a visualization directly with the appropriate library
 * @param {Object} options - Visualization options following the standardized props interface
 * @returns {HTMLElement} - The rendered visualization element
 */
export function renderVisualization(options) {
  const { library = 'auto', ...props } = options;
  
  // If library is 'auto', select the best library based on the visualization type
  const actualLibrary = library === 'auto' 
    ? selectLibrary({ concept: { type: props.type } }) 
    : library;
  
  try {
    // Use our new renderer system
    const { default: render } = require('./renderers/renderVisualization');
    return render({
      library: actualLibrary,
      ...props
    });
  } catch (error) {
    console.error("Error rendering visualization:", error);
    // Fallback to older renderer if available
    try {
      const renderer = require(`./renderers/${actualLibrary}Renderer`).default;
      return renderer.render(props);
    } catch (e) {
      console.error("Both renderers failed:", e);
      const errorDiv = document.createElement('div');
      errorDiv.innerText = `Error rendering visualization: ${error.message}`;
      return errorDiv;
    }
  }
}

/**
 * Calculate the derivative of a function using Wolfram Alpha
 * @param {string} expression - The expression to differentiate
 * @param {string} variable - The variable to differentiate with respect to
 * @returns {Promise<string>} - The derivative
 */
export async function getDerivative(expression, variable = 'x') {
  return await wolframAlphaService.getDerivative(expression, variable);
}

/**
 * Calculate the integral of a function using Wolfram Alpha
 * @param {string} expression - The expression to integrate
 * @param {string} variable - The variable to integrate with respect to
 * @returns {Promise<string>} - The integral
 */
export async function getIntegral(expression, variable = 'x') {
  return await wolframAlphaService.getIntegral(expression, variable);
}

/**
 * Calculate the limit of a function using Wolfram Alpha
 * @param {string} expression - The expression to find the limit of
 * @param {string} variable - The variable in the limit
 * @param {string|number} value - The value the variable approaches
 * @returns {Promise<string>} - The limit
 */
export async function getLimit(expression, variable = 'x', value = 0) {
  return await wolframAlphaService.getLimit(expression, variable, value);
}

/**
 * Solve an equation using Wolfram Alpha
 * @param {string} equation - The equation to solve
 * @param {string} variable - The variable to solve for
 * @returns {Promise<Array<string>>} - The solutions
 */
export async function solveEquation(equation, variable = 'x') {
  return await wolframAlphaService.solveEquation(equation, variable);
}

/**
 * Simplify an expression using Wolfram Alpha
 * @param {string} expression - The expression to simplify
 * @returns {Promise<string>} - The simplified expression
 */
export async function simplifyExpression(expression) {
  return await wolframAlphaService.simplifyExpression(expression);
}

/**
 * Generate a step-by-step explanation for a math problem
 * @param {string} problem - The math problem in natural language
 * @param {Object} analysis - Optional pre-analyzed problem
 * @returns {Promise<Object>} - Step-by-step explanation
 */
export async function generateStepByStepExplanation(problem, analysis = null) {
  // If analysis is not provided, analyze the problem first
  if (!analysis) {
    analysis = await analyzeMathProblem(problem);
  }
  
  // Generate and return the step-by-step explanation
  return await generateSolutionExplanation(problem, analysis);
}

// Export additional services
export const wolfram = wolframAlphaService;