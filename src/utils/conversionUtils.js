/**
 * Utility functions for converting visualization parameters between different libraries
 */

/**
 * Convert visualization parameters from one library format to another
 * 
 * @param {Object} params - The original parameters
 * @param {string} fromLibrary - Source library ('mafs', 'mathbox', 'jsxgraph', 'd3', 'three')
 * @param {string} toLibrary - Target library ('mafs', 'mathbox', 'jsxgraph', 'd3', 'three')
 * @returns {Object} - Converted parameters for the target library
 */
export const convertParameters = (params, fromLibrary, toLibrary) => {
  if (fromLibrary === toLibrary) return params;
  
  const result = { ...params };
  
  // Convert from Mafs to JSXGraph
  if (fromLibrary === 'mafs' && toLibrary === 'jsxgraph') {
    // Convert domain/range format
    if (params.domain && params.range) {
      result.boundingBox = [
        params.domain[0], 
        params.range[1], 
        params.domain[1], 
        params.range[0]
      ];
    }
    
    // Convert points format
    if (params.points) {
      result.elements = (result.elements || []).concat(
        params.points.map(point => ({
          type: 'point',
          coords: [point.x, point.y],
          name: point.name || '',
          color: point.color || 'blue',
          size: point.size || 4
        }))
      );
    }
    
    // Convert lines format
    if (params.lines) {
      result.elements = (result.elements || []).concat(
        params.lines.map((line, index) => ({
          type: 'line',
          point1: line.point || [0, 0],
          point2: [10, 10 * line.slope], // Approximate second point
          name1: `P${index*2+1}`,
          name2: `P${index*2+2}`,
          color: line.color || 'black',
          width: line.width || 2,
          showPoints: false
        }))
      );
    }
    
    // Convert vectors format
    if (params.vectors) {
      result.elements = (result.elements || []).concat(
        params.vectors.map((vector, index) => ({
          type: 'arrow',
          point1: vector.tail || [0, 0],
          point2: vector.tip,
          name: vector.name || '',
          color: vector.color || 'red',
          width: vector.width || 2
        }))
      );
    }
    
    // Convert circles format
    if (params.circles) {
      result.elements = (result.elements || []).concat(
        params.circles.map((circle, index) => ({
          type: 'circle',
          center: circle.center || [0, 0],
          radius: circle.radius,
          color: circle.color || 'black',
          fillColor: circle.fillColor,
          fillOpacity: circle.fillOpacity || 0.2
        }))
      );
    }
  }
  
  // Convert from JSXGraph to Mafs
  if (fromLibrary === 'jsxgraph' && toLibrary === 'mafs') {
    // Convert boundingBox to domain/range
    if (params.boundingBox) {
      result.domain = [params.boundingBox[0], params.boundingBox[2]];
      result.range = [params.boundingBox[3], params.boundingBox[1]];
      delete result.boundingBox;
    }
    
    // Convert elements to specific Mafs properties
    if (params.elements) {
      // Initialize arrays
      result.points = [];
      result.lines = [];
      result.vectors = [];
      result.circles = [];
      
      // Process each element
      params.elements.forEach(elem => {
        switch (elem.type) {
          case 'point':
            result.points.push({
              x: elem.coords[0],
              y: elem.coords[1],
              color: elem.color || 'blue',
              name: elem.name || '',
              size: elem.size || 4
            });
            break;
            
          case 'line':
            // Calculate slope from two points
            const [x1, y1] = elem.point1;
            const [x2, y2] = elem.point2;
            const slope = (y2 - y1) / (x2 - x1);
            
            result.lines.push({
              point: [x1, y1],
              slope: slope,
              color: elem.color || 'black',
              width: elem.width || 2
            });
            break;
            
          case 'arrow':
          case 'vector':
            result.vectors.push({
              tail: elem.point1 || [0, 0],
              tip: elem.point2,
              color: elem.color || 'red',
              name: elem.name || ''
            });
            break;
            
          case 'circle':
            result.circles.push({
              center: elem.center,
              radius: elem.radius,
              color: elem.color || 'black',
              fillColor: elem.fillColor,
              fillOpacity: elem.fillOpacity || 0.2
            });
            break;
        }
      });
      
      // Remove elements property as it's been converted
      delete result.elements;
    }
  }
  
  // Convert from Mafs to MathBox (2D to 3D)
  if (fromLibrary === 'mafs' && toLibrary === 'mathbox') {
    // Add z-range if not present
    if (!result.zRange) {
      result.zRange = [-1, 1];
    }
    
    // Convert 2D points to 3D if needed
    if (params.points) {
      result.points3D = params.points.map(point => ({
        x: point.x,
        y: point.y,
        z: 0,
        color: point.color,
        size: point.size || 0.1,
        label: point.name
      }));
    }
    
    // Convert 2D vectors to 3D
    if (params.vectors) {
      result.vectors3D = params.vectors.map(vector => {
        const tail = vector.tail || [0, 0];
        return {
          start: [tail[0], tail[1], 0],
          end: [vector.tip[0], vector.tip[1], 0],
          color: vector.color
        };
      });
    }
  }
  
  // Convert from MathBox to Three.js
  if (fromLibrary === 'mathbox' && toLibrary === 'three') {
    // Three.js might need different parameter names or structures
    result.resolution = params.resolution || 64;
    
    // For most Three.js visualizations, we keep the same domain/range/zRange
    
    // Convert colors to Three.js hex format if needed
    if (typeof params.color === 'string' && !params.color.startsWith('#')) {
      result.color = `#${params.color.replace(/[^0-9A-F]/gi, '')}`;
    }
  }
  
  // Convert from generic format to D3
  if (toLibrary === 'd3') {
    // D3 often needs data in array format for plotting
    if (params.type === 'function2D' && params.expression && params.domain) {
      // For function plotting, we generate data points
      const [min, max] = params.domain;
      const points = [];
      const steps = 100;
      const step = (max - min) / steps;
      
      // This is just a placeholder - in real code, we would
      // actually evaluate the function at each point
      for (let i = 0; i <= steps; i++) {
        const x = min + i * step;
        // Note: in a real implementation we would evaluate the expression
        points.push({ x, y: 0 }); 
      }
      
      result.data = points;
    }
    
    // Add D3-specific margin conventions
    if (!result.margin) {
      result.margin = { top: 40, right: 40, bottom: 60, left: 60 };
    }
  }
  
  return result;
};

