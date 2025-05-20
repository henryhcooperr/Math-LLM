/**
 * Utilities for formatting standardized responses between the LLM and visualization system
 * according to the output_format_guide.txt specification
 */

/**
 * Creates a standardized response object with the specified visualization parameters,
 * educational content, and follow-up questions.
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.explanation - Clear explanation of the mathematical concept
 * @param {Object} options.visualizationParams - Parameters for creating the visualization
 * @param {Object} options.educationalContent - Educational materials to accompany the visualization
 * @param {Array} options.followUpQuestions - Suggested follow-up questions for further exploration
 * @returns {Object} - Standardized JSON response conforming to the output format guide
 */
export const createStandardResponse = ({
  explanation = "",
  visualizationParams = {},
  educationalContent = {},
  followUpQuestions = []
}) => {
  // Validate required fields
  if (!explanation) {
    console.warn("Explanation is required for standard response");
  }
  
  if (!visualizationParams.type) {
    console.warn("Visualization type is required");
  }
  
  // Create base response object
  const response = {
    explanation,
    visualizationParams,
    educationalContent: {
      title: educationalContent.title || "",
      summary: educationalContent.summary || "",
      steps: educationalContent.steps || [],
      keyInsights: educationalContent.keyInsights || [],
      exercises: educationalContent.exercises || []
    },
    followUpQuestions: followUpQuestions
  };
  
  // Add defaults for visualization params if not provided
  ensureVisualizationDefaults(response.visualizationParams);
  
  return response;
};

/**
 * Ensure visualization parameters have required fields based on type
 * 
 * @param {Object} params - Visualization parameters
 */
