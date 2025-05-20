/**
 * LLM Visualization Connector
 * Connects the LLM service with the visualization system to create a complete
 * math visualization experience based on natural language queries.
 */

import LLMService from './llmService';
import { analyzeMathProblem } from '../analyzer/mathAnalyzer';
import { selectLibrary } from '../libraries/librarySelector';
import { generateVisualization } from '../generators/visualizationGenerator';
import { createEducationalContent } from '../content/educationalContent';
import { generateSolutionExplanation } from '../content/solutionExplanationGenerator';

/**
 * Connector class that bridges LLM responses with the visualization system
 */
class LLMVisualizationConnector {
  constructor(options = {}) {
    // Initialize the LLM service
    this.llmService = new LLMService(options.llm);
    
    // Configuration options
    this.options = {
      useLLMAnalysis: true, // Whether to use LLM for analysis or local analyzer
      combineExplanations: true, // Whether to combine LLM and local explanations
      enhanceVisualizations: true, // Whether to enhance visualizations with advanced features
      ...options
    };
  }
  
  /**
   * Process a math problem and generate visualization and educational content
   * @param {string} problem - The math problem or question in natural language
   * @param {Object} options - Processing options
   * @returns {Promise<Object>} - Complete solution with visualization and educational content
   */
  async processMathProblem(problem, options = {}) {
    // Default options
    const processingOptions = {
      maintainContext: true,
      useLocalAnalysis: !this.options.useLLMAnalysis,
      ...options
    };
    
    try {
      // ===== STEP 1: Get LLM analysis and recommendations =====
      const llmResponse = await this.llmService.processMathProblem(
        problem, 
        { maintainContext: processingOptions.maintainContext }
      );
      
      // ===== STEP 2: Perform local analysis if needed or for validation =====
      let localAnalysis = null;
      if (processingOptions.useLocalAnalysis) {
        localAnalysis = await analyzeMathProblem(problem);
      }
      
      // ===== STEP 3: Create the final analysis by combining or selecting =====
      const analysis = this.createFinalAnalysis(llmResponse, localAnalysis, processingOptions);
      
      // ===== STEP 4: Select the visualization library =====
      // Use LLM recommendation or select based on analysis
      const selectedLibrary = llmResponse.visualizationParams.recommendedLibrary || 
                             selectLibrary(analysis);
      
      // ===== STEP 5: Generate visualization code =====
      const visualizationCode = this.generateEnhancedVisualization(
        analysis, 
        selectedLibrary, 
        llmResponse.visualizationParams
      );
      
      // ===== STEP 6: Create educational content =====
      const educationalContent = this.createFinalEducationalContent(
        llmResponse, 
        analysis, 
        processingOptions
      );
      
      // ===== STEP 7: Generate step-by-step solution =====
      const solutionExplanation = await generateSolutionExplanation(problem, analysis);
      
      // ===== STEP 8: Combine everything into a complete solution =====
      return {
        // Original problem
        query: problem,
        
        // Analysis information (combined or local)
        analysis: analysis,
        
        // Selected library for visualization
        selectedLibrary,
        
        // Visualization code and parameters
        visualizationCode,
        visualizationParams: llmResponse.visualizationParams,
        
        // Educational content
        explanation: llmResponse.explanation,
        educationalContent,
        solutionExplanation,
        
        // Follow-up questions for continued learning
        followUpQuestions: llmResponse.followUpQuestions || []
      };
    } catch (error) {
      console.error('Error in LLM Visualization Connector:', error);
      
      // Fallback to local processing if LLM fails
      if (!processingOptions.useLocalAnalysis) {
        console.log('Falling back to local analysis due to LLM failure');
        return this.processMathProblem(problem, { ...options, useLocalAnalysis: true });
      }
      
      throw error;
    }
  }
  
