/**
 * Visualization Generator
 * Generates visualization code tailored to the selected library based on
 * the mathematical concepts and requirements from the analysis.
 */

import { mafsTemplates } from './templates/mafsTemplates';
import { mathboxTemplates } from './templates/mathboxTemplates';
import { jsxgraphTemplates } from './templates/jsxgraphTemplates';
import { d3Templates } from './templates/d3Templates';
import { threeTemplates } from './templates/threeTemplates';

/**
 * Generate visualization code for the selected library
 * @param {Object} analysis - The complete analysis from the math analyzer
 * @param {string} selectedLibrary - The selected visualization library
 * @returns {Object} - Generated code and related metadata following the output format
 */
export function generateVisualization(analysis, selectedLibrary) {
  // Get the template based on the library and concept type
  const template = getTemplate(selectedLibrary, analysis.concept.type);
  
  // Generate the code by filling in the template with analysis data
  const code = generateCode(template, analysis);
  
  // Determine the appropriate language based on the library
  const language = determineLanguage(selectedLibrary);
  
  // Get library-specific dependencies
  const dependencies = getDependencies(selectedLibrary);
  
  // Return the complete code generation result
  return {
    library: selectedLibrary,
    language,
    dependencies,
    code,
    helperFunctions: generateHelperFunctions(selectedLibrary, analysis),
    styles: generateStyles(selectedLibrary),
    example: generateExample(selectedLibrary, analysis),
    notes: generateNotes(selectedLibrary)
  };
}

/**
 * Get the appropriate template for the selected library and concept type
 * @param {string} library - The selected library
 * @param {string} conceptType - The type of mathematical concept
 * @returns {string} - The template code as a string
 */
function getTemplate(library, conceptType) {
  // Normalize the concept type
  const normalizedType = conceptType.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Select templates based on the library
  switch (library.toLowerCase()) {
    case 'mafs':
      return mafsTemplates[normalizedType] || mafsTemplates.default;
      
    case 'mathbox':
      return mathboxTemplates[normalizedType] || mathboxTemplates.default;
      
    case 'jsxgraph':
      return jsxgraphTemplates[normalizedType] || jsxgraphTemplates.default;
      
    case 'd3':
      return d3Templates[normalizedType] || d3Templates.default;
      
    case 'three':
      return threeTemplates[normalizedType] || threeTemplates.default;
      
    // Add more libraries as needed
      
    default:
      // If the library doesn't have specific templates, use a generic one
      return 'console.log("Template for ${library} not yet implemented");';
  }
}

/**
 * Generate the actual code by filling in the template with data from the analysis
 * @param {string} template - The template string
 * @param {Object} analysis - The complete analysis from the math analyzer
 * @returns {string} - The generated code
 */
function generateCode(template, analysis) {
  // Extract key data from the analysis
  const { concept, visualization, parameters, educational, code } = analysis;
  
  // Simple template variable replacement
  // In a real implementation, this would be more sophisticated with proper template parsing
  
  let result = template;
  
  // Replace concept-related placeholders
  result = result.replace(/\${concept\.type}/g, concept.type || '');
  result = result.replace(/\${concept\.subtype}/g, concept.subtype || '');
  result = result.replace(/\${concept\.expression}/g, concept.expression || '');
  
  // Replace visualization-related placeholders
  if (visualization) {
    result = result.replace(/\${visualization\.dimensionality}/g, visualization.dimensionality || '2D');
    result = result.replace(/\${visualization\.complexity}/g, visualization.complexity || 'intermediate');
  
    // Handle viewport
    if (visualization.viewport) {
      result = result.replace(/\${visualization\.viewport\.x}/g, JSON.stringify(visualization.viewport.x) || '[-10, 10]');
      result = result.replace(/\${visualization\.viewport\.y}/g, JSON.stringify(visualization.viewport.y) || '[-10, 10]');
      result = result.replace(/\${visualization\.viewport\.z}/g, JSON.stringify(visualization.viewport.z) || '[-10, 10]');
    }
  }
  
  // Replace parameters-related placeholders
  if (parameters) {
    result = result.replace(/\${parameters\.domain}/g, JSON.stringify(parameters.domain) || '[-10, 10]');
    result = result.replace(/\${parameters\.range}/g, JSON.stringify(parameters.range) || '[-10, 10]');
    
    // Handle functions
    if (parameters.functions && parameters.functions.length > 0) {
      const mainFunction = parameters.functions[0];
      result = result.replace(/\${parameters\.functions\[0\]\.expression}/g, mainFunction.expression || '');
      result = result.replace(/\${parameters\.functions\[0\]\.color}/g, mainFunction.color || '#3090FF');
    }
    
    // Handle points
    if (parameters.points && parameters.points.length > 0) {
      let pointsStr = [];
      parameters.points.forEach(point => {
        pointsStr.push(`{ label: "${point.label}", coordinates: [${point.coordinates.join(', ')}], color: "${point.color || '#000000'}" }`);
      });
      result = result.replace(/\${parameters\.points}/g, '[' + pointsStr.join(',\n  ') + ']');
    } else {
      result = result.replace(/\${parameters\.points}/g, '[]');
    }
  }
  
  // Replace code configuration placeholders
  if (code && code.configuration) {
    // Handle configuration as a JSON string
    result = result.replace(/\${code\.configuration}/g, JSON.stringify(code.configuration, null, 2));
  }
  
  // Replace educational content placeholders
  if (educational) {
    result = result.replace(/\${educational\.title}/g, educational.title || '');
    result = result.replace(/\${educational\.summary}/g, educational.summary || '');
  }
  
  return result;
}

