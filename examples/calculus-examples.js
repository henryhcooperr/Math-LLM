/**
 * Math-LLM Calculus Examples
 * Demonstrates how to use the Math Visualization System with Wolfram Alpha integration
 * to process and visualize calculus operations.
 */

// Import the main functions from the library
import { processMathProblem, renderVisualization } from '../src/index';
import * as wolframAlphaService from '../src/services/wolframAlphaService';

// Example 1: Derivative Visualization
async function derivativeExample() {
  const problem = "Find the derivative of f(x) = x^3 - 3x^2 + 2x - 1 and visualize both functions.";
  
  console.log("Example 1: Processing a Derivative Problem");
  console.log("Problem:", problem);
  
  // Process the problem
  const solution = await processMathProblem(problem);
  
  // Get the derivative directly using Wolfram Alpha service
  const originalExpression = "x^3 - 3x^2 + 2x - 1";
  const derivative = await wolframAlphaService.getDerivative(originalExpression);
  
  console.log("Original Function:", originalExpression);
  console.log("Derivative:", derivative);
  
  // Log the analysis results
  console.log("Analysis:", solution.analysis);
  console.log("Selected Library:", solution.selectedLibrary);
  
  // Output the educational content
  console.log("Educational Content:");
  console.log(`Title: ${solution.educationalContent.title}`);
  console.log(`Summary: ${solution.educationalContent.summary}`);
  console.log(`Key Points:`, solution.educationalContent.keyPoints);
  
  // Render the visualization to a container element
  const container = document.getElementById('derivative-container');
  if (container) {
    // Render directly using the selected library
    const visualization = renderVisualization({
      type: "calculus",
      subtype: "derivative",
      library: solution.selectedLibrary,
      expression: originalExpression,
      derivativeExpression: derivative,
      domain: [-2, 4],
      range: [-10, 10],
      functions: [
        { label: 'f(x)', expression: originalExpression, color: '#3090FF' },
        { label: 'f\'(x)', expression: derivative, color: '#FF5733' }
      ]
    });
    
    container.appendChild(visualization);
  }
}

// Example 2: Integral Visualization
async function integralExample() {
  const problem = "Calculate the integral of f(x) = x^2 * sin(x) and visualize the result.";
  
  console.log("Example 2: Processing an Integral Problem");
  console.log("Problem:", problem);
  
  // Process the problem
  const solution = await processMathProblem(problem);
  
  // Get the integral directly using Wolfram Alpha service
  const originalExpression = "x^2 * sin(x)";
  const integral = await wolframAlphaService.getIntegral(originalExpression);
  
  console.log("Original Function:", originalExpression);
  console.log("Integral:", integral);
  
  // Log the analysis results
  console.log("Analysis:", solution.analysis);
  console.log("Selected Library:", solution.selectedLibrary);
  
  // Output the educational content
  console.log("Educational Content:");
  console.log(`Title: ${solution.educationalContent.title}`);
  console.log(`Summary: ${solution.educationalContent.summary}`);
  console.log(`Key Points:`, solution.educationalContent.keyPoints);
  
  // Render the visualization to a container element
  const container = document.getElementById('integral-container');
  if (container) {
    // Render directly using the selected library
    const visualization = renderVisualization({
      type: "calculus",
      subtype: "integral",
      library: solution.selectedLibrary,
      expression: originalExpression,
      integralExpression: integral,
      domain: [0, 2 * Math.PI],
      range: [-10, 10],
      functions: [
        { label: 'f(x)', expression: originalExpression, color: '#3090FF' },
        { label: '∫f(x)', expression: integral, color: '#32CD32' }
      ],
      options: {
        shadeArea: true,
        areaColor: 'rgba(50, 205, 50, 0.3)',
        integrationRange: [0, Math.PI]
      }
    });
    
    container.appendChild(visualization);
  }
}