  /**
   * Create the final analysis by combining LLM and local analysis or selecting one
   * @param {Object} llmResponse - The parsed LLM response
   * @param {Object} localAnalysis - The local analysis result (if available)
   * @param {Object} options - Processing options
   * @returns {Object} - The final analysis to use for visualization
   */
  createFinalAnalysis(llmResponse, localAnalysis, options) {
    // If using local analysis exclusively, return it
    if (options.useLocalAnalysis && localAnalysis) {
      return localAnalysis;
    }
    
    // If no local analysis, create an analysis object from LLM response
    if (!localAnalysis) {
      return this.createAnalysisFromLLMResponse(llmResponse);
    }
    
    // Otherwise, combine the analyses, preferring LLM for high-level understanding
    // and local analysis for details and parameters
    return {
      ...localAnalysis,
      concept: {
        ...localAnalysis.concept,
        type: llmResponse.visualizationParams.type || localAnalysis.concept.type,
        expression: llmResponse.visualizationParams.expression || localAnalysis.concept.expression
      },
      parameters: {
        ...localAnalysis.parameters,
        domain: llmResponse.visualizationParams.domain || localAnalysis.parameters.domain,
        range: llmResponse.visualizationParams.range || localAnalysis.parameters.range
      },
      visualization: {
        ...localAnalysis.visualization,
        recommendedLibrary: llmResponse.visualizationParams.recommendedLibrary || 
                           localAnalysis.visualization.recommendedLibrary
      }
    };
  }
  
  /**
   * Create an analysis object from the LLM response
   * @param {Object} llmResponse - The parsed LLM response
   * @returns {Object} - Analysis object in the format expected by visualization generators
   */
  createAnalysisFromLLMResponse(llmResponse) {
    const params = llmResponse.visualizationParams;
    
    // Extract domain and range based on visualization type
    let domain, range, zRange;
    
    if (params.type === 'function3D') {
      domain = params.domainX || params.domain || [-10, 10];
      range = params.domainY || params.range || [-10, 10];
      zRange = params.range || [-10, 10];
    } else {
      domain = params.domain || [-10, 10];
      range = params.range || [-10, 10];
    }
    
    // Create the analysis object structure expected by our system
    return {
      concept: {
        type: params.type,
        subtype: params.subtype,
        expression: params.expression,
        variables: this.extractVariables(params)
      },
      parameters: {
        domain,
        range,
        ...(params.type === 'function3D' && { zRange }),
        ...(params.functions && { functions: params.functions }),
        ...(params.points && { points: params.points }),
        ...(params.elements && { elements: params.elements })
      },
      visualization: {
        recommendedLibrary: params.recommendedLibrary,
        dimensionality: params.type.includes('3D') ? '3D' : '2D',
        viewport: {
          x: domain,
          y: range,
          z: zRange || [-10, 10]
        }
      }
    };
  }
  
  /**
   * Extract variables from visualization parameters
   * @param {Object} params - The visualization parameters
   * @returns {Array} - Array of variable names
   */
  extractVariables(params) {
    if (params.variables) {
      return params.variables;
    }
    
    // Default variables based on visualization type
    switch (params.type) {
      case 'function2D':
        return ['x'];
      case 'function3D':
        return ['x', 'y'];
      case 'parametric2D':
      case 'parametric3D':
        return ['t'];
      case 'vectorField':
        return params.dimensionality === '3D' ? ['x', 'y', 'z'] : ['x', 'y'];
      default:
        return ['x'];
    }
  }
  
