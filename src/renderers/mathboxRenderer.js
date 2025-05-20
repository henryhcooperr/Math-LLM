/**
 * MathBox Renderer
 * Renders 3D mathematical visualizations using the MathBox library.
 */

/**
 * Render a MathBox visualization
 * @param {Object} options - Visualization options following the standardized props interface
 * @returns {HTMLElement} - The rendered visualization element
 */
const render = (options) => {
  // Extract options with defaults
  const {
    id = 'mathbox-' + Math.random().toString(36).substring(2, 9),
    width = '100%',
    height = 400,
    expression = 'Math.sin(x) * Math.cos(y)',
    domain = [-5, 5],
    range = [-5, 5],
    zRange = [-5, 5],
    colors = {
      background: '#FFFFFF',
      primary: '#3090FF'
    },
    showAxes = true,
    showGrid = true,
    resizable = true
  } = options;
  
  // Create container element
  const container = document.createElement('div');
  container.id = id;
  container.style.width = typeof width === 'number' ? width + 'px' : width;
  container.style.height = typeof height === 'number' ? height + 'px' : height;
  container.style.position = 'relative';
  
  // Create script element for initialization
  const script = document.createElement('script');
  script.type = 'text/javascript';
  
  // Generate the initialization code
  script.textContent = generateMathBoxInitializationCode(options);
  
  // Add script to container
  container.appendChild(script);
  
  // If resizable, add resize observer
  if (resizable) {
    const resizeScript = document.createElement('script');
    resizeScript.type = 'text/javascript';
    resizeScript.textContent = generateResizeCode(id);
    container.appendChild(resizeScript);
  }
  
  return container;
};

/**
 * Generate MathBox initialization code based on options
 * @param {Object} options - Visualization options
 * @returns {string} - JavaScript code to initialize MathBox
 */
function generateMathBoxInitializationCode(options) {
  const {
    id,
    expression,
    domain,
    range,
    zRange,
    colors,
    type = 'function3D',
    showAxes,
    showGrid
  } = options;
  
  // Select the initialization template based on the visualization type
  let template;
  
  switch (type) {
    case 'function3D':
      template = generateFunction3DCode(options);
      break;
    case 'vectorField':
      template = generateVectorFieldCode(options);
      break;
    case 'parametricSurface':
      template = generateParametricSurfaceCode(options);
      break;
    default:
      template = generateFunction3DCode(options);
  }
  
  // Wrap the template in an initialization function
  return `
  (function() {
    // Wait for document to be ready
    function initialize() {
      if (typeof window.THREE === 'undefined' || typeof window.mathBox === 'undefined') {
        // Libraries not loaded yet, wait and try again
        setTimeout(initialize, 100);
        return;
      }
      
      const container = document.getElementById('${id}');
      if (!container) {
        console.error('Container element not found:', '${id}');
        return;
      }
      
      // Create mathbox instance
      const mathbox = mathBox({
        plugins: ['core', 'controls', 'cursor'],
        controls: {
          klass: THREE.OrbitControls
        },
        element: container
      });
      
      // Access three.js renderer
      const three = mathbox.three;
      
      // Set renderer properties
      three.renderer.setClearColor(new THREE.Color('${colors.background || '#FFFFFF'}'), 1.0);
      three.renderer.setPixelRatio(window.devicePixelRatio);
      
      // Store reference to mathbox
      container._mathbox = mathbox;
      
      ${template}
    }
    
    // Initialize when document is ready
    if (document.readyState === 'complete') {
      initialize();
    } else {
      window.addEventListener('load', initialize);
    }
  })();
  `;
}

/**
 * Generate code for a 3D function visualization
 * @param {Object} options - Visualization options
 * @returns {string} - JavaScript code for the visualization
 */
