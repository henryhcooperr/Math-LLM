import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Three.js Visualizer Component
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Type of visualization
 * @param {string} [props.expression] - Mathematical expression
 * @param {number[]} [props.domain=[-10, 10]] - X-axis domain
 * @param {number[]} [props.range=[-10, 10]] - Y-axis range
 * @param {number[]} [props.zRange=[-10, 10]] - Z-axis range
 * @param {string|number} [props.width='100%'] - Container width
 * @param {string|number} [props.height=400] - Container height
 * @returns {React.ReactElement} - Three.js visualization component
 */
export const ThreeJSVisualizer = ({
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
  const controlsRef = useRef(null);
  const frameIdRef = useRef(null);
  const meshRef = useRef(null);
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clean up previous scene
    if (rendererRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      containerRef.current.removeChild(rendererRef.current.domElement);
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        disposeScene(sceneRef.current);
      }
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
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add grid and axes
    addGridAndAxes(scene, domain, range, zRange);
    
    // Create visualization based on type
    createVisualization(scene, type, expression, domain, range, zRange, rest);
    
    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      controls.update();
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
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (rendererRef.current) {
        if (containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
      
      if (sceneRef.current) {
        disposeScene(sceneRef.current);
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
      data-testid="threejs-container"
    />
  );
};

/**
 * Dispose all objects from scene
 */
function disposeScene(scene) {
  scene.traverse((object) => {
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

/**
 * Add grid and axes to scene
 */
function addGridAndAxes(scene, domain, range, zRange) {
  // Calculate grid size based on domain and range
  const gridSizeX = Math.max(Math.abs(domain[0]), Math.abs(domain[1]));
  const gridSizeZ = Math.max(Math.abs(range[0]), Math.abs(range[1]));
  const gridSize = Math.max(gridSizeX, gridSizeZ, 10);
  
  // Add grid helper
  const gridHelper = new THREE.GridHelper(gridSize * 2, gridSize * 2);
  scene.add(gridHelper);
  
  // Create axes
  const axesHelper = new THREE.AxesHelper(gridSize);
  scene.add(axesHelper);
  
  // Create axis labels
  const axisLabels = ['X', 'Y', 'Z'];
  const positions = [
    [gridSize + 1, 0, 0],
    [0, gridSize + 1, 0],
    [0, 0, gridSize + 1]
  ];
  
  // We would need to use TextGeometry or HTML labels for proper text,
  // but for simplicity, we'll use line-based labels:
  const colors = [0xff0000, 0x00ff00, 0x0000ff];
  
  for (let i = 0; i < 3; i++) {
    const points = [];
    points.push(new THREE.Vector3(positions[i][0] * 0.9, positions[i][1] * 0.9, positions[i][2] * 0.9));
    points.push(new THREE.Vector3(positions[i][0], positions[i][1], positions[i][2]));
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: colors[i] });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
  }
}

/**
 * Create visualization based on type
 */
function createVisualization(scene, type, expression, domain, range, zRange, options) {
  switch (type) {
    case 'function3D':
    case 'surface':
      createSurface(scene, expression, domain, range, zRange, options);
      break;
    case 'parametric3D':
      createParametricSurface(scene, expression, domain, range, zRange, options);
      break;
    case 'vectorField3D':
      createVectorField(scene, expression, domain, range, zRange, options);
      break;
    case 'scatter3D':
      createScatterPlot3D(scene, options.data || [], domain, range, zRange);
      break;
    default:
      // Create a default cube
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshLambertMaterial({ color: 0x3090FF });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      break;
  }
}

/**
 * Create a 3D surface from a function
 */
function createSurface(scene, expression, domain, range, zRange, options) {
  try {
    // Parse the expression string
    const fn = createFunctionFromExpression(expression);
    
    // Create a plane geometry and modify it
    // Since ParametricGeometry isn't available in the current Three.js version
    const segments = 50;
    const geometry = new THREE.PlaneGeometry(
      domain[1] - domain[0],
      range[1] - range[0],
      segments,
      segments
    );
    
    // Update vertices positions
    const position = geometry.attributes.position;
    const vertex = new THREE.Vector3();
    
    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);
      
      // Convert from plane coordinates to domain/range coordinates
      const x = domain[0] + ((vertex.x + (domain[1] - domain[0])/2) / (domain[1] - domain[0])) * (domain[1] - domain[0]);
      const z = range[0] + ((vertex.y + (range[1] - range[0])/2) / (range[1] - range[0])) * (range[1] - range[0]);
      
      // Calculate height (y value) from function
      let y;
      try {
        y = fn(x, z);
        // Clamp to zRange
        y = Math.max(zRange[0], Math.min(zRange[1], y));
      } catch (e) {
        y = 0;
      }
      
      // Update position
      position.setXYZ(i, x, y, z);
    }
    
    // Recompute normals
    geometry.computeVertexNormals();
    
    // Create material
    const material = new THREE.MeshPhongMaterial({
      color: options.color || 0x3090FF,
      side: THREE.DoubleSide,
      flatShading: false,
      shininess: 50,
      wireframe: options.wireframe || false
    });
    
    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    return mesh;
  } catch (e) {
    console.error('Error creating surface:', e);
    return null;
  }
}

/**
 * Create a parametric surface
 */
function createParametricSurface(scene, expression, domain, range, zRange, options) {
  try {
    // Parametric surfaces require different expressions for x, y, z
    // We expect expressions to be an object with x, y, z functions
    if (!options.expressions || !options.expressions.x || !options.expressions.y || !options.expressions.z) {
      throw new Error('Parametric surface requires x, y, z expressions');
    }
    
    const xFn = createFunctionFromExpression(options.expressions.x, 'u', 'v');
    const yFn = createFunctionFromExpression(options.expressions.y, 'u', 'v');
    const zFn = createFunctionFromExpression(options.expressions.z, 'u', 'v');
    
    // Parameter ranges
    const uRange = options.uRange || [0, 1];
    const vRange = options.vRange || [0, 1];
    
    // Create a plane geometry and modify it
    // Since ParametricGeometry isn't available in the current Three.js version
    const segments = 50;
    const geometry = new THREE.PlaneGeometry(
      1, 
      1,
      segments,
      segments
    );
    
    // Update vertices positions
    const position = geometry.attributes.position;
    const vertex = new THREE.Vector3();
    
    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);
      
      // Convert from plane coordinates to parameter range coordinates
      const u = uRange[0] + (vertex.x + 0.5) * (uRange[1] - uRange[0]);
      const v = vRange[0] + (vertex.y + 0.5) * (vRange[1] - vRange[0]);
      
      // Calculate x, y, z values from parametric functions
      let x, y, z;
      try {
        x = xFn(u, v);
        y = yFn(u, v);
        z = zFn(u, v);
      } catch (e) {
        x = y = z = 0;
      }
      
      // Update position
      position.setXYZ(i, x, y, z);
    }
    
    // Recompute normals
    geometry.computeVertexNormals();
    
    // Create material
    const material = new THREE.MeshPhongMaterial({
      color: options.color || 0x3090FF,
      side: THREE.DoubleSide,
      flatShading: false,
      shininess: 50,
      wireframe: options.wireframe || false
    });
    
    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    return mesh;
  } catch (e) {
    console.error('Error creating parametric surface:', e);
    return null;
  }
}

