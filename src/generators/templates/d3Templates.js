/**
 * D3.js Templates
 * Template code for generating D3.js visualizations for different types of
 * mathematical concepts.
 */

/**
 * Templates organized by concept type
 */
export const d3Templates = {
  /**
   * Default template used when a specific one isn't available
   */
  default: `/**
 * D3.js Visualization
 * ${educational.title}
 * 
 * ${educational.summary}
 */

// Create an SVG container for the visualization
function createVisualization(containerId) {
  // Get the container dimensions
  const container = document.getElementById(containerId);
  if (!container) return null;
  
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 400;
  
  // Set up margins
  const margin = { top: 40, right: 40, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Create the SVG element
  const svg = d3.select('#' + containerId)
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // Create a group for the visualization with margins applied
  const g = svg.append('g')
    .attr('transform', \`translate(\${margin.left}, \${margin.top})\`);
  
  // Create scales for x and y axes
  const xScale = d3.scaleLinear()
    .domain(${parameters.domain})
    .range([0, innerWidth]);
  
  const yScale = d3.scaleLinear()
    .domain(${parameters.range})
    .range([innerHeight, 0]);
  
  // Add axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  // Add x-axis
  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', \`translate(0, \${innerHeight})\`)
    .call(xAxis);
  
  // Add y-axis
  g.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);
  
  // Add axis labels
  svg.append('text')
    .attr('class', 'x-label')
    .attr('text-anchor', 'middle')
    .attr('x', margin.left + innerWidth / 2)
    .attr('y', height - margin.bottom / 3)
    .text('x');
  
  svg.append('text')
    .attr('class', 'y-label')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr('x', -(margin.top + innerHeight / 2))
    .attr('y', margin.left / 3)
    .text('y');
  
  // Add visualization
  addVisualization(g, xScale, yScale, innerWidth, innerHeight);
  
  return svg.node();
}

// Add the main visualization elements
function addVisualization(g, xScale, yScale, width, height) {
  // Default visualization - we'll show a simple function
  try {
    // Generate data points for the function
    const data = [];
    const numPoints = 100;
    const step = (${parameters.domain[1]} - ${parameters.domain[0]}) / numPoints;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = ${parameters.domain[0]} + i * step;
      const y = evaluateExpression('${parameters.functions[0].expression}', x);
      data.push({ x, y });
    }
    
    // Create a line generator
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);
    
    // Add the line path
    g.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', '${parameters.functions[0].color}')
      .attr('stroke-width', 2)
      .attr('d', line);
    
    // Add a title
    g.append('text')
      .attr('class', 'title')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .text('${educational.title}');
  } catch (error) {
    console.error('Error creating D3 visualization:', error);
  }
}

// Safely evaluate a mathematical expression
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
   * Template for 2D function visualization
   */
  function2D: `/**
 * D3.js Function Visualization
 * ${educational.title}
 * 
 * ${educational.summary}
 */

// Create an SVG container for the visualization
function createVisualization(containerId) {
  // Get the container dimensions
  const container = document.getElementById(containerId);
  if (!container) return null;
  
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 400;
  
  // Set up margins
  const margin = { top: 40, right: 40, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Create the SVG element
  const svg = d3.select('#' + containerId)
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // Create a group for the visualization with margins applied
  const g = svg.append('g')
    .attr('transform', \`translate(\${margin.left}, \${margin.top})\`);
  
  // Create scales for x and y axes
  const xScale = d3.scaleLinear()
    .domain(${parameters.domain})
    .range([0, innerWidth]);
  
  const yScale = d3.scaleLinear()
    .domain(${parameters.range})
    .range([innerHeight, 0]);
  
  // Add axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  // Add x-axis
  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', \`translate(0, \${yScale(0)})\`)
    .call(xAxis);
  
  // Add y-axis
  g.append('g')
    .attr('class', 'y-axis')
    .attr('transform', \`translate(\${xScale(0)}, 0)\`)
    .call(yAxis);
  
  // Add grid for better readability
  g.append('g')
    .attr('class', 'grid')
    .attr('transform', \`translate(0, \${innerHeight})\`)
    .call(d3.axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickFormat('')
    )
    .selectAll('line')
    .attr('stroke', '#e0e0e0');
  
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat('')
    )
    .selectAll('line')
    .attr('stroke', '#e0e0e0');
  
  // Add axis labels
  svg.append('text')
    .attr('class', 'x-label')
    .attr('text-anchor', 'middle')
    .attr('x', margin.left + innerWidth / 2)
    .attr('y', height - margin.bottom / 3)
    .text('x');
  
  svg.append('text')
    .attr('class', 'y-label')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr('x', -(margin.top + innerHeight / 2))
    .attr('y', margin.left / 3)
    .text('y');
  
  // Add function visualization
  addFunctionGraph(g, xScale, yScale, innerWidth, innerHeight);
  
  return svg.node();
}

// Add the function graph
function addFunctionGraph(g, xScale, yScale, width, height) {
  try {
    // Generate data points for the function
    const data = [];
    const numPoints = 200; // More points for smoother curve
    const step = (${parameters.domain[1]} - ${parameters.domain[0]}) / numPoints;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = ${parameters.domain[0]} + i * step;
      try {
        const y = evaluateExpression('${parameters.functions[0].expression}', x);
        // Only add points that are within the range and are finite
        if (!isNaN(y) && isFinite(y) && y >= ${parameters.range[0]} && y <= ${parameters.range[1]}) {
          data.push({ x, y });
        }
      } catch (e) {
        // Skip points where the function is undefined
      }
    }
    
    // Create a line generator
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);
    
    // Add the line path
    g.append('path')
      .datum(data)
      .attr('class', 'function-line')
      .attr('fill', 'none')
      .attr('stroke', '${parameters.functions[0].color}')
      .attr('stroke-width', 2)
      .attr('d', line);
    
    // Add key points (zeros, extrema) - this is a simplified approach
    // In a real implementation, we would use calculus to find these precisely
    findKeyPoints(data).forEach(point => {
      g.append('circle')
        .attr('cx', xScale(point.x))
        .attr('cy', yScale(point.y))
        .attr('r', 4)
        .attr('fill', point.type === 'zero' ? 'green' : 'red')
        .attr('stroke', 'white')
        .attr('stroke-width', 1);
      
      g.append('text')
        .attr('x', xScale(point.x) + 8)
        .attr('y', yScale(point.y) - 8)
        .attr('font-size', '12px')
        .text(point.type === 'zero' ? 'Zero' : 'Extremum');
    });
    
    // Add a title
    g.append('text')
      .attr('class', 'title')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .text('f(x) = ${parameters.functions[0].expression}');
      
    // Add a description below the graph
    g.append('text')
      .attr('class', 'description')
      .attr('x', width / 2)
      .attr('y', height + 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text('${educational.summary}');
  } catch (error) {
    console.error('Error creating function graph:', error);
    
    // Show error message
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', 'red')
      .text('Error: ' + error.message);
  }
}

// Find key points in the function (zeros and extrema)
function findKeyPoints(data) {
  if (!data || data.length < 3) return [];
  
  const keyPoints = [];
  
  // Find zeros (where y crosses the x-axis)
  for (let i = 1; i < data.length; i++) {
    if ((data[i-1].y <= 0 && data[i].y >= 0) || (data[i-1].y >= 0 && data[i].y <= 0)) {
      // Interpolate to find a better approximation of the zero
      const t = Math.abs(data[i-1].y) / (Math.abs(data[i-1].y) + Math.abs(data[i].y));
      const x = data[i-1].x + t * (data[i].x - data[i-1].x);
      keyPoints.push({ x, y: 0, type: 'zero' });
    }
  }
  
  // Find extrema (where derivative changes sign)
  for (let i = 1; i < data.length - 1; i++) {
    const derivative1 = (data[i].y - data[i-1].y) / (data[i].x - data[i-1].x);
    const derivative2 = (data[i+1].y - data[i].y) / (data[i+1].x - data[i].x);
    
    if ((derivative1 <= 0 && derivative2 >= 0) || (derivative1 >= 0 && derivative2 <= 0)) {
      keyPoints.push({ x: data[i].x, y: data[i].y, type: 'extremum' });
    }
  }
  
  // Limit to at most 5 key points to avoid cluttering
  return keyPoints.slice(0, 5);
}

// Safely evaluate a mathematical expression
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
    throw e;
  }
}`,

  /**
   * Template for statistical visualization
   */
  statistics: `/**
 * D3.js Statistical Visualization
 * ${educational.title}
 * 
 * ${educational.summary}
 */

// Create an SVG container for the visualization
function createVisualization(containerId) {
  // Get the container dimensions
  const container = document.getElementById(containerId);
  if (!container) return null;
  
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 400;
  
  // Set up margins
  const margin = { top: 40, right: 40, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Create the SVG element
  const svg = d3.select('#' + containerId)
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // Create a group for the visualization with margins applied
  const g = svg.append('g')
    .attr('transform', \`translate(\${margin.left}, \${margin.top})\`);
  
  // Create scales for x and y axes
  const xScale = d3.scaleLinear()
    .domain(${parameters.domain})
    .range([0, innerWidth]);
  
  const yScale = d3.scaleLinear()
    .domain([0, 0.5]) // Default for probability density
    .range([innerHeight, 0]);
  
  // Add axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  // Add x-axis
  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', \`translate(0, \${innerHeight})\`)
    .call(xAxis);
  
  // Add y-axis
  g.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);
  
  // Add axis labels
  svg.append('text')
    .attr('class', 'x-label')
    .attr('text-anchor', 'middle')
    .attr('x', margin.left + innerWidth / 2)
    .attr('y', height - margin.bottom / 3)
    .text('x');
  
  svg.append('text')
    .attr('class', 'y-label')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr('x', -(margin.top + innerHeight / 2))
    .attr('y', margin.left / 3)
    .text('Probability Density');
  
  // Add statistical visualization
  addStatisticalVisualization(g, xScale, yScale, innerWidth, innerHeight);
  
  return svg.node();
}

// Add the statistical visualization
function addStatisticalVisualization(g, xScale, yScale, width, height) {
  try {
    // Create a normal distribution as an example
    const mean = (${parameters.domain[0]} + ${parameters.domain[1]}) / 2;
    const stdDev = (${parameters.domain[1]} - ${parameters.domain[0]}) / 6; // So 3 std devs fit in the domain
    
    // Generate data points for the normal distribution
    const data = [];
    const numPoints = 100;
    const step = (${parameters.domain[1]} - ${parameters.domain[0]}) / numPoints;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = ${parameters.domain[0]} + i * step;
      const y = normalDistribution(x, mean, stdDev);
      data.push({ x, y });
    }
    
    // Create a line generator
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveBasis);
    
    // Add the line path
    g.append('path')
      .datum(data)
      .attr('class', 'distribution-line')
      .attr('fill', 'none')
      .attr('stroke', '${parameters.functions[0].color}')
      .attr('stroke-width', 2)
      .attr('d', line);
    
    // Add a shaded area under the curve
    g.append('path')
      .datum(data)
      .attr('class', 'distribution-area')
      .attr('fill', '${parameters.functions[0].color}')
      .attr('fill-opacity', 0.3)
      .attr('d', d3.area()
        .x(d => xScale(d.x))
        .y0(height)
        .y1(d => yScale(d.y))
        .curve(d3.curveBasis)
      );
    
    // Add mean line
    g.append('line')
      .attr('class', 'mean-line')
      .attr('x1', xScale(mean))
      .attr('x2', xScale(mean))
      .attr('y1', yScale(0))
      .attr('y2', yScale(normalDistribution(mean, mean, stdDev)))
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');
    
    // Add mean label
    g.append('text')
      .attr('class', 'mean-label')
      .attr('x', xScale(mean))
      .attr('y', yScale(normalDistribution(mean, mean, stdDev) / 2))
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text('μ = ' + mean.toFixed(2));
    
    // Add standard deviation range
    g.append('line')
      .attr('class', 'std-dev-line')
      .attr('x1', xScale(mean - stdDev))
      .attr('x2', xScale(mean + stdDev))
      .attr('y1', yScale(normalDistribution(mean, mean, stdDev) / 3))
      .attr('y2', yScale(normalDistribution(mean, mean, stdDev) / 3))
      .attr('stroke', 'green')
      .attr('stroke-width', 2);
    
    // Add std dev label
    g.append('text')
      .attr('class', 'std-dev-label')
      .attr('x', xScale(mean))
      .attr('y', yScale(normalDistribution(mean, mean, stdDev) / 3) - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text('σ = ' + stdDev.toFixed(2));
    
    // Add a title
    g.append('text')
      .attr('class', 'title')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .text('Normal Distribution');
      
    // Add a description below the graph
    g.append('text')
      .attr('class', 'description')
      .attr('x', width / 2)
      .attr('y', height + 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text('${educational.summary}');
  } catch (error) {
    console.error('Error creating statistical visualization:', error);
    
    // Show error message
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', 'red')
      .text('Error: ' + error.message);
  }
}

// Calculate normal distribution
function normalDistribution(x, mean, stdDev) {
  const factor = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return factor * Math.exp(exponent);
}`
};