  /**
   * Generate enhanced visualization code
   * @param {Object} analysis - The math problem analysis
   * @param {string} library - The selected visualization library
   * @param {Object} llmParams - Visualization parameters from LLM
   * @returns {Object} - Generated visualization code
   */
  generateEnhancedVisualization(analysis, library, llmParams) {
    // First generate the basic visualization
    const basicVisualization = generateVisualization(analysis, library);
    
    // If enhancement is disabled, return the basic visualization
    if (!this.options.enhanceVisualizations) {
      return basicVisualization;
    }
    
    // Otherwise, enhance the visualization based on the type
    let enhancedCode = basicVisualization.code;
    
    // Add interactivity based on visualization type
    switch (analysis.concept.type) {
      case 'function2D':
        enhancedCode = this.enhanceFunction2D(enhancedCode, library, llmParams);
        break;
      case 'function3D':
        enhancedCode = this.enhanceFunction3D(enhancedCode, library, llmParams);
        break;
      case 'geometry':
        enhancedCode = this.enhanceGeometry(enhancedCode, library, llmParams);
        break;
      // Add cases for other types
    }
    
    // Return the enhanced visualization
    return {
      ...basicVisualization,
      code: enhancedCode,
      enhanced: true
    };
  }
  
  /**
   * Enhance a 2D function visualization
   * @param {string} code - Original visualization code
   * @param {string} library - Visualization library
   * @param {Object} params - Visualization parameters from LLM
   * @returns {string} - Enhanced visualization code
   */
  enhanceFunction2D(code, library, params) {
    // Add enhancements based on the library
    switch (library) {
      case 'mafs':
        // Add interactive controls for Mafs
        if (!code.includes('useState')) {
          code = code.replace(
            'import React from \'react\';',
            'import React, { useState } from \'react\';'
          );
        }
        
        // Add parameter sliders if not already present
        if (!code.includes('Slider')) {
          code = this.addMafsParameterSliders(code, params);
        }
        
        // Add derivative toggle if not already present
        if (!code.includes('showDerivative') && !params.subtype?.includes('parametric')) {
          code = this.addMafsDerivativeToggle(code, params);
        }
        break;
        
      case 'jsxgraph':
        // Add interactive elements for JSXGraph
        if (!code.includes('slider')) {
          code = this.addJSXGraphInteractiveElements(code, params);
        }
        break;
        
      // Add cases for other libraries
    }
    
    return code;
  }
  
  /**
   * Enhance a 3D function visualization
   * @param {string} code - Original visualization code
   * @param {string} library - Visualization library
   * @param {Object} params - Visualization parameters from LLM
   * @returns {string} - Enhanced visualization code
   */
  enhanceFunction3D(code, library, params) {
    // Add enhancements based on the library
    switch (library) {
      case 'mathbox':
        // Add view controls if not already present
        if (!code.includes('view controls')) {
          code = this.addMathBoxViewControls(code, params);
        }
        
        // Add color controls if not already present
        if (!code.includes('color control')) {
          code = this.addMathBoxColorControls(code, params);
        }
        break;
        
      case 'threejs':
        // Add camera and lighting controls for Three.js
        if (!code.includes('camera controls')) {
          code = this.addThreeJSControls(code, params);
        }
        break;
        
      // Add cases for other libraries
    }
    
    return code;
  }
  
  /**
   * Enhance a geometry visualization
   * @param {string} code - Original visualization code
   * @param {string} library - Visualization library
   * @param {Object} params - Visualization parameters from LLM
   * @returns {string} - Enhanced visualization code
   */
  enhanceGeometry(code, library, params) {
    // Add enhancements based on the library
    switch (library) {
      case 'jsxgraph':
        // Add measurement tools if not already present
        if (!code.includes('measurement')) {
          code = this.addJSXGraphMeasurements(code, params);
        }
        
        // Add draggable points if not already present
        if (!code.includes('draggable')) {
          code = this.addJSXGraphDraggablePoints(code, params);
        }
        break;
        
      // Add cases for other libraries
    }
    
    return code;
  }
  