/**
 * Convert mathematical expressions between different library formats
 * 
 * @param {string} expression - The original mathematical expression
 * @param {string} fromFormat - Source format ('generic', 'mathbox', 'jsxgraph', 'd3', 'three')
 * @param {string} toFormat - Target format ('generic', 'mathbox', 'jsxgraph', 'd3', 'three')
 * @returns {string} - Converted expression for the target library
 */
export const convertExpression = (expression, fromFormat, toFormat) => {
  if (fromFormat === toFormat || !expression) return expression;
  
  let result = expression;
  
  // Convert from generic JavaScript to MathBox
  if (fromFormat === 'generic' && toFormat === 'mathbox') {
    // Replace Math.* functions with direct calls for MathBox
    result = result
      .replace(/Math\.sin/g, 'sin')
      .replace(/Math\.cos/g, 'cos')
      .replace(/Math\.tan/g, 'tan')
      .replace(/Math\.exp/g, 'exp')
      .replace(/Math\.log/g, 'log')
      .replace(/Math\.sqrt/g, 'sqrt')
      .replace(/Math\.pow/g, 'pow')
      .replace(/Math\.abs/g, 'abs')
      .replace(/Math\.PI/g, 'PI');
  }
  
  // Convert from MathBox to generic JavaScript
  if (fromFormat === 'mathbox' && toFormat === 'generic') {
    // Replace direct math calls with Math.* functions
    result = result
      .replace(/\bsin\(/g, 'Math.sin(')
      .replace(/\bcos\(/g, 'Math.cos(')
      .replace(/\btan\(/g, 'Math.tan(')
      .replace(/\bexp\(/g, 'Math.exp(')
      .replace(/\blog\(/g, 'Math.log(')
      .replace(/\bsqrt\(/g, 'Math.sqrt(')
      .replace(/\bpow\(/g, 'Math.pow(')
      .replace(/\babs\(/g, 'Math.abs(')
      .replace(/\bPI\b/g, 'Math.PI');
  }
  
  // Convert to JSXGraph format
  if (toFormat === 'jsxgraph') {
    // JSXGraph uses function strings directly
    // But we need to ensure it's wrapped properly if needed
    if (!result.includes('return')) {
      // Simple expressions might need to be wrapped in a return
      result = `return ${result}`;
    }
  }
  
  // Convert from generic JavaScript to D3
  if (fromFormat === 'generic' && toFormat === 'd3') {
    // D3 often uses d[0], d[1] or d.x, d.y notation depending on context
    // This is a simplistic example - real conversion depends on usage
    result = result
      .replace(/x/g, 'd.x')
      .replace(/y/g, 'd.y');
  }
  
  return result;
};

/**
 * Generate default visualization parameters based on type
 * 
 * @param {string} type - Visualization type
 * @returns {Object} - Default parameters for the given visualization type
 */
export const getDefaultParams = (type) => {
  switch (type) {
    case 'function2D':
      return {
        domain: [-10, 10],
        range: [-10, 10],
        gridLines: true,
        axes: true
      };
      
    case 'function3D':
      return {
        domainX: [-5, 5],
        domainY: [-5, 5],
        range: [-5, 5],
        resolution: 64,
        colormap: 'viridis'
      };
      
    case 'geometry':
      return {
        domain: [-5, 5],
        range: [-5, 5],
        gridLines: true,
        axes: true
      };
      
    case 'vectorField':
      return {
        domain: [-5, 5],
        range: [-5, 5],
        density: 10,
        normalize: true
      };
      
    case 'parametric2D':
      return {
        parameterRange: [0, 2 * Math.PI],
        domain: [-5, 5],
        range: [-5, 5]
      };
      
    case 'parametric3D':
      return {
        parameterRanges: [[0, 2 * Math.PI], [0, 2 * Math.PI]],
        domainX: [-5, 5],
        domainY: [-5, 5],
        domainZ: [-5, 5],
        resolution: 48
      };
      
    default:
      return {
        domain: [-10, 10],
        range: [-10, 10]
      };
  }
};

export default {
  convertParameters,
  convertExpression,
  getDefaultParams
};