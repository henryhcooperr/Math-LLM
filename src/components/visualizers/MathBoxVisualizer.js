import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * MathBox Visualizer Component
 * 
 * Note: MathBox is a specialized library for mathematical visualizations.
 * This is a simplified implementation that uses Three.js instead since
 * properly integrating MathBox would require its full dependency chain.
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Type of visualization
 * @param {string} [props.expression] - Mathematical expression
 * @param {number[]} [props.domain=[-10, 10]] - X-axis domain
 * @param {number[]} [props.range=[-10, 10]] - Y-axis range
 * @param {number[]} [props.zRange=[-10, 10]] - Z-axis range
 * @param {string|number} [props.width='100%'] - Container width
 * @param {string|number} [props.height=400] - Container height
 * @returns {React.ReactElement} - MathBox visualization component
 */
export const MathBoxVisualizer = ({
  type,
  expression,
  domain = [-10, 10],
  range = [-10, 10],
  zRange = [-10, 10],
  width = '100%',
  height = 400,
  ...rest
}) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const frameIdRef = useRef(null);
  
  // Initialize Three.js scene (as a simplified MathBox)
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clean up previous scene
    if (rendererRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      containerRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }
    
    // Get container dimensions
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = typeof height === 'string' 
      ? parseInt(height, 10) 
      : height;
    
    // Create a new scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75, // FOV
      containerWidth / containerHeight, // Aspect ratio
      0.1, // Near plane
      1000 // Far plane
    );
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add axes
    createAxes(scene, domain, range, zRange);
    
    // Create visualization based on type
    createVisualization(scene, type, expression, domain, range, zRange, rest);
    
    // Add OrbitControls (simulated)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationSensitivity = 0.01;
    
    const onMouseDown = (event) => {
      isDragging = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };
    
    const onMouseMove = (event) => {
      if (!isDragging) return;
      
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };
      
      // Rotate the camera based on mouse movement
      const rotationQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(
          deltaMove.y * rotationSensitivity,
          deltaMove.x * rotationSensitivity,
          0,
          'XYZ'
        ));
      
      camera.position.applyQuaternion(rotationQuaternion);
      camera.lookAt(scene.position);
      
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };
    
    const onMouseUp = () => {
      isDragging = false;
    };
    
    const onWheel = (event) => {
      event.preventDefault();
      
      // Zoom in/out based on wheel
      const zoomSensitivity = 0.1;
      const delta = -Math.sign(event.deltaY) * zoomSensitivity;
      
      const direction = new THREE.Vector3()
        .subVectors(camera.position, scene.position)
        .normalize()
        .multiplyScalar(delta * 5);
      
      camera.position.add(direction);
    };
    
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);
    
    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = typeof height === 'string' 
        ? parseInt(height, 10) 
        : height;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up on unmount
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current) {
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('wheel', onWheel);
        
        if (containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
      
      // Clean up scene
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
    };
  }, [type, expression, domain, range, zRange, height, rest]);
  
  return (
    <div
      ref={containerRef}
      style={{
        width: width,
        height: height,
        overflow: 'hidden'
      }}
      data-testid="mathbox-container"
    />
  );
};

/**
 * Create axes for the visualization
 */
function createAxes(scene, domain, range, zRange) {
  // Calculate grid size based on domain and range
  const gridSizeX = Math.max(Math.abs(domain[0]), Math.abs(domain[1]));
  const gridSizeY = Math.max(Math.abs(zRange[0]), Math.abs(zRange[1]));
  const gridSizeZ = Math.max(Math.abs(range[0]), Math.abs(range[1]));
  const gridSize = Math.max(gridSizeX, gridSizeY, gridSizeZ, 10);
  
  // Create axes
  const axesHelper = new THREE.AxesHelper(gridSize);
  scene.add(axesHelper);
  
  // Create grid helper for XZ plane
  const gridHelper = new THREE.GridHelper(gridSize * 2, 20);
  scene.add(gridHelper);
  
  // Create coordinate labels
  const labels = [];
  const step = gridSize / 5;
  
  // Create tick marks and labels for X-axis
  for (let i = -gridSize; i <= gridSize; i += step) {
    if (i === 0) continue; // Skip origin
    
    // Add tick mark
    const tickGeometry = new THREE.BufferGeometry();
    const tickVertices = new Float32Array([
      i, 0, 0,
      i, -0.2, 0
    ]);
    tickGeometry.setAttribute('position', new THREE.BufferAttribute(tickVertices, 3));
    const tickMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const tick = new THREE.Line(tickGeometry, tickMaterial);
    scene.add(tick);
    
    // Would add text label here with TextGeometry or CSS2DRenderer in a full implementation
  }
  
  // Create tick marks for Y-axis
  for (let i = -gridSize; i <= gridSize; i += step) {
    if (i === 0) continue; // Skip origin
    
    const tickGeometry = new THREE.BufferGeometry();
    const tickVertices = new Float32Array([
      0, i, 0,
      -0.2, i, 0
    ]);
    tickGeometry.setAttribute('position', new THREE.BufferAttribute(tickVertices, 3));
    const tickMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const tick = new THREE.Line(tickGeometry, tickMaterial);
    scene.add(tick);
  }
  
  // Create tick marks for Z-axis
  for (let i = -gridSize; i <= gridSize; i += step) {
    if (i === 0) continue; // Skip origin
    
    const tickGeometry = new THREE.BufferGeometry();
    const tickVertices = new Float32Array([
      0, 0, i,
      0, -0.2, i
    ]);
    tickGeometry.setAttribute('position', new THREE.BufferAttribute(tickVertices, 3));
    const tickMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const tick = new THREE.Line(tickGeometry, tickMaterial);
    scene.add(tick);
  }
}