  /**
   * Add parameter sliders to a Mafs visualization
   * @param {string} code - Original visualization code
   * @param {Object} params - Visualization parameters
   * @returns {string} - Enhanced code with parameter sliders
   */
  addMafsParameterSliders(code, params) {
    // Find the component function declaration
    const componentMatch = code.match(/export\s+const\s+(\w+)\s*=\s*\(\s*\{[^}]*\}\s*\)\s*=>\s*{/);
    if (!componentMatch) return code;
    
    // Add state hooks
    const stateHooks = `
  // Add parameters that can be adjusted by the user
  const [paramA, setParamA] = useState(1);
  const [paramB, setParamB] = useState(1);`;
    
    // Add slider controls
    const sliderControls = `
  // Parameter control slider component
  const ParameterSlider = ({ label, value, min, max, step, onChange }) => (
    <div style={{ margin: '10px 0' }}>
      <label style={{ display: 'inline-block', width: '60px' }}>{label}:</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '120px' }}
      />
      <span style={{ marginLeft: '10px' }}>{value.toFixed(2)}</span>
    </div>
  );`;
    
    // Add the sliders to the return statement
    const slidersJSX = `
      <div style={{ marginTop: '20px' }}>
        <ParameterSlider
          label="a"
          value={paramA}
          min={-5}
          max={5}
          step={0.1}
          onChange={setParamA}
        />
        <ParameterSlider
          label="b"
          value={paramB}
          min={-5}
          max={5}
          step={0.1}
          onChange={setParamB}
        />
      </div>`;
    
    // Update the function to use parameters
    let updatedExpression = params.expression;
    if (updatedExpression) {
      updatedExpression = updatedExpression.replace(/(\d+)([*])?/g, 'paramA$2');
      updatedExpression = updatedExpression.replace(/([+-]\s*\d+)/g, '+ paramB');
    }
    
    // Insert hooks after the component declaration
    code = code.replace(
      componentMatch[0],
      `${componentMatch[0]}\n${stateHooks}`
    );
    
    // Insert slider component before the return statement
    code = code.replace(
      /return\s*\(/,
      `${sliderControls}\n\n  return (`
    );
    
    // Add sliders after the Mafs component
    code = code.replace(
      /<\/div>\s*\)\s*;\s*}/,
      `</div>\n${slidersJSX}\n  );\n}`
    );
    
    // Update the visualization to use parameters, if possible
    if (updatedExpression && code.includes(params.expression)) {
      code = code.replace(
        new RegExp(params.expression.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        updatedExpression
      );
    }
    
    return code;
  }
  
  /**
   * Add derivative toggle to a Mafs visualization
   * @param {string} code - Original visualization code
   * @param {Object} params - Visualization parameters
   * @returns {string} - Enhanced code with derivative toggle
   */
  addMafsDerivativeToggle(code, params) {
    // Find the component function declaration
    const componentMatch = code.match(/export\s+const\s+(\w+)\s*=\s*\(\s*\{[^}]*\}\s*\)\s*=>\s*{/);
    if (!componentMatch) return code;
    
    // Add state hook for derivative toggle
    const stateHook = `
  // Add state for showing derivative
  const [showDerivative, setShowDerivative] = useState(false);`;
    
    // Add derivative function
    const derivativeFunction = `
  // Calculate derivative function
  const calculateDerivative = (f) => {
    return (x) => {
      const h = 0.0001;
      return (f(x + h) - f(x)) / h;
    };
  };
  
  // Derivative of the function
  const fPrime = calculateDerivative(${params.expression ? `(x) => ${params.expression}` : 'f'});`;
    
    // Add toggle control
    const toggleControl = `
      <div style={{ marginTop: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={showDerivative}
            onChange={() => setShowDerivative(!showDerivative)}
          />
          Show Derivative
        </label>
      </div>`;
    
    // Add derivative plot to the Mafs component
    const derivativePlot = `
        {/* Show derivative if toggled */}
        {showDerivative && (
          <Plot.OfX 
            y={fPrime} 
            color={Theme.red} 
            style="dashed"
          />
        )}`;
    
    // Insert hooks after the component declaration
    code = code.replace(
      componentMatch[0],
      `${componentMatch[0]}\n${stateHook}`
    );
    
    // Insert derivative function before the return statement
    code = code.replace(
      /return\s*\(/,
      `${derivativeFunction}\n\n  return (`
    );
    
    // Add derivative plot before the closing Mafs tag
    code = code.replace(
      /<\/Mafs>/,
      `${derivativePlot}\n      </Mafs>`
    );
    
    // Add toggle control after the Mafs component
    code = code.replace(
      /<\/div>\s*\)\s*;\s*}/,
      `</div>\n${toggleControl}\n  );\n}`
    );
    
