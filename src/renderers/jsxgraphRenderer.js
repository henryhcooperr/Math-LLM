/**
 * JSXGraph library specific renderer
 */

import JXG from 'jsxgraph';

/**
 * Render a visualization using JSXGraph
 * 
 * @param {HTMLElement} container - Container element for the visualization
 * @param {Object} params - Visualization parameters
 * @param {string} params.type - Type of visualization ('function2D', 'functions2D', 'geometry', etc.)
 * @param {string} [params.expression] - Mathematical expression to visualize
 * @param {number[]} [params.domain=[-10, 10]] - X-axis domain as [min, max]
 * @param {number[]} [params.range=[-10, 10]] - Y-axis range as [min, max]
 * @param {string} [params.containerId] - Optional custom ID to use for the container element
 * @returns {Object} - JSXGraph board
 */
export const jsxgraphRenderer = (container, params) => {
  const { type, expression, domain = [-10, 10], range = [-10, 10], containerId } = params;
  
  // Use provided containerId if available, otherwise generate one
  if (containerId) {
    container.id = containerId;
  } else if (!container.id) {
    container.id = `jsxgraph-${Math.random().toString(36).substring(2, 8)}`;
  }
  
  // Calculate bounding box from domain and range
  // JSXGraph format is [left, top, right, bottom]
  const boundingBox = [domain[0], range[1], domain[1], range[0]];
  
  // Create board with calculated bounding box
  const board = JXG.JSXGraph.initBoard(container.id, {
    boundingBox: boundingBox,
    axis: true,
    grid: true,
    showCopyright: false,
    showNavigation: true
  });
  
  // Render based on visualization type
  switch (type) {
    case 'function2D':
      renderFunction(board, expression, domain);
      break;
      
    case 'functions2D':
      if (params.functions && Array.isArray(params.functions)) {
        params.functions.forEach((func, index) => {
          renderFunction(board, func.expression, domain, func.color || getColor(index));
        });
      }
      break;
      
    case 'geometry':
      renderGeometry(board, params.elements || []);
      break;
      
    case 'parametric2D':
      renderParametric(board, params);
      break;
      
    case 'calculus':
      if (params.subtype === 'derivative') {
        renderDerivative(board, params);
      } else if (params.subtype === 'integral') {
        renderIntegral(board, params);
      }
      break;
      
    default:
      // Default to a simple function plot
      renderFunction(board, expression || 'x', domain);
  }
  
  return board;
};

/**
 * Render a mathematical function on a JSXGraph board
 */
function renderFunction(board, expression, domain, color = '#3090FF') {
  try {
    // Create a function from the expression
    const fn = createFunctionFromExpression(expression);
    
    // Plot the function
    board.create('functiongraph', [
      fn,
      domain[0],
      domain[1]
    ], {
      strokeColor: color,
      strokeWidth: 2
    });
  } catch (e) {
    console.error('Error plotting function:', e);
    
    // Add error text to the board
    board.create('text', [0, 0, `Error: ${e.message}`], {
      fontSize: 14,
      color: 'red',
      fixed: true
    });
  }
}

/**
 * Render geometry elements on a JSXGraph board
 */
function renderGeometry(board, elements) {
  if (!elements || !Array.isArray(elements) || elements.length === 0) {
    // Add example point if no elements provided
    board.create('point', [0, 0], { name: 'O', size: 4, color: 'blue' });
    return;
  }
  
  // Objects to store created points for reference
  const points = {};
  
  // First pass: create all points
  elements.forEach((element, index) => {
    if (element.type === 'point') {
      const point = board.create('point', element.coordinates, {
        name: element.label || element.id || `P${index}`,
        size: element.size || 4,
        color: element.color || 'blue',
        fixed: element.fixed || false
      });
      
      // Store the point with its ID for reference
      if (element.id) {
        points[element.id] = point;
      }
    }
  });
  
  // Second pass: create all other elements that may depend on points
  elements.forEach((element, index) => {
    if (element.type === 'line') {
      let p1, p2;
      
      // Get points from references or coordinates
      if (element.point1Id && points[element.point1Id]) {
        p1 = points[element.point1Id];
      } else if (element.point1) {
        p1 = board.create('point', element.point1, { visible: false });
      }
      
      if (element.point2Id && points[element.point2Id]) {
        p2 = points[element.point2Id];
      } else if (element.point2) {
        p2 = board.create('point', element.point2, { visible: false });
      }
      
      if (p1 && p2) {
        board.create('line', [p1, p2], {
          straightFirst: element.straightFirst !== false,
          straightLast: element.straightLast !== false,
          strokeColor: element.color || 'black',
          strokeWidth: element.width || 2
        });
      }
    } else if (element.type === 'circle') {
      let center, radius;
      
      // Get center point from reference or coordinates
      if (element.centerId && points[element.centerId]) {
        center = points[element.centerId];
      } else if (element.center) {
        center = board.create('point', element.center, { 
          visible: element.showPoints || false,
          name: element.centerName || ''
        });
      }
      
      if (center) {
        board.create('circle', [center, element.radius], {
          strokeColor: element.color || 'black',
          strokeWidth: element.width || 2,
          fillColor: element.fillColor || 'none',
          fillOpacity: element.fillOpacity || 0
        });
      }
    }
    // Add more element types as needed
  });
}

/**
 * Render a parametric curve on a JSXGraph board
 */
