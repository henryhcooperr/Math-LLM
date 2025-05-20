/**
 * Mafs Templates
 * Template code for generating Mafs visualizations for different types of
 * mathematical concepts in React.
 */

/**
 * Templates organized by concept type
 */
export const mafsTemplates = {
  /**
   * Default template used when a specific one isn't available
   */
  default: `import React from 'react';
import { Mafs, Coordinates, Plot, Theme } from 'mafs';
import 'mafs/core.css';

/**
 * Mathematical Visualization Component
 * ${educational.title}
 * 
 * ${educational.summary}
 */
export function MathVisualization({ 
  width = '100%', 
  height = 400,
  expression = '${concept.expression}',
  domain = ${parameters.domain},
  range = ${parameters.range},
  showGrid = true,
  showAxes = true
}) {
  // Interpret the mathematical expression
  const fn = (x) => {
    try {
      // Parse the expression into a function
      return evaluateExpression(expression, x);
    } catch (error) {
      console.error('Error evaluating expression:', error);
      return 0;
    }
  };

  return (
    <div style={{ width, height }}>
      <Mafs
        viewBox={{ x: domain, y: range }}
        preserveAspectRatio={false}
      >
        {showAxes && <Coordinates.Cartesian />}
        
        <Plot.OfX y={fn} color={Theme.blue} />
      </Mafs>
    </div>
  );
}

/**
 * Safely evaluate a mathematical expression
 * @param {string} expression - The mathematical expression as a string
 * @param {number} x - The x value
 * @returns {number} - The evaluated result
 */
function evaluateExpression(expression, x) {
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
    const fn = new Function('x', \`return \${preparedExpression};\`);
    
    // Evaluate the function
    return fn(x);
  } catch (e) {
    console.error('Error evaluating expression:', e);
    return 0;
  }
}`,

  /**
   * Template for 2D function visualizations
   */
  function2D: `import React from 'react';
import { Mafs, Coordinates, Plot, Theme } from 'mafs';
import 'mafs/core.css';

/**
 * 2D Function Visualization Component
 * ${educational.title}
 * 
 * ${educational.summary}
 */
export function MathVisualization({ 
  width = '100%', 
  height = 400,
  expression = '${concept.expression}',
  domain = ${parameters.domain},
  range = ${parameters.range},
  showGrid = true,
  showAxes = true,
  color = '${parameters.functions[0].color}'
}) {
  // Interpret the mathematical expression
  const fn = (x) => {
    try {
      // Parse the expression into a function
      return evaluateExpression(expression, x);
    } catch (error) {
      console.error('Error evaluating expression:', error);
      return 0;
    }
  };

  return (
    <div style={{ width, height }}>
      <Mafs
        viewBox={{ x: domain, y: range }}
        preserveAspectRatio={false}
      >
        {showAxes && <Coordinates.Cartesian />}
        
        <Plot.OfX y={fn} color={color || Theme.blue} />
      </Mafs>
    </div>
  );
}

/**
 * Safely evaluate a mathematical expression
 * @param {string} expression - The mathematical expression as a string
 * @param {number} x - The x value
 * @returns {number} - The evaluated result
 */
function evaluateExpression(expression, x) {
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
    const fn = new Function('x', \`return \${preparedExpression};\`);
    
    // Evaluate the function
    return fn(x);
  } catch (e) {
    console.error('Error evaluating expression:', e);
    return 0;
  }
}`,

  /**
   * Template for parametric curve visualizations
   */
  parametric: `import React from 'react';
import { Mafs, Coordinates, Plot, Theme } from 'mafs';
import 'mafs/core.css';

/**
 * Parametric Curve Visualization Component
 * ${educational.title}
 * 
 * ${educational.summary}
 */
export function MathVisualization({ 
  width = '100%', 
  height = 400,
  expression = '${concept.expression}',
  domain = ${parameters.domain},
  range = ${parameters.range},
  tRange = [0, 2 * Math.PI],
  showGrid = true,
  showAxes = true,
  color = '${parameters.functions[0].color}'
}) {
  // Interpret the parametric expression
  // The expression should return [x(t), y(t)]
  const parametricFn = (t) => {
    try {
      // Parse the expression into a function
      return evaluateParametricExpression(expression, t);
    } catch (error) {
      console.error('Error evaluating parametric expression:', error);
      return [0, 0];
    }
  };

  return (
    <div style={{ width, height }}>
      <Mafs
        viewBox={{ x: domain, y: range }}
        preserveAspectRatio={false}
      >
        {showAxes && <Coordinates.Cartesian />}
        
        <Plot.Parametric 
          t={tRange} 
          xy={parametricFn} 
          color={color || Theme.red} 
        />
      </Mafs>
    </div>
  );
}

/**
 * Safely evaluate a parametric expression
 * @param {string} expression - The parametric expression as a string
 * @param {number} t - The parameter value
 * @returns {Array} - The [x, y] coordinates
 */
function evaluateParametricExpression(expression, t) {
  try {
    // By default, use a circle if no expression is provided or there's an error
    if (!expression) {
      return [Math.cos(t), Math.sin(t)];
    }
    
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
    const fn = new Function('t', \`return \${preparedExpression};\`);
    
    // Evaluate the function
    return fn(t);
  } catch (e) {
    console.error('Error evaluating parametric expression:', e);
    return [Math.cos(t), Math.sin(t)]; // Default to a circle
  }
}`,

  /**
   * Template for point visualizations
   */
  points: `import React from 'react';
import { Mafs, Coordinates, Point, Theme } from 'mafs';
import 'mafs/core.css';

/**
 * Points Visualization Component
 * ${educational.title}
 * 
 * ${educational.summary}
 */
export function MathVisualization({ 
  width = '100%', 
  height = 400,
  points = ${parameters.points},
  domain = ${parameters.domain},
  range = ${parameters.range},
  showGrid = true,
  showAxes = true
}) {
  return (
    <div style={{ width, height }}>
      <Mafs
        viewBox={{ x: domain, y: range }}
        preserveAspectRatio={false}
      >
        {showAxes && <Coordinates.Cartesian />}
        
        {/* Render each point */}
        {points.map((point, index) => (
          <Point 
            key={\`point-\${index}\`}
            x={point.coordinates[0]} 
            y={point.coordinates[1]} 
            color={point.color || Theme.blue}
          >
            {point.label}
          </Point>
        ))}
      </Mafs>
    </div>
  );
}`
};