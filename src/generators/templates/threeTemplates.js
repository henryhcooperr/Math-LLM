/**
 * Three.js Templates
 * Template code for generating Three.js visualizations for different types of
 * mathematical concepts.
 */

/**
 * Templates organized by concept type
 */
export const threeTemplates = {
  /**
   * Default template used when a specific one isn't available
   */
  default: `/**
 * Three.js Visualization
 * ${educational.title}
 * 
 * ${educational.summary}
 */

/**
 * Initialize the Three.js visualization
 * @param {string} containerId - The ID of the container element
 */
function initVisualization(containerId) {
  // Get the container
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Set up scene, camera, and renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  
  // Create a camera
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 400;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);
  
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  
  // Add orbit controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // Add lighting
  addLighting(scene);
  
  // Add coordinate axes
  addAxes(scene);
  
  // Add visualization content
  addVisualization(scene);
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

/**
 * Add lighting to the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addLighting(scene) {
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 1);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
}

/**
 * Add coordinate axes to the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addAxes(scene) {
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
}

/**
 * Add the main visualization content
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addVisualization(scene) {
  // Default visualization - a simple cube
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x3090FF,
    metalness: 0.2,
    roughness: 0.5
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}`,

  /**
   * Template for 3D function visualization (z = f(x,y))
   */
  function3D: `/**
 * Three.js 3D Function Visualization
 * ${educational.title}
 * 
 * ${educational.summary}
 */

/**
 * Initialize the Three.js visualization
 * @param {string} containerId - The ID of the container element
 */
function initVisualization(containerId) {
  // Get the container
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Set up scene, camera, and renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  
  // Create a camera
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 400;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);
  
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  
  // Add orbit controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // Add lighting
  addLighting(scene);
  
  // Add coordinate axes
  addAxes(scene);
  
  // Add coordinate grid
  addGrid(scene);
  
  // Add the 3D function visualization
  addFunction3D(scene);
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

/**
 * Add lighting to the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addLighting(scene) {
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 1);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Add a second directional light from another angle
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(-1, 0.5, -1);
  scene.add(directionalLight2);
}

/**
 * Add coordinate axes to the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addAxes(scene) {
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
  
  // X, Y, Z labels
  const fontLoader = new THREE.FontLoader();
  fontLoader.load('https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    const textOptions = {
      font: font,
      size: 0.3,
      height: 0.05
    };
    
    // X axis label
    const xTextGeometry = new THREE.TextGeometry('X', textOptions);
    const xTextMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const xText = new THREE.Mesh(xTextGeometry, xTextMaterial);
    xText.position.set(5.2, 0, 0);
    scene.add(xText);
    
    // Y axis label
    const yTextGeometry = new THREE.TextGeometry('Y', textOptions);
    const yTextMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const yText = new THREE.Mesh(yTextGeometry, yTextMaterial);
    yText.position.set(0, 5.2, 0);
    scene.add(yText);
    
    // Z axis label
    const zTextGeometry = new THREE.TextGeometry('Z', textOptions);
    const zTextMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const zText = new THREE.Mesh(zTextGeometry, zTextMaterial);
    zText.position.set(0, 0, 5.2);
    scene.add(zText);
  });
}

/**
 * Add a coordinate grid to the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addGrid(scene) {
  // XY-plane grid
  const gridHelper = new THREE.GridHelper(10, 10);
  gridHelper.rotation.x = Math.PI / 2;
  scene.add(gridHelper);
}

/**
 * Add a 3D function visualization to the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addFunction3D(scene) {
  // Create a parametric geometry for the function z = f(x,y)
  const xMin = ${parameters.domain[0]};
  const xMax = ${parameters.domain[1]};
  const yMin = ${parameters.range[0]};
  const yMax = ${parameters.range[1]};
  const resolution = 50; // Number of segments
  
  try {
    // Create a parametric geometry
    const geometry = new THREE.ParametricBufferGeometry(
      (u, v, target) => {
        // Map u,v parameters (range 0 to 1) to x,y coordinates
        const x = xMin + u * (xMax - xMin);
        const y = yMin + v * (yMax - yMin);
        
        // Calculate z value using the function expression
        const z = evaluateExpression('${parameters.functions[0].expression}', x, y);
        
        target.set(x, y, z);
      }, 
      resolution, 
      resolution
    );
    
    // Create a material
    const material = new THREE.MeshPhongMaterial({
      color: '${parameters.functions[0].color}',
      side: THREE.DoubleSide,
      flatShading: false,
      shininess: 30,
      wireframe: false
    });
    
    // Create the surface mesh and add it to the scene
    const surface = new THREE.Mesh(geometry, material);
    scene.add(surface);
    
    // Add a wireframe to see the mesh structure
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });
    const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(wireframe);
    
  } catch (error) {
    console.error('Error creating 3D function:', error);
    
    // Create a simple plane with an error message as a fallback
    const geometry = new THREE.PlaneGeometry(5, 5);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
  }
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
      .replace(/abs\\(/g, 'Math.abs(')
      .replace(/\\^/g, '**'); // Convert caret operator to JS exponentiation
    
    // Create a function from the expression
    const fn = new Function('x', 'y', \`return \${preparedExpression};\`);
    
    // Evaluate the function
    return fn(x, y);
  } catch (e) {
    console.error('Error evaluating expression:', e);
    return 0;
  }
}`,

  /**
   * Template for vector field visualization
   */
  vectorfield: `/**
 * Three.js Vector Field Visualization
 * ${educational.title}
 * 
 * ${educational.summary}
 */

/**
 * Initialize the Three.js visualization
 * @param {string} containerId - The ID of the container element
 */
function initVisualization(containerId) {
  // Get the container
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Set up scene, camera, and renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  
  // Create a camera
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 400;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);
  
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  
  // Add orbit controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // Add lighting
  addLighting(scene);
  
  // Add coordinate axes
  addAxes(scene);
  
  // Add coordinate grid
  addGrid(scene);
  
  // Add the vector field visualization
  addVectorField(scene);
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

/**
 * Add lighting to the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addLighting(scene) {
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 1);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
}

/**
 * Add coordinate axes to the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addAxes(scene) {
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
}

/**
 * Add a coordinate grid to the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addGrid(scene) {
  // Add grid on each plane
  const gridHelperXY = new THREE.GridHelper(10, 10);
  gridHelperXY.rotation.x = Math.PI / 2;
  scene.add(gridHelperXY);
  
  const gridHelperXZ = new THREE.GridHelper(10, 10);
  scene.add(gridHelperXZ);
  
  const gridHelperYZ = new THREE.GridHelper(10, 10);
  gridHelperYZ.rotation.z = Math.PI / 2;
  scene.add(gridHelperYZ);
}

/**
 * Add a vector field visualization to the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addVectorField(scene) {
  const xMin = ${parameters.domain[0]};
  const xMax = ${parameters.domain[1]};
  const yMin = ${parameters.range[0]};
  const yMax = ${parameters.range[1]};
  const zMin = ${visualization.viewport.z[0]};
  const zMax = ${visualization.viewport.z[1]};
  
  // Number of vectors in each dimension
  const resolution = 5; // Lower for better performance
  
  try {
    // Calculate step size
    const xStep = (xMax - xMin) / resolution;
    const yStep = (yMax - yMin) / resolution;
    const zStep = (zMax - zMin) / resolution;
    
    // Create vectors at grid points
    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        for (let k = 0; k <= resolution; k++) {
          // Calculate position
          const x = xMin + i * xStep;
          const y = yMin + j * yStep;
          const z = zMin + k * zStep;
          
          // Calculate vector at this position
          // For demonstration, using a simple vector field like gradient of f(x,y,z) = x^2 + y^2 + z^2
          // In a real implementation, this would come from the analysis data
          const vx = 2 * x;
          const vy = 2 * y;
          const vz = 2 * z;
          
          // Calculate vector magnitude for scaling
          const magnitude = Math.sqrt(vx*vx + vy*vy + vz*vz);
          
          // Skip very small vectors
          if (magnitude < 0.1) continue;
          
          // Create normalized direction vector
          const direction = new THREE.Vector3(vx/magnitude, vy/magnitude, vz/magnitude);
          
          // Scale factor for arrow length - adjust based on field
          const length = Math.min(xStep, yStep, zStep) * 0.8;
          
          // Create arrow
          const arrowHelper = new THREE.ArrowHelper(
            direction,
            new THREE.Vector3(x, y, z),
            length,
            '${parameters.functions[0].color}'
          );
          
          scene.add(arrowHelper);
        }
      }
    }
    
  } catch (error) {
    console.error('Error creating vector field:', error);
  }
}`,

  /**
   * Template for parametric surface visualization
   */
  parametricsurface: `/**
 * Three.js Parametric Surface Visualization
 * ${educational.title}
 * 
 * ${educational.summary}
 */

/**
 * Initialize the Three.js visualization
 * @param {string} containerId - The ID of the container element
 */
function initVisualization(containerId) {
  // Get the container
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Set up scene, camera, and renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  
  // Create a camera
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 400;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);
  
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  
  // Add orbit controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // Add lighting
  addLighting(scene);
  
  // Add coordinate axes
  addAxes(scene);
  
  // Add the parametric surface visualization
  addParametricSurface(scene);
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

/**
 * Add lighting to the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addLighting(scene) {
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 1);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Add a second directional light from another angle
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(-1, 0.5, -1);
  scene.add(directionalLight2);
}

/**
 * Add coordinate axes to the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addAxes(scene) {
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
}

/**
 * Add a parametric surface visualization to the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addParametricSurface(scene) {
  const resolution = 64; // Higher resolution for smoother surface
  
  try {
    // Create a parametric geometry
    // This example creates a torus knot as demonstration
    const geometry = new THREE.ParametricBufferGeometry(
      (u, v, target) => {
        // Torus knot parametric equations
        const p = 2; // Number of winds around the axis of rotational symmetry
        const q = 3; // Number of winds around a circle in the interior of the torus
        
        // Convert u, v to appropriate parameter ranges
        const phi = u * 2 * Math.PI;
        const theta = v * 2 * Math.PI;
        
        // Compute the point on the torus knot
        const r = 0.5 * (2 + Math.sin(q * phi));
        const x = r * Math.cos(p * phi);
        const y = r * Math.sin(p * phi);
        const z = Math.cos(q * phi);
        
        target.set(x, y, z);
      }, 
      resolution, 
      resolution
    );
    
    // Create a material
    const material = new THREE.MeshPhongMaterial({
      color: '${parameters.functions[0].color}',
      side: THREE.DoubleSide,
      flatShading: false,
      shininess: 30
    });
    
    // Create the surface mesh and add it to the scene
    const surface = new THREE.Mesh(geometry, material);
    scene.add(surface);
    
    // Add a wireframe to see the mesh structure
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });
    const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(wireframe);
    
  } catch (error) {
    console.error('Error creating parametric surface:', error);
    
    // Create a simple sphere as a fallback
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
  }
}`
};