function renderParametric(board, params) {
  const { parameterName = 't', parameterRange = [0, 2 * Math.PI], expressions } = params;
  
  if (!expressions || !expressions.x || !expressions.y) {
    console.error('Missing x or y expressions for parametric curve');
    return;
  }
  
  try {
    // Create functions from expressions
    const xFn = createFunctionFromExpression(expressions.x, parameterName);
    const yFn = createFunctionFromExpression(expressions.y, parameterName);
    
    // Create the parametric curve
    board.create('curve', [
      t => xFn(t),
      t => yFn(t),
      parameterRange[0],
      parameterRange[1]
    ], {
      strokeColor: params.color || '#FF9030',
      strokeWidth: 2
    });
    
    // Add special points if specified
    if (params.specialPoints && Array.isArray(params.specialPoints)) {
      params.specialPoints.forEach(point => {
        if (point.t !== undefined) {
          const x = xFn(point.t);
          const y = yFn(point.t);
          board.create('point', [x, y], {
            name: point.label || `t=${point.t}`,
            size: 4,
            color: point.color || '#3090FF'
          });
        }
      });
    }
  } catch (e) {
    console.error('Error plotting parametric curve:', e);
  }
}

/**
 * Render a function with its derivative
 */
function renderDerivative(board, params) {
  if (!params.function || !params.function.expression) {
    console.error('Missing function expression for derivative visualization');
    return;
  }
  
  try {
    // Plot the original function
    renderFunction(
      board, 
      params.function.expression, 
      params.domain, 
      params.function.color || '#3090FF'
    );
    
    // Plot the derivative function if provided
    if (params.derivative && params.derivative.expression) {
      renderFunction(
        board, 
        params.derivative.expression, 
        params.domain, 
        params.derivative.color || '#FF5733'
      );
    }
    
    // Add a tangent line if requested
    if (params.derivative && params.derivative.showTangent && params.derivative.tangentPoint) {
      // Create the function
      const fn = createFunctionFromExpression(params.function.expression);
      const dfn = createFunctionFromExpression(params.derivative.expression);
      
      // Calculate tangent point
      const x0 = params.derivative.tangentPoint;
      const y0 = fn(x0);
      const slope = dfn(x0);
      
      // Create tangent line
      board.create('line', [
        [x0, y0],
        [x0 + 1, y0 + slope]
      ], {
        strokeColor: params.derivative.tangentColor || '#FF5733',
        strokeWidth: 2,
        dash: 2
      });
      
      // Create the point of tangency
      board.create('point', [x0, y0], {
        name: 'Tangent point',
        size: 4,
        color: params.derivative.tangentColor || '#FF5733'
      });
    }
  } catch (e) {
    console.error('Error plotting derivative:', e);
  }
}

/**
 * Render a function with its integral
 */
function renderIntegral(board, params) {
  if (!params.function || !params.function.expression) {
    console.error('Missing function expression for integral visualization');
    return;
  }
  
  try {
    // Get the function and bounds
    const fn = createFunctionFromExpression(params.function.expression);
    const lowerBound = params.integral.lowerBound;
    const upperBound = params.integral.upperBound;
    
    // Plot the original function
    renderFunction(
      board, 
      params.function.expression, 
      params.domain, 
      params.function.color || '#3090FF'
    );
    
    // Create a polygon for the integral area
    const curve = board.create('curve', [
      function(t) { return t; },
      function(t) { return fn(t); },
      lowerBound,
      upperBound
    ], { visible: false });
    
    // Create the integral area
    board.create('integral', [
      curve,
      lowerBound,
      upperBound
    ], {
      fillColor: params.integral.color || '#FF9030',
      fillOpacity: params.integral.fillOpacity || 0.3,
      strokeColor: params.integral.color || '#FF9030',
      strokeWidth: 1
    });
    
    // Show approximation rectangles if requested
    if (params.integral.approximation && params.integral.approximation.show) {
      const count = params.integral.approximation.count || 10;
      const width = (upperBound - lowerBound) / count;
      
      for (let i = 0; i < count; i++) {
        const x = lowerBound + i * width;
        const height = fn(x);
        
        board.create('polygon', [
          [x, 0],
          [x + width, 0],
          [x + width, height],
          [x, height]
        ], {
          fillColor: params.integral.approximation.color || '#FF9030',
          fillOpacity: 0.2,
          strokeColor: params.integral.approximation.color || '#FF9030',
          strokeWidth: 1
        });
      }
    }
  } catch (e) {
    console.error('Error plotting integral:', e);
  }
}

/**
 * Create a JavaScript function from a string expression
 */
function createFunctionFromExpression(expression, variable = 'x') {
  try {
    // Replace Math functions with direct calls if needed
    const processedExpression = expression
      .replace(/Math\./g, '')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/exp/g, 'Math.exp')
      .replace(/log/g, 'Math.log')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/pow/g, 'Math.pow')
      .replace(/PI/g, 'Math.PI');
    
    // Create a function from the expression
    return new Function(variable, `return ${processedExpression};`);
  } catch (e) {
    console.error('Error creating function from expression:', e);
    return x => 0;
  }
}

/**
 * Get a color from a predefined set based on index
 */
function getColor(index) {
  const colors = [
    '#3090FF', // Blue
    '#FF9030', // Orange
    '#30FF90', // Green
    '#FF3090', // Pink
    '#9030FF', // Purple
    '#30FFF9', // Cyan
    '#FFD700'  // Gold
  ];
  
  return colors[index % colors.length];
}

export default jsxgraphRenderer;