const ensureVisualizationDefaults = (params) => {
  if (!params.title) {
    params.title = `${params.type} Visualization`;
  }
  
  // Set defaults based on visualization type
  switch (params.type) {
    case 'function2D':
      if (!params.domain) params.domain = [-10, 10];
      if (!params.range) params.range = [-10, 10];
      if (params.gridLines === undefined) params.gridLines = true;
      break;
      
    case 'functions2D':
      if (!params.domain) params.domain = [-10, 10];
      if (!params.range) params.range = [-10, 10];
      if (params.gridLines === undefined) params.gridLines = true;
      if (!params.functions || !Array.isArray(params.functions)) {
        params.functions = [];
      }
      break;
      
    case 'function3D':
      if (!params.domainX) params.domainX = [-5, 5];
      if (!params.domainY) params.domainY = [-5, 5];
      if (!params.range) params.range = [0, 10];
      if (!params.resolution) params.resolution = 64;
      if (!params.colormap) params.colormap = 'viridis';
      break;
      
    case 'parametric2D':
      if (!params.parameterName) params.parameterName = 't';
      if (!params.parameterRange) params.parameterRange = [0, 2 * Math.PI];
      if (!params.domain) params.domain = [-5, 5];
      if (!params.range) params.range = [-5, 5];
      if (!params.expressions) {
        params.expressions = { x: 'Math.cos(t)', y: 'Math.sin(t)' };
      }
      break;
      
    case 'parametric3D':
      if (!params.parameterType) params.parameterType = 'curve';
      if (!params.parameterNames) {
        params.parameterNames = 
          params.parameterType === 'curve' ? ['t'] : ['u', 'v'];
      }
      if (!params.parameterRanges) {
        params.parameterRanges = 
          params.parameterType === 'curve' 
            ? [[0, 2 * Math.PI]] 
            : [[0, 2 * Math.PI], [0, 2 * Math.PI]];
      }
      if (!params.domainX) params.domainX = [-5, 5];
      if (!params.domainY) params.domainY = [-5, 5];
      if (!params.domainZ) params.domainZ = [-5, 5];
      if (!params.resolution && params.parameterType === 'surface') {
        params.resolution = 48;
      }
      break;
      
    case 'vectorField':
      if (!params.dimensionality) params.dimensionality = '2D';
      if (!params.domain) params.domain = [-3, 3];
      if (!params.range) params.range = [-3, 3];
      if (!params.density) params.density = 15;
      if (params.normalize === undefined) params.normalize = true;
      if (!params.expressions) {
        params.expressions = { x: 'y', y: '-x' };
        if (params.dimensionality === '3D') {
          params.expressions.z = '0';
        }
      }
      break;
      
    case 'geometry':
      if (!params.domain) params.domain = [-5, 5];
      if (!params.range) params.range = [-5, 5];
      if (!params.elements || !Array.isArray(params.elements)) {
        params.elements = [];
      }
      break;
      
    case 'calculus':
      if (!params.subtype) params.subtype = 'integral';
      if (!params.domain) params.domain = [-0.5, 2.5];
      if (!params.range) params.range = [-0.5, 4.5];
      if (!params.function) {
        params.function = { expression: 'x**2', color: '#3090FF' };
      }
      
      if (params.subtype === 'integral') {
        if (!params.integral) {
          params.integral = {
            lowerBound: 0,
            upperBound: 2,
            color: '#FF9030',
            fillOpacity: 0.3
          };
        }
        
        if (params.integral.approximation) {
          const approx = params.integral.approximation;
          if (!approx.method) approx.method = 'rectangles';
          if (!approx.count) approx.count = 10;
          if (approx.show === undefined) approx.show = true;
        }
      }
      break;
      
    case 'probabilityDistribution':
      if (!params.domain) params.domain = [-4, 4];
      if (!params.range) params.range = [0, 0.5];
      if (!params.distribution) {
        params.distribution = {
          name: 'normal',
          parameters: {
            mean: 0,
            standardDeviation: 1
          }
        };
      }
      break;
      
    case 'linearAlgebra':
      if (!params.subtype) params.subtype = 'transformation';
      if (!params.space) params.space = '2D';
      if (!params.domain) params.domain = [-5, 5];
      if (!params.range) params.range = [-5, 5];
      
      if (params.subtype === 'transformation' && !params.matrix) {
        if (params.space === '2D') {
          params.matrix = [[1, 0], [0, 1]]; // Identity matrix by default
        } else if (params.space === '3D') {
          params.matrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        }
      }
      
      if (!params.displayElements) {
        params.displayElements = {
          grid: true,
          unitVectors: true,
          additionalVectors: []
        };
      }
      
      if (!params.animation) {
        params.animation = {
          duration: 1.5,
          enabled: true
        };
      }
      break;
  }
};

/**
 * Validates a standardized response object according to the output format guide
 * 
 * @param {Object} response - The response object to validate
 * @returns {Object} - Validation result with { valid, errors } properties
 */
