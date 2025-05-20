/**
 * Educational Content Generator
 * Generates educational content to accompany mathematical visualizations,
 * providing context, explanations, and interactive learning elements.
 */

/**
 * Create educational content for a mathematical concept
 * @param {Object} analysis - The complete analysis from the math analyzer
 * @returns {Object} - Educational content following the output format
 */
export function createEducationalContent(analysis) {
  // Extract relevant information from the analysis
  const { concept, educational } = analysis;
  
  // Use educational content from the analysis if available
  if (educational) {
    return expandEducationalContent(concept, educational);
  }
  
  // Otherwise, generate new educational content
  return generateEducationalContent(concept);
}

/**
 * Expand existing educational content with additional details
 * @param {Object} concept - The concept information
 * @param {Object} educational - The educational content from the analysis
 * @returns {Object} - Expanded educational content
 */
function expandEducationalContent(concept, educational) {
  // Start with the existing educational content
  const result = { ...educational };
  
  // Add mathematical details if not present
  if (!result.formula) {
    result.formula = generateFormula(concept);
  }
  
  // Add learning elements if not present
  if (!result.keyPoints) {
    result.keyPoints = generateKeyPoints(concept);
  }
  
  if (!result.commonMisconceptions) {
    result.commonMisconceptions = generateCommonMisconceptions(concept);
  }
  
  if (!result.realWorldApplications) {
    result.realWorldApplications = generateRealWorldApplications(concept);
  }
  
  // Add exploration guide if not present
  if (!result.explorationGuide) {
    result.explorationGuide = generateExplorationGuide(concept);
  }
  
  // Add assessment questions if not present
  if (!result.checkUnderstanding) {
    result.checkUnderstanding = generateUnderstandingQuestions(concept);
  }
  
  // Add related content if not present
  if (!result.prerequisites) {
    result.prerequisites = generatePrerequisites(concept);
  }
  
  if (!result.relatedConcepts) {
    result.relatedConcepts = generateRelatedConcepts(concept);
  }
  
  if (!result.furtherReading) {
    result.furtherReading = generateFurtherReading(concept);
  }
  
  return result;
}

/**
 * Generate comprehensive educational content for a concept
 * @param {Object} concept - The concept information
 * @returns {Object} - Complete educational content
 */
function generateEducationalContent(concept) {
  // Generate title and summary based on the concept
  const title = generateTitle(concept);
  const summary = generateSummary(concept);
  const detailedExplanation = generateDetailedExplanation(concept);
  
  // Determine the appropriate difficulty level
  const difficulty = determineDifficulty(concept);
  
  return {
    title,
    conceptType: concept.type,
    difficulty,
    
    // Core explanation
    summary,
    detailedExplanation,
    
    // Mathematical details
    formula: generateFormula(concept),
    
    // Learning elements
    keyPoints: generateKeyPoints(concept),
    commonMisconceptions: generateCommonMisconceptions(concept),
    realWorldApplications: generateRealWorldApplications(concept),
    
    // Interactive learning
    explorationGuide: generateExplorationGuide(concept),
    
    // Assessment
    checkUnderstanding: generateUnderstandingQuestions(concept),
    
    // Related content
    prerequisites: generatePrerequisites(concept),
    relatedConcepts: generateRelatedConcepts(concept),
    furtherReading: generateFurtherReading(concept)
  };
}

/**
 * Generate a title for the concept
 * @param {Object} concept - The concept information
 * @returns {string} - A descriptive title
 */
