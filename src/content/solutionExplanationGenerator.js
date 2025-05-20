/**
 * Solution Explanation Generator
 * Creates step-by-step explanations for various mathematical concepts and operations.
 * Specializes in generating educational guides tailored to each type of problem.
 */

import wolframAlphaService from '../services/wolframAlphaService';

/**
 * Generate a detailed step-by-step explanation for a mathematical problem
 * @param {Object} problem - The processed mathematical problem
 * @param {Object} analysis - The analysis result from mathAnalyzer
 * @param {Object} calculusResult - Optional result from calculus operations
 * @returns {Object} - Structured step-by-step explanation
 */
export async function generateSolutionExplanation(problem, analysis, calculusResult = null) {
  // Determine the type of problem to generate an appropriate explanation
  const type = analysis.concept.type;
  const subtype = analysis.concept.subtype;
  const expression = analysis.concept.expression;
  
  // Generate explanation based on problem type
  switch (type) {
    case 'function2D':
      return generateFunction2DExplanation(problem, analysis);
    case 'function3D':
      return generateFunction3DExplanation(problem, analysis);
    case 'geometry':
      return generateGeometryExplanation(problem, analysis);
    case 'calculus':
      return generateCalculusExplanation(problem, analysis, calculusResult);
    case 'linearAlgebra':
      return generateLinearAlgebraExplanation(problem, analysis);
    case 'probability':
      return generateProbabilityExplanation(problem, analysis);
    case 'statistics':
      return generateStatisticsExplanation(problem, analysis);
    default:
      return generateGeneralExplanation(problem, analysis);
  }
}

/**
 * Generate explanation for 2D functions
 * @param {Object} problem - The processed mathematical problem
 * @param {Object} analysis - The analysis result from mathAnalyzer
 * @returns {Object} - Step-by-step explanation
 */
function generateFunction2DExplanation(problem, analysis) {
  const expression = analysis.concept.expression;
  const domain = analysis.parameters.domain;
  const range = analysis.parameters.range;
  
  // Determine key features based on the function type
  const subtype = analysis.concept.subtype;
  let keyFeatures = [];
  let steps = [];
  
  steps.push({
    title: 'Understanding the Function',
    content: `We're visualizing the function f(x) = ${expression}. This is a ${subtype} function.`,
    emphasis: `f(x) = ${expression}`
  });
  
  // Add domain and range step
  steps.push({
    title: 'Domain and Range',
    content: `The domain (valid input values) is x ∈ [${domain[0]}, ${domain[1]}]. Based on the function behavior, the range (output values) is approximately y ∈ [${range[0]}, ${range[1]}].`,
    emphasis: `Domain: [${domain[0]}, ${domain[1]}], Range: [${range[0]}, ${range[1]}]`
  });
  
  // Step for specific function type analysis
  if (subtype === 'polynomial') {
    // Try to determine the degree of the polynomial
    const degree = determinePolynomialDegree(expression);
    steps.push({
      title: 'Polynomial Analysis',
      content: `This is a degree ${degree} polynomial. ${degree % 2 === 0 ? 'Even-degree polynomials have the same end behavior in both directions.' : 'Odd-degree polynomials have opposite end behaviors.'}`,
      emphasis: `Degree: ${degree}`
    });
    
    // Find zeroes (simplified approach)
    steps.push({
      title: 'Finding Zeroes',
      content: `To find where f(x) = 0, we would solve the equation ${expression} = 0.`,
      emphasis: `${expression} = 0`
    });
  } 
  else if (subtype === 'trigonometric') {
    steps.push({
      title: 'Trigonometric Analysis',
      content: `This trigonometric function has periodic behavior. We should look for key features like amplitude, period, phase shift, and vertical shift.`,
      emphasis: 'Amplitude, Period, Phase Shift, Vertical Shift'
    });
  }
  else if (subtype === 'exponential') {
    steps.push({
      title: 'Exponential Analysis',
      content: `Exponential functions grow quickly. This function will never cross the x-axis if it's a pure exponential function without any shift.`,
      emphasis: 'Rapid Growth/Decay'
    });
  }
  else if (subtype === 'logarithmic') {
    steps.push({
      title: 'Logarithmic Analysis',
      content: `Logarithmic functions grow slowly. The function is undefined for negative inputs with natural logarithms.`,
      emphasis: 'Domain Restriction: x > 0 for natural logarithms'
    });
  }
  
  // Step for analyzing the visualization
  steps.push({
    title: 'Visual Analysis',
    content: `Looking at the graph, we can identify key features such as intercepts, extrema (maximum and minimum points), and the overall shape.`,
    emphasis: 'Intercepts, Extrema, Inflection Points'
  });
  
  // Provide some practice questions
  const questions = generatePracticeQuestions(type, subtype, expression);
  
  return {
    title: `Step-by-Step Analysis of f(x) = ${expression}`,
    summary: `This guide walks through the analysis of the function f(x) = ${expression}, exploring its key features and behavior.`,
    steps,
    questions,
    references: [
      'Functions and Their Graphs - Khan Academy',
      'Visual Calculus - MIT OpenCourseWare',
      'Desmos Graphing Calculator'
    ]
  };
}