function generateFunction3DCode(options) {
  const {
    expression,
    domain,
    range,
    zRange,
    colors,
    showAxes,
    showGrid,
    resolution = 64
  } = options;
  
  return `
    // Set up cartesian coordinate system
    mathbox
      .set({
        scale: 500,
        focus: 3
      })
      .cartesian({
        range: [${JSON.stringify(domain)}, ${JSON.stringify(range)}, ${JSON.stringify(zRange)}],
        scale: [1, 1, 1]
      });
    
    ${showAxes ? `
    // Add coordinate axes
    mathbox
      .group()
      .axis({
        axis: 1,
        width: 2,
        color: 'black'
      })
      .axis({
        axis: 2,
        width: 2,
        color: 'black'
      })
      .axis({
        axis: 3,
        width: 2,
        color: 'black'
      });` : ''}
    
    ${showGrid ? `
    // Add grid
    mathbox
      .group()
      .grid({
        width: 1,
        divideX: 20,
        divideY: 20,
        axes: [1, 2],
        color: '#777777'
      });` : ''}
    
    // Add the 3D function surface
    mathbox
      .group()
      .area({
        expr: function (emit, x, y, i, j) {
          // Parse and evaluate the function expression
          const z = evaluateExpression('${expression}', x, y);
          emit(x, y, z);
        },
        width: ${resolution},
        height: ${resolution},
        axes: [1, 2, 3]
      })
      .surface({
        color: '${colors.primary || '#3090FF'}',
        shaded: true,
        lineX: true,
        lineY: true,
        width: 1,
        fill: true,
        opacity: 0.8
      });
    
    // Helper function to evaluate mathematical expressions
    function evaluateExpression(expression, x, y) {
      try {
        // Replace Math functions if they're not prefixed
        const expr = expression
          .replace(/sin\\(/g, 'Math.sin(')
          .replace(/cos\\(/g, 'Math.cos(')
          .replace(/tan\\(/g, 'Math.tan(')
          .replace(/exp\\(/g, 'Math.exp(')
          .replace(/log\\(/g, 'Math.log(')
          .replace(/sqrt\\(/g, 'Math.sqrt(')
          .replace(/pow\\(/g, 'Math.pow(')
          .replace(/abs\\(/g, 'Math.abs(')
          .replace(/\\^/g, '**');
        
        // Create a function from the expression
        const fn = new Function('x', 'y', \`return \${expr};\`);
        
        // Evaluate the function
        return fn(x, y);
      } catch (e) {
        console.error('Error evaluating expression:', e);
        return 0;
      }
    }
  `;
}

/**
 * Generate code for a vector field visualization
 * @param {Object} options - Visualization options
 * @returns {string} - JavaScript code for the visualization
 */
function generateVectorFieldCode(options) {
  const {
    expression,
    domain,
    range,
    zRange,
    colors,
    showAxes,
    showGrid,
    resolution = 10
  } = options;
  
  return `
    // Set up cartesian coordinate system
    mathbox
      .set({
        scale: 500,
        focus: 3
      })
      .cartesian({
        range: [${JSON.stringify(domain)}, ${JSON.stringify(range)}, ${JSON.stringify(zRange)}],
        scale: [1, 1, 1]
      });
    
    ${showAxes ? `
    // Add coordinate axes
    mathbox
      .group()
      .axis({
        axis: 1,
        width: 2,
        color: 'black'
      })
      .axis({
        axis: 2,
        width: 2,
        color: 'black'
      })
      .axis({
        axis: 3,
        width: 2,
        color: 'black'
      });` : ''}
    
    ${showGrid ? `
    // Add grid
    mathbox
      .group()
      .grid({
        width: 1,
        divideX: 20,
        divideY: 20,
        axes: [1, 2],
        color: '#777777'
      });` : ''}
    
    // Add the vector field
    const vectorGroup = mathbox.group();
    
    // Add vector positions
    vectorGroup
      .array({
        width: ${resolution},
        height: ${resolution},
        depth: ${resolution},
        items: 3,
        channels: 3,
        expr: function (emit, x, y, z, i, j, k) {
          // Map the indices to positions in the domain
          const xPos = ${domain[0]} + (${domain[1]} - ${domain[0]}) * i / (${resolution} - 1);
          const yPos = ${range[0]} + (${range[1]} - ${range[0]}) * j / (${resolution} - 1);
          const zPos = ${zRange[0]} + (${zRange[1]} - ${zRange[0]}) * k / (${resolution} - 1);
          
          emit(xPos, yPos, zPos);
        }
      });
    
    // Add vector directions
    vectorGroup
      .array({
        width: ${resolution},
        height: ${resolution},
        depth: ${resolution},
        items: 3,
        channels: 3,
        expr: function (emit, x, y, z, i, j, k) {
          // Map the indices to positions in the domain
          const xPos = ${domain[0]} + (${domain[1]} - ${domain[0]}) * i / (${resolution} - 1);
          const yPos = ${range[0]} + (${range[1]} - ${range[0]}) * j / (${resolution} - 1);
          const zPos = ${zRange[0]} + (${zRange[1]} - ${zRange[0]}) * k / (${resolution} - 1);
          
          // Calculate the vector at this position
          // For demonstration, using a simple vector field where vector points outward from origin
          const vx = xPos;
          const vy = yPos;
          const vz = zPos;
          
          // Get the vector length for normalization
          const length = Math.sqrt(vx*vx + vy*vy + vz*vz);
          
          // Scale factor for arrow length
          const scale = 0.3 * (${domain[1]} - ${domain[0]}) / ${resolution};
          
          // Emit normalized and scaled vector
          if (length > 0) {
            emit(vx/length * scale, vy/length * scale, vz/length * scale);
          } else {
            emit(0, 0, 0);
          }
        }
      });
    
    // Create the vector arrows
    vectorGroup
      .vector({
        color: '${colors.primary || '#3090FF'}',
        width: 2,
        start: true,
        end: true
      });
  `;
}

