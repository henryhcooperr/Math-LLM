import React, { useState, useEffect } from 'react';
import VisualizationWrapper from '../components/VisualizationWrapper';
import { generateFormattedPrompt, extractStructuredResponse } from '../utils/llmResponseProcessor';
import { createStandardResponse } from '../utils/responseFormatter';
import './App.css';

// Example responses for different mathematical concepts
const DEMO_RESPONSES = {
  'quadratic': {
    explanation: "A quadratic function is a second-degree polynomial function of the form f(x) = ax² + bx + c, where a, b, and c are constants and a ≠ 0. The graph of a quadratic function is a parabola. When a > 0, the parabola opens upward, and when a < 0, it opens downward. The graph of f(x) = x² - 3x + 2 crosses the x-axis at x = 1 and x = 2 (these are the roots or zeros of the function) and has a vertex at (1.5, -0.25), which is the minimum point of this particular parabola.",
    visualizationParams: {
      type: "function2D",
      title: "Quadratic Function: f(x) = x² - 3x + 2",
      expression: "Math.pow(x, 2) - 3*x + 2",
      domain: [-2, 4],
      range: [-1, 5],
      gridLines: true,
      specialPoints: [
        {x: 1, y: 0, label: "Root at x=1"},
        {x: 2, y: 0, label: "Root at x=2"},
        {x: 1.5, y: -0.25, label: "Vertex (1.5, -0.25)"}
      ],
      recommendedLibrary: "mafs"
    },
    educationalContent: {
      title: "Understanding Quadratic Functions",
      summary: "Quadratic functions are second-degree polynomial functions that create parabolas when graphed. They have many applications in physics, engineering, and optimization problems.",
      steps: [
        {
          title: "Identifying the Parabola's Direction",
          content: "The coefficient 'a' in front of x² determines whether the parabola opens upward (a > 0) or downward (a < 0). In our example, a = 1, so the parabola opens upward."
        },
        {
          title: "Finding the Vertex",
          content: "The vertex of a parabola occurs at x = -b/(2a). For f(x) = x² - 3x + 2, a = 1 and b = -3, so the x-coordinate is -(-3)/(2*1) = 3/2 = 1.5. Substituting back, we get y = (1.5)² - 3(1.5) + 2 = 2.25 - 4.5 + 2 = -0.25. Thus, the vertex is at (1.5, -0.25)."
        },
        {
          title: "Determining x-intercepts (Roots)",
          content: "The x-intercepts occur where f(x) = 0. For our function, x² - 3x + 2 = 0, we can factor this as (x - 1)(x - 2) = 0, giving us roots at x = 1 and x = 2."
        }
      ],
      keyInsights: [
        "The graph of a quadratic function is always a parabola",
        "The vertex is the minimum point when a > 0 and the maximum point when a < 0",
        "The discriminant b² - 4ac determines the number of real roots: positive gives 2 real roots, zero gives 1 real root, negative gives 0 real roots",
        "Every quadratic function can be written in vertex form: f(x) = a(x - h)² + k, where (h, k) is the vertex"
      ],
      exercises: [
        {
          question: "Find the vertex and roots of the quadratic function f(x) = 2x² + 4x - 6",
          solution: "Vertex: x = -b/(2a) = -4/(2*2) = -1; y = 2(-1)² + 4(-1) - 6 = 2 - 4 - 6 = -8, so vertex is at (-1, -8). For roots, solve 2x² + 4x - 6 = 0 using the quadratic formula: x = (-4 ± √(16 + 48))/4 = (-4 ± √64)/4 = (-4 ± 8)/4, giving x = 1 and x = -3."
        },
        {
          question: "How would the graph of f(x) = x² - 3x + 2 change if it were changed to g(x) = -x² + 3x - 2?",
          solution: "This would reflect the parabola across the x-axis, so it would open downward instead of upward. The vertex would become a maximum point instead of a minimum, and the roots would remain at x = 1 and x = 2."
        }
      ]
    },
    followUpQuestions: [
      "How do you convert a quadratic function from standard form to vertex form?",
      "What real-world scenarios can be modeled using quadratic functions?",
      "How does the discriminant help predict the nature of a quadratic equation's solutions?"
    ]
  },
  'sine': {
    explanation: "The sine function is one of the fundamental trigonometric functions that relates the angles of a right triangle to the ratio of the length of the opposite side to the hypotenuse. In a more general context, sine is a periodic function with period 2π that oscillates between -1 and 1. The graph of y = sin(x) crosses the x-axis at x = 0, π, 2π, etc., reaches its maximum value of 1 at x = π/2 + 2nπ, and its minimum value of -1 at x = 3π/2 + 2nπ, where n is any integer.",
    visualizationParams: {
      type: "function2D",
      title: "Sine Function: y = sin(x)",
      expression: "Math.sin(x)",
      domain: [-Math.PI * 2, Math.PI * 2],
      range: [-1.5, 1.5],
      gridLines: true,
      xTicks: [
        {value: -Math.PI * 2, label: "-2π"},
        {value: -Math.PI, label: "-π"},
        {value: 0, label: "0"},
        {value: Math.PI, label: "π"},
        {value: Math.PI * 2, label: "2π"}
      ],
      specialPoints: [
        {x: 0, y: 0, label: "Origin"},
        {x: Math.PI/2, y: 1, label: "Maximum at π/2"},
        {x: Math.PI, y: 0, label: "Zero at π"},
        {x: 3*Math.PI/2, y: -1, label: "Minimum at 3π/2"}
      ],
      recommendedLibrary: "mafs"
    },
    educationalContent: {
      title: "Understanding the Sine Function",
      summary: "The sine function is a fundamental periodic function in mathematics with applications in physics, engineering, signal processing, and many other fields. It oscillates smoothly between -1 and 1 with a period of 2π.",
      steps: [
        {
          title: "Defining Sine in the Unit Circle",
          content: "In the unit circle (a circle of radius 1 centered at the origin), the sine of an angle θ is the y-coordinate of the point where the terminal side of the angle intersects the unit circle."
        },
        {
          title: "Key Features of the Sine Function",
          content: "Period: 2π (the function repeats every 2π units). Range: [-1, 1] (the function values are always between -1 and 1, inclusive). Domain: All real numbers (sine is defined for any angle)."
        },
        {
          title: "Important Values",
          content: "sin(0) = 0, sin(π/6) = 0.5, sin(π/4) = √2/2 ≈ 0.707, sin(π/3) = √3/2 ≈ 0.866, sin(π/2) = 1, sin(π) = 0, sin(3π/2) = -1."
        }
      ],
      keyInsights: [
        "The sine function is odd, meaning sin(-x) = -sin(x) for all x",
        "The derivative of sin(x) is cos(x)",
        "The sine function can be defined by its Taylor series: sin(x) = x - x³/3! + x⁵/5! - ...",
        "Sine waves are fundamental in describing oscillatory motion and wave phenomena"
      ],
      exercises: [
        {
          question: "Find all solutions to the equation sin(x) = 0.5 in the interval [0, 2π]",
          solution: "We need to find where sin(x) = 0.5. This occurs at x = π/6 and x = 5π/6 within the interval [0, 2π]. We can verify this: sin(π/6) = 0.5 and sin(5π/6) = sin(π - π/6) = sin(π/6) = 0.5."
        },
        {
          question: "Describe the graph of y = 2sin(3x)",
          solution: "This function has amplitude 2 (the coefficient of sin), so it oscillates between -2 and 2. The period is 2π/3 (the original period 2π divided by 3), so it completes three full cycles in the interval [0, 2π]."
        }
      ]
    },
    followUpQuestions: [
      "How are sine and cosine functions related to each other?",
      "What happens when you change the amplitude and frequency of a sine function?",
      "How is the sine function used in physics to model wave phenomena?"
    ]
  },
  'derivative': {
    explanation: "The derivative of a function represents the rate of change of the function with respect to its variable. Geometrically, it gives the slope of the tangent line to the function at any given point. For the function f(x) = x², the derivative is f'(x) = 2x. This means that at any point x, the slope of the tangent line to the parabola y = x² is 2x. For example, at x = 1, the slope is 2, at x = 2, the slope is 4, and at x = 0, the slope is 0 (which corresponds to the horizontal tangent line at the vertex of the parabola).",
    visualizationParams: {
      type: "calculus",
      subtype: "derivative",
      title: "Derivative of f(x) = x²",
      function: {
        expression: "Math.pow(x, 2)",
        color: "#3090FF"
      },
      derivative: {
        expression: "2*x",
        color: "#FF5733",
        showTangent: true,
        tangentPoint: 1.5
      },
      domain: [-3, 3],
      range: [-1, 9],
      recommendedLibrary: "mafs"
    },
    educationalContent: {
      title: "Understanding Derivatives",
      summary: "Derivatives are a fundamental concept in calculus that quantify how a function changes as its input changes. They have applications in physics, economics, engineering, and many other fields.",
      steps: [
        {
          title: "Definition of the Derivative",
          content: "The derivative of a function f(x) is defined as the limit of the difference quotient as h approaches zero: f'(x) = lim_{h→0} [f(x+h) - f(x)]/h. This represents the instantaneous rate of change of f at x."
        },
        {
          title: "Geometric Interpretation",
          content: "The derivative f'(x) gives the slope of the tangent line to the graph of f at the point (x, f(x)). For f(x) = x², the derivative is f'(x) = 2x, so the slope at any point x is 2x."
        },
        {
          title: "Finding Derivatives Using Rules",
          content: "For f(x) = x², we can use the power rule: d/dx(x^n) = n*x^(n-1). With n = 2, we get f'(x) = 2x."
        }
      ],
      keyInsights: [
        "The derivative of a constant function is zero",
        "The derivative of the sum of functions is the sum of their derivatives",
        "Critical points occur where the derivative equals zero or is undefined",
        "The second derivative reveals information about concavity and inflection points"
      ],
      exercises: [
        {
          question: "Find the derivative of f(x) = 3x³ - 2x² + 5x - 7",
          solution: "Using the power rule and linearity of the derivative: f'(x) = 3(3x²) - 2(2x) + 5(1) - 0 = 9x² - 4x + 5."
        },
        {
          question: "Find the equation of the tangent line to the curve y = x² at the point (2, 4)",
          solution: "The derivative is f'(x) = 2x, so at x = 2, the slope is f'(2) = 4. The equation of the tangent line is y - 4 = 4(x - 2), which simplifies to y = 4x - 4."
        }
      ]
    },
    followUpQuestions: [
      "How do you find derivatives of more complex functions like products, quotients, and compositions?",
      "What is the relationship between derivatives and optimization problems?",
      "How are derivatives used in physics to describe motion?"
    ]
  },
  'vectors': {
    explanation: "Vectors are mathematical objects that have both magnitude (length) and direction. They are commonly represented as arrows in space, where the length of the arrow corresponds to the vector's magnitude and the direction the arrow points indicates the vector's direction. A vector field assigns a vector to each point in a region of space. In a 2D vector field, each point (x, y) in the plane has an associated vector. The vector field shown here is the rotational field (y, -x), which assigns to each point (x, y) the vector (y, -x). This creates a circular pattern where vectors point perpendicular to the line from the origin to the point, causing a counterclockwise rotation around the origin.",
    visualizationParams: {
      type: "vectorField",
      title: "2D Rotational Vector Field: F(x,y) = (y, -x)",
      dimensionality: "2D",
      expressions: {
        x: "y",
        y: "-x"
      },
      domain: [-3, 3],
      range: [-3, 3],
      density: 12,
      normalize: false,
      color: "#3090FF",
      recommendedLibrary: "mafs"
    },
    educationalContent: {
      title: "Understanding Vector Fields",
      summary: "Vector fields assign a vector to each point in space, creating a visualization of how force, velocity, or other vector quantities vary throughout a region. They are essential in physics, engineering, and many areas of advanced mathematics.",
      steps: [
        {
          title: "Definition of a Vector Field",
          content: "A vector field F on ℝ² assigns a two-dimensional vector F(x,y) to each point (x,y) in a region. The vector field F(x,y) = (y, -x) assigns the vector (y, -x) to the point (x,y)."
        },
        {
          title: "Properties of the Rotational Field",
          content: "The vector field F(x,y) = (y, -x) is a rotational or circular field. At each point, the vector is perpendicular to the position vector from the origin to that point, pointing in a counterclockwise direction."
        },
        {
          title: "Mathematical Characteristics",
          content: "This vector field is conservative (curl-free) and has zero divergence, making it incompressible. The magnitude of the vector at point (x,y) is √(x² + y²), which equals the distance from the origin."
        }
      ],
      keyInsights: [
        "Vector fields can represent physical quantities like force, velocity, or electromagnetic fields",
        "The curl of a vector field measures its rotational tendency",
        "The divergence measures how much the field 'sources' or 'sinks' at a point",
        "Conservative fields can be expressed as the gradient of a scalar potential function"
      ],
      exercises: [
        {
          question: "Calculate the curl of the vector field F(x,y) = (y, -x)",
          solution: "The curl in 2D is calculated as ∂F₂/∂x - ∂F₁/∂y = ∂(-x)/∂x - ∂y/∂y = -1 - 1 = -2. This non-zero curl confirms the rotational nature of the field."
        },
        {
          question: "Find the vector assigned by this field to the point (3, 4)",
          solution: "F(3,4) = (4, -3). The magnitude of this vector is √(4² + (-3)²) = √(16 + 9) = √25 = 5, which is equal to the distance from the origin to the point (3,4)."
        }
      ]
    },
    followUpQuestions: [
      "How do vector fields relate to fluid flow and electromagnetic fields?",
      "What is the significance of divergence and curl in vector field analysis?",
      "How can line integrals be used to calculate work done by a force field?"
    ]
  },
  'integral': {
    explanation: "The definite integral of a function f(x) from a to b represents the signed area between the function and the x-axis over the interval [a, b]. For the function f(x) = x², the integral from 0 to 2 is ∫₀² x² dx = [x³/3]₀² = 8/3 - 0 = 8/3 ≈ 2.67. This represents the area between the parabola y = x² and the x-axis, from x = 0 to x = 2. The integral can be approximated using numerical methods like the rectangle method shown in the visualization, where the area is divided into smaller rectangles whose areas can be easily calculated and summed.",
    visualizationParams: {
      type: "calculus",
      subtype: "integral",
      title: "Definite Integral of f(x) = x²",
      function: {
        expression: "Math.pow(x, 2)",
        color: "#3090FF"
      },
      integral: {
        lowerBound: 0,
        upperBound: 2,
        color: "#FF9030",
        fillOpacity: 0.3,
        approximation: {
          method: "rectangles",
          count: 10,
          show: true
        }
      },
      domain: [-0.5, 2.5],
      range: [-0.5, 4.5],
      recommendedLibrary: "mafs"
    },
    educationalContent: {
      title: "Understanding Definite Integrals",
      summary: "Definite integrals are a fundamental concept in calculus that calculate the signed area between a function and the x-axis over a specific interval. They have applications in physics, engineering, economics, and many other fields.",
      steps: [
        {
          title: "Definition of the Definite Integral",
          content: "The definite integral of a function f(x) from a to b is defined as the limit of a Riemann sum: ∫ₐᵇ f(x) dx = lim_{n→∞} Σᵢ₌₁ⁿ f(xᵢ*)Δx, where Δx = (b-a)/n and xᵢ* is a point in the i-th subinterval."
        },
        {
          title: "Geometric Interpretation",
          content: "The definite integral gives the signed area between the function and the x-axis over the interval [a, b]. For f(x) = x², the integral from 0 to 2 represents the area under the parabola from x = 0 to x = 2."
        },
        {
          title: "Computing Using the Fundamental Theorem of Calculus",
          content: "To evaluate ∫₀² x² dx, we find the antiderivative F(x) = x³/3, then compute F(2) - F(0) = 8/3 - 0 = 8/3 ≈ 2.67."
        }
      ],
      keyInsights: [
        "The Fundamental Theorem of Calculus connects differentiation and integration",
        "Definite integrals can represent physical quantities like distance, area, volume, and work",
        "Numerical methods like the rectangle method, trapezoidal rule, and Simpson's rule can approximate definite integrals",
        "An integral where the lower and upper bounds are the same equals zero"
      ],
      exercises: [
        {
          question: "Find the definite integral ∫₁³ (2x + 3) dx",
          solution: "First, find the antiderivative: F(x) = x² + 3x. Then, evaluate F(3) - F(1) = (9 + 9) - (1 + 3) = 18 - 4 = 14."
        },
        {
          question: "What is the area between the curve y = x³ and the x-axis from x = 0 to x = 2?",
          solution: "The area is given by the definite integral ∫₀² x³ dx = [x⁴/4]₀² = 2⁴/4 - 0 = 16/4 = 4."
        }
      ]
    },
    followUpQuestions: [
      "How are definite integrals related to the concept of work in physics?",
      "What is the difference between a definite and an indefinite integral?",
      "How can we interpret negative areas in definite integrals?"
    ]
  },
  'parametric': {
    explanation: "A parametric curve is defined by a set of equations where the coordinates are functions of a parameter, typically denoted as t. The circle shown is defined parametrically by the equations x(t) = 2cos(t) and y(t) = 2sin(t), where t varies from 0 to 2π. This representation describes a circle of radius 2 centered at the origin. As the parameter t increases from 0 to 2π, the point (x(t), y(t)) traces the circle in a counterclockwise direction, starting and ending at the point (2, 0) when t = 0 or t = 2π.",
    visualizationParams: {
      type: "parametric2D",
      title: "Parametric Circle: (2cos(t), 2sin(t))",
      parameterName: "t",
      parameterRange: [0, 2 * Math.PI],
      expressions: {
        x: "2 * Math.cos(t)",
        y: "2 * Math.sin(t)"
      },
      domain: [-3, 3],
      range: [-3, 3],
      specialPoints: [
        {t: 0, label: "t = 0"},
        {t: Math.PI/2, label: "t = π/2"},
        {t: Math.PI, label: "t = π"},
        {t: 3*Math.PI/2, label: "t = 3π/2"}
      ],
      showParameter: true,
      recommendedLibrary: "mafs"
    },
    educationalContent: {
      title: "Understanding Parametric Curves",
      summary: "Parametric equations represent curves by expressing the coordinates as functions of a parameter. This approach allows for a more natural description of many curves and motions that would be difficult to represent with a single function y = f(x).",
      steps: [
        {
          title: "Definition of Parametric Equations",
          content: "A parametric curve in the plane is defined by equations x = f(t) and y = g(t), where t is the parameter. As t varies through its domain, the point (f(t), g(t)) traces the curve."
        },
        {
          title: "Parametric Representation of a Circle",
          content: "The equations x = 2cos(t) and y = 2sin(t) for t ∈ [0, 2π] define a circle of radius 2 centered at the origin. This follows from the Pythagorean identity cos²(t) + sin²(t) = 1, which means (x/2)² + (y/2)² = 1, or x² + y² = 4."
        },
        {
          title: "Tracing the Curve",
          content: "As t increases, the point (2cos(t), 2sin(t)) moves counterclockwise around the circle. At t = 0, the point is at (2, 0); at t = π/2, it's at (0, 2); at t = π, it's at (-2, 0); and at t = 3π/2, it's at (0, -2)."
        }
      ],
      keyInsights: [
        "Parametric equations can represent curves that are not functions, like circles",
        "The same curve can have different parametric representations",
        "The parameter t often represents time in physical applications",
        "Parametric equations are useful for describing motion along a curve"
      ],
      exercises: [
        {
          question: "Convert the parametric equations x = 3t + 1, y = t² into a Cartesian equation (i.e., find y in terms of x)",
          solution: "From x = 3t + 1, we get t = (x - 1)/3. Substituting into y = t², we get y = ((x - 1)/3)² = (x - 1)²/9. This is a parabola."
        },
        {
          question: "Find a parametric representation for the ellipse x²/a² + y²/b² = 1",
          solution: "A standard parametric representation is x = a·cos(t) and y = b·sin(t) for t ∈ [0, 2π]. This satisfies the ellipse equation because (a·cos(t))²/a² + (b·sin(t))²/b² = cos²(t) + sin²(t) = 1."
        }
      ]
    },
    followUpQuestions: [
      "How do you find the tangent line to a parametric curve?",
      "What are some examples of curves that are best described parametrically?",
      "How are parametric equations used in computer graphics and animation?"
    ]
  }
};