/**
 * Generate explanation for 3D functions
 * @param {Object} problem - The processed mathematical problem
 * @param {Object} analysis - The analysis result from mathAnalyzer
 * @returns {Object} - Step-by-step explanation
 */
function generateFunction3DExplanation(problem, analysis) {
  const expression = analysis.concept.expression;
  const domain = analysis.parameters.domain;
  const range = analysis.parameters.range;
  const zRange = analysis.visualization.viewport.z;
  
  // Determine key features based on the function type
  const subtype = analysis.concept.subtype;
  let steps = [];
  
  steps.push({
    title: 'Understanding the 3D Function',
    content: `We're visualizing the function f(x,y) = ${expression}. This creates a surface in 3D space.`,
    emphasis: `f(x,y) = ${expression}`
  });
  
  // Add domain and range step
  steps.push({
    title: 'Domain and Range',
    content: `The domain is x ∈ [${domain[0]}, ${domain[1]}] and y ∈ [${range[0]}, ${range[1]}]. The range of the function (z-values) is approximately z ∈ [${zRange[0]}, ${zRange[1]}].`,
    emphasis: `Domain: x ∈ [${domain[0]}, ${domain[1]}], y ∈ [${range[0]}, ${range[1]}]; Range: z ∈ [${zRange[0]}, ${zRange[1]}]`
  });
  
  // Step for specific 3D function type analysis
  if (subtype === 'surface') {
    steps.push({
      title: 'Surface Analysis',
      content: `This function creates a 3D surface. Key features to look for include peaks, valleys, saddle points, and flatness.`,
      emphasis: 'Peaks, Valleys, Saddle Points'
    });
  } 
  else if (subtype === 'parametric') {
    steps.push({
      title: 'Parametric Surface Analysis',
      content: `This is a parametric surface, meaning it's generated by parameters that vary independently. The shape is determined by how these parameters map to 3D coordinates.`,
      emphasis: 'Parameter Mapping, Coordinate Transformation'
    });
  }
  else if (subtype === 'vectorField') {
    steps.push({
      title: 'Vector Field Analysis',
      content: `This visualization represents a vector field in 3D space. Each point has an associated vector showing direction and magnitude.`,
      emphasis: 'Vector Direction, Magnitude, Field Patterns'
    });
  }
  
  // Step for level curves
  steps.push({
    title: 'Level Curves/Contours',
    content: `Level curves (or contour lines) show points where the function has the same z-value. They help us understand the topography of the surface.`,
    emphasis: 'Constant z-values, Topographic Map'
  });
  
  // Step for understanding the visualization
  steps.push({
    title: 'Interacting with the 3D Visualization',
    content: `To fully understand this 3D surface, interact with the visualization by rotating, zooming, and examining it from different angles.`,
    emphasis: 'Rotation, Zoom, Perspective'
  });
  
  // Provide some practice questions
  const questions = generatePracticeQuestions(type, subtype, expression);
  
  return {
    title: `Step-by-Step Analysis of f(x,y) = ${expression}`,
    summary: `This guide explores the 3D function f(x,y) = ${expression}, analyzing its surface features and behavior in 3D space.`,
    steps,
    questions,
    references: [
      'Multivariable Calculus - Khan Academy',
      'Visualizing Functions of Two Variables - MIT OpenCourseWare',
      'MathWorld: 3D Plotting and Visualization'
    ]
  };
}