function generateTitle(concept) {
  const { type, subtype, expression } = concept;
  
  // Create title based on the concept type and subtype
  switch (type) {
    case 'function2D':
      if (subtype === 'polynomial') {
        return `Exploring Polynomial Functions: ${expression}`;
      } else if (subtype === 'trigonometric') {
        return `Visualizing Trigonometric Functions: ${expression}`;
      } else if (subtype === 'exponential') {
        return `Understanding Exponential Functions: ${expression}`;
      } else if (subtype === 'logarithmic') {
        return `Investigating Logarithmic Functions: ${expression}`;
      }
      return `Visualizing the Function: ${expression}`;
      
    case 'function3D':
      return `3D Visualization of ${subtype === 'general' ? 'the Function' : `the ${subtype} Function`}: ${expression}`;
      
    case 'geometry':
      if (subtype === 'triangle') {
        return 'Exploring Triangle Properties';
      } else if (subtype === 'circle') {
        return 'Understanding Circle Geometry';
      } else if (subtype === 'polygon') {
        return 'Investigating Polygon Properties';
      }
      return `Geometric Visualization: ${subtype}`;
      
    case 'calculus':
      return `Calculus Concepts: ${subtype}`;
      
    case 'linearAlgebra':
      return `Linear Algebra: ${subtype}`;
      
    case 'statistics':
      return `Statistical Analysis: ${subtype}`;
      
    case 'probability':
      return `Probability Concepts: ${subtype}`;
      
    default:
      return `Mathematical Visualization: ${expression}`;
  }
}

/**
 * Generate a concise summary of the concept
 * @param {Object} concept - The concept information
 * @returns {string} - A brief summary
 */
function generateSummary(concept) {
  const { type, subtype, expression } = concept;
  
  // Create summary based on the concept type
  switch (type) {
    case 'function2D':
      return `This visualization explores the behavior of the function ${expression} across different input values, showing how the output changes in response to changes in the input.`;
      
    case 'function3D':
      return `This 3D visualization demonstrates how the function ${expression} maps inputs to outputs, creating a surface in three-dimensional space that reveals patterns and behaviors that might be difficult to understand algebraically.`;
      
    case 'geometry':
      return `This geometric visualization examines the properties and relationships in ${subtype} geometry, allowing for interactive exploration of mathematical principles through visual representation.`;
      
    case 'calculus':
      return `This visualization illustrates key concepts in calculus, specifically focusing on ${subtype}, to provide intuitive understanding of mathematical principles through visual representation.`;
      
    case 'linearAlgebra':
      return `This visualization demonstrates concepts in linear algebra related to ${subtype}, showing how mathematical abstractions can be represented and understood visually.`;
      
    case 'statistics':
      return `This statistical visualization presents data and analytical concepts related to ${subtype}, helping to build intuition for statistical measures and their interpretations.`;
      
    case 'probability':
      return `This probability visualization illustrates concepts related to ${subtype}, demonstrating how probabilistic outcomes can be visualized and understood intuitively.`;
      
    default:
      return `This visualization presents a mathematical concept related to ${type}, providing an interactive way to explore and understand the underlying principles.`;
  }
}

/**
 * Generate a detailed explanation of the concept
 * @param {Object} concept - The concept information
 * @returns {string} - A comprehensive explanation
 */