// Main App component
function App() {
  const [query, setQuery] = useState('');
  const [selectedDemo, setSelectedDemo] = useState('quadratic');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Load demo response when the selected demo changes
  useEffect(() => {
    setResponseData(DEMO_RESPONSES[selectedDemo]);
  }, [selectedDemo]);
  
  // Handle form submission - in a real app, this would call an LLM API
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      // In a real application, we would call the LLM API here
      // const prompt = generateFormattedPrompt(query);
      // const response = await fetchLLMResponse(prompt);
      // const structuredResponse = extractStructuredResponse(response);
      
      // For demo purposes, just use the quadratic example
      setResponseData(DEMO_RESPONSES[selectedDemo]);
      setLoading(false);
    }, 1000);
  };
  
  // Handle demo selection change
  const handleDemoChange = (e) => {
    setSelectedDemo(e.target.value);
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Math-LLM: Interactive Mathematical Visualization System</h1>
        <p>Explore mathematical concepts through interactive visualizations</p>
      </header>
      
      <main className="app-main">
        <section className="query-section">
          <h2>Ask a Mathematical Question</h2>
          <form onSubmit={handleSubmit} className="query-form">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a mathematical question or concept..."
              className="query-input"
            />
            <button type="submit" className="query-button" disabled={loading}>
              {loading ? 'Processing...' : 'Visualize'}
            </button>
          </form>
          
          <div className="demo-selector">
            <h3>Or explore a demo:</h3>
            <select value={selectedDemo} onChange={handleDemoChange} className="demo-select">
              <option value="quadratic">Quadratic Function</option>
              <option value="sine">Sine Function</option>
              <option value="derivative">Derivatives</option>
              <option value="vectors">Vector Fields</option>
              <option value="integral">Definite Integrals</option>
              <option value="parametric">Parametric Curves</option>
            </select>
          </div>
        </section>
        
        {responseData && (
          <>
            <section className="visualization-section">
              <h2>{responseData.visualizationParams.title}</h2>
              <div className="visualization-container">
                <VisualizationWrapper
                  {...responseData.visualizationParams}
                  width="100%"
                  height={400}
                />
              </div>
            </section>
            
            <section className="explanation-section">
              <h2>Explanation</h2>
              <p className="explanation-text">{responseData.explanation}</p>
            </section>
            
            <section className="educational-content-section">
              <h2>{responseData.educationalContent.title}</h2>
              
              <div className="summary-section">
                <h3>Summary</h3>
                <p>{responseData.educationalContent.summary}</p>
              </div>
              
              <div className="steps-section">
                <h3>Step-by-Step Guide</h3>
                <div className="steps-container">
                  {responseData.educationalContent.steps.map((step, index) => (
                    <div key={index} className="step-item">
                      <h4>{step.title}</h4>
                      <p>{step.content}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="insights-section">
                <h3>Key Insights</h3>
                <ul className="insights-list">
                  {responseData.educationalContent.keyInsights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
              
              <div className="exercises-section">
                <h3>Practice Exercises</h3>
                <div className="exercises-container">
                  {responseData.educationalContent.exercises.map((exercise, index) => (
                    <div key={index} className="exercise-item">
                      <h4>Exercise {index + 1}</h4>
                      <p className="exercise-question">{exercise.question}</p>
                      <div className="exercise-solution">
                        <h5>Solution</h5>
                        <p>{exercise.solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            
            <section className="follow-up-section">
              <h3>Explore Further</h3>
              <ul className="follow-up-list">
                {responseData.followUpQuestions.map((question, index) => (
                  <li key={index} className="follow-up-item">
                    <button
                      className="follow-up-button"
                      onClick={() => setQuery(question)}
                    >
                      {question}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Math-LLM: Combining the power of Large Language Models with interactive mathematical visualizations</p>
      </footer>
    </div>
  );
}

export default App;