/**
 * Generate explanation for calculus problems
 * @param {Object} problem - The processed mathematical problem
 * @param {Object} analysis - The analysis result from mathAnalyzer
 * @param {Object} calculusResult - The result from wolfram alpha calculus operation
 * @returns {Object} - Step-by-step explanation
 */
async function generateCalculusExplanation(problem, analysis, calculusResult) {
  const expression = analysis.concept.expression;
  const subtype = analysis.concept.subtype;
  let steps = [];
  
  // Get additional information based on calculus operation type
  if (subtype === 'derivative' || calculusResult?.type === 'derivative') {
    const origExpr = calculusResult?.originalExpression || expression;
    const derivExpr = calculusResult?.expression || await wolframAlphaService.getDerivative(expression);
    
    steps = generateDerivativeSteps(origExpr, derivExpr);
  } 
  else if (subtype === 'integral' || calculusResult?.type === 'integral') {
    const origExpr = calculusResult?.originalExpression || expression;
    const intExpr = calculusResult?.expression || await wolframAlphaService.getIntegral(expression);
    
    steps = generateIntegralSteps(origExpr, intExpr);
  }
  else if (subtype === 'limit' || calculusResult?.type === 'limit') {
    const origExpr = calculusResult?.originalExpression || expression;
    const limitVal = calculusResult?.limitValue || calculusResult?.expression || '1';
    const variable = calculusResult?.variable || 'x';
    const approach = calculusResult?.limitValue || '0';
    
    steps = generateLimitSteps(origExpr, variable, approach, limitVal);
  }
  else {
    // General calculus explanation if subtype isn't specific
    steps.push({
      title: 'Understanding the Calculus Problem',
      content: `We're analyzing the function f(x) = ${expression} using calculus.`,
      emphasis: `f(x) = ${expression}`
    });
    
    steps.push({
      title: 'Function Analysis',
      content: `First, we identify the key characteristics of the function to understand how to apply calculus operations.`,
      emphasis: 'Domain, Continuity, Differentiability'
    });
  }
  
  // Provide some practice questions
  const questions = generatePracticeQuestions(type, subtype, expression);
  
  return {
    title: `Step-by-Step ${subtype.charAt(0).toUpperCase() + subtype.slice(1)} of f(x) = ${expression}`,
    summary: `This guide walks through the ${subtype} of the function f(x) = ${expression}, providing detailed steps and explanations.`,
    steps,
    questions,
    references: [
      'Calculus - Khan Academy',
      'MIT OpenCourseWare: Single Variable Calculus',
      'Paul\'s Online Math Notes: Calculus'
    ]
  };
}

/**
 * Generate steps for derivative problems
 * @param {string} expression - Original expression
 * @param {string} derivative - Derivative result
 * @returns {Array} - Array of steps
 */
function generateDerivativeSteps(expression, derivative) {
  const steps = [];
  
  steps.push({
    title: 'Understanding the Derivative',
    content: `We're finding the derivative of f(x) = ${expression}. The derivative measures the rate of change of the function at each point.`,
    emphasis: `f(x) = ${expression}`
  });
  
  steps.push({
    title: 'Applying Derivative Rules',
    content: `To find the derivative, we apply the appropriate differentiation rules based on the function structure.`,
    emphasis: 'Power Rule, Product Rule, Chain Rule, etc.'
  });
  
  // Add specific rules based on the expression
  if (expression.includes('^')) {
    steps.push({
      title: 'Power Rule',
      content: `For terms of the form x^n, the derivative is n·x^(n-1).`,
      emphasis: 'Power Rule: d/dx(x^n) = n·x^(n-1)'
    });
  }
  
  if (expression.includes('sin') || expression.includes('cos')) {
    steps.push({
      title: 'Trigonometric Functions',
      content: `For trigonometric functions, we have specific derivative rules like d/dx(sin(x)) = cos(x) and d/dx(cos(x)) = -sin(x).`,
      emphasis: 'd/dx(sin(x)) = cos(x), d/dx(cos(x)) = -sin(x)'
    });
  }
  
  if (expression.includes('e^')) {
    steps.push({
      title: 'Exponential Functions',
      content: `For e^x, the derivative is simply e^x. For other bases, we use the chain rule.`,
      emphasis: 'd/dx(e^x) = e^x'
    });
  }
  
  steps.push({
    title: 'Final Derivative',
    content: `After applying all the appropriate rules, we get the derivative: f'(x) = ${derivative}`,
    emphasis: `f'(x) = ${derivative}`
  });
  
  steps.push({
    title: 'Interpreting the Derivative',
    content: `The derivative f'(x) tells us the slope of the tangent line to the original function at any point x. When f'(x) = 0, we have critical points that may be maxima, minima, or inflection points.`,
    emphasis: 'Slope, Critical Points, Max/Min, Inflection Points'
  });
  
  return steps;
}

