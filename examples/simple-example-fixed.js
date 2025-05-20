/**
 * Math-LLM Simple Example with Fixed Expression Updating
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

// Example 4: Interactive Function Update
async function example4() {
  const container = document.getElementById('example4-container');
  if (!container) return;
  
  // Create UI elements
  const inputDiv = document.createElement('div');
  inputDiv.style.marginBottom = '10px';
  
  const expressionInput = document.createElement('input');
  expressionInput.type = 'text';
  expressionInput.placeholder = 'Enter a function (e.g., x^2, sin(x), etc.)';
  expressionInput.value = 'x^2 - 2*x + 1';
  expressionInput.style.width = '300px';
  expressionInput.style.marginRight = '10px';
  expressionInput.style.padding = '5px';
  
  const updateButton = document.createElement('button');
  updateButton.textContent = 'Update Visualization';
  updateButton.style.padding = '5px 10px';
  updateButton.style.backgroundColor = '#3498db';
  updateButton.style.color = 'white';
  updateButton.style.border = 'none';
  updateButton.style.borderRadius = '4px';
  updateButton.style.cursor = 'pointer';
  
  const visualizationDiv = document.createElement('div');
  visualizationDiv.style.height = '400px';
  visualizationDiv.style.border = '1px solid #ccc';
  visualizationDiv.style.marginTop = '10px';
  
  // Add elements to container
  inputDiv.appendChild(expressionInput);
  inputDiv.appendChild(updateButton);
  container.appendChild(inputDiv);
  container.appendChild(visualizationDiv);
  
  // Function to update the visualization
  async function updateVisualization() {
    const expression = expressionInput.value.trim();
    if (!expression) return;
    
    try {
      // Create a synthetic problem based on the input expression
      const problem = `Graph the function f(x) = ${expression}.`;
      
      // Process the problem
      const solution = await processMathProblem(problem);
      
      // Clear previous visualization
      visualizationDiv.innerHTML = '';
      
      // Render the new visualization
      const visualization = renderVisualization({
        type: solution.analysis.concept.type,
        library: solution.selectedLibrary,
        expression: solution.analysis.concept.expression, // Use the parsed expression from the analyzer
        domain: solution.analysis.parameters.domain,
        range: solution.analysis.parameters.range
      });
      
      visualizationDiv.appendChild(visualization);
    } catch (error) {
      console.error('Error updating visualization:', error);
      visualizationDiv.innerHTML = `<div style="color: red; padding: 20px;">Error: ${error.message}</div>`;
    }
  }
  
  // Add event listeners
  updateButton.addEventListener('click', updateVisualization);
  expressionInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') updateVisualization();
  });
  
  // Initial visualization
  updateVisualization();
}

// Run the examples when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  // Add container elements to the page
  const app = document.getElementById('app');
  if (app) {
    // Header
    const header = document.createElement('header');
    header.innerHTML = '<h1>Math-LLM Examples</h1><p>Demonstration of the Math Visualization System</p>';
    app.appendChild(header);
    
    // Example 1
    const container1 = document.createElement('div');
    container1.className = 'example-container';
    container1.innerHTML = '<h2>Example 1: 2D Function Visualization</h2><p>Graph the function f(x) = x^2 - 2x + 1 and identify its key features.</p>';
    const exampleDiv1 = document.createElement('div');
    exampleDiv1.id = 'example1-container';
    exampleDiv1.className = 'visualization-display';
    container1.appendChild(exampleDiv1);
    app.appendChild(container1);
    
    // Example 2
    const container2 = document.createElement('div');
    container2.className = 'example-container';
    container2.innerHTML = '<h2>Example 2: 3D Function Visualization</h2><p>Visualize the 3D function f(x,y) = sin(x) * cos(y) over the domain x in [-3,3] and y in [-3,3].</p>';
    const exampleDiv2 = document.createElement('div');
    exampleDiv2.id = 'example2-container';
    exampleDiv2.className = 'visualization-display';
    container2.appendChild(exampleDiv2);
    app.appendChild(container2);
    
    // Example 3
    const container3 = document.createElement('div');
    container3.className = 'example-container';
    container3.innerHTML = '<h2>Example 3: Geometry Visualization</h2><p>Create a visualization of a triangle with vertices at (0,0), (4,0), and (2,3). Calculate its area and find the coordinates of its centroid.</p>';
    const exampleDiv3 = document.createElement('div');
    exampleDiv3.id = 'example3-container';
    exampleDiv3.className = 'visualization-display';
    container3.appendChild(exampleDiv3);
    app.appendChild(container3);
    
    // Example 4
    const container4 = document.createElement('div');
    container4.className = 'example-container';
    container4.innerHTML = '<h2>Example 4: Interactive Expression Update</h2><p>Enter a mathematical expression and see the visualization update in real-time.</p>';
    const exampleDiv4 = document.createElement('div');
    exampleDiv4.id = 'example4-container';
    container4.appendChild(exampleDiv4);
    app.appendChild(container4);
    
    // Add some basic styling
    const style = document.createElement('style');
    style.textContent = `
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 20px;
        color: #333;
      }
      header {
        text-align: center;
        margin-bottom: 30px;
      }
      .example-container {
        margin-bottom: 40px;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #f9f9f9;
      }
      .visualization-display {
        height: 400px;
        width: 100%;
        border: 1px solid #ccc;
        background-color: white;
        margin-top: 10px;
      }
    `;
    document.head.appendChild(style);
    
    // Run the examples
    example1();
    example2();
    example3();
    example4();
  }
});