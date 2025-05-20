/**
 * MathBox Templates
 * Template code for generating MathBox visualizations for different types of
 * mathematical concepts.
 */

/**
 * Templates organized by concept type
 */
export const mathboxTemplates = {
  /**
   * Default template used when a specific one isn't available
   */
  default: `/**
 * MathBox Visualization
 * ${educational.title}
 * 
 * ${educational.summary}
 */

/**
 * Initialize the MathBox visualization
 * @param {string} elementId - The ID of the container element
 */
function initVisualization(elementId) {
  // Create the MathBox instance
  const mathbox = createMathBoxInstance(elementId, {
    backgroundColor: '#FFFFFF'
  });
  
  // Set up cartesian coordinates
  mathbox
    .set({
      scale: 720,
      focus: 3
    })
    .cartesian({
      range: [${visualization.viewport.x}, ${visualization.viewport.y}, ${visualization.viewport.z}],
      scale: [2, 1, 1]
    });
  
  // Add coordinate axes
  addAxes(mathbox);
  
  // Add a grid
  addGrid(mathbox);
  
  // Add the visualization
  addVisualization(mathbox);
}

/**
 * Add coordinate axes to the visualization
 * @param {Object} mathbox - The MathBox instance
 */
function addAxes(mathbox) {
  mathbox
    .group()
    .axis({
      axis: 1,
      width: 2,
      detail: 40,
      color: 'black'
    })
    .axis({
      axis: 2,
      width: 2,
      detail: 40,
      color: 'black'
    })
    .axis({
      axis: 3,
      width: 2,
      detail: 40,
      color: 'black'
    });
}

/**
 * Add a grid to the visualization
 * @param {Object} mathbox - The MathBox instance
 */
function addGrid(mathbox) {
  mathbox
    .group()
    .grid({
      width: 1,
      axes: [1, 3],
      divideX: 20,
      divideY: 20,
      opacity: 0.5,
      color: 'gray'
    });
}

/**
 * Add the main visualization
 * @param {Object} mathbox - The MathBox instance
 */
function addVisualization(mathbox) {
  // Placeholder visualization - this would be customized based on the concept
  mathbox
    .group()
    .interval({
      width: 64,
      expr: function (emit, x) {
        emit(x, Math.sin(x), 0);
      },
      channels: 3
    })
    .line({
      width: 5,
      color: '#3090FF'
    });
}

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
}`,

  /**
   * Template for 3D function visualizations (z = f(x,y))
   */
  function3D: `/**
 * MathBox 3D Function Visualization
 * ${educational.title}
 * 
 * ${educational.summary}
 */

/**
 * Initialize the MathBox visualization
 * @param {string} elementId - The ID of the container element
 */
function initVisualization(elementId) {
  // Create the MathBox instance
  const mathbox = createMathBoxInstance(elementId, {
    backgroundColor: '#FFFFFF'
  });
  
  // Set up cartesian coordinates
  mathbox
    .set({
      scale: 720,
      focus: 3
    })
    .cartesian({
      range: [${visualization.viewport.x}, ${visualization.viewport.y}, ${visualization.viewport.z}],
      scale: [2, 1, 1]
    });
  
  // Add coordinate axes
  addAxes(mathbox);
  
  // Add a grid
  addGrid(mathbox);
  
  // Add the 3D function visualization
  addSurface(mathbox);
}

/**
 * Add coordinate axes to the visualization
 * @param {Object} mathbox - The MathBox instance
 */
function addAxes(mathbox) {
  mathbox
    .group()
    .axis({
      axis: 1,
      width: 2,
      detail: 40,
      color: 'black'
    })
    .axis({
      axis: 2,
      width: 2,
      detail: 40,
      color: 'black'
    })
    .axis({
      axis: 3,
      width: 2,
      detail: 40,
      color: 'black'
    });
}

/**
 * Add a grid to the visualization
 * @param {Object} mathbox - The MathBox instance
 */
function addGrid(mathbox) {
  mathbox
    .group()
    .grid({
      width: 1,
      axes: [1, 3],
      divideX: 20,
      divideY: 20,
      opacity: 0.5,
      color: 'gray'
    });
}

/**
 * Add the 3D function surface
 * @param {Object} mathbox - The MathBox instance
 */
function addSurface(mathbox) {
  // Create a 3D function surface z = f(x,y)
  mathbox
    .group()
    .area({
      width: 64,
      height: 64,
      axes: [1, 2, 3],
      expr: function (emit, x, y, i, j) {
        // Parse and evaluate the function expression
        const z = evaluateExpression('${parameters.functions[0].expression}', x, y);
        emit(x, y, z);
      }
    })
    .surface({
      color: '${parameters.functions[0].color}',
      shaded: true,
      lineX: true,
      lineY: true,
      width: 1,
      fill: true,
      opacity: 0.8
    });
}

/**
 * Safely evaluate a mathematical expression with x and y variables
 * @param {string} expression - The mathematical expression
 * @param {number} x - The x value
 * @param {number} y - The y value
 * @returns {number} - The result of the expression
 */
function evaluateExpression(expression, x, y) {
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
      .replace(/abs\\(/g, 'Math.abs(');
    
    // Create a function from the expression
    const fn = new Function('x', 'y', \`return \${preparedExpression};\`);
    
    // Evaluate the function
    return fn(x, y);
  } catch (e) {
    console.error('Error evaluating expression:', e);
    return 0;
  }
}

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
  
  // Set up camera
  three.camera.position.set(2, 2, 2);
  three.camera.lookAt(new THREE.Vector3(0, 0, 0));
  
  return mathbox;
}`,

  /**
   * Template for vector field visualizations
   */
  vectorfield: `/**
 * MathBox Vector Field Visualization
 * ${educational.title}
 * 
 * ${educational.summary}
 */

/**
 * Initialize the MathBox visualization
 * @param {string} elementId - The ID of the container element
 */
function initVisualization(elementId) {
  // Create the MathBox instance
  const mathbox = createMathBoxInstance(elementId, {
    backgroundColor: '#FFFFFF'
  });
  
  // Set up cartesian coordinates
  mathbox
    .set({
      scale: 720,
      focus: 3
    })
    .cartesian({
      range: [${visualization.viewport.x}, ${visualization.viewport.y}, ${visualization.viewport.z}],
      scale: [2, 1, 1]
    });
  
  // Add coordinate axes
  addAxes(mathbox);
  
  // Add a grid
  addGrid(mathbox);
  
  // Add the vector field visualization
  addVectorField(mathbox);
}

/**
 * Add coordinate axes to the visualization
 * @param {Object} mathbox - The MathBox instance
 */
function addAxes(mathbox) {
  mathbox
    .group()
    .axis({
      axis: 1,
      width: 2,
      detail: 40,
      color: 'black'
    })
    .axis({
      axis: 2,
      width: 2,
      detail: 40,
      color: 'black'
    })
    .axis({
      axis: 3,
      width: 2,
      detail: 40,
      color: 'black'
    });
}

/**
 * Add a grid to the visualization
 * @param {Object} mathbox - The MathBox instance
 */
function addGrid(mathbox) {
  mathbox
    .group()
    .grid({
      width: 1,
      axes: [1, 3],
      divideX: 20,
      divideY: 20,
      opacity: 0.5,
      color: 'gray'
    });
}

/**
 * Add the vector field visualization
 * @param {Object} mathbox - The MathBox instance
 */
function addVectorField(mathbox) {
  // Create a vector field visualization
  const vectorGroup = mathbox.group();
  
  // Create the vector field data
  vectorGroup
    .array({
      width: 10,
      height: 10,
      depth: 10,
      expr: function (emit, x, y, z, i, j, k) {
        // Compute the origin point of each vector
        emit(x, y, z);
      },
      channels: 3
    });
  
  // Create the vectors
  vectorGroup
    .array({
      width: 10,
      height: 10,
      depth: 10,
      expr: function (emit, x, y, z, i, j, k) {
        // Calculate the vector direction at this point
        // This should be replaced with the actual vector field function
        const vx = calculateVectorX(x, y, z);
        const vy = calculateVectorY(x, y, z);
        const vz = calculateVectorZ(x, y, z);
        
        // Normalize and scale the vector
        const length = Math.sqrt(vx*vx + vy*vy + vz*vz);
        const scale = 0.3; // Scale factor for vector display
        
        if (length > 0) {
          emit(vx/length * scale, vy/length * scale, vz/length * scale);
        } else {
          emit(0, 0, 0);
        }
      },
      channels: 3
    })
    .vector({
      color: '${parameters.functions[0].color}',
      width: 2,
      start: true, // Draw vectors from the points defined in the first array
      end: true    // Draw arrows at the end
    });
}

/**
 * Calculate the x-component of the vector field
 * @param {number} x - The x coordinate
 * @param {number} y - The y coordinate
 * @param {number} z - The z coordinate
 * @returns {number} - The x-component of the vector
 */
function calculateVectorX(x, y, z) {
  // This should be replaced with the actual vector field function
  // Example: return a simple vector field like [y, -x, z]
  return y;
}

/**
 * Calculate the y-component of the vector field
 * @param {number} x - The x coordinate
 * @param {number} y - The y coordinate
 * @param {number} z - The z coordinate
 * @returns {number} - The y-component of the vector
 */
function calculateVectorY(x, y, z) {
  // Example vector field component
  return -x;
}

/**
 * Calculate the z-component of the vector field
 * @param {number} x - The x coordinate
 * @param {number} y - The y coordinate
 * @param {number} z - The z coordinate
 * @returns {number} - The z-component of the vector
 */
function calculateVectorZ(x, y, z) {
  // Example vector field component
  return z;
}

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
  
  // Set up camera
  three.camera.position.set(2, 2, 2);
  three.camera.lookAt(new THREE.Vector3(0, 0, 0));
  
  return mathbox;
}`,

  /**
   * Template for parametric surface visualizations
   */
  parametricsurface: `/**
 * MathBox Parametric Surface Visualization
 * ${educational.title}
 * 
 * ${educational.summary}
 */

/**
 * Initialize the MathBox visualization
 * @param {string} elementId - The ID of the container element
 */
function initVisualization(elementId) {
  // Create the MathBox instance
  const mathbox = createMathBoxInstance(elementId, {
    backgroundColor: '#FFFFFF'
  });
  
  // Set up cartesian coordinates
  mathbox
    .set({
      scale: 720,
      focus: 3
    })
    .cartesian({
      range: [${visualization.viewport.x}, ${visualization.viewport.y}, ${visualization.viewport.z}],
      scale: [2, 1, 1]
    });
  
  // Add coordinate axes
  addAxes(mathbox);
  
  // Add a grid
  addGrid(mathbox);
  
  // Add the parametric surface visualization
  addParametricSurface(mathbox);
}

/**
 * Add coordinate axes to the visualization
 * @param {Object} mathbox - The MathBox instance
 */
function addAxes(mathbox) {
  mathbox
    .group()
    .axis({
      axis: 1,
      width: 2,
      detail: 40,
      color: 'black'
    })
    .axis({
      axis: 2,
      width: 2,
      detail: 40,
      color: 'black'
    })
    .axis({
      axis: 3,
      width: 2,
      detail: 40,
      color: 'black'
    });
}

/**
 * Add a grid to the visualization
 * @param {Object} mathbox - The MathBox instance
 */
function addGrid(mathbox) {
  mathbox
    .group()
    .grid({
      width: 1,
      axes: [1, 3],
      divideX: 20,
      divideY: 20,
      opacity: 0.5,
      color: 'gray'
    });
}

/**
 * Add the parametric surface visualization
 * @param {Object} mathbox - The MathBox instance
 */
function addParametricSurface(mathbox) {
  // Create a parametric surface
  mathbox
    .group()
    .area({
      width: 64,
      height: 64,
      axes: [1, 2, 3],
      expr: function (emit, u, v, i, j) {
        // For parametric surface, we calculate x, y, z from parameters u, v
        // Example: a torus
        const r1 = 1; // major radius
        const r2 = 0.5; // minor radius
        
        const x = (r1 + r2 * Math.cos(v)) * Math.cos(u);
        const y = (r1 + r2 * Math.cos(v)) * Math.sin(u);
        const z = r2 * Math.sin(v);
        
        emit(x, y, z);
      },
      rangeU: [0, 2 * Math.PI],
      rangeV: [0, 2 * Math.PI]
    })
    .surface({
      color: '${parameters.functions[0].color}',
      shaded: true,
      lineX: true,
      lineY: true,
      width: 1,
      fill: true,
      opacity: 0.8
    });
}

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
  
  // Set up camera
  three.camera.position.set(2, 2, 2);
  three.camera.lookAt(new THREE.Vector3(0, 0, 0));
  
  return mathbox;
}`
};