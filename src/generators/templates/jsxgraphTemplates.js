/**
 * JSXGraph Templates
 * Template code for generating JSXGraph visualizations for different types of
 * mathematical concepts.
 */

/**
 * Templates organized by concept type
 */
export const jsxgraphTemplates = {
  /**
   * Default template used when a specific one isn't available
   */
  default: `/**
 * JSXGraph Visualization
 * ${educational.title}
 * 
 * ${educational.summary}
 */

/**
 * Initialize the JSXGraph visualization
 * @param {string} containerId - The ID of the container element
 */
function initVisualization(containerId) {
  // Define the bounding box for the visualization
  // Format: [xMin, yMax, xMax, yMin]
  const bbox = [${parameters.domain[0]}, ${parameters.range[1]}, ${parameters.domain[1]}, ${parameters.range[0]}];
  
  // Initialize the JSXGraph board
  const board = JXG.JSXGraph.initBoard(containerId, {
    boundingbox: bbox,
    axis: true,
    grid: true,
    showCopyright: false,
    showNavigation: true,
    keepAspectRatio: true
  });
  
  // Add the visualization
  addVisualization(board);
  
  return board;
}

/**
 * Add the main visualization to the board
 * @param {Object} board - The JSXGraph board
 */
function addVisualization(board) {
  // Create a function graph (default visualization)
  try {
    // Parse the expression
    const fn = function(x) {
      return eval('${concept.expression}'.replace(/x/g, x));
    };
    
    // Create the function graph
    board.create('functiongraph', [fn, ${parameters.domain[0]}, ${parameters.domain[1]}], {
      strokeColor: '${parameters.functions[0].color}',
      strokeWidth: 2
    });
    
    // Add a caption
    board.create('text', [
      (${parameters.domain[0]} + ${parameters.domain[1]}) / 2, 
      ${parameters.range[0]} + 0.1 * (${parameters.range[1]} - ${parameters.range[0]}), 
      '${educational.title}'
    ], {
      fontSize: 14,
      anchorX: 'middle',
      anchorY: 'bottom',
      cssClass: 'jsxgraph-caption'
    });
  } catch (error) {
    console.error('Error creating visualization:', error);
  }
}`,

  /**
   * Template for 2D function visualization
   */
  function2D: `/**
 * JSXGraph Function Visualization
 * ${educational.title}
 * 
 * ${educational.summary}
 */

/**
 * Initialize the JSXGraph visualization
 * @param {string} containerId - The ID of the container element
 */
function initVisualization(containerId) {
  // Define the bounding box for the visualization
  // Format: [xMin, yMax, xMax, yMin]
  const bbox = [${parameters.domain[0]}, ${parameters.range[1]}, ${parameters.domain[1]}, ${parameters.range[0]}];
  
  // Initialize the JSXGraph board
  const board = JXG.JSXGraph.initBoard(containerId, {
    boundingbox: bbox,
    axis: true,
    grid: true,
    showCopyright: false,
    showNavigation: true,
    keepAspectRatio: true
  });
  
  // Add the function visualization
  addFunction(board);
  
  // Add interactive elements
  addInteractiveElements(board);
  
  return board;
}

/**
 * Add the function to the board
 * @param {Object} board - The JSXGraph board
 */
function addFunction(board) {
  try {
    // Parse the expression
    const fn = function(x) {
      return evaluateExpression('${parameters.functions[0].expression}', x);
    };
    
    // Create the function graph
    const graph = board.create('functiongraph', [fn, ${parameters.domain[0]}, ${parameters.domain[1]}], {
      strokeColor: '${parameters.functions[0].color}',
      strokeWidth: 2,
      name: 'f(x)'
    });
    
    // Add key points
    addKeyPoints(board, fn);
    
    return graph;
  } catch (error) {
    console.error('Error creating function:', error);
    // Show the error on the board
    board.create('text', [0, 0, 'Error: ' + error.message], {
      fontSize: 14,
      anchorX: 'middle',
      anchorY: 'middle',
      color: 'red'
    });
    return null;
  }
}

/**
 * Add key points to the function (zeros, extrema)
 * @param {Object} board - The JSXGraph board
 * @param {Function} fn - The function
 */
function addKeyPoints(board, fn) {
  // This is a simplified approach - in a real implementation, 
  // we would use numerical methods to find zeros and extrema
  
  // Sample the function at regular intervals to find approximate zeros and extrema
  const numSamples = 100;
  const step = (${parameters.domain[1]} - ${parameters.domain[0]}) / numSamples;
  
  let prevY = fn(${parameters.domain[0]});
  let extrema = [];
  let zeros = [];
  
  for (let i = 1; i <= numSamples; i++) {
    const x = ${parameters.domain[0]} + i * step;
    const y = fn(x);
    
    // Check for zeros (y-value changes sign)
    if (prevY * y <= 0 && i > 1) {
      // More precise zero-finding would be needed here
      const zeroX = x - step / 2;
      zeros.push([zeroX, 0]);
    }
    
    // Check for potential extrema (derivative changes sign)
    if (i >= 2) {
      const prevX = ${parameters.domain[0]} + (i - 1) * step;
      const prevPrevX = ${parameters.domain[0]} + (i - 2) * step;
      const prevPrevY = fn(prevPrevX);
      
      // If slope changes sign, might be an extremum
      if ((prevY - prevPrevY) * (y - prevY) <= 0) {
        extrema.push([prevX, prevY]);
      }
    }
    
    prevY = y;
  }
  
  // Add zero points
  zeros.forEach(([x, y], index) => {
    board.create('point', [x, y], {
      name: 'Zero ' + (index + 1),
      size: 4,
      color: 'green',
      withLabel: true
    });
  });
  
  // Add extrema points (limit to max 3 to avoid cluttering)
  extrema.slice(0, 3).forEach(([x, y], index) => {
    board.create('point', [x, y], {
      name: 'Extremum ' + (index + 1),
      size: 4,
      color: 'red',
      withLabel: true
    });
  });
}

/**
 * Add interactive elements to the board
 * @param {Object} board - The JSXGraph board
 */
function addInteractiveElements(board) {
  // Add a movable point on the x-axis
  const xPoint = board.create('glider', [0, 0, board.defaultAxes.x], {
    name: 'x',
    size: 5,
    color: 'blue',
    withLabel: true
  });
  
  // Add a point on the function that moves with the x-point
  const fnPoint = board.create('point', [
    function() { return xPoint.X(); },
    function() { return evaluateExpression('${parameters.functions[0].expression}', xPoint.X()); }
  ], {
    name: 'f(x)',
    size: 5,
    color: '${parameters.functions[0].color}',
    withLabel: true
  });
  
  // Add a line segment connecting the x-axis point to the function point
  board.create('line', [xPoint, fnPoint], {
    straightFirst: false,
    straightLast: false,
    strokeColor: 'black',
    strokeWidth: 1,
    dash: 2
  });
  
  // Add a text element showing the current coordinates
  board.create('text', [
    function() { return xPoint.X() + 0.5; },
    function() { return fnPoint.Y() + 0.5; },
    function() { return 'f(' + xPoint.X().toFixed(2) + ') = ' + fnPoint.Y().toFixed(2); }
  ], {
    fontSize: 12
  });
}

/**
 * Safely evaluate a mathematical expression
 * @param {string} expression - The mathematical expression as a string
 * @param {number} x - The x value
 * @returns {number} - The evaluated result
 */
function evaluateExpression(expression, x) {
  try {
    // Replace common math functions with Math.* equivalents if needed
    const preparedExpression = expression
      .replace(/sin\\(/g, 'Math.sin(')
      .replace(/cos\\(/g, 'Math.cos(')
      .replace(/tan\\(/g, 'Math.tan(')
      .replace(/exp\\(/g, 'Math.exp(')
      .replace(/log\\(/g, 'Math.log(')
      .replace(/sqrt\\(/g, 'Math.sqrt(')
      .replace(/pow\\(/g, 'Math.pow(')
      .replace(/abs\\(/g, 'Math.abs(')
      .replace(/\\^/g, '**'); // Convert caret operator to JS exponentiation
    
    // Create a function from the expression
    const fn = new Function('x', \`return \${preparedExpression};\`);
    
    // Evaluate the function
    return fn(x);
  } catch (e) {
    console.error('Error evaluating expression:', e);
    return 0;
  }
}`,

  /**
   * Template for geometry visualization
   */
  geometry: `/**
 * JSXGraph Geometry Visualization
 * ${educational.title}
 * 
 * ${educational.summary}
 */

/**
 * Initialize the JSXGraph visualization
 * @param {string} containerId - The ID of the container element
 */
function initVisualization(containerId) {
  // Define the bounding box for the visualization
  // Format: [xMin, yMax, xMax, yMin]
  const bbox = [${parameters.domain[0]}, ${parameters.range[1]}, ${parameters.domain[1]}, ${parameters.range[0]}];
  
  // Initialize the JSXGraph board
  const board = JXG.JSXGraph.initBoard(containerId, {
    boundingbox: bbox,
    axis: true,
    grid: true,
    showCopyright: false,
    showNavigation: true,
    keepAspectRatio: true
  });
  
  // Add geometric elements
  addGeometricElements(board);
  
  return board;
}

/**
 * Add geometric elements to the board
 * @param {Object} board - The JSXGraph board
 */
function addGeometricElements(board) {
  // Add points
  const points = [];
  
  // Create some default points if none are provided
  const pointsData = ${parameters.points}.length > 0 ? ${parameters.points} : [
    { label: 'A', coordinates: [-3, -2], color: '#3090FF' },
    { label: 'B', coordinates: [3, -2], color: '#3090FF' },
    { label: 'C', coordinates: [0, 2], color: '#3090FF' }
  ];
  
  // Add the points to the board
  pointsData.forEach(pointData => {
    const point = board.create('point', pointData.coordinates, {
      name: pointData.label,
      size: 4,
      color: pointData.color || '#3090FF',
      withLabel: true,
      label: { offset: [5, 5] }
    });
    points.push(point);
  });
  
  // Use the points to create geometric shapes based on the number of points
  if (points.length === 3) {
    // Create a triangle if we have 3 points
    const triangle = board.create('polygon', points, {
      fillColor: 'lightblue',
      fillOpacity: 0.3,
      borders: {
        strokeColor: 'blue',
        strokeWidth: 2
      }
    });
    
    // Add midpoints of the sides
    const midpoints = [];
    for (let i = 0; i < 3; i++) {
      const midpoint = board.create('midpoint', [points[i], points[(i + 1) % 3]], {
        name: 'M' + (i + 1),
        size: 2,
        color: 'green',
        withLabel: true
      });
      midpoints.push(midpoint);
    }
    
    // Add medians (lines from vertices to opposite midpoints)
    for (let i = 0; i < 3; i++) {
      board.create('line', [points[i], midpoints[(i + 1) % 3]], {
        strokeColor: 'green',
        strokeWidth: 1,
        dash: 2
      });
    }
    
    // Add the centroid (point of intersection of the medians)
    board.create('point', [
      function() {
        return (points[0].X() + points[1].X() + points[2].X()) / 3;
      },
      function() {
        return (points[0].Y() + points[1].Y() + points[2].Y()) / 3;
      }
    ], {
      name: 'Centroid',
      size: 4,
      color: 'red',
      withLabel: true
    });
    
  } else if (points.length === 4) {
    // Create a quadrilateral if we have 4 points
    board.create('polygon', points, {
      fillColor: 'lightgreen',
      fillOpacity: 0.3,
      borders: {
        strokeColor: 'green',
        strokeWidth: 2
      }
    });
    
    // Add diagonals
    board.create('line', [points[0], points[2]], {
      strokeColor: 'red',
      strokeWidth: 1,
      dash: 2
    });
    
    board.create('line', [points[1], points[3]], {
      strokeColor: 'red',
      strokeWidth: 1,
      dash: 2
    });
    
  } else if (points.length === 2) {
    // Create a circle if we have 2 points (center and point on circle)
    board.create('circle', points, {
      strokeColor: 'blue',
      strokeWidth: 2,
      fillColor: 'lightblue',
      fillOpacity: 0.1
    });
    
    // Add the radius
    board.create('line', points, {
      straightFirst: false,
      straightLast: false,
      strokeWidth: 1,
      strokeColor: 'black',
      dash: 2
    });
    
    // Add text for the radius value
    board.create('text', [
      function() { return (points[0].X() + points[1].X()) / 2; },
      function() { return (points[0].Y() + points[1].Y()) / 2; },
      function() {
        const radius = Math.sqrt(
          Math.pow(points[1].X() - points[0].X(), 2) +
          Math.pow(points[1].Y() - points[0].Y(), 2)
        );
        return 'r = ' + radius.toFixed(2);
      }
    ], {
      fontSize: 12
    });
  }
  
  // Add a title/caption
  board.create('text', [
    (${parameters.domain[0]} + ${parameters.domain[1]}) / 2, 
    ${parameters.range[1]} - 0.5, 
    '${educational.title}'
  ], {
    fontSize: 16,
    anchorX: 'middle',
    anchorY: 'top',
    cssClass: 'jsxgraph-title'
  });
}`,

  /**
   * Template for plotting multiple functions
   */
  multipleFunction: `/**
 * JSXGraph Multiple Function Visualization
 * ${educational.title}
 * 
 * ${educational.summary}
 */

/**
 * Initialize the JSXGraph visualization
 * @param {string} containerId - The ID of the container element
 */
function initVisualization(containerId) {
  // Define the bounding box for the visualization
  // Format: [xMin, yMax, xMax, yMin]
  const bbox = [${parameters.domain[0]}, ${parameters.range[1]}, ${parameters.domain[1]}, ${parameters.range[0]}];
  
  // Initialize the JSXGraph board
  const board = JXG.JSXGraph.initBoard(containerId, {
    boundingbox: bbox,
    axis: true,
    grid: true,
    showCopyright: false,
    showNavigation: true,
    keepAspectRatio: true
  });
  
  // Add the functions
  addFunctions(board);
  
  // Add interactive elements
  addInteractiveElements(board);
  
  return board;
}

/**
 * Add functions to the board
 * @param {Object} board - The JSXGraph board
 */
function addFunctions(board) {
  // Define the functions to plot
  const functions = ${parameters.functions.length > 0 ? JSON.stringify(parameters.functions) : `[
    {
      label: 'f(x)',
      expression: '${concept.expression}',
      domain: ${parameters.domain},
      color: '#3090FF'
    },
    {
      label: 'g(x)',
      expression: '${concept.expression.includes('x') ? concept.expression.replace(/x/g, '(x+1)') : concept.expression}',
      domain: ${parameters.domain},
      color: '#FF5733'
    }
  ]`};
  
  // Create the function graphs
  const graphs = [];
  
  functions.forEach((func, index) => {
    try {
      // Create the function graph
      const graph = board.create('functiongraph', [
        function(x) { return evaluateExpression(func.expression, x); },
        func.domain[0],
        func.domain[1]
      ], {
        strokeColor: func.color,
        strokeWidth: 2,
        name: func.label
      });
      
      graphs.push(graph);
      
      // Add a label for the function
      board.create('text', [
        ${parameters.domain[0]} + 0.5,
        ${parameters.range[1]} - 0.5 - index * 0.5,
        function() { return func.label + ': ' + func.expression; }
      ], {
        color: func.color,
        fontSize: 12
      });
      
    } catch (error) {
      console.error(\`Error creating function \${func.label}:\`, error);
    }
  });
  
  return graphs;
}

/**
 * Add interactive elements to the board
 * @param {Object} board - The JSXGraph board
 */
function addInteractiveElements(board) {
  // Add a movable point on the x-axis
  const xPoint = board.create('glider', [0, 0, board.defaultAxes.x], {
    name: 'x',
    size: 5,
    color: 'black',
    withLabel: true
  });
  
  // Define the functions to evaluate at the x-point
  const functions = ${parameters.functions.length > 0 ? JSON.stringify(parameters.functions) : `[
    {
      label: 'f(x)',
      expression: '${concept.expression}',
      color: '#3090FF'
    },
    {
      label: 'g(x)',
      expression: '${concept.expression.includes('x') ? concept.expression.replace(/x/g, '(x+1)') : concept.expression}',
      color: '#FF5733'
    }
  ]`};
  
  // Add points on each function that move with the x-point
  const fnPoints = [];
  
  functions.forEach((func, index) => {
    const fnPoint = board.create('point', [
      function() { return xPoint.X(); },
      function() { 
        try {
          return evaluateExpression(func.expression, xPoint.X());
        } catch (e) {
          return 0;
        }
      }
    ], {
      name: func.label,
      size: 5,
      color: func.color,
      withLabel: true
    });
    
    fnPoints.push(fnPoint);
    
    // Add a line segment connecting the x-axis point to the function point
    board.create('line', [xPoint, fnPoint], {
      straightFirst: false,
      straightLast: false,
      strokeColor: func.color,
      strokeWidth: 1,
      dash: 2
    });
  });
  
  // Add a text element showing the current function values
  board.create('text', [
    function() { return xPoint.X() + 0.5; },
    function() { return ${parameters.range[1]} - 1; },
    function() { 
      let text = 'x = ' + xPoint.X().toFixed(2) + '\\n';
      fnPoints.forEach((point, index) => {
        text += functions[index].label + ' = ' + point.Y().toFixed(2) + '\\n';
      });
      return text;
    }
  ], {
    fontSize: 12
  });
}

/**
 * Safely evaluate a mathematical expression
 * @param {string} expression - The mathematical expression as a string
 * @param {number} x - The x value
 * @returns {number} - The evaluated result
 */
function evaluateExpression(expression, x) {
  try {
    // Replace common math functions with Math.* equivalents if needed
    const preparedExpression = expression
      .replace(/sin\\(/g, 'Math.sin(')
      .replace(/cos\\(/g, 'Math.cos(')
      .replace(/tan\\(/g, 'Math.tan(')
      .replace(/exp\\(/g, 'Math.exp(')
      .replace(/log\\(/g, 'Math.log(')
      .replace(/sqrt\\(/g, 'Math.sqrt(')
      .replace(/pow\\(/g, 'Math.pow(')
      .replace(/abs\\(/g, 'Math.abs(')
      .replace(/\\^/g, '**'); // Convert caret operator to JS exponentiation
    
    // Create a function from the expression
    const fn = new Function('x', \`return \${preparedExpression};\`);
    
    // Evaluate the function
    return fn(x);
  } catch (e) {
    console.error('Error evaluating expression:', e);
    return 0;
  }
}`
};