function generateDetailedExplanation(concept) {
  const { type, subtype, expression, variables } = concept;
  
  // Create detailed explanation based on the concept type
  switch (type) {
    case 'function2D':
      if (subtype === 'polynomial') {
        return `This visualization shows a polynomial function ${expression}. Polynomial functions are characterized by terms with non-negative integer exponents. The behavior of the function is determined by its degree (the highest exponent) and the coefficients of each term. By exploring this visualization, you can observe how the function behaves across different domains and identify key features such as zeros (roots), extrema (maxima and minima), and asymptotic behavior.`;
      } else if (subtype === 'trigonometric') {
        return `This visualization depicts the trigonometric function ${expression}. Trigonometric functions model periodic phenomena, repeating their values over regular intervals. By exploring this visualization, you can observe properties like amplitude (the maximum deviation from the center line), period (the distance required for the function to complete one full cycle), and phase shift (horizontal displacement from the standard position).`;
      } else if (subtype === 'exponential') {
        return `This visualization represents the exponential function ${expression}. Exponential functions model growth or decay processes where the rate of change is proportional to the current value. The visualization allows you to observe the characteristic rapid growth (or decay) of these functions and understand key properties like the y-intercept and asymptotic behavior.`;
      } else if (subtype === 'logarithmic') {
        return `This visualization shows a logarithmic function ${expression}. Logarithmic functions are the inverse of exponential functions and grow very slowly. Through this visualization, you can explore properties like the vertical asymptote, the slow rate of increase, and observe how logarithmic functions map multiplicative processes to additive scales.`;
      }
      return `This visualization represents the function ${expression}, showing how input values (typically represented on the x-axis) are mapped to output values (typically represented on the y-axis). By exploring this visualization, you can observe the function's behavior, identify patterns, and understand how changes in input affect the output.`;
      
    case 'function3D':
      return `This 3D visualization represents the function ${expression} where the output (typically represented on the z-axis) depends on two input variables (typically represented on the x and y axes). The resulting surface in three-dimensional space reveals patterns and behaviors that might be difficult to understand algebraically. By exploring different viewpoints and parameter values, you can develop intuition for how the function behaves across its domain.`;
      
    // Additional cases for other concept types
    // ...
      
    default:
      return `This visualization represents a mathematical concept related to ${type}, specifically focusing on ${subtype}. By interacting with this visualization, you can develop a deeper understanding of the underlying principles and relationships involved.`;
  }
}

/**
 * Determine the appropriate difficulty level for the concept
 * @param {Object} concept - The concept information
 * @returns {string} - The difficulty level (beginner, intermediate, advanced)
 */
function determineDifficulty(concept) {
  const { type, subtype } = concept;
  
  // Determine difficulty based on concept type and subtype
  switch (type) {
    case 'function2D':
      if (subtype === 'polynomial' && subtype !== 'cubic') {
        return 'beginner';
      } else if (subtype === 'trigonometric' || subtype === 'exponential') {
        return 'intermediate';
      } else if (subtype === 'logarithmic') {
        return 'intermediate';
      }
      return 'beginner';
      
    case 'function3D':
      return 'intermediate';
      
    case 'calculus':
      return 'advanced';
      
    case 'linearAlgebra':
      return 'advanced';
      
    case 'statistics':
    case 'probability':
      if (subtype === 'basic') {
        return 'beginner';
      }
      return 'intermediate';
      
    default:
      return 'intermediate';
  }
}

/**
 * Generate formula information for the concept
 * @param {Object} concept - The concept information
 * @returns {Object} - Formula information with raw, LaTeX, and component details
 */
function generateFormula(concept) {
  const { type, subtype, expression } = concept;
  
  // Convert the expression to LaTeX format
  const latexExpression = convertToLatex(expression);
  
  // Identify components in the formula
  const components = identifyComponents(expression);
  
  return {
    raw: expression,
    latex: latexExpression,
    components
  };
}

/**
 * Convert a mathematical expression to LaTeX format
 * @param {string} expression - The mathematical expression
 * @returns {string} - The LaTeX representation
 */
