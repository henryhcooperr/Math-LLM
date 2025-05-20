/**
 * Test fixtures for math problems
 * Contains a collection of natural language math problems for testing the extraction functionality
 */

// Basic function expressions
export const basicFunctionProblems = [
  {
    problem: "Graph the function y = x^2 + 3x - 4.",
    expected: "x^2 + 3x - 4"
  },
  {
    problem: "Plot f(x) = sin(x) from 0 to 2π.",
    expected: "sin(x)"
  },
  {
    problem: "Visualize the function y = log(x).",
    expected: "log(x)"
  },
  {
    problem: "Show the quadratic function y = 2x^2 - 5x + 3.",
    expected: "2x^2 - 5x + 3"
  },
  {
    problem: "Draw the line y = 3x + 2.",
    expected: "3x + 2"
  }
];

// Calculus problems
export const calculusProblems = [
  {
    problem: "Find the derivative of x^3 + 2x^2 - 5x + 1.",
    expected: "x^3 + 2x^2 - 5x + 1"
  },
  {
    problem: "Evaluate the integral of sin(x) with respect to x.",
    expected: "sin(x)"
  },
  {
    problem: "Calculate the limit of (x^2 - 1)/(x - 1) as x approaches 1.",
    expected: "(x^2 - 1)/(x - 1)"
  },
  {
    problem: "Find the derivative of the function f(x) = e^x * sin(x).",
    expected: "e^x * sin(x)"
  },
  {
    problem: "Compute the integral of x^2 * ln(x) with respect to x.",
    expected: "x^2 * ln(x)"
  }
];

// Geometry problems
export const geometryProblems = [
  {
    problem: "Draw a triangle with vertices at (0,0), (3,0), and (0,4).",
    expected: "x"
  },
  {
    problem: "Plot the circle with equation x^2 + y^2 = 25.",
    expected: "x^2 + y^2 - 25"
  },
  {
    problem: "Visualize the polygon with vertices at (1,1), (4,2), (3,5), and (0,3).",
    expected: "x"
  },
  {
    problem: "Show the rectangle with opposite corners at (-2,-3) and (5,7).",
    expected: "x"
  },
  {
    problem: "Draw an ellipse with equation (x^2/16) + (y^2/9) = 1.",
    expected: "(x^2/16) + (y^2/9) - 1"
  }
];

// Edge cases
export const edgeCaseProblems = [
  {
    problem: "Visualize x.", // Simplest expression
    expected: "x"
  },
  {
    problem: "What is a good example of a mathematical function?", // No clear expression
    expected: "x"
  },
  {
    problem: "Graph the function that represents the relationship between time and distance.", // Vague description
    expected: "x"
  },
  {
    problem: "", // Empty string
    expected: "x"
  },
  {
    problem: "Plot y = f(x) where f(x) = x^2 when x > 0 and f(x) = -x^2 when x ≤ 0.", // Piecewise function
    expected: "x^2"
  },
  {
    problem: "Graph y = (x^3 - 3x^2 + 2x)/(x-1).", // Expression with division
    expected: "(x^3 - 3x^2 + 2x)/(x-1)"
  },
  {
    problem: "Visualize the function f(x) = |x - 3| + 2.", // Absolute value
    expected: "|x - 3| + 2"
  }
];

// Complex function expressions
export const complexFunctionProblems = [
  {
    problem: "Graph the function f(x) = sin(x) * e^(-x/5) * cos(x/2).",
    expected: "sin(x) * e^(-x/5) * cos(x/2)"
  },
  {
    problem: "Plot the rational function y = (x^3 - 4x^2 + 5x - 2) / (x^2 - 3x + 2).",
    expected: "(x^3 - 4x^2 + 5x - 2) / (x^2 - 3x + 2)"
  },
  {
    problem: "Visualize the implicit curve defined by x^2 + y^2 - 2xy = 4.",
    expected: "x^2 + y^2 - 2xy - 4"
  },
  {
    problem: "Show the function f(x) = sqrt(4 - x^2) for -2 ≤ x ≤ 2.",
    expected: "sqrt(4 - x^2)"
  },
  {
    problem: "Graph the hyperbolic function f(x) = sinh(x) + cosh(x).",
    expected: "sinh(x) + cosh(x)"
  }
];

// System of equations
export const systemProblems = [
  {
    problem: "Graph the system of equations: y = 2x + 1 and y = -x + 4.",
    expected: "2x + 1"
  },
  {
    problem: "Visualize the solution to the system: 3x - 2y = 6 and x + 4y = 8.",
    expected: "3x - 2y - 6"
  },
  {
    problem: "Plot the intersection of y = x^2 and y = 2x + 3.",
    expected: "x^2"
  }
];

// Problems with domain/range specifications
export const domainRangeProblems = [
  {
    problem: "Graph f(x) = x^3 - 3x in the domain [-2, 2] and range [-5, 5].",
    expected: "x^3 - 3x"
  },
  {
    problem: "Plot the function y = log(x) with x from 0.1 to 10.",
    expected: "log(x)"
  },
  {
    problem: "Visualize the function f(x) = tan(x) in the interval [-π/2, π/2].",
    expected: "tan(x)"
  }
];

// 3D Function problems
export const function3DProblems = [
  {
    problem: "Graph the 3D function f(x,y) = x^2 + y^2.",
    expected: "x^2 + y^2"
  },
  {
    problem: "Visualize the surface z = sin(x) * cos(y).",
    expected: "sin(x) * cos(y)"
  },
  {
    problem: "Plot the 3D function f(x,y) = sqrt(x^2 + y^2).",
    expected: "sqrt(x^2 + y^2)"
  }
];

// All combined for comprehensive testing
export const allProblems = [
  ...basicFunctionProblems,
  ...calculusProblems,
  ...geometryProblems,
  ...edgeCaseProblems,
  ...complexFunctionProblems,
  ...systemProblems,
  ...domainRangeProblems,
  ...function3DProblems
];