/**
 * Create visualization based on type
 */
function createVisualization(scene, type, expression, domain, range, zRange, options) {
  try {
    switch (type) {
      case 'function3D':
        createFunction3D(scene, expression, domain, range, zRange, options);
        break;
      
      case 'parametric3D':
        createParametric3D(scene, expression, domain, range, zRange, options);
        break;
      
      case 'vectorField3D':
        createVectorField3D(scene, expression, domain, range, zRange, options);
        break;
      
      default:
        // Create a simple plane as placeholder
        const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
        const planeMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x3090FF, 
          wireframe: true,
          side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        scene.add(plane);
    }
  } catch (e) {
    console.error('Error creating visualization:', e);
    
    // Add error message mesh
    const errorGeometry = new THREE.PlaneGeometry(5, 1);
    const errorMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff0000,
      side: THREE.DoubleSide
    });
    const errorMesh = new THREE.Mesh(errorGeometry, errorMaterial);
    errorMesh.position.set(0, 5, 0);
    errorMesh.lookAt(0, 10, 10); // Face towards camera position
    scene.add(errorMesh);
  }
}

/**
 * Create a 3D function visualization z = f(x, y)
 */
function createFunction3D(scene, expression, domain, range, zRange, options) {
  // Create function from expression
  const fn = createFunctionFromExpression(expression || 'Math.sin(x) * Math.cos(y)');
  
  // Grid resolution
  const resolution = options.resolution || 50;
  
  // Create a surface geometry
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];
  const normals = [];
  const colors = [];
  
  // Generate vertices
  const xStep = (domain[1] - domain[0]) / resolution;
  const zStep = (range[1] - range[0]) / resolution;
  
  // Generate vertices and colors
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const x = domain[0] + i * xStep;
      const z = range[0] + j * zStep;
      
      // Calculate y = f(x, z)
      let y;
      try {
        y = fn(x, z);
        // Clamp to zRange
        y = Math.max(zRange[0], Math.min(zRange[1], y));
      } catch (e) {
        y = 0; // Default value on error
      }
      
      // Add vertex
      vertices.push(x, y, z);
      
      // Generate color based on height
      const normalizedHeight = (y - zRange[0]) / (zRange[1] - zRange[0]);
      const hue = (1 - normalizedHeight) * 240; // Blue to Red gradient
      const color = new THREE.Color(`hsl(${hue}, 100%, 50%)`);
      colors.push(color.r, color.g, color.b);
    }
  }
  
  // Generate indices for triangles
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const a = i * (resolution + 1) + j;
      const b = i * (resolution + 1) + j + 1;
      const c = (i + 1) * (resolution + 1) + j;
      const d = (i + 1) * (resolution + 1) + j + 1;
      
      // Two triangles per grid cell
      indices.push(a, c, b);
      indices.push(c, d, b);
    }
  }
  
  // Calculate normals (simplified)
  for (let i = 0; i < vertices.length / 3; i++) {
    normals.push(0, 1, 0);
  }
  
  // Set geometry attributes
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
  // Compute vertex normals
  geometry.computeVertexNormals();
  
  // Create material
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    vertexColors: true,
    shininess: 30,
    wireframe: options.wireframe || false
  });
  
  // Create mesh
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

/**
 * Create a parametric 3D visualization
 */