export const validateResponse = (response) => {
  const errors = [];
  
  // Check for required top-level fields
  if (!response.explanation) {
    errors.push("Missing required field: explanation");
  }
  
  if (!response.visualizationParams) {
    errors.push("Missing required field: visualizationParams");
  } else if (!response.visualizationParams.type) {
    errors.push("Missing required field: visualizationParams.type");
  }
  
  // Check educational content structure if present
  if (response.educationalContent) {
    const edu = response.educationalContent;
    
    if (edu.steps && !Array.isArray(edu.steps)) {
      errors.push("educationalContent.steps must be an array");
    }
    
    if (edu.keyInsights && !Array.isArray(edu.keyInsights)) {
      errors.push("educationalContent.keyInsights must be an array");
    }
    
    if (edu.exercises && !Array.isArray(edu.exercises)) {
      errors.push("educationalContent.exercises must be an array");
    }
  }
  
  // Check follow-up questions
  if (response.followUpQuestions && !Array.isArray(response.followUpQuestions)) {
    errors.push("followUpQuestions must be an array");
  }
  
  // Type-specific validation
  if (response.visualizationParams && response.visualizationParams.type) {
    const specificErrors = validateVisParamsByType(response.visualizationParams);
    errors.push(...specificErrors);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validates visualization parameters based on their type
 * 
 * @param {Object} params - Visualization parameters
 * @returns {Array} - Array of validation errors
 */
const validateVisParamsByType = (params) => {
  const errors = [];
  
  switch (params.type) {
    case 'function2D':
      if (!params.expression) {
        errors.push(`Missing required field for ${params.type}: expression`);
      }
      if (!params.domain || !Array.isArray(params.domain) || params.domain.length !== 2) {
        errors.push(`Invalid or missing domain for ${params.type}`);
      }
      if (!params.range || !Array.isArray(params.range) || params.range.length !== 2) {
        errors.push(`Invalid or missing range for ${params.type}`);
      }
      break;
      
    case 'functions2D':
      if (!params.functions || !Array.isArray(params.functions) || params.functions.length === 0) {
        errors.push(`Missing required field for ${params.type}: functions array`);
      } else {
        params.functions.forEach((func, index) => {
          if (!func.expression) {
            errors.push(`Missing expression for function at index ${index}`);
          }
        });
      }
      break;
      
    case 'function3D':
      if (!params.expression) {
        errors.push(`Missing required field for ${params.type}: expression`);
      }
      break;
      
    case 'parametric2D':
      if (!params.expressions || !params.expressions.x || !params.expressions.y) {
        errors.push(`Missing required x/y expressions for ${params.type}`);
      }
      break;
      
    case 'parametric3D':
      if (!params.expressions || !params.expressions.x || !params.expressions.y || !params.expressions.z) {
        errors.push(`Missing required x/y/z expressions for ${params.type}`);
      }
      break;
      
    case 'vectorField':
      if (!params.expressions) {
        errors.push(`Missing required field for ${params.type}: expressions`);
      } else if (params.dimensionality === '2D' && (!params.expressions.x || !params.expressions.y)) {
        errors.push(`Missing required x/y expressions for 2D ${params.type}`);
      } else if (params.dimensionality === '3D' && 
                (!params.expressions.x || !params.expressions.y || !params.expressions.z)) {
        errors.push(`Missing required x/y/z expressions for 3D ${params.type}`);
      }
      break;
      
    case 'geometry':
      if (!params.elements || !Array.isArray(params.elements)) {
        errors.push(`Missing required field for ${params.type}: elements array`);
      }
      break;
      
    case 'calculus':
      if (!params.function || !params.function.expression) {
        errors.push(`Missing required function expression for ${params.type}`);
      }
      
      if (params.subtype === 'integral' && 
          (!params.integral || params.integral.lowerBound === undefined || 
           params.integral.upperBound === undefined)) {
        errors.push(`Missing required integral bounds for ${params.type}`);
      }
      break;
      
    case 'probabilityDistribution':
      if (!params.distribution || !params.distribution.name) {
        errors.push(`Missing required distribution name for ${params.type}`);
      }
      break;
      
    case 'linearAlgebra':
      if (params.subtype === 'transformation' && (!params.matrix || !Array.isArray(params.matrix))) {
        errors.push(`Missing required transformation matrix for ${params.type}`);
      }
      break;
  }
  
  return errors;
};

/**
 * Parses a raw JSON string into a validated standard response
 * 
 * @param {string} jsonString - JSON string to parse
 * @returns {Object} - Parsed and validated response, or null if invalid
 */
export const parseResponseFromJson = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    const validation = validateResponse(parsed);
    
    if (!validation.valid) {
      console.error("Validation errors:", validation.errors);
      // Still return the parsed object, but with defaults applied
      const fixed = createStandardResponse({
        explanation: parsed.explanation || "",
        visualizationParams: parsed.visualizationParams || {},
        educationalContent: parsed.educationalContent || {},
        followUpQuestions: parsed.followUpQuestions || []
      });
      
      return fixed;
    }
    
    return parsed;
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    return null;
  }
};

export default {
  createStandardResponse,
  validateResponse,
  parseResponseFromJson
};