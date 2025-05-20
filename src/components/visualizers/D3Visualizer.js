import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

/**
 * D3 Visualizer Component
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Type of visualization
 * @param {Object[]} [props.data=[]] - Data for visualization
 * @param {number[]} [props.domain=[-10, 10]] - X-axis domain
 * @param {number[]} [props.range=[-10, 10]] - Y-axis range
 * @param {string|number} [props.width='100%'] - Container width
 * @param {string|number} [props.height=400] - Container height
 * @returns {React.ReactElement} - D3 visualization component
 */
export const D3Visualizer = ({
  type,
  data = [],
  domain = [-10, 10],
  range = [-10, 10],
  width = '100%',
  height = 400,
  ...rest
}) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Handle responsive width
  useEffect(() => {
    if (containerRef.current) {
      const updateWidth = () => {
        if (typeof width === 'string' && width.includes('%')) {
          setContainerWidth(containerRef.current.clientWidth);
        } else {
          setContainerWidth(parseInt(width, 10));
        }
      };
      
      updateWidth();
      window.addEventListener('resize', updateWidth);
      
      return () => {
        window.removeEventListener('resize', updateWidth);
      };
    }
  }, [width]);
  
  useEffect(() => {
    if (containerRef.current && containerWidth > 0) {
      // Clear previous visualization
      d3.select(containerRef.current).selectAll('*').remove();
      
      // Create SVG
      const svg = d3.select(containerRef.current)
        .append('svg')
        .attr('width', containerWidth)
        .attr('height', typeof height === 'string' ? parseInt(height, 10) : height)
        .attr('viewBox', `0 0 ${containerWidth} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
      
      // Create visualization based on type
      switch (type) {
        case 'scatter':
          createScatterPlot(svg, data, domain, range, containerWidth, height);
          break;
        case 'bar':
          createBarChart(svg, data, domain, range, containerWidth, height);
          break;
        case 'line':
        case 'multiLine':
          createLineChart(svg, data, domain, range, containerWidth, height);
          break;
        case 'probabilityDistribution':
          createDistributionChart(svg, data, domain, range, containerWidth, height);
          break;
        default:
          // Create a default placeholder
          svg.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', containerWidth)
            .attr('height', height)
            .attr('fill', '#f8f9fa');
          
          svg.append('text')
            .attr('x', containerWidth / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .text(`Unsupported D3 visualization type: ${type}`);
      }
    }
  }, [type, data, domain, range, containerWidth, height, rest]);
  
  return (
    <div
      ref={containerRef}
      style={{
        width: width,
        height: height,
        overflow: 'hidden'
      }}
      data-testid="d3-container"
    />
  );
};

/**
 * Create a scatter plot visualization
 */
function createScatterPlot(svg, data, domain, range, width, height) {
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Create scales
  const xScale = d3.scaleLinear()
    .domain(domain)
    .range([0, innerWidth]);
  
  const yScale = d3.scaleLinear()
    .domain(range)
    .range([innerHeight, 0]);
  
  // Create axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  // Create the chart group
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Add grid lines
  g.append('g')
    .attr('class', 'grid-lines')
    .selectAll('line')
    .data(xScale.ticks())
    .enter()
    .append('line')
    .attr('x1', d => xScale(d))
    .attr('x2', d => xScale(d))
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', '#e0e0e0')
    .attr('stroke-width', 0.5);
  
  g.append('g')
    .attr('class', 'grid-lines')
    .selectAll('line')
    .data(yScale.ticks())
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('x2', innerWidth)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))
    .attr('stroke', '#e0e0e0')
    .attr('stroke-width', 0.5);
  
  // Add axes
  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis);
  
  g.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);
  
  // Add points
  g.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', d => d.size || 5)
    .attr('fill', d => d.color || '#3090FF')
    .attr('opacity', 0.7);
  
  // Add axis labels
  g.append('text')
    .attr('class', 'x-axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 35)
    .attr('text-anchor', 'middle')
    .text('X-Axis');
  
  g.append('text')
    .attr('class', 'y-axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -40)
    .attr('text-anchor', 'middle')
    .text('Y-Axis');
}

/**
 * Create a bar chart visualization
 */
function createBarChart(svg, data, domain, range, width, height) {
  const margin = { top: 20, right: 30, bottom: 60, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Create scales
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, innerWidth])
    .padding(0.2);
  
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value) * 1.1])
    .range([innerHeight, 0]);
  
  // Create axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  // Create the chart group
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Add grid lines
  g.append('g')
    .attr('class', 'grid-lines')
    .selectAll('line')
    .data(yScale.ticks())
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('x2', innerWidth)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))
    .attr('stroke', '#e0e0e0')
    .attr('stroke-width', 0.5);
  
  // Add axes
  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis)
    .selectAll('text')
    .attr('y', 10)
    .attr('x', -5)
    .attr('dy', '.35em')
    .attr('transform', 'rotate(-45)')
    .attr('text-anchor', 'end');
  
  g.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);
  
  // Add bars
  g.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.label))
    .attr('y', d => yScale(d.value))
    .attr('width', xScale.bandwidth())
    .attr('height', d => innerHeight - yScale(d.value))
    .attr('fill', d => d.color || '#3090FF');
  
  // Add bar values
  g.selectAll('.bar-value')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'bar-value')
    .attr('x', d => xScale(d.label) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.value) - 5)
    .attr('text-anchor', 'middle')
    .text(d => d.value);
  
  // Add axis labels
  g.append('text')
    .attr('class', 'x-axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 50)
    .attr('text-anchor', 'middle')
    .text('Categories');
  
  g.append('text')
    .attr('class', 'y-axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -40)
    .attr('text-anchor', 'middle')
    .text('Values');
}

/**
 * Create a line chart visualization
 */
function createLineChart(svg, data, domain, range, width, height) {
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Check if data is a series or multiple series
  const isMultiSeries = Array.isArray(data[0]) || (data[0] && data[0].series);
  const seriesData = isMultiSeries 
    ? (data[0].series ? data : data.map((series, i) => ({ 
        name: series.name || `Series ${i + 1}`, 
        color: series.color || getColor(i),
        data: series
      })))
    : [{ name: 'Series 1', color: '#3090FF', data }];
  
  // Determine the domain based on data
  const xDomain = domain || [
    d3.min(seriesData, series => d3.min(series.data, d => d.x)),
    d3.max(seriesData, series => d3.max(series.data, d => d.x))
  ];
  
  const yDomain = range || [
    d3.min(seriesData, series => d3.min(series.data, d => d.y)),
    d3.max(seriesData, series => d3.max(series.data, d => d.y))
  ];
  
  // Create scales with padding
  const xScale = d3.scaleLinear()
    .domain([xDomain[0] - (xDomain[1] - xDomain[0]) * 0.05, xDomain[1] + (xDomain[1] - xDomain[0]) * 0.05])
    .range([0, innerWidth]);
  
  const yScale = d3.scaleLinear()
    .domain([yDomain[0] - (yDomain[1] - yDomain[0]) * 0.05, yDomain[1] + (yDomain[1] - yDomain[0]) * 0.05])
    .range([innerHeight, 0]);
  
  // Create axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  // Create line generator
  const line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveMonotoneX);
  
  // Create the chart group
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Add grid lines
  g.append('g')
    .attr('class', 'grid-lines')
    .selectAll('line')
    .data(xScale.ticks())
    .enter()
    .append('line')
    .attr('x1', d => xScale(d))
    .attr('x2', d => xScale(d))
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', '#e0e0e0')
    .attr('stroke-width', 0.5);
  
  g.append('g')
    .attr('class', 'grid-lines')
    .selectAll('line')
    .data(yScale.ticks())
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('x2', innerWidth)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))
    .attr('stroke', '#e0e0e0')
    .attr('stroke-width', 0.5);
  
  // Add axes
  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis);
  
  g.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);
  
  // Add lines for each series
  seriesData.forEach(series => {
    // Add the line path
    g.append('path')
      .datum(series.data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', series.color)
      .attr('stroke-width', 2)
      .attr('d', line);
    
    // Add data points
    g.selectAll(`.dot-${series.name.replace(/\s+/g, '-')}`)
      .data(series.data)
      .enter()
      .append('circle')
      .attr('class', `dot-${series.name.replace(/\s+/g, '-')}`)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 4)
      .attr('fill', series.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);
  });
  
  // Add legend if multiple series
  if (seriesData.length > 1) {
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${innerWidth - 100}, 0)`);
    
    seriesData.forEach((series, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);
      
      legendItem.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', series.color);
      
      legendItem.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .attr('text-anchor', 'start')
        .text(series.name);
    });
  }
  
  // Add axis labels
  g.append('text')
    .attr('class', 'x-axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 35)
    .attr('text-anchor', 'middle')
    .text('X-Axis');
  
  g.append('text')
    .attr('class', 'y-axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -40)
    .attr('text-anchor', 'middle')
    .text('Y-Axis');
}

/**
 * Create a probability distribution chart
 */
function createDistributionChart(svg, data, domain, range, width, height) {
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Determine the domain based on data
  const xDomain = domain || [
    d3.min(data, d => d.x) - 1,
    d3.max(data, d => d.x) + 1
  ];
  
  const yDomain = range || [
    0,
    d3.max(data, d => d.y) * 1.1
  ];
  
  // Create scales
  const xScale = d3.scaleLinear()
    .domain(xDomain)
    .range([0, innerWidth]);
  
  const yScale = d3.scaleLinear()
    .domain(yDomain)
    .range([innerHeight, 0]);
  
  // Create axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  // Create line and area generators
  const line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveBasis);
  
  const area = d3.area()
    .x(d => xScale(d.x))
    .y0(innerHeight)
    .y1(d => yScale(d.y))
    .curve(d3.curveBasis);
  
  // Create the chart group
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Add grid lines
  g.append('g')
    .attr('class', 'grid-lines')
    .selectAll('line')
    .data(yScale.ticks())
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('x2', innerWidth)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))
    .attr('stroke', '#e0e0e0')
    .attr('stroke-width', 0.5);
  
  // Add area
  g.append('path')
    .datum(data)
    .attr('class', 'area')
    .attr('fill', '#3090FF')
    .attr('fill-opacity', 0.3)
    .attr('d', area);
  
  // Add line
  g.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', '#3090FF')
    .attr('stroke-width', 2)
    .attr('d', line);
  
  // Add axes
  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis);
  
  g.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);
  
  // Add mean line if available
  if (data.some(d => d.isMean)) {
    const meanPoint = data.find(d => d.isMean);
    
    g.append('line')
      .attr('class', 'mean-line')
      .attr('x1', xScale(meanPoint.x))
      .attr('x2', xScale(meanPoint.x))
      .attr('y1', innerHeight)
      .attr('y2', 0)
      .attr('stroke', 'red')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5,5');
    
    g.append('text')
      .attr('class', 'mean-label')
      .attr('x', xScale(meanPoint.x))
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .text('Mean');
  }
  
  // Add axis labels
  g.append('text')
    .attr('class', 'x-axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 35)
    .attr('text-anchor', 'middle')
    .text('Value');
  
  g.append('text')
    .attr('class', 'y-axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -40)
    .attr('text-anchor', 'middle')
    .text('Probability');
}

/**
 * Get a color from a predefined set based on index
 */
function getColor(index) {
  const colors = [
    '#3090FF', // Blue
    '#FF9030', // Orange
    '#30FF90', // Green
    '#FF3090', // Pink
    '#9030FF', // Purple
    '#30FFF9', // Cyan
    '#FFD700'  // Gold
  ];
  
  return colors[index % colors.length];
}

export default D3Visualizer;