// Example 3: Limit Visualization
async function limitExample() {
  const problem = "Find the limit of f(x) = (sin(x))/x as x approaches 0 and visualize the function.";
  
  console.log("Example 3: Processing a Limit Problem");
  console.log("Problem:", problem);
  
  // Process the problem
  const solution = await processMathProblem(problem);
  
  // Get the limit directly using Wolfram Alpha service
  const expression = "(sin(x))/x";
  const limitValue = await wolframAlphaService.getLimit(expression, 'x', 0);
  
  console.log("Function:", expression);
  console.log("Limit as x approaches 0:", limitValue);
  
  // Log the analysis results
  console.log("Analysis:", solution.analysis);
  console.log("Selected Library:", solution.selectedLibrary);
  
  // Output the educational content
  console.log("Educational Content:");
  console.log(`Title: ${solution.educationalContent.title}`);
  console.log(`Summary: ${solution.educationalContent.summary}`);
  console.log(`Key Points:`, solution.educationalContent.keyPoints);
  
  // Render the visualization to a container element
  const container = document.getElementById('limit-container');
  if (container) {
    // Render directly using the selected library
    const visualization = renderVisualization({
      type: "calculus",
      subtype: "limit",
      library: solution.selectedLibrary,
      expression: expression,
      limitValue: limitValue,
      limitPoint: 0,
      domain: [-2 * Math.PI, 2 * Math.PI],
      range: [-0.5, 1.5],
      functions: [
        { label: 'f(x)', expression: expression, color: '#3090FF' },
      ],
      options: {
        highlightPoint: true,
        pointColor: '#FF5733',
        pointSize: 5,
        showAsymptote: true,
        asymptoteColor: '#9932CC'
      }
    });
    
    container.appendChild(visualization);
  }
}

// Example 4: Combined Calculus Operations
async function combinedExample() {
  const problem = "For f(x) = x^2 * e^(-x), find its derivative, integral from 0 to 2, and limit as x approaches infinity.";
  
  console.log("Example 4: Processing Combined Calculus Operations");
  console.log("Problem:", problem);
  
  // Process the problem
  const solution = await processMathProblem(problem);
  
  // Get calculus operations directly using Wolfram Alpha service
  const expression = "x^2 * e^(-x)";
  const derivative = await wolframAlphaService.getDerivative(expression);
  const integral = await wolframAlphaService.getIntegral(expression);
  const limit = await wolframAlphaService.getLimit(expression, 'x', 'infinity');
  
  console.log("Original Function:", expression);
  console.log("Derivative:", derivative);
  console.log("Integral:", integral);
  console.log("Limit as x approaches infinity:", limit);
  
  // Create a detailed analysis with all the operations
  const fullAnalysis = {
    originalFunction: expression,
    derivative: derivative,
    integral: integral,
    limit: limit,
    notes: [
      "The function f(x) = x^2 * e^(-x) approaches 0 as x approaches infinity",
      "The derivative shows where the function increases and decreases",
      "The integral represents the area under the curve"
    ]
  };
  
  console.log("Full Analysis:", fullAnalysis);
  
  // Render the visualization to a container element
  const container = document.getElementById('combined-container');
  if (container) {
    // Create a visualization that shows all operations
    const visualization = renderVisualization({
      type: "calculus",
      subtype: "combined",
      library: solution.selectedLibrary,
      expression: expression,
      derivativeExpression: derivative,
      integralExpression: integral,
      limitValue: limit,
      domain: [0, 8],
      range: [-1, 4],
      functions: [
        { label: 'f(x)', expression: expression, color: '#3090FF' },
        { label: 'f\'(x)', expression: derivative, color: '#FF5733' },
        { label: '∫f(x)', expression: integral, color: '#32CD32' }
      ],
      options: {
        showAllFunctions: true,
        highlightCriticalPoints: true,
        showLimitAsymptote: true
      }
    });
    
    container.appendChild(visualization);
  }
}

// Run the examples when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  // Add container elements to the page
  const app = document.getElementById('app');
  if (app) {
    // Example 1
    const container1 = document.createElement('div');
    container1.id = 'derivative-container';
    container1.innerHTML = '<h2>Example 1: Derivative Visualization</h2>';
    container1.className = 'example-container';
    app.appendChild(container1);
    
    // Example 2
    const container2 = document.createElement('div');
    container2.id = 'integral-container';
    container2.innerHTML = '<h2>Example 2: Integral Visualization</h2>';
    container2.className = 'example-container';
    app.appendChild(container2);
    
    // Example 3
    const container3 = document.createElement('div');
    container3.id = 'limit-container';
    container3.innerHTML = '<h2>Example 3: Limit Visualization</h2>';
    container3.className = 'example-container';
    app.appendChild(container3);
    
    // Example 4
    const container4 = document.createElement('div');
    container4.id = 'combined-container';
    container4.innerHTML = '<h2>Example 4: Combined Calculus Operations</h2>';
    container4.className = 'example-container';
    app.appendChild(container4);
    
    // Run the examples
    derivativeExample();
    integralExample();
    limitExample();
    combinedExample();
  }
});