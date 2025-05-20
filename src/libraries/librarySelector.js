/**
 * Library Selector
 * Logic for selecting the optimal visualization library based on the
 * requirements extracted from the math problem analysis.
 */

/**
 * Decision tree for selecting the best library based on the Library Selection
 * Decision Tree from the library_integration_guide
 * @param {Object} analysis - The complete analysis from the math analyzer
 * @returns {string} - The selected library name 
 */
export function selectLibrary(analysis) {
  const { concept, visualization } = analysis;
  
  // If a library is explicitly recommended in the analysis, use it
  if (visualization && visualization.recommendedLibrary) {
    return visualization.recommendedLibrary;
  }
  
  // Otherwise, use the decision tree to select the library
  return libraryDecisionTree(concept, visualization);
}

/**
 * Implements the library selection decision tree from the integration guide
 * @param {Object} concept - The concept from the analysis
 * @param {Object} visualization - The visualization from the analysis
 * @returns {string} - The selected library name
 */
function libraryDecisionTree(concept, visualization) {
  // Determine if this is for a React application
  // This would come from user preferences or application context
  const isReactApplication = true; // Assume React by default for this implementation
  
  // Extract key decision factors
  const type = concept.type || 'function2D';
  const subtype = concept.subtype || 'general';
  const dimensionality = visualization ? visualization.dimensionality : determineDimensionality(type);
  const complexity = visualization ? visualization.complexity : 'intermediate';
  
  // Implementation of the decision tree from the library integration guide
  
  // First branch: Is it for a React application?
  if (isReactApplication) {
    // Is it a 2D function or coordinate system?
    if (dimensionality === '2D' && (type === 'function2D' || type === 'geometry')) {
      return 'mafs';
    }
    
    // Is it an interactive educational video?
    if (visualization && visualization.specialFeatures && 
        visualization.specialFeatures.some(f => f.type === 'video' || f.type === 'animation')) {
      return 'liqvid';
    }
    
    // For other React applications, continue to the general decision tree
  }
  
  // Second branch: What is the primary visualization type?
  
  // 2D Function plotting
  if (type === 'function2D') {
    // Is it for education/classroom use?
    if (analysis.educational && analysis.educational.level === 'secondary') {
      return 'desmos';
    }
    
    // Does it require geometric constructions?
    if (subtype === 'construction' || subtype === 'geometry') {
      return 'jsxgraph';
    }
    
    // Is it data-driven or needs customization?
    if (complexity === 'advanced' || 
        (visualization && visualization.specialFeatures && 
         visualization.specialFeatures.some(f => f.type === 'customization'))) {
      return 'd3';
    }
    
    // Default for 2D functions
    return 'jsxgraph';
  }
  
  // 3D Visualization
  if (dimensionality === '3D' || type === 'function3D') {
    // Is it specifically for mathematical concepts?
    if (type === 'function3D' || subtype === 'mathematical') {
      // Needs presentation quality?
      if (complexity === 'advanced' || 
          (visualization && visualization.specialFeatures && 
           visualization.specialFeatures.some(f => f.type === 'presentation'))) {
        return 'mathbox'; // PREFERRED as per guide
      }
      return 'grafar';
    }
    
    // General 3D visualization
    return 'three';
  }
  
  // Geometry
  if (type === 'geometry') {
    // Is it specifically Euclidean geometry?
    if (subtype === 'euclidean') {
      return 'euclidjs';
    }
    
    // Needs advanced interactive features?
    if (visualization && visualization.interactiveElements && 
        visualization.interactiveElements.length > 0) {
      return 'cindyjs';
    }
    
    // Default for geometry
    return 'jsxgraph';
  }
  
  // Educational Experience
  if (type === 'educational') {
    // Creating a complete course?
    if (subtype === 'course') {
      return 'mathigon';
    }
    
    // Interactive notebooks/explorations?
    if (subtype === 'exploration' || subtype === 'notebook') {
      return 'observable';
    }
  }
  
  // Creative/Artistic Visualization
  if (type === 'creative') {
    // Animation focused?
    if (visualization && visualization.specialFeatures && 
        visualization.specialFeatures.some(f => f.type === 'animation')) {
      return 'p5';
    }
    
    return 'pts';
  }
  
  // Statistical/Data Analysis
  if (type === 'statistics' || type === 'probability' || type === 'data') {
    // Using R?
    const usingR = false; // Would come from user preferences
    if (usingR) {
      return 'shiny';
    }
    
    return 'd3';
  }
  
  // Default library selection if no specific match is found
  // Based on decision tree defaults, we'll use JSXGraph as a versatile fallback
  return 'jsxgraph';
}

/**
 * Helper function to determine dimensionality based on concept type
 * @param {string} type - The concept type
 * @returns {string} - '2D' or '3D'
 */
function determineDimensionality(type) {
  if (type === 'function3D' || type.includes('3D')) {
    return '3D';
  }
  return '2D';
}