/**
 * Generate code for a parametric surface visualization
 * @param {Object} options - Visualization options
 * @returns {string} - JavaScript code for the visualization
 */
function generateParametricSurfaceCode(options) {
  const {
    expression,
    domain,
    range,
    zRange,
    colors,
    showAxes,
    showGrid,
    resolution = 64
  } = options;
  
  return `
    // Set up cartesian coordinate system
    mathbox
      .set({
        scale: 500,
        focus: 3
      })
      .cartesian({
        range: [${JSON.stringify(domain)}, ${JSON.stringify(range)}, ${JSON.stringify(zRange)}],
        scale: [1, 1, 1]
      });
    
    ${showAxes ? `
    // Add coordinate axes
    mathbox
      .group()
      .axis({
        axis: 1,
        width: 2,
        color: 'black'
      })
      .axis({
        axis: 2,
        width: 2,
        color: 'black'
      })
      .axis({
        axis: 3,
        width: 2,
        color: 'black'
      });` : ''}
    
    ${showGrid ? `
    // Add grid
    mathbox
      .group()
      .grid({
        width: 1,
        divideX: 20,
        divideY: 20,
        axes: [1, 2],
        color: '#777777'
      });` : ''}
    
    // Add the parametric surface
    mathbox
      .group()
      .area({
        width: ${resolution},
        height: ${resolution},
        axes: [1, 2, 3],
        expr: function (emit, u, v, i, j) {
          // For a parametric surface, calculate x, y, z based on parameters u, v
          // Example: a torus
          const r1 = 2; // major radius
          const r2 = 1; // minor radius
          
          const x = (r1 + r2 * Math.cos(v)) * Math.cos(u);
          const y = (r1 + r2 * Math.cos(v)) * Math.sin(u);
          const z = r2 * Math.sin(v);
          
          emit(x, y, z);
        },
        rangeU: [0, 2 * Math.PI],
        rangeV: [0, 2 * Math.PI]
      })
      .surface({
        color: '${colors.primary || '#3090FF'}',
        shaded: true,
        lineX: true,
        lineY: true,
        width: 1,
        fill: true,
        opacity: 0.8
      });
  `;
}

/**
 * Generate code to handle resizing of the visualization
 * @param {string} id - The container ID
 * @returns {string} - JavaScript code for handling resize
 */
function generateResizeCode(id) {
  return `
  (function() {
    // Set up resize observer
    if (typeof ResizeObserver !== 'undefined') {
      const container = document.getElementById('${id}');
      if (!container) return;
      
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          // Get the mathbox instance
          const mathbox = container._mathbox;
          if (!mathbox) continue;
          
          // Get the new dimensions
          const { width, height } = entry.contentRect;
          
          // Update mathbox size
          mathbox.three.renderer.setSize(width, height);
          mathbox.three.camera.aspect = width / height;
          mathbox.three.camera.updateProjectionMatrix();
        }
      });
      
      // Start observing
      resizeObserver.observe(container);
    }
  })();
  `;
}

export default { render };