function convertToLatex(expression) {
  // This would be a more sophisticated conversion in a real implementation
  // Basic replacement for common mathematical notation
  let latex = expression;
  
  // Replace power notation
  latex = latex.replace(/\^(\d+)/g, '^{$1}');
  
  // Replace sqrt
  latex = latex.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
  
  // Replace trigonometric functions
  latex = latex.replace(/sin\(/g, '\\sin(');
  latex = latex.replace(/cos\(/g, '\\cos(');
  latex = latex.replace(/tan\(/g, '\\tan(');
  
  // Replace logarithmic functions
  latex = latex.replace(/log\(/g, '\\log(');
  latex = latex.replace(/ln\(/g, '\\ln(');
  
  // Replace exponential function
  latex = latex.replace(/exp\(/g, 'e^{');
  latex = latex.replace(/\)(?![^(]*\))/g, '}');
  
  return latex;
}

/**
 * Identify components in a mathematical expression
 * @param {string} expression - The mathematical expression
 * @returns {Array} - Array of components with symbol and meaning
 */
function identifyComponents(expression) {
  // This would be more sophisticated in a real implementation
  const components = [];
  
  // Check for variables
  if (expression.includes('x')) {
    components.push({
      symbol: 'x',
      meaning: 'Independent variable'
    });
  }
  
  if (expression.includes('y')) {
    components.push({
      symbol: 'y',
      meaning: 'Dependent variable'
    });
  }
  
  // Check for common functions
  if (expression.includes('sin')) {
    components.push({
      symbol: 'sin',
      meaning: 'Sine function, representing oscillatory behavior'
    });
  }
  
  if (expression.includes('cos')) {
    components.push({
      symbol: 'cos',
      meaning: 'Cosine function, representing oscillatory behavior'
    });
  }
  
  if (expression.includes('exp') || expression.includes('e^')) {
    components.push({
      symbol: 'e^x',
      meaning: 'Exponential function, representing growth or decay'
    });
  }
  
  if (expression.includes('log')) {
    components.push({
      symbol: 'log',
      meaning: 'Logarithm function, the inverse of exponential function'
    });
  }
  
  return components;
}

/**
 * Generate key points about the concept
 * @param {Object} concept - The concept information
 * @returns {Array} - Array of key points
 */
function generateKeyPoints(concept) {
  const { type, subtype } = concept;
  
  // Generate key points based on the concept type
  switch (type) {
    case 'function2D':
      if (subtype === 'polynomial') {
        return [
          'Polynomial functions have the form P(x) = a₀ + a₁x + a₂x² + ... + aₙxⁿ',
          'The degree of a polynomial is the highest power of the variable',
          'A polynomial of degree n can have at most n real roots',
          'The end behavior of a polynomial is determined by its leading term'
        ];
      } else if (subtype === 'trigonometric') {
        return [
          'Trigonometric functions are periodic, repeating their values at regular intervals',
          'The amplitude determines the height of the wave',
          'The period determines the length of one complete cycle',
          'Trigonometric functions can model oscillatory phenomena in nature'
        ];
      } else if (subtype === 'exponential') {
        return [
          'Exponential functions have the form f(x) = a·bˣ where b > 0',
          'When b > 1, the function grows increasingly rapidly',
          'When 0 < b < 1, the function decays towards zero',
          'Exponential functions model growth and decay processes in nature'
        ];
      } else if (subtype === 'logarithmic') {
        return [
          'Logarithmic functions are the inverse of exponential functions',
          'They grow very slowly as x increases',
          'The domain of a logarithmic function is restricted to positive numbers',
          'Logarithmic functions are useful for representing data that varies over a large range'
        ];
      }
      return [
        'Functions map input values to exactly one output value',
        'The domain is the set of all possible input values',
        'The range is the set of all possible output values',
        'The graph of a function visualizes this input-output relationship'
      ];
      
    case 'function3D':
      return [
        'A function of two variables maps each pair of inputs to a single output',
        'The graph forms a surface in three-dimensional space',
        'Level curves (contours) show where the function has the same value',
        'The partial derivatives indicate the rate of change in each input direction'
      ];
      
    // Additional cases for other concept types
    // ...
      
    default:
      return [
        'Mathematical visualizations help build intuition for abstract concepts',
        'Visual representations can reveal patterns that may not be obvious algebraically',
        'Interactive exploration allows for deeper understanding through experimentation',
        'Understanding mathematical concepts visually complements analytical understanding'
      ];
  }
}

/**
 * Generate common misconceptions about the concept
 * @param {Object} concept - The concept information
 * @returns {Array} - Array of common misconceptions
 */
function generateCommonMisconceptions(concept) {
  const { type, subtype } = concept;
  
  // Generate misconceptions based on the concept type
  switch (type) {
    case 'function2D':
      if (subtype === 'polynomial') {
        return [
          'Misconception: All polynomials have as many roots as their degree - In reality, some roots may be complex numbers',
          'Misconception: Polynomial graphs always cross the x-axis - They may touch it without crossing (double roots)',
          'Misconception: Higher-degree polynomials always have more complex graphs - The coefficients play a crucial role in determining the shape'
        ];
      } else if (subtype === 'trigonometric') {
        return [
          'Misconception: All trigonometric functions have the same period - Different functions have different natural periods',
          'Misconception: Amplitude is always positive - It can be negative, indicating a reflection across the x-axis',
          'Misconception: Phase shift is difficult to identify - It can be systematically determined from the standard form'
        ];
      }
      return [
        'Misconception: Every curve represents a function - Some curves fail the vertical line test',
        'Misconception: Functions must have a "nice" formula - Some functions are defined piecewise or implicitly',
        'Misconception: All functions are continuous - Functions can have discontinuities at certain points'
      ];
      
    // Additional cases for other concept types
    // ...
      
    default:
      return [
        'Misconception: Visual understanding is less rigorous than algebraic understanding - Both approaches complement each other',
        'Misconception: Mathematical visualization is mainly for basic concepts - Advanced concepts often benefit even more from visualization',
        'Misconception: Visualizations always show the complete picture - Some properties may still require analytical investigation'
      ];
  }
}

/**
 * Generate real-world applications of the concept
 * @param {Object} concept - The concept information
 * @returns {Array} - Array of real-world applications
 */
function generateRealWorldApplications(concept) {
  const { type, subtype } = concept;
  
  // Generate applications based on the concept type
  switch (type) {
    case 'function2D':
      if (subtype === 'polynomial') {
        return [
          'Modeling physical systems where variables have power relationships',
          'Curve fitting in data analysis and statistics',
          'Designing roads and bridges using parabolic curves',
          'Economic models for cost, revenue, and profit functions'
        ];
      } else if (subtype === 'trigonometric') {
        return [
          'Modeling wave phenomena in physics (sound, light, etc.)',
          'Analyzing seasonal patterns in data',
          'Signal processing in electronics and communications',
          'Navigation and positioning systems'
        ];
      } else if (subtype === 'exponential') {
        return [
          'Population growth and decay models',
          'Compound interest in finance',
          'Radioactive decay in physics',
          'Growth of bacteria or spread of diseases in biology'
        ];
      } else if (subtype === 'logarithmic') {
        return [
          'Measuring earthquake intensity (Richter scale)',
          'Sound intensity (decibel scale)',
          'pH scale in chemistry',
          'Information theory and entropy'
        ];
      }
      return [
        'Modeling relationships between variables in science and engineering',
        'Economic models for supply, demand, and equilibrium',
        'Data analysis and pattern recognition',
        'Computer graphics and animation'
      ];
      
    // Additional cases for other concept types
    // ...
      
    default:
      return [
        'Scientific modeling and simulation',
        'Data visualization and analysis',
        'Problem-solving in engineering and design',
        'Decision-making in business and economics'
      ];
  }
}

/**
 * Generate an exploration guide for the concept
 * @param {Object} concept - The concept information
 * @returns {Object} - Exploration guide with steps
 */
function generateExplorationGuide(concept) {
  const { type, subtype } = concept;
  
  // Generate exploration steps based on the concept type
  let steps = [];
  
  switch (type) {
    case 'function2D':
      steps = [
        {
          instruction: 'Observe the overall shape of the function graph.',
          expectation: 'Notice the general trend of the function (increasing, decreasing, periodic, etc.).',
          hint: 'Pay attention to where the function rises and falls.'
        },
        {
          instruction: 'Identify key points such as intercepts, maxima, and minima.',
          expectation: 'Locate where the function crosses the axes and where it reaches its highest and lowest points.',
          hint: 'x-intercepts occur when y = 0; y-intercepts occur when x = 0.'
        },
        {
          instruction: 'Explore how the function behaves for extreme input values.',
          expectation: 'Observe what happens as x becomes very large in the positive or negative direction.',
          hint: 'This is called the "end behavior" of the function.'
        }
      ];
      
      // Add type-specific exploration steps
      if (subtype === 'polynomial') {
        steps.push(
          {
            instruction: 'Count the number of turning points in the graph.',
            expectation: 'A polynomial of degree n can have at most n-1 turning points.',
            hint: 'Turning points occur where the function changes from increasing to decreasing or vice versa.'
          },
          {
            instruction: 'Identify all the roots (x-intercepts) of the polynomial.',
            expectation: 'These are the values of x where the function equals zero.',
            hint: 'A polynomial of degree n can have at most n real roots.'
          }
        );
      } else if (subtype === 'trigonometric') {
        steps.push(
          {
            instruction: 'Identify the period of the function.',
            expectation: 'Determine how long it takes for the function to complete one full cycle.',
            hint: 'The standard period for sine and cosine is 2π.'
          },
          {
            instruction: 'Measure the amplitude of the function.',
            expectation: 'Find the maximum distance from the midline to the highest or lowest point.',
            hint: 'The amplitude is half the distance from the maximum to the minimum value.'
          }
        );
      }
      break;
      
    case 'function3D':
      steps = [
        {
          instruction: 'Rotate the 3D visualization to view the surface from different angles.',
          expectation: 'Gain a complete understanding of the surface\'s shape and features.',
          hint: 'Click and drag to rotate the view.'
        },
        {
          instruction: 'Observe how the height (z-value) changes as you move along the x and y axes.',
          expectation: 'Understand how the function responds to changes in each input variable.',
          hint: 'Look for patterns like ridges, valleys, or plateaus.'
        },
        {
          instruction: 'Identify any maximum or minimum points on the surface.',
          expectation: 'Find the highest and lowest points, which represent extreme values of the function.',
          hint: 'These points often occur where the surface is locally flat (zero slope in all directions).'
        }
      ];
      break;
      
    // Additional cases for other concept types
    // ...
      
    default:
      steps = [
        {
          instruction: 'Observe the overall visualization and note its key features.',
          expectation: 'Identify the main components and relationships displayed.',
          hint: 'Look for patterns, symmetries, or notable structures.'
        },
        {
          instruction: 'Interact with any adjustable parameters to see how they affect the visualization.',
          expectation: 'Understand how changes in input values influence the mathematical concept being visualized.',
          hint: 'Try extreme values as well as subtle changes to observe different behaviors.'
        },
        {
          instruction: 'Relate the visual representation to the underlying mathematical formulas.',
          expectation: 'Connect the visual patterns to their algebraic descriptions.',
          hint: 'Try to predict visual changes based on mathematical properties and verify your predictions.'
        }
      ];
  }
  
  return {
    steps
  };
}

/**
 * Generate questions to check understanding of the concept
 * @param {Object} concept - The concept information
 * @returns {Array} - Array of assessment questions
 */
function generateUnderstandingQuestions(concept) {
  const { type, subtype } = concept;
  
  // Generate questions based on the concept type
  switch (type) {
    case 'function2D':
      if (subtype === 'polynomial') {
        return [
          {
            text: 'How does the degree of a polynomial affect its end behavior?',
            type: 'open-ended',
            explanation: 'Polynomials of odd degree have opposite end behaviors as x approaches positive and negative infinity. Polynomials of even degree have the same end behavior in both directions. The leading coefficient determines whether the function grows toward positive or negative infinity.'
          },
          {
            text: 'True or False: A polynomial of degree 4 must have exactly 4 real roots.',
            type: 'true-false',
            correctAnswer: false,
            explanation: 'False. A polynomial of degree 4 can have 0, 2, or 4 real roots. Some roots may be complex numbers, which don\'t appear on the real number line.'
          }
        ];
      } else if (subtype === 'trigonometric') {
        return [
          {
            text: 'What happens to the graph of y = sin(x) when you multiply x by a constant k?',
            type: 'multiple-choice',
            options: [
              'The amplitude changes',
              'The period changes',
              'The phase shift changes',
              'The vertical shift changes'
            ],
            correctAnswer: 1,
            explanation: 'Multiplying x by a constant k changes the period of the function. Specifically, the period becomes 2π/k. This compresses or stretches the graph horizontally.'
          },
          {
            text: 'How are the graphs of sine and cosine related to each other?',
            type: 'open-ended',
            explanation: 'The cosine function is a horizontal shift of the sine function by π/2 units (or 90 degrees). In other words, cos(x) = sin(x + π/2). This means the cosine function reaches its maximum value where sine is zero and increasing.'
          }
        ];
      }
      return [
        {
          text: 'What does it mean if a function fails the vertical line test?',
          type: 'open-ended',
          explanation: 'If a curve fails the vertical line test, it means there exists at least one vertical line that intersects the curve at more than one point. This indicates that the relation is not a function, because a function must map each input value to exactly one output value.'
        },
        {
          text: 'How can you determine the domain and range of a function from its graph?',
          type: 'open-ended',
          explanation: 'The domain is the set of all x-values (inputs) for which the function is defined, which can be visualized as the projection of the graph onto the x-axis. The range is the set of all y-values (outputs) that the function produces, which can be visualized as the projection of the graph onto the y-axis.'
        }
      ];
      
    // Additional cases for other concept types
    // ...
      
    default:
      return [
        {
          text: 'How does visualization enhance understanding of mathematical concepts?',
          type: 'open-ended',
          explanation: 'Visualization provides an intuitive, spatial understanding of mathematical concepts that complements analytical understanding. It helps identify patterns, relationships, and behaviors that might be difficult to grasp from equations alone. Visual representations engage different cognitive processes, making concepts more memorable and accessible.'
        },
        {
          text: 'True or False: All mathematical concepts can be fully understood through visualization alone.',
          type: 'true-false',
          correctAnswer: false,
          explanation: 'False. While visualization is a powerful tool for understanding mathematics, some concepts require formal analytical reasoning to fully comprehend. Visual representations may sometimes be misleading or incomplete. The most robust understanding comes from combining visual, analytical, and algebraic approaches.'
        }
      ];
  }
}

/**
 * Generate prerequisites for understanding the concept
 * @param {Object} concept - The concept information
 * @returns {Array} - Array of prerequisite concepts
 */
function generatePrerequisites(concept) {
  const { type, subtype } = concept;
  
  // Generate prerequisites based on the concept type
  switch (type) {
    case 'function2D':
      if (subtype === 'polynomial') {
        return [
          'Basic algebraic operations',
          'Understanding of variables and equations',
          'Coordinate systems and graphing',
          'Polynomial notation and terminology'
        ];
      } else if (subtype === 'trigonometric') {
        return [
          'Understanding of angles and angular measurement',
          'Basic trigonometric functions (sine, cosine, tangent)',
          'Coordinate systems and graphing',
          'Concept of periodicity'
        ];
      } else if (subtype === 'exponential') {
        return [
          'Understanding of exponents and powers',
          'Properties of exponents',
          'Coordinate systems and graphing',
          'Concept of growth and decay'
        ];
      } else if (subtype === 'logarithmic') {
        return [
          'Understanding of exponential functions',
          'Properties of logarithms',
          'Coordinate systems and graphing',
          'Concept of inverse functions'
        ];
      }
      return [
        'Understanding of variables and equations',
        'Coordinate systems and graphing',
        'Input-output relationships',
        'Basic algebraic operations'
      ];
      
    // Additional cases for other concept types
    // ...
      
    default:
      return [
        'Basic mathematical notation',
        'Understanding of variables and functions',
        'Coordinate systems and graphing',
        'Logical reasoning'
      ];
  }
}

/**
 * Generate related concepts to explore further
 * @param {Object} concept - The concept information
 * @returns {Array} - Array of related concepts
 */
function generateRelatedConcepts(concept) {
  const { type, subtype } = concept;
  
  // Generate related concepts based on the concept type
  switch (type) {
    case 'function2D':
      if (subtype === 'polynomial') {
        return [
          'Polynomial factorization',
          'Roots and zeros',
          'The Fundamental Theorem of Algebra',
          'Polynomial interpolation',
          'Polynomial approximation'
        ];
      } else if (subtype === 'trigonometric') {
        return [
          'Fourier series',
          'Harmonic motion',
          'Wave equations',
          'Trigonometric identities',
          'Phasor representation'
        ];
      } else if (subtype === 'exponential') {
        return [
          'Logarithmic functions',
          'Compound interest',
          'Growth and decay models',
          'Differential equations',
          'The number e'
        ];
      } else if (subtype === 'logarithmic') {
        return [
          'Exponential functions',
          'Properties of logarithms',
          'Change of base formula',
          'Logarithmic scales',
          'Logarithmic differentiation'
        ];
      }
      return [
        'Function transformations',
        'Inverse functions',
        'Function composition',
        'Piecewise functions',
        'Function properties (continuity, differentiability, etc.)'
      ];
      
    // Additional cases for other concept types
    // ...
      
    default:
      return [
        'Mathematical modeling',
        'Function properties and transformations',
        'Analytical vs. visual representations',
        'Applied mathematics',
        'Computational mathematics'
      ];
  }
}

/**
 * Generate further reading suggestions for the concept
 * @param {Object} concept - The concept information
 * @returns {Array} - Array of further reading resources
 */
function generateFurtherReading(concept) {
  const { type, subtype } = concept;
  
  // Generate further reading based on the concept type
  switch (type) {
    case 'function2D':
      return [
        {
          title: 'Visual Complex Analysis by Tristan Needham',
          description: 'Excellent book that emphasizes geometric and visual understanding of mathematical concepts.'
        },
        {
          title: 'Interactive Mathematics',
          link: 'https://www.intmath.com',
          description: 'Website with interactive applets and comprehensive explanations of various mathematical concepts.'
        },
        {
          title: '3Blue1Brown YouTube Channel',
          link: 'https://www.youtube.com/c/3blue1brown',
          description: 'Excellent visual explanations of mathematical concepts with beautiful animations.'
        }
      ];
      
    case 'function3D':
      return [
        {
          title: 'Calculus: Early Transcendentals by James Stewart',
          description: 'Comprehensive textbook with excellent explanations and visualizations of 3D functions.'
        },
        {
          title: 'GeoGebra 3D Calculator',
          link: 'https://www.geogebra.org/3d',
          description: 'Interactive tool for exploring 3D functions and surfaces.'
        },
        {
          title: 'Visualizing Mathematics with 3D Printing by Henry Segerman',
          description: 'Innovative approach to understanding 3D mathematical objects through physical models.'
        }
      ];
      
    // Additional cases for other concept types
    // ...
      
    default:
      return [
        {
          title: 'Mathematics Visualization Resources',
          link: 'https://mathvis.academic.wlu.edu/',
          description: 'Collection of visualizations across various mathematical fields.'
        },
        {
          title: 'Wolfram MathWorld',
          link: 'https://mathworld.wolfram.com/',
          description: 'Comprehensive encyclopedia of mathematical concepts with visualizations.'
        },
        {
          title: 'Visual Insights: A Practical Guide to Making Sense of Data by Katy Börner',
          description: 'Book exploring effective visualization techniques for understanding complex information.'
        }
      ];
  }
}