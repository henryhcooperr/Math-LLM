import React from 'react';
import { MafsVisualizer } from './visualizers/MafsVisualizer';
import { MathBoxVisualizer } from './visualizers/MathBoxVisualizer';
import { ThreeJSVisualizer } from './visualizers/ThreeJSVisualizer';
import { JSXGraphVisualizer } from './visualizers/JSXGraphVisualizer';
import { D3Visualizer } from './visualizers/D3Visualizer';
// Import other visualizers as needed

/**
 * Universal Visualization Wrapper that selects the appropriate library
 * based on visualization requirements.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.library] - Explicitly specified library to use
 * @param {string} props.type - Type of visualization (e.g., 'function2D', 'function3D')
 * @param {string} [props.expression] - Mathematical expression to visualize
 * @param {Array} [props.data] - Data array for data-driven visualizations
 * @param {Array} [props.domain] - X-axis domain [min, max]
 * @param {Array} [props.range] - Y-axis range [min, max]
 * @param {Array} [props.zRange] - Z-axis range [min, max] for 3D visualizations
 * @param {Array} [props.points] - Array of point objects
 * @param {Array} [props.lines] - Array of line objects
 * @param {Array} [props.vectors] - Array of vector objects
 * @param {Array} [props.circles] - Array of circle objects
 * @param {Array} [props.elements] - Array of geometric elements
 * @param {string|number} [props.width] - Width of visualization
 * @param {string|number} [props.height] - Height of visualization
 * @param {Object} [props.options] - Additional library-specific options
 * @returns {React.ReactElement} - The appropriate visualization component
 */
export const VisualizationWrapper = (props) => {
  const {
    library,
    type,
    expression,
    data,
    domain,
    range,
    zRange,
    points,
    lines,
    vectors,
    circles,
    elements,
    width,
    height,
    options = {}
  } = props;
  
  // Select library based on provided library prop or visualization requirements
  const selectLibrary = () => {
    if (library) return library;
    
    // Auto-select library based on visualization type
    if (type.includes('3D') || type === 'function3D' || type === 'parametric3D' || type === 'vectorField3D' || zRange) {
      return 'mathbox'; // Prefer MathBox for 3D
    }
    
    if (type === 'function2D' && !options.requiresCustomization) {
      return 'mafs'; // Default for simple functions in React
    }
    
    if (type === 'geometry') {
      return 'jsxgraph'; // Default for geometry
    }
    
    if (type === 'scatter' || type === 'bar' || type === 'line' || type === 'multiLine' || data) {
      return 'd3'; // Default for data visualization
    }
    
    // For calculus visualizations
    if (type === 'calculus') {
      if (options.subtype === 'integral' || options.subtype === 'derivative') {
        return 'mafs'; // Mafs is good for simple calculus visualizations
      }
    }
    
    // For linear algebra
    if (type === 'linearAlgebra') {
      if (options.space === '2D') {
        return 'mafs';
      } else {
        return 'mathbox';
      }
    }
    
    // For probability distributions
    if (type === 'probabilityDistribution') {
      return 'd3';
    }
    
    // Default fallback
    return 'jsxgraph';
  };
  
  const selectedLibrary = selectLibrary();
  
  // Render the appropriate visualizer
  switch (selectedLibrary) {
    case 'mafs':
      return (
        <MafsVisualizer
          type={type}
          expression={expression}
          domain={domain}
          range={range}
          points={points}
          vectors={vectors}
          lines={lines}
          circles={circles}
          width={width}
          height={height}
          {...options}
        />
      );
      
    case 'mathbox':
      return (
        <MathBoxVisualizer
          type={type}
          expression={expression}
          domain={domain}
          range={range}
          zRange={zRange}
          width={width}
          height={height}
          {...options}
        />
      );
      
    case 'three':
      return (
        <ThreeJSVisualizer
          type={type}
          expression={expression}
          domain={domain}
          range={range}
          zRange={zRange}
          width={width}
          height={height}
          {...options}
        />
      );
      
    case 'jsxgraph':
      return (
        <JSXGraphVisualizer
          type={type}
          expression={expression}
          domain={domain}
          range={range}
          elements={elements || []}
          width={width}
          height={height}
          {...options}
        />
      );
      
    case 'd3':
      return (
        <D3Visualizer
          type={type}
          expression={expression}
          data={data}
          domain={domain}
          range={range}
          width={width}
          height={height}
          {...options}
        />
      );
      
    default:
      return (
        <div style={{ 
          width: width || '100%', 
          height: height || 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9'
        }}>
          <p>Unsupported visualization library: {selectedLibrary}</p>
        </div>
      );
  }
};

export default VisualizationWrapper;