/**
 * Determine the appropriate programming language based on the library
 * @param {string} library - The selected library
 * @returns {string} - The programming language (javascript, typescript, jsx, etc.)
 */
function determineLanguage(library) {
  switch (library.toLowerCase()) {
    case 'mafs':
      return 'jsx'; // Mafs is React-based
    case 'mathbox':
    case 'three':
    case 'jsxgraph':
    case 'd3':
      return 'javascript';
    // Add more mappings as needed
    default:
      return 'javascript';
  }
}

/**
 * Get the dependencies for the selected library
 * @param {string} library - The selected library
 * @returns {Array} - Array of dependency objects
 */
function getDependencies(library) {
  switch (library.toLowerCase()) {
    case 'mafs':
      return [
        { name: 'mafs', version: '^0.15.2', installCommand: 'npm install mafs' },
        { name: 'react', version: '^17.0.0 || ^18.0.0', installCommand: 'npm install react' }
      ];
      
    case 'mathbox':
      return [
        { name: 'mathbox', version: '^0.0.5', installCommand: 'npm install mathbox' },
        { name: 'three', version: '^0.146.0', installCommand: 'npm install three' }
      ];
      
    case 'jsxgraph':
      return [
        { name: 'jsxgraph', version: '^1.4.6', installCommand: 'npm install jsxgraph' }
      ];
      
    case 'd3':
      return [
        { name: 'd3', version: '^7.8.0', installCommand: 'npm install d3' }
      ];
      
    case 'three':
      return [
        { name: 'three', version: '^0.146.0', installCommand: 'npm install three' }
      ];
      
    // Add more libraries as needed
      
    default:
      return [
        { name: library, version: 'latest', installCommand: `npm install ${library}` }
      ];
  }
}

/**
 * Generate helper functions specific to the library and analysis
 * @param {string} library - The selected library
 * @param {Object} analysis - The complete analysis
 * @returns {Object} - Map of helper function names to their code
 */
function generateHelperFunctions(library, analysis) {
  // This would contain library-specific helper functions
  const helpers = {};
  
  switch (library.toLowerCase()) {
    case 'mathbox':
      helpers.createMathBoxInstance = `
/**
 * Create a MathBox instance with standard configuration
 * @param {string} elementId - The ID of the container element
 * @param {Object} options - Configuration options
 * @returns {Object} - The MathBox instance
 */
function createMathBoxInstance(elementId, options = {}) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(\`Element with ID \${elementId} not found\`);
    return null;
  }
  
  const mathbox = mathBox({
    plugins: ['core', 'controls', 'cursor'],
    controls: {
      klass: THREE.OrbitControls
    },
    element: element,
    ...options
  });
  
  // Access the underlying three.js renderer, scene, and camera
  const three = mathbox.three;
  
  // Set the renderer background color
  three.renderer.setClearColor(new THREE.Color(options.backgroundColor || '#FFFFFF'), 1.0);
  
  return mathbox;
}`;
      break;
      
    case 'jsxgraph':
      helpers.createFunction = `
/**
 * Create a function graph on a JSXGraph board
 * @param {Object} board - The JSXGraph board
 * @param {string} expression - The function expression
 * @param {Array} domain - The domain [min, max]
 * @param {string} color - The line color
 * @returns {Object} - The created function graph
 */
function createFunction(board, expression, domain, color = '#3090FF') {
  try {
    // Parse the expression into a JavaScript function
    const fn = new Function('x', \`return \${expression};\`);
    
    // Create the function graph
    return board.create('functiongraph', [
      fn,
      domain[0],
      domain[1]
    ], {
      strokeColor: color,
      strokeWidth: 2
    });
  } catch (e) {
    console.error('Error creating function:', e);
    return null;
  }
}`;
      break;
      
    // Add more libraries as needed
  }
  
  return helpers;
}

