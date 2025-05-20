/**
 * Main visualization renderer that dispatches to the appropriate library-specific renderer
 */

import { ensureContainer, createErrorMessage } from '../utils/visualizationHelpers';
import jsxgraphRenderer from './jsxgraphRenderer';
import mathboxRenderer from './mathboxRenderer';
import d3Renderer from './d3Renderer';
import threeRenderer from './threeRenderer';

/**
 * Render a visualization using the specified parameters
 * 
 * @param {Object} params - Visualization parameters 
 * @param {string} params.type - Type of visualization (e.g., 'function2D', 'function3D')
 * @param {string} [params.library] - Library to use (auto-selected if not specified)
 * @param {string} [params.expression] - Mathematical expression to visualize
 * @param {Array} [params.domain] - X-axis domain [min, max]
 * @param {Array} [params.range] - Y-axis range [min, max] 
 * @param {Array} [params.zRange] - Z-axis range [min, max] for 3D visualizations
 * @param {Object} [params.options] - Additional options specific to the visualization
 * @returns {HTMLElement} - Container element with the rendered visualization
 */
export const renderVisualization = (params) => {
  const { type, library } = params;
  
  // Select appropriate library if not specified
  const selectedLibrary = library || selectLibrary(type, params);
  
  // Create a container for the visualization
  const { container, containerId } = ensureContainer(selectedLibrary);
  
  try {
    // Dispatch to the appropriate renderer
    switch (selectedLibrary.toLowerCase()) {
      case 'jsxgraph':
        jsxgraphRenderer(container, params);
        break;
        
      case 'mathbox':
        mathboxRenderer(container, params);
        break;
        
      case 'd3':
        d3Renderer(container, params);
        break;
        
      case 'three':
        threeRenderer(container, params);
        break;
        
      default:
        // Default to JSXGraph for most visualizations
        jsxgraphRenderer(container, params);
    }
    
    return container;
  } catch (error) {
    console.error(`Error rendering visualization with ${selectedLibrary}:`, error);
    return createErrorMessage(`Error rendering visualization: ${error.message}`);
  }
};

/**
 * Select the most appropriate visualization library based on the visualization type
 * 
 * @param {string} type - Type of visualization 
 * @param {Object} params - Visualization parameters
 * @returns {string} - Selected library name
 */
function selectLibrary(type, params) {
  // 3D visualizations
  if (type.includes('3D') || params.zRange) {
    return 'mathbox';
  }
  
  // 2D function plotting
  if (type === 'function2D' || type === 'functions2D') {
    return 'jsxgraph';
  }
  
  // Geometry
  if (type === 'geometry') {
    return 'jsxgraph';
  }
  
  // Data visualization
  if (type === 'scatter' || type === 'bar' || type === 'line' || type === 'multiLine') {
    return 'd3';
  }
  
  // Default to JSXGraph
  return 'jsxgraph';
}

export default renderVisualization;