    return code;
  }
  
  /**
   * Add interactive elements to a JSXGraph visualization
   * @param {string} code - Original visualization code
   * @param {Object} params - Visualization parameters
   * @returns {string} - Enhanced code with interactive elements
   */
  addJSXGraphInteractiveElements(code, params) {
    // Try to find where parameters are defined
    const boardCreationIndex = code.indexOf('JXG.JSXGraph.initBoard');
    if (boardCreationIndex === -1) return code;
    
    // Add a slider to control a parameter
    const sliderCode = `
// Add parameter slider
const a = board.create('slider', [[-4, 4], [0, 4], [0, 1, 2]], {
  name: 'a',
  snapWidth: 0.1,
  label: {fontSize: 16, offset: [0, -20]}
});

// Update function to use parameter
function f(x) {
  return a.Value() * ${params.expression || 'Math.sin(x)'};
}`;
    
    // Find where the function is defined
    const functionDefIndex = code.indexOf('function f(x)');
    if (functionDefIndex === -1) {
      // If function definition not found, add after board creation
      const boardInitEnd = code.indexOf(';', boardCreationIndex);
      if (boardInitEnd === -1) return code;
      
      code = code.slice(0, boardInitEnd + 1) + sliderCode + code.slice(boardInitEnd + 1);
    } else {
      // If function definition found, replace it
      const functionEndIndex = code.indexOf('}', functionDefIndex);
      if (functionEndIndex === -1) return code;
      
      code = code.slice(0, functionDefIndex) + sliderCode + code.slice(functionEndIndex + 1);
    }
    
    return code;
  }
  
  /**
   * Add view controls to a MathBox visualization
   * @param {string} code - Original visualization code
   * @param {Object} params - Visualization parameters
   * @returns {string} - Enhanced code with view controls
   */
  addMathBoxViewControls(code, params) {
    // Find where MathBox is set up
    const mathboxSetupIndex = code.indexOf('mathbox');
    if (mathboxSetupIndex === -1) return code;
    
    // Add view controls
    const viewControlsCode = `
// Add view controls
const viewControls = document.createElement('div');
viewControls.className = 'view-controls';
viewControls.style.cssText = 'position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.7); padding: 10px; border-radius: 5px;';
viewControls.innerHTML = \`
  <div style="margin-bottom: 10px;">
    <label>Rotation X: </label>
    <input type="range" min="-180" max="180" value="30" id="rotationX">
  </div>
  <div style="margin-bottom: 10px;">
    <label>Rotation Y: </label>
    <input type="range" min="-180" max="180" value="30" id="rotationY">
  </div>
  <div>
    <label>Zoom: </label>
    <input type="range" min="0.5" max="2" step="0.1" value="1" id="zoom">
  </div>
\`;
container.appendChild(viewControls);

// Add event listeners for controls
document.getElementById('rotationX').addEventListener('input', function(e) {
  const value = e.target.value * Math.PI / 180;
  // Update view
  mathbox.three.camera.position.x = Math.sin(value) * 5;
  mathbox.three.camera.position.z = Math.cos(value) * 5;
  mathbox.three.camera.lookAt(new THREE.Vector3(0, 0, 0));
});

document.getElementById('rotationY').addEventListener('input', function(e) {
  const value = e.target.value * Math.PI / 180;
  // Update view
  mathbox.three.camera.position.y = Math.sin(value) * 5;
  mathbox.three.camera.lookAt(new THREE.Vector3(0, 0, 0));
});

document.getElementById('zoom').addEventListener('input', function(e) {
  const value = e.target.value;
  // Update view
  mathbox.three.camera.zoom = value;
  mathbox.three.camera.updateProjectionMatrix();
});
`;
    
    // Find a good insertion point, near the end
    const lastBraceIndex = code.lastIndexOf('}');
    if (lastBraceIndex === -1) return code;
    
    code = code.slice(0, lastBraceIndex) + viewControlsCode + code.slice(lastBraceIndex);
    
    return code;
  }
  
  /**
   * Add MathBox color controls
   * @param {string} code - Original visualization code
   * @param {Object} params - Visualization parameters
   * @returns {string} - Enhanced code with color controls
   */
  addMathBoxColorControls(code, params) {
    // Find where MathBox is set up
    const mathboxSetupIndex = code.indexOf('mathbox');
    if (mathboxSetupIndex === -1) return code;
    
    // Add color controls
    const colorControlsCode = `
// Add color controls
const colorControls = document.createElement('div');
colorControls.className = 'color-controls';
colorControls.style.cssText = 'position: absolute; bottom: 10px; right: 10px; background: rgba(255,255,255,0.7); padding: 10px; border-radius: 5px;';
colorControls.innerHTML = \`
  <div style="margin-bottom: 10px;">
    <label>Surface Color: </label>
    <select id="colorScheme">
      <option value="#3090FF">Blue</option>
      <option value="#FF9030">Orange</option>
      <option value="#30FF90">Green</option>
      <option value="#FF3090">Pink</option>
      <option value="rainbow">Rainbow</option>
    </select>
  </div>
  <div>
    <label>Opacity: </label>
    <input type="range" min="0.1" max="1" step="0.1" value="1" id="opacity">
  </div>
\`;
container.appendChild(colorControls);

// Add event listeners for color controls
document.getElementById('colorScheme').addEventListener('change', function(e) {
  const value = e.target.value;
  // Update surface color
  // This is a simplified approach - in a real implementation, you would need to update the actual material
  const surface = mathbox.select('surface');
  if (surface.length) {
    if (value === 'rainbow') {
      surface.set('color', '#FFFFFF');
      surface.set('colors', [1, 1, 1, 1]);
    } else {
      surface.set('color', value);
      surface.set('colors', null);
    }
  }
});

document.getElementById('opacity').addEventListener('input', function(e) {
  const value = e.target.value;
  // Update surface opacity
  const surface = mathbox.select('surface');
  if (surface.length) {
    surface.set('opacity', value);
  }
});
`;
    
    // Find a good insertion point, near the end
    const lastBraceIndex = code.lastIndexOf('}');
    if (lastBraceIndex === -1) return code;
    
    code = code.slice(0, lastBraceIndex) + colorControlsCode + code.slice(lastBraceIndex);
    
    return code;
  }
  
  /**
   * Add Three.js controls
   * @param {string} code - Original visualization code
   * @param {Object} params - Visualization parameters
   * @returns {string} - Enhanced code with Three.js controls
   */
  addThreeJSControls(code, params) {
    // Find where Three.js setup occurs
    const threeSetupIndex = code.indexOf('THREE.Scene');
    if (threeSetupIndex === -1) return code;
    
    // Add camera controls
    const cameraControlsCode = `
// Add camera controls
const cameraControls = document.createElement('div');
cameraControls.className = 'camera-controls';
cameraControls.style.cssText = 'position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.7); padding: 10px; border-radius: 5px;';
cameraControls.innerHTML = \`
  <div style="margin-bottom: 10px;">
    <label>Camera X: </label>
    <input type="range" min="-10" max="10" value="5" id="cameraX">
  </div>
  <div style="margin-bottom: 10px;">
    <label>Camera Y: </label>
    <input type="range" min="-10" max="10" value="5" id="cameraY">
  </div>
  <div>
    <label>Camera Z: </label>
    <input type="range" min="-10" max="10" value="5" id="cameraZ">
  </div>
\`;
container.appendChild(cameraControls);

// Add event listeners for camera controls
document.getElementById('cameraX').addEventListener('input', function(e) {
  const value = parseFloat(e.target.value);
  camera.position.x = value;
  camera.lookAt(0, 0, 0);
});

document.getElementById('cameraY').addEventListener('input', function(e) {
  const value = parseFloat(e.target.value);
  camera.position.y = value;
  camera.lookAt(0, 0, 0);
});

document.getElementById('cameraZ').addEventListener('input', function(e) {
  const value = parseFloat(e.target.value);
  camera.position.z = value;
  camera.lookAt(0, 0, 0);
});
`;
    
    // Find a good insertion point, near the end
    const lastBraceIndex = code.lastIndexOf('}');
    if (lastBraceIndex === -1) return code;
    
    code = code.slice(0, lastBraceIndex) + cameraControlsCode + code.slice(lastBraceIndex);
    
    return code;
  }
  
  /**
   * Add JSXGraph measurements
   * @param {string} code - Original visualization code
   * @param {Object} params - Visualization parameters
   * @returns {string} - Enhanced code with measurement tools
   */
  addJSXGraphMeasurements(code, params) {
    // Only add if there are geometric elements
    if (!params.elements || !Array.isArray(params.elements)) return code;
    
    // Find board creation
    const boardCreationIndex = code.indexOf('JXG.JSXGraph.initBoard');
    if (boardCreationIndex === -1) return code;
    
    // Create measurement tools based on elements
    let measurementCode = '\n// Add measurement tools\n';
    
    // Check for points to measure distances between
    const points = params.elements.filter(el => el.type === 'point');
    if (points.length >= 2) {
      measurementCode += `
// Add distance measurement
const distanceMeasurement = board.create('text', [
  (${points[0].id || 'A'}.X() + ${points[1].id || 'B'}.X()) / 2,
  (${points[0].id || 'A'}.Y() + ${points[1].id || 'B'}.Y()) / 2,
  function() {
    const dx = ${points[0].id || 'A'}.X() - ${points[1].id || 'B'}.X();
    const dy = ${points[0].id || 'A'}.Y() - ${points[1].id || 'B'}.Y();
    return 'Distance: ' + Math.sqrt(dx*dx + dy*dy).toFixed(2);
  }
], {fontSize: 16});
`;
    }
    
    // Check for polygons to measure area
    const polygons = params.elements.filter(el => el.type === 'polygon');
    if (polygons.length > 0) {
      measurementCode += `
// Add area measurement
const areaMeasurement = board.create('text', [
  function() {
    // Calculate centroid of the polygon
    let xSum = 0, ySum = 0, count = 0;
    const vertices = ${polygons[0].id || 'triangle'}.vertices;
    for (let i = 0; i < vertices.length; i++) {
      xSum += vertices[i].X();
      ySum += vertices[i].Y();
      count++;
    }
    return xSum / count;
  },
  function() {
    let ySum = 0, count = 0;
    const vertices = ${polygons[0].id || 'triangle'}.vertices;
    for (let i = 0; i < vertices.length; i++) {
      ySum += vertices[i].Y();
      count++;
    }
    return ySum / count;
  },
  function() {
    // Calculate area using Shoelace formula
    const vertices = ${polygons[0].id || 'triangle'}.vertices;
    let area = 0;
    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length;
      area += vertices[i].X() * vertices[j].Y();
      area -= vertices[j].X() * vertices[i].Y();
    }
    area = Math.abs(area) / 2;
    return 'Area: ' + area.toFixed(2);
  }
], {fontSize: 16});
`;
    }
    
    // Check for angles to measure
    if (points.length >= 3) {
      measurementCode += `
// Add angle measurement
const angleMeasurement = board.create('angle', [
  ${points[0].id || 'A'},
  ${points[1].id || 'B'},
  ${points[2].id || 'C'}
], {
  radius: 1,
  name: function() {
    const a = this.Value() * 180 / Math.PI;
    return a.toFixed(1) + '°';
  }
});
`;
    }
    
    // Find a good insertion point - after all elements are created
    const insertionIndex = code.indexOf('// Define shapes');
    if (insertionIndex === -1) {
      // If no shapes comment, look for end of points definitions
      const pointsEndIndex = code.lastIndexOf('});', code.lastIndexOf('point'));
      if (pointsEndIndex === -1) {
        // If not found, just add near the end
        const lastBraceIndex = code.lastIndexOf('}');
        if (lastBraceIndex === -1) return code;
        
        code = code.slice(0, lastBraceIndex) + measurementCode + code.slice(lastBraceIndex);
      } else {
        code = code.slice(0, pointsEndIndex + 3) + measurementCode + code.slice(pointsEndIndex + 3);
      }
    } else {
      code = code.slice(0, insertionIndex) + measurementCode + code.slice(insertionIndex);
    }
    
    return code;
  }
  
  /**
   * Add JSXGraph draggable points
   * @param {string} code - Original visualization code
   * @param {Object} params - Visualization parameters
   * @returns {string} - Enhanced code with draggable points
   */
  addJSXGraphDraggablePoints(code, params) {
    // Check if there are points to make draggable
    if (!params.elements || !Array.isArray(params.elements)) return code;
    
    // Find point creation in the code
    const points = params.elements.filter(el => el.type === 'point');
    if (points.length === 0) return code;
    
    // Replace fixed points with draggable points
    points.forEach(point => {
      const pointId = point.id || point.label;
      
      // Look for the point definition
      const pointDefRegex = new RegExp(`(const\\s+${pointId}\\s*=\\s*board\\.create\\('point',[^{]*{)([^}]*)(}\\))`, 'g');
      
      code = code.replace(pointDefRegex, (match, start, properties, end) => {
        // Check if draggable is already set
        if (properties.includes('draggable')) {
          return match;
        }
        
        // Add draggable property
        return `${start}${properties}, draggable: true${end}`;
      });
    });
    
    // Add an update callback to update dependent objects when points are dragged
    if (code.includes('polygon') || code.includes('line') || code.includes('circle')) {
      // Find where board creation ends
      const boardCreationEnd = code.indexOf(';', code.indexOf('JXG.JSXGraph.initBoard'));
      if (boardCreationEnd === -1) return code;
      
      // Add update listener
      const updateCode = `
// Add board update listener for real-time measurements
board.on('update', function() {
  // Board will automatically update all dependent objects
  board.update();
});
`;
      
      code = code.slice(0, boardCreationEnd + 1) + updateCode + code.slice(boardCreationEnd + 1);
    }
    
    return code;
  }
  
  /**
   * Create the final educational content by combining LLM and local content
   * @param {Object} llmResponse - The parsed LLM response
   * @param {Object} analysis - The final analysis
   * @param {Object} options - Processing options
   * @returns {Object} - The final educational content
   */
  createFinalEducationalContent(llmResponse, analysis, options) {
    // Generate local educational content
    const localContent = createEducationalContent(analysis);
    
    // If LLM didn't provide educational content, use local content
    if (!llmResponse.educationalContent) {
      return localContent;
    }
    
    // If not combining explanations, return LLM content
    if (!this.options.combineExplanations) {
      return llmResponse.educationalContent;
    }
    
    // Otherwise, combine the content, preferring LLM for high-level explanations
    // and local content for technical details
    return {
      title: llmResponse.educationalContent.title || localContent.title,
      summary: llmResponse.educationalContent.summary || localContent.summary,
      steps: llmResponse.educationalContent.steps || localContent.steps,
      keyPoints: [
        ...(llmResponse.educationalContent.keyInsights || []),
        ...localContent.keyPoints.filter(point => 
          !llmResponse.educationalContent.keyInsights?.some(insight => 
            insight.toLowerCase().includes(point.toLowerCase())
          )
        )
      ],
      exercises: llmResponse.educationalContent.exercises || localContent.exercises
    };
  }
}

export default LLMVisualizationConnector;