/**
 * Generate steps for integral problems
 * @param {string} expression - Original expression
 * @param {string} integral - Integral result
 * @returns {Array} - Array of steps
 */
function generateIntegralSteps(expression, integral) {
  const steps = [];
  
  steps.push({
    title: 'Understanding the Integral',
    content: `We're finding the indefinite integral of f(x) = ${expression}. The integral gives us the anti-derivative, or the family of functions whose derivative is our original function.`,
    emphasis: `f(x) = ${expression}`
  });
  
  steps.push({
    title: 'Applying Integration Rules',
    content: `To find the integral, we apply the appropriate integration rules based on the function structure.`,
    emphasis: 'Power Rule, Substitution, Integration by Parts, etc.'
  });
  
  // Add specific rules based on the expression
  if (expression.includes('^')) {
    steps.push({
      title: 'Power Rule for Integration',
      content: `For terms of the form x^n (where n ≠ -1), the integral is x^(n+1)/(n+1) + C.`,
      emphasis: '∫x^n dx = x^(n+1)/(n+1) + C (for n ≠ -1)'
    });
  }
  
  if (expression.includes('sin') || expression.includes('cos')) {
    steps.push({
      title: 'Trigonometric Integrals',
      content: `For trigonometric functions, we use specific integral formulas like ∫sin(x)dx = -cos(x) + C and ∫cos(x)dx = sin(x) + C.`,
      emphasis: '∫sin(x)dx = -cos(x) + C, ∫cos(x)dx = sin(x) + C'
    });
  }
  
  if (expression.includes('e^')) {
    steps.push({
      title: 'Exponential Integrals',
      content: `For e^x, the integral is also e^x + C. For other bases, we need additional techniques.`,
      emphasis: '∫e^x dx = e^x + C'
    });
  }
  
  if (expression.includes('1/x') || expression.includes('x^-1')) {
    steps.push({
      title: 'Logarithmic Integrals',
      content: `For 1/x, the integral is ln|x| + C.`,
      emphasis: '∫(1/x)dx = ln|x| + C'
    });
  }
  
  steps.push({
    title: 'Final Integral',
    content: `After applying all the appropriate rules, we get the indefinite integral: ∫f(x)dx = ${integral} + C, where C is an arbitrary constant.`,
    emphasis: `∫f(x)dx = ${integral} + C`
  });
  
  steps.push({
    title: 'Interpreting the Integral',
    content: `The indefinite integral represents a family of functions (differing by a constant C) whose derivative is the original function. The definite integral (with bounds) gives us the net signed area between the function and the x-axis.`,
    emphasis: 'Anti-derivative, Area Under the Curve'
  });
  
  return steps;
}

/**
 * Generate steps for limit problems
 * @param {string} expression - Original expression
 * @param {string} variable - Variable name
 * @param {string} approach - The value being approached
 * @param {string} limitValue - The calculated limit
 * @returns {Array} - Array of steps
 */