function createParametric3D(scene, expression, domain, range, zRange, options) {
  // Parametric curves require separate functions for x, y, z
  const expressions = options.expressions || {
    x: 'u * Math.cos(v)',
    y: 'u * Math.sin(v)',
    z: 'v'
  };
  
  const xFn = createFunctionFromExpression(expressions.x);
  const yFn = createFunctionFromExpression(expressions.y);
  const zFn = createFunctionFromExpression(expressions.z);
  
  // Parameter ranges
  const uRange = options.uRange || [0, 1];
  const vRange = options.vRange || [0, 2 * Math.PI];
  
  // Grid resolution
  const uResolution = options.uResolution || 30;
  const vResolution = options.vResolution || 30;
  
  // Create geometry
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];
  const normals = [];
  const colors = [];
  
  // Generate vertices
  const uStep = (uRange[1] - uRange[0]) / uResolution;
  const vStep = (vRange[1] - vRange[0]) / vResolution;
  
  for (let i = 0; i <= uResolution; i++) {
    for (let j = 0; j <= vResolution; j++) {
      const u = uRange[0] + i * uStep;
      const v = vRange[0] + j * vStep;
      
      // Calculate position
      let x, y, z;
      try {
        x = xFn(u, v);
        y = yFn(u, v);
        z = zFn(u, v);
      } catch (e) {
        x = y = z = 0; // Default values on error
      }
      
      // Add vertex
      vertices.push(x, y, z);
      
      // Generate color based on parameter u
      const normalizedU = (u - uRange[0]) / (uRange[1] - uRange[0]);
      const hue = normalizedU * 360;
      const color = new THREE.Color(`hsl(${hue}, 100%, 50%)`);
      colors.push(color.r, color.g, color.b);
    }
  }
  
  // Generate indices for triangles
  for (let i = 0; i < uResolution; i++) {
    for (let j = 0; j < vResolution; j++) {
      const a = i * (vResolution + 1) + j;
      const b = i * (vResolution + 1) + j + 1;
      const c = (i + 1) * (vResolution + 1) + j;
      const d = (i + 1) * (vResolution + 1) + j + 1;
      
      // Two triangles per grid cell
      indices.push(a, c, b);
      indices.push(c, d, b);
    }
  }
  
  // Set geometry attributes
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
  // Compute vertex normals
  geometry.computeVertexNormals();
  
  // Create material
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    vertexColors: true,
    shininess: 30,
    wireframe: options.wireframe || false
  });
  
  // Create mesh
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

/**
 * Create a 3D vector field visualization
 */
function createVectorField3D(scene, expression, domain, range, zRange, options) {
  // Vector field expressions
  const expressions = options.expressions || {
    x: 'y',
    y: '-x',
    z: '0'
  };
  
  const xFn = createFunctionFromExpression(expressions.x);
  const yFn = createFunctionFromExpression(expressions.y);
  const zFn = createFunctionFromExpression(expressions.z);
  
  // Grid resolution
  const resolution = options.resolution || 5;
  const vectorScale = options.vectorScale || 0.5;
  
  // Create a group for all arrows
  const vectorField = new THREE.Group();
  
  // Generate vectors
  const xStep = (domain[1] - domain[0]) / resolution;
  const yStep = (zRange[1] - zRange[0]) / resolution;
  const zStep = (range[1] - range[0]) / resolution;
  
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      for (let k = 0; k <= resolution; k++) {
        const x = domain[0] + i * xStep;
        const y = zRange[0] + j * yStep;
        const z = range[0] + k * zStep;
        
        // Calculate vector components
        let vx, vy, vz;
        try {
          vx = xFn(x, y, z);
          vy = yFn(x, y, z);
          vz = zFn(x, y, z);
        } catch (e) {
          vx = vy = vz = 0; // Default values on error
        }
        
        // Calculate magnitude
        const magnitude = Math.sqrt(vx * vx + vy * vy + vz * vz);
        
        // Skip very small vectors
        if (magnitude < 0.01) continue;
        
        // Normalize and scale
        const normalizedVx = (vx / magnitude) * vectorScale;
        const normalizedVy = (vy / magnitude) * vectorScale;
        const normalizedVz = (vz / magnitude) * vectorScale;
        
        // Create arrow
        const direction = new THREE.Vector3(normalizedVx, normalizedVy, normalizedVz);
        const origin = new THREE.Vector3(x, y, z);
        
        // Choose color based on magnitude
        const hue = (1 - Math.min(magnitude, 5) / 5) * 240; // Blue to Red
        const arrowColor = new THREE.Color(`hsl(${hue}, 100%, 50%)`);
        
        const arrowHelper = new THREE.ArrowHelper(
          direction.normalize(),
          origin,
          vectorScale,
          arrowColor,
          vectorScale * 0.2,
          vectorScale * 0.1
        );
        
        vectorField.add(arrowHelper);
      }
    }
  }
  
  scene.add(vectorField);
}

/**
 * Create a JavaScript function from a string expression
 */
function createFunctionFromExpression(expression, var1 = 'x', var2 = 'y') {
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
    return new Function(var1, var2, `return ${processedExpression};`);
  } catch (e) {
    console.error('Error creating function from expression:', e);
    return () => 0;
  }
}

export default MathBoxVisualizer;