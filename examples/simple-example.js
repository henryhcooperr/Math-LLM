/**
 * Math-LLM Simple Example
 * Demonstrates how to use the Math Visualization System to process a math problem
 * and generate an appropriate visualization.
 */

// Import the main functions from the library
import { processMathProblem, renderVisualization } from '../src/index';

// Example 1: Process a simple 2D function problem
async function example1() {
  const problem = "Graph the function f(x) = x^2 - 2x + 1 and identify its key features.";
  
  console.log("Example 1: Processing a 2D function problem");
  console.log("Problem:", problem);
  
  // Process the problem
  const solution = await processMathProblem(problem);
  
  // Log the analysis results
  console.log("Analysis:", solution.analysis);
  console.log("Selected Library:", solution.selectedLibrary);
  
  // Output the generated code
  console.log("Generated Code:");
  console.log(solution.visualizationCode.code);
  
  // Output the educational content
  console.log("Educational Content:");
  console.log(`Title: ${solution.educationalContent.title}`);
  console.log(`Summary: ${solution.educationalContent.summary}`);
  console.log(`Key Points:`, solution.educationalContent.keyPoints);
  
  // Render the visualization to a container element
  const container = document.getElementById('example1-container');
  if (container) {
    // Render directly using the selected library
    const visualization = renderVisualization({
      type: solution.analysis.concept.type,
      library: solution.selectedLibrary,
      expression: solution.analysis.concept.expression,
      domain: solution.analysis.parameters.domain,
      range: solution.analysis.parameters.range
    });
    
    container.appendChild(visualization);
  }
}

// Example 2: Process a 3D function problem
async function example2() {
  const problem = "Visualize the 3D function f(x,y) = sin(x) * cos(y) over the domain x in [-3,3] and y in [-3,3].";
  
  console.log("Example 2: Processing a 3D function problem");
  console.log("Problem:", problem);
  
  // Process the problem
  const solution = await processMathProblem(problem);
  
  // Log the analysis results
  console.log("Analysis:", solution.analysis);
  console.log("Selected Library:", solution.selectedLibrary);
  
  // Output the generated code
  console.log("Generated Code:");
  console.log(solution.visualizationCode.code);
  
  // Output the educational content
  console.log("Educational Content:");
  console.log(`Title: ${solution.educationalContent.title}`);
  console.log(`Summary: ${solution.educationalContent.summary}`);
  console.log(`Key Points:`, solution.educationalContent.keyPoints);
  
  // Render the visualization to a container element
  const container = document.getElementById('example2-container');
  if (container) {
    // Render directly using the selected library
    const visualization = renderVisualization({
      type: solution.analysis.concept.type,
      library: solution.selectedLibrary,
      expression: solution.analysis.concept.expression,
      domain: solution.analysis.parameters.domain,
      range: solution.analysis.parameters.range,
      zRange: solution.analysis.visualization.viewport.z
    });
    
    container.appendChild(visualization);
  }
}

// Example 3: Process a geometry problem
async function example3() {
  const problem = "Create a visualization of a triangle with vertices at (0,0), (4,0), and (2,3). Calculate its area and find the coordinates of its centroid.";
  
  console.log("Example 3: Processing a geometry problem");
  console.log("Problem:", problem);
  
  // Process the problem
  const solution = await processMathProblem(problem);
  
  // Log the analysis results
  console.log("Analysis:", solution.analysis);
  console.log("Selected Library:", solution.selectedLibrary);
  
  // Output the generated code
  console.log("Generated Code:");
  console.log(solution.visualizationCode.code);
  
  // Output the educational content
  console.log("Educational Content:");
  console.log(`Title: ${solution.educationalContent.title}`);
  console.log(`Summary: ${solution.educationalContent.summary}`);
  console.log(`Key Points:`, solution.educationalContent.keyPoints);
  
  // Render the visualization to a container element
  const container = document.getElementById('example3-container');
  if (container) {
    // Render directly using the selected library
    const visualization = renderVisualization({
      type: solution.analysis.concept.type,
      library: solution.selectedLibrary,
      domain: solution.analysis.parameters.domain,
      range: solution.analysis.parameters.range,
      points: [
        { label: 'A', coordinates: [0, 0], color: '#3090FF' },
        { label: 'B', coordinates: [4, 0], color: '#3090FF' },
        { label: 'C', coordinates: [2, 3], color: '#3090FF' }
      ]
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
    container1.id = 'example1-container';
    container1.innerHTML = '<h2>Example 1: 2D Function Visualization</h2>';
    app.appendChild(container1);
    
    // Example 2
    const container2 = document.createElement('div');
    container2.id = 'example2-container';
    container2.innerHTML = '<h2>Example 2: 3D Function Visualization</h2>';
    app.appendChild(container2);
    
    // Example 3
    const container3 = document.createElement('div');
    container3.id = 'example3-container';
    container3.innerHTML = '<h2>Example 3: Geometry Visualization</h2>';
    app.appendChild(container3);
    
    // Run the examples
    example1();
    example2();
    example3();
  }
});