function generateLimitSteps(expression, variable, approach, limitValue) {
  const steps = [];
  
  steps.push({
    title: 'Understanding the Limit',
    content: `We're finding the limit of f(${variable}) = ${expression} as ${variable} approaches ${approach}.`,
    emphasis: `lim (${variable}→${approach}) ${expression}`
  });
  
  steps.push({
    title: 'Analyzing the Function Behavior',
    content: `To find the limit, we need to understand how the function behaves as ${variable} gets closer and closer to ${approach} (but not necessarily equal to it).`,
    emphasis: 'Function Behavior Near the Limit Point'
  });
  
  // Add specific strategies based on the limit type
  if (expression.includes('/') && approach === '0') {
    steps.push({
      title: 'Handling Potential Division by Zero',
      content: `Since there's division in the expression and we're approaching 0, we need to check for potential indeterminate forms like 0/0 or ∞/∞.`,
      emphasis: 'Indeterminate Forms, L\'Hôpital\'s Rule'
    });
  }
  
  if (expression.includes('sin') && expression.includes('x') && approach === '0') {
    steps.push({
      title: 'Special Trigonometric Limit',
      content: `For expressions involving sin(x)/x as x approaches 0, we use the special limit: lim (x→0) sin(x)/x = 1.`,
      emphasis: 'lim (x→0) sin(x)/x = 1'
    });
  }
  
  steps.push({
    title: 'Computing the Limit',
    content: `Using appropriate limit evaluation techniques, we determine that the limit equals ${limitValue}.`,
    emphasis: `lim (${variable}→${approach}) ${expression} = ${limitValue}`
  });
  
  steps.push({
    title: 'Interpreting the Limit',
    content: `This limit tells us the value that the function approaches as ${variable} gets closer to ${approach}. It doesn't necessarily mean the function equals this value at ${variable} = ${approach}.`,
    emphasis: 'Function Behavior, Continuity'
  });
  
  return steps;
}

/**
 * Generate explanation for geometry problems
 * @param {Object} problem - The processed mathematical problem
 * @param {Object} analysis - The analysis result from mathAnalyzer
 * @returns {Object} - Step-by-step explanation
 */
function generateGeometryExplanation(problem, analysis) {
  const subtype = analysis.concept.subtype;
  const points = analysis.parameters.points || [];
  
  let steps = [];
  
  steps.push({
    title: 'Understanding the Geometric Figure',
    content: `We're analyzing a geometric figure of type ${subtype}.`,
    emphasis: `Geometry Type: ${subtype}`
  });
  
  // Add steps based on geometry type
  if (subtype === 'triangle') {
    steps = steps.concat(generateTriangleSteps(points));
  } 
  else if (subtype === 'circle') {
    steps = steps.concat(generateCircleSteps(analysis));
  }
  else if (subtype === 'polygon') {
    steps = steps.concat(generatePolygonSteps(points));
  }
  else {
    steps.push({
      title: 'Analyzing the Geometric Elements',
      content: `This geometric visualization contains various elements that we can analyze using principles of Euclidean geometry.`,
      emphasis: 'Points, Lines, Angles, Relationships'
    });
  }
  
  // Add a step for geometric properties
  steps.push({
    title: 'Geometric Properties',
    content: `Understanding the geometric properties helps us analyze the relationships between different elements of the figure.`,
    emphasis: 'Congruence, Similarity, Symmetry'
  });
  
  // Provide some practice questions
  const questions = generatePracticeQuestions('geometry', subtype);
  
  return {
    title: `Step-by-Step Analysis of ${subtype.charAt(0).toUpperCase() + subtype.slice(1)} Geometry`,
    summary: `This guide explores the geometric properties and relationships in the given ${subtype} figure.`,
    steps,
    questions,
    references: [
      'Euclidean Geometry - Khan Academy',
      'Interactive Geometry - GeoGebra',
      'Principles of Geometry - Wolfram MathWorld'
    ]
  };
}

/**
 * Generate steps for triangle analysis
 * @param {Array} points - Points of the triangle
 * @returns {Array} - Array of steps
 */
function generateTriangleSteps(points) {
  const steps = [];
  
  steps.push({
    title: 'Identifying the Vertices',
    content: `The triangle has vertices at ${points.map(p => `(${p.coordinates.join(', ')})`).join(', ')}.`,
    emphasis: 'Vertices, Coordinates'
  });
  
  steps.push({
    title: 'Calculating Side Lengths',
    content: `To find the side lengths, we calculate the distance between each pair of vertices using the distance formula.`,
    emphasis: 'Distance Formula: d = √[(x₂ - x₁)² + (y₂ - y₁)²]'
  });
  
  steps.push({
    title: 'Calculating Area',
    content: `The area of the triangle can be calculated using the formula Area = (1/2) × base × height or using the cross product method for coordinates.`,
    emphasis: 'Area Formula, Cross Product Method'
  });
  
  steps.push({
    title: 'Finding the Centroid',
    content: `The centroid of the triangle is located at the point where the three medians intersect. It can be calculated as the average of the three vertices.`,
    emphasis: 'Centroid: (x₁ + x₂ + x₃)/3, (y₁ + y₂ + y₃)/3'
  });
  
  return steps;
}

