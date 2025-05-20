/**
 * Mafs Renderer
 * Renders mathematical visualizations using the Mafs library
 */

import { evaluateExpression } from '../utilities/expressionParser';

/**
 * Render a visualization using Mafs
 * @param {Object} props - Visualization properties
 * @returns {HTMLElement} - The rendered visualization element
 */
export function render(props) {
  const { 
    type = 'function2D',
    expression = 'x',
    domain = [-10, 10],
    range = [-10, 10],
    functions = [],
    zRange,
    points = [],
    vectors = [],
    lines = []
  } = props;

  // Create container element
  const container = document.createElement('div');
  container.className = 'mafs-visualization';
  container.style.width = '100%';
  container.style.height = '400px';
  container.style.border = '1px solid #eee';
  container.style.borderRadius = '4px';
  container.style.backgroundColor = '#fff';
  
  // Display function info
  const mainExpr = functions.length > 0 ? functions[0].expression : expression;
  
  // Add function expression display
  const infoElement = document.createElement('div');
  infoElement.className = 'mafs-info';
  infoElement.style.margin = '10px 0';
  infoElement.style.padding = '10px';
  infoElement.style.backgroundColor = '#f5f5f5';
  infoElement.style.borderRadius = '4px';
  
  // Create formula display
  const formula = document.createElement('div');
  formula.innerHTML = `<strong>f(x) = ${escapeHtml(mainExpr)}</strong>`;
  infoElement.appendChild(formula);
  
  // Add domain and range info
  const domainRange = document.createElement('div');
  domainRange.innerHTML = `Domain: [${domain.join(', ')}], Range: [${range.join(', ')}]`;
  domainRange.style.fontSize = '0.9em';
  domainRange.style.color = '#666';
  infoElement.appendChild(domainRange);
  
  // Create canvas for visualization
  const canvas = document.createElement('div');
  canvas.style.width = '100%';
  canvas.style.height = '300px';
  canvas.style.backgroundColor = '#f9f9f9';
  canvas.style.display = 'flex';
  canvas.style.alignItems = 'center';
  canvas.style.justifyContent = 'center';
  
  // Add a message that in a real implementation, this would render using Mafs
  // For now, let's create a simple visualization by sampling points
  const plotPoints = [];
  const numPoints = 100;
  
  try {
    // Sample points across the domain
    for (let i = 0; i <= numPoints; i++) {
      const x = domain[0] + (i / numPoints) * (domain[1] - domain[0]);
      let y;
      
      try {
        // Use our improved evaluateExpression function
        y = evaluateExpression(mainExpr, x);
        
        // Only add points within the range
        if (y >= range[0] && y <= range[1]) {
          plotPoints.push({ x, y });
        }
      } catch (e) {
        console.error(`Error evaluating at x=${x}:`, e);
      }
    }
    
    // Draw simple SVG visualization
    const svgWidth = 400;
    const svgHeight = 300;
    const padding = 30;
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);
    svg.style.backgroundColor = '#f0f0f0';
    
    // Calculate scaling factors
    const xScale = (svgWidth - 2 * padding) / (domain[1] - domain[0]);
    const yScale = (svgHeight - 2 * padding) / (range[1] - range[0]);
    
    // Transform coordinates
    const transformX = x => padding + (x - domain[0]) * xScale;
    const transformY = y => svgHeight - padding - (y - range[0]) * yScale;
    
    // Draw axes
    // X-axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', padding);
    xAxis.setAttribute('y1', transformY(0));
    xAxis.setAttribute('x2', svgWidth - padding);
    xAxis.setAttribute('y2', transformY(0));
    xAxis.setAttribute('stroke', 'black');
    xAxis.setAttribute('stroke-width', '1');
    svg.appendChild(xAxis);
    
    // Y-axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', transformX(0));
    yAxis.setAttribute('y1', padding);
    yAxis.setAttribute('x2', transformX(0));
    yAxis.setAttribute('y2', svgHeight - padding);
    yAxis.setAttribute('stroke', 'black');
    yAxis.setAttribute('stroke-width', '1');
    svg.appendChild(yAxis);
    
    // Draw function curve
    if (plotPoints.length > 1) {
      // Create path data
      let pathData = `M ${transformX(plotPoints[0].x)} ${transformY(plotPoints[0].y)}`;
      
      for (let i = 1; i < plotPoints.length; i++) {
        pathData += ` L ${transformX(plotPoints[i].x)} ${transformY(plotPoints[i].y)}`;
      }
      
      // Create path element
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('stroke', '#3090FF');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('fill', 'none');
      svg.appendChild(path);
    } else {
      // Fallback message if no points could be plotted
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', svgWidth / 2);
      text.setAttribute('y', svgHeight / 2);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#666');
      text.textContent = 'Could not plot points for this function';
      svg.appendChild(text);
    }
    
    // Append SVG to canvas
    canvas.innerHTML = '';
    canvas.appendChild(svg);
    
    // Add function information below the graph
    const info = document.createElement('div');
    info.style.textAlign = 'center';
    info.style.marginTop = '10px';
    info.innerHTML = `
      <div style="font-weight: bold;">f(x) = ${escapeHtml(mainExpr)}</div>
      <div style="color: #999; font-size: 0.9em; margin-top: 5px;">Domain: [${domain.join(', ')}], Range: [${range.join(', ')}]</div>
    `;
    canvas.appendChild(info);
    
  } catch (e) {
    console.error('Error creating visualization:', e);
    
    // Fallback simple message
    canvas.innerHTML = `
      <div style="text-align: center;">
        <div style="font-weight: bold; margin-bottom: 10px;">f(x) = ${escapeHtml(mainExpr)}</div>
        <div style="color: #666;">Error rendering visualization: ${e.message}</div>
        <div style="color: #999; font-size: 0.9em; margin-top: 20px;">Domain: [${domain.join(', ')}], Range: [${range.join(', ')}]</div>
      </div>
    `;
  }
  
  // Assemble the elements
  container.appendChild(infoElement);
  container.appendChild(canvas);
  
  return container;
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} html - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(html) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default { render };