/**
 * Generate CSS styles for the visualization if needed
 * @param {string} library - The selected library
 * @returns {string} - CSS styles as a string
 */
function generateStyles(library) {
  switch (library.toLowerCase()) {
    case 'jsxgraph':
      return `
.jxgbox {
  width: 100%;
  height: 400px;
  margin: 20px auto;
  border: 1px solid #ccc;
}`;
      
    case 'd3':
      return `
.visualization-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.line {
  fill: none;
  stroke: #3090FF;
  stroke-width: 2px;
}

.grid line {
  stroke: #eee;
  shape-rendering: crispEdges;
}`;
      
    // Add more libraries as needed
      
    default:
      return '';
  }
}

/**
 * Generate an example of how to use the visualization
 * @param {string} library - The selected library
 * @param {Object} analysis - The complete analysis
 * @returns {string} - Example usage code
 */
function generateExample(library, analysis) {
  switch (library.toLowerCase()) {
    case 'mafs':
      return `
import React from 'react';
import { MathVisualization } from './MathVisualization';

function App() {
  return (
    <div>
      <h1>${analysis.educational?.title || 'Mathematical Visualization'}</h1>
      <p>${analysis.educational?.summary || 'An interactive visualization of a mathematical concept.'}</p>
      <MathVisualization 
        expression="${analysis.concept?.expression || 'x^2'}"
        domain={${JSON.stringify(analysis.parameters?.domain || [-10, 10])}}
        range={${JSON.stringify(analysis.parameters?.range || [-10, 10])}}
      />
    </div>
  );
}

export default App;`;
      
    case 'mathbox':
      return `
<!DOCTYPE html>
<html>
<head>
  <title>${analysis.educational?.title || 'MathBox Visualization'}</title>
  <script src="https://cdn.jsdelivr.net/npm/three@0.146.0/build/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mathbox@0.0.5/build/mathbox.min.js"></script>
  <style>
    body { margin: 0; }
    #visualization { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="visualization"></div>
  <script src="./visualization.js"></script>
  <script>
    // Initialize the visualization
    initVisualization('visualization');
  </script>
</body>
</html>`;
      
    // Add more libraries as needed
      
    default:
      return `// Example usage for ${library} not yet implemented`;
  }
}

/**
 * Generate notes about the visualization implementation
 * @param {string} library - The selected library
 * @returns {Array} - Array of note strings
 */
function generateNotes(library) {
  switch (library.toLowerCase()) {
    case 'mafs':
      return [
        'Mafs is a React library, so this code should be used in a React application.',
        'Make sure to install the required dependencies with: npm install mafs react',
        'Adjust the domain and range as needed for your specific visualization.'
      ];
      
    case 'mathbox':
      return [
        'MathBox requires Three.js as a dependency.',
        'This visualization uses WebGL and requires browser support for it.',
        'For more complex visualizations, consider adjusting the resolution parameters.',
        'MathBox provides excellent presentation-quality renders for 3D mathematical concepts.'
      ];
      
    case 'jsxgraph':
      return [
        'JSXGraph works with plain HTML and JavaScript, no framework required.',
        'Include the JSXGraph CSS file in addition to the JavaScript library.',
        'The board can be made responsive by adjusting the size or using a resize observer.'
      ];
      
    // Add more libraries as needed
      
    default:
      return [
        `Implementation notes for ${library} will be provided upon selection.`
      ];
  }
}