/**
 * Generate steps for circle analysis
 * @param {Object} analysis - The analysis result from mathAnalyzer
 * @returns {Array} - Array of steps
 */
function generateCircleSteps(analysis) {
  const expression = analysis.concept.expression;
  const steps = [];
  
  steps.push({
    title: 'Identifying the Circle Equation',
    content: `The circle is defined by the equation ${expression} = 0.`,
    emphasis: `Circle Equation: ${expression} = 0`
  });
  
  steps.push({
    title: 'Finding the Center and Radius',
    content: `From the standard form (x - h)² + (y - k)² = r², we can identify the center (h, k) and the radius r.`,
    emphasis: 'Standard Form: (x - h)² + (y - k)² = r²'
  });
  
  steps.push({
    title: 'Calculating the Circumference and Area',
    content: `Once we have the radius r, we can calculate the circumference as 2πr and the area as πr².`,
    emphasis: 'Circumference = 2πr, Area = πr²'
  });
  
  return steps;
}

/**
 * Generate steps for polygon analysis
 * @param {Array} points - Points of the polygon
 * @returns {Array} - Array of steps
 */
function generatePolygonSteps(points) {
  const numSides = points.length;
  const steps = [];
  
  steps.push({
    title: 'Identifying the Vertices',
    content: `The polygon has ${numSides} vertices at ${points.map(p => `(${p.coordinates.join(', ')})`).join(', ')}.`,
    emphasis: `${numSides}-sided Polygon (${numSides === 4 ? 'Quadrilateral' : numSides === 5 ? 'Pentagon' : numSides === 6 ? 'Hexagon' : 'Polygon'})`
  });
  
  steps.push({
    title: 'Calculating the Perimeter',
    content: `To find the perimeter, we calculate the distance between each consecutive pair of vertices and sum them.`,
    emphasis: 'Perimeter = Sum of all sides'
  });
  
  steps.push({
    title: 'Calculating the Area',
    content: `For a polygon with coordinates, we can calculate the area using the Shoelace formula (or Surveyor's formula).`,
    emphasis: 'Shoelace Formula, Coordinate Method'
  });
  
  return steps;
}

/**
 * Generate explanation for linear algebra problems
 * @param {Object} problem - The processed mathematical problem
 * @param {Object} analysis - The analysis result from mathAnalyzer
 * @returns {Object} - Step-by-step explanation
 */
function generateLinearAlgebraExplanation(problem, analysis) {
  // Simplified for this implementation
  return {
    title: 'Step-by-Step Linear Algebra Solution',
    summary: 'This guide walks through the linear algebra problem, providing detailed steps and explanations.',
    steps: [
      {
        title: 'Understanding the Problem',
        content: 'We first identify the type of linear algebra problem we\'re dealing with.',
        emphasis: 'Matrix Operations, Systems of Equations, Vector Spaces'
      },
      {
        title: 'Setting Up the Problem',
        content: 'We set up the problem in appropriate mathematical form.',
        emphasis: 'Matrix Notation, Vector Notation'
      },
      {
        title: 'Solving the Problem',
        content: 'We apply appropriate linear algebra techniques to solve the problem.',
        emphasis: 'Gauss-Jordan Elimination, Matrix Inversion, Eigenvalues'
      },
      {
        title: 'Interpreting the Solution',
        content: 'We interpret the mathematical solution in the context of the original problem.',
        emphasis: 'Geometric Interpretation, Application Context'
      }
    ],
    questions: generatePracticeQuestions('linearAlgebra'),
    references: [
      'Linear Algebra - Khan Academy',
      'MIT OpenCourseWare: Linear Algebra',
      '3Blue1Brown: Essence of Linear Algebra'
    ]
  };
}

/**
 * Generate explanation for probability problems
 * @param {Object} problem - The processed mathematical problem
 * @param {Object} analysis - The analysis result from mathAnalyzer
 * @returns {Object} - Step-by-step explanation
 */