/**
 * Create a 3D vector field
 */
function createVectorField(scene, expression, domain, range, zRange, options) {
  try {
    // Vector field requires expressions for vector components
    if (!options.expressions || !options.expressions.x || !options.expressions.y || !options.expressions.z) {
      throw new Error('Vector field requires x, y, z component expressions');
    }
    
    const xFn = createFunctionFromExpression(options.expressions.x, 'x', 'y', 'z');
    const yFn = createFunctionFromExpression(options.expressions.y, 'x', 'y', 'z');
    const zFn = createFunctionFromExpression(options.expressions.z, 'x', 'y', 'z');
    
    // Create a grid of vectors
    const resolution = options.resolution || 5;
    const scale = options.vectorScale || 1;
    
    const xStep = (domain[1] - domain[0]) / resolution;
    const yStep = (zRange[1] - zRange[0]) / resolution;
    const zStep = (range[1] - range[0]) / resolution;
    
    const arrows = new THREE.Group();
    
    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        for (let k = 0; k <= resolution; k++) {
          const x = domain[0] + i * xStep;
          const y = zRange[0] + j * yStep;
          const z = range[0] + k * zStep;
          
          // Calculate vector components
          const vx = xFn(x, y, z);
          const vy = yFn(x, y, z);
          const vz = zFn(x, y, z);
          
          // Calculate vector magnitude
          const magnitude = Math.sqrt(vx * vx + vy * vy + vz * vz);
          
          // Skip very small vectors
          if (magnitude < 0.01) continue;
          
          // Normalize and scale vector
          const normVx = (vx / magnitude) * scale;
          const normVy = (vy / magnitude) * scale;
          const normVz = (vz / magnitude) * scale;
          
          // Create arrow helper
          const arrow = new THREE.ArrowHelper(
            new THREE.Vector3(normVx, normVy, normVz).normalize(),
            new THREE.Vector3(x, y, z),
            scale,
            getColorFromMagnitude(magnitude)
          );
          
          arrows.add(arrow);
        }
      }
    }
    
    scene.add(arrows);
    return arrows;
  } catch (e) {
    console.error('Error creating vector field:', e);
    return null;
  }
}

/**
 * Create a 3D scatter plot
 */
function createScatterPlot3D(scene, data, domain, range, zRange) {
  // Create a group for all points
  const pointsGroup = new THREE.Group();
  
  // Create points
  for (const point of data) {
    const geometry = new THREE.SphereGeometry(point.size || 0.2, 16, 16);
    const material = new THREE.MeshLambertMaterial({ color: new THREE.Color(point.color || 0x3090FF) });
    const sphere = new THREE.Mesh(geometry, material);
    
    sphere.position.set(point.x, point.y, point.z);
    pointsGroup.add(sphere);
    
    // Add label if provided
    if (point.label) {
      // We would need to use TextGeometry or HTML labels for proper text
      // For simplicity, we'll use a different colored sphere to represent labels
      const labelGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const labelMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const labelSphere = new THREE.Mesh(labelGeometry, labelMaterial);
      
      labelSphere.position.set(point.x + 0.3, point.y + 0.3, point.z + 0.3);
      pointsGroup.add(labelSphere);
    }
  }
  
  scene.add(pointsGroup);
  return pointsGroup;
}

/**
 * Create a JavaScript function from a string expression
 */
function createFunctionFromExpression(expression, ...variables) {
  try {
    // Handle multiple variables
    const varNames = variables.length > 0 ? variables : ['x'];
    
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
    return new Function(...varNames, `return ${processedExpression};`);
  } catch (e) {
    console.error('Error creating function from expression:', e);
    return () => 0;
  }
}

/**
 * Get a color based on magnitude
 */
function getColorFromMagnitude(magnitude) {
  // Use a simple gradient from blue to red
  const hue = Math.max(0, Math.min(240 - magnitude * 60, 240));
  return new THREE.Color(`hsl(${hue}, 100%, 50%)`);
}

export default ThreeJSVisualizer;