function generateProbabilityExplanation(problem, analysis) {
  // Simplified for this implementation
  return {
    title: 'Step-by-Step Probability Solution',
    summary: 'This guide walks through the probability problem, providing detailed steps and explanations.',
    steps: [
      {
        title: 'Understanding the Problem',
        content: 'We first identify what type of probability problem we\'re dealing with.',
        emphasis: 'Discrete Probability, Continuous Probability, Distributions'
      },
      {
        title: 'Identifying the Sample Space',
        content: 'We determine all possible outcomes in the sample space.',
        emphasis: 'Sample Space, Events, Outcomes'
      },
      {
        title: 'Calculating Probabilities',
        content: 'We apply appropriate probability formulas and concepts.',
        emphasis: 'Probability Rules, Conditional Probability, Bayes\' Theorem'
      },
      {
        title: 'Interpreting the Results',
        content: 'We interpret the calculated probabilities in the context of the original problem.',
        emphasis: 'Practical Interpretation, Decision Making'
      }
    ],
    questions: generatePracticeQuestions('probability'),
    references: [
      'Probability - Khan Academy',
      'MIT OpenCourseWare: Introduction to Probability',
      'Statistics and Probability - Wolfram MathWorld'
    ]
  };
}

/**
 * Generate explanation for statistics problems
 * @param {Object} problem - The processed mathematical problem
 * @param {Object} analysis - The analysis result from mathAnalyzer
 * @returns {Object} - Step-by-step explanation
 */
function generateStatisticsExplanation(problem, analysis) {
  // Simplified for this implementation
  return {
    title: 'Step-by-Step Statistical Analysis',
    summary: 'This guide walks through the statistical problem, providing detailed steps and explanations.',
    steps: [
      {
        title: 'Understanding the Data',
        content: 'We first understand what kind of data we\'re dealing with and what we want to learn from it.',
        emphasis: 'Data Types, Statistical Questions'
      },
      {
        title: 'Descriptive Statistics',
        content: 'We calculate summary statistics to understand the central tendency and spread of the data.',
        emphasis: 'Mean, Median, Mode, Variance, Standard Deviation'
      },
      {
        title: 'Data Visualization',
        content: 'We create appropriate visualizations to better understand the data distribution.',
        emphasis: 'Histograms, Box Plots, Scatter Plots'
      },
      {
        title: 'Statistical Inference',
        content: 'We apply inferential statistics to draw conclusions beyond the immediate data.',
        emphasis: 'Hypothesis Testing, Confidence Intervals, p-values'
      },
      {
        title: 'Interpreting Results',
        content: 'We interpret the statistical results in the context of the original problem.',
        emphasis: 'Practical Significance, Decision Making'
      }
    ],
    questions: generatePracticeQuestions('statistics'),
    references: [
      'Statistics - Khan Academy',
      'MIT OpenCourseWare: Introduction to Statistics',
      'Statistical Learning - Stanford Online'
    ]
  };
}

/**
 * Generate a general explanation for any problem type
 * @param {Object} problem - The processed mathematical problem
 * @param {Object} analysis - The analysis result from mathAnalyzer
 * @returns {Object} - Step-by-step explanation
 */
function generateGeneralExplanation(problem, analysis) {
  return {
    title: 'Step-by-Step Mathematical Analysis',
    summary: 'This guide walks through the mathematical problem, providing a general framework for analysis.',
    steps: [
      {
        title: 'Understanding the Problem',
        content: 'First, we identify what type of mathematical problem we\'re dealing with and what we need to find.',
        emphasis: 'Problem Identification, Goal Setting'
      },
      {
        title: 'Analyzing Mathematical Structures',
        content: 'We analyze the key mathematical structures and relationships in the problem.',
        emphasis: 'Patterns, Relationships, Structures'
      },
      {
        title: 'Applying Mathematical Techniques',
        content: 'We apply appropriate mathematical techniques and methods to solve the problem.',
        emphasis: 'Mathematical Methods, Algorithms, Procedures'
      },
      {
        title: 'Visualizing the Solution',
        content: 'We create a visualization to better understand the solution and mathematical relationships.',
        emphasis: 'Visual Representation, Geometric Interpretation'
      },
      {
        title: 'Interpreting Results',
        content: 'We interpret the mathematical results in a meaningful way.',
        emphasis: 'Practical Interpretation, Connections to Other Concepts'
      }
    ],
    questions: generatePracticeQuestions('general'),
    references: [
      'Mathematics - Khan Academy',
      'MIT OpenCourseWare: Mathematics',
      'Wolfram MathWorld'
    ]
  };
}

/**
 * Generate practice questions based on the problem type and subtype
 * @param {string} type - The problem type
 * @param {string} subtype - The problem subtype
 * @param {string} expression - The mathematical expression
 * @returns {Array} - Array of practice questions
 */
function generatePracticeQuestions(type, subtype = 'general', expression = '') {
  // Base questions applicable to most problems
  const baseQuestions = [
    {
      question: 'What are the key features of this visualization?',
      hint: 'Look for critical points, intercepts, and overall shape.'
    },
    {
      question: 'How would this change if we modified a parameter?',
      hint: 'Consider how changing coefficients or terms would affect the result.'
    }
  ];
  
  // Type-specific questions
  let specificQuestions = [];
  
  switch (type) {
    case 'function2D':
      specificQuestions = [
        {
          question: `Find the zeroes of f(x) = ${expression}.`,
          hint: 'Set the function equal to zero and solve for x.'
        },
        {
          question: `Determine where f(x) = ${expression} is increasing and decreasing.`,
          hint: 'Look at where the derivative is positive or negative.'
        }
      ];
      break;
    case 'function3D':
      specificQuestions = [
        {
          question: `Identify the critical points of f(x,y) = ${expression}.`,
          hint: 'Look for points where both partial derivatives equal zero.'
        },
        {
          question: `Describe the behavior of f(x,y) = ${expression} as x and y approach infinity.`,
          hint: 'Analyze the highest-degree terms in x and y.'
        }
      ];
      break;
    case 'calculus':
      if (subtype === 'derivative') {
        specificQuestions = [
          {
            question: `Find the critical points of f(x) = ${expression}.`,
            hint: 'Set the derivative equal to zero and solve for x.'
          },
          {
            question: `Determine where f(x) = ${expression} is concave up or concave down.`,
            hint: 'Look at the second derivative.'
          }
        ];
      } else if (subtype === 'integral') {
        specificQuestions = [
          {
            question: `Calculate the definite integral of f(x) = ${expression} from a to b.`,
            hint: 'Evaluate the antiderivative at the boundaries and find the difference.'
          },
          {
            question: `Find the average value of f(x) = ${expression} over the interval [a, b].`,
            hint: 'Use the formula (1/(b-a)) * ∫_a^b f(x) dx.'
          }
        ];
      } else if (subtype === 'limit') {
        specificQuestions = [
          {
            question: `Evaluate the limit from the left and right sides.`,
            hint: 'Check if the function approaches the same value from both directions.'
          },
          {
            question: `Is the function continuous at the point of interest?`,
            hint: 'Check if the limit equals the function value at that point.'
          }
        ];
      }
      break;
    case 'geometry':
      specificQuestions = [
        {
          question: 'Calculate the area of the geometric figure.',
          hint: 'Use appropriate area formulas based on the shape.'
        },
        {
          question: 'Find the perimeter or circumference of the figure.',
          hint: 'Calculate the sum of all sides or use the circle formula.'
        }
      ];
      break;
  }
  
  // Combine and return questions (limit to 4 total)
  return [...specificQuestions, ...baseQuestions].slice(0, 4);
}

/**
 * Determine the degree of a polynomial expression (simplified version)
 * @param {string} expression - The polynomial expression
 * @returns {number} - The degree of the polynomial
 */
function determinePolynomialDegree(expression) {
  // This is a simplified approach - a real implementation would parse the expression
  let highestPower = 1; // Default to linear
  
  // Check for x^n patterns
  const powerMatches = expression.match(/x\^(\d+)/g);
  if (powerMatches) {
    for (const match of powerMatches) {
      const power = parseInt(match.replace('x^', ''));
      highestPower = Math.max(highestPower, power);
    }
  }
  
  return highestPower;
}

export default {
  generateSolutionExplanation,
  generateFunction2DExplanation,
  generateFunction3DExplanation,
  generateCalculusExplanation,
  generateGeometryExplanation
};