import React, { useRef, useEffect } from 'react';
// Import CSS manually via require since CSS import is not exported correctly
// You may need to copy the CSS to your public folder and load it via a <link> tag
import { jsxgraphRenderer } from '../../renderers/jsxgraphRenderer';

/**
 * JSXGraph Visualizer Component
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Type of visualization
 * @param {string} [props.expression] - Mathematical expression
 * @param {number[]} [props.domain=[-10, 10]] - X-axis domain
 * @param {number[]} [props.range=[-10, 10]] - Y-axis range
 * @param {Array} [props.elements=[]] - Geometric elements
 * @param {string|number} [props.width='100%'] - Container width
 * @param {string|number} [props.height=400] - Container height
 * @param {string} [props.containerId] - Optional custom ID for the container
 * @returns {React.ReactElement} - JSXGraph visualization component
 */
export const JSXGraphVisualizer = ({
  type,
  expression,
  domain = [-10, 10],
  range = [-10, 10],
  elements = [],
  width = '100%',
  height = 400,
  containerId,
  ...rest
}) => {
  const containerRef = useRef(null);
  const boardRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current) {
      // Clean up any existing board
      if (boardRef.current) {
        // JSXGraph doesn't have a direct destroy method, but we can clear the container
        containerRef.current.innerHTML = '';
      }
      
      // Create a new board
      boardRef.current = jsxgraphRenderer(containerRef.current, {
        type,
        expression,
        domain,
        range,
        elements,
        containerId,
        ...rest
      });
    }
    
    // Clean up on unmount
    return () => {
      if (boardRef.current && typeof boardRef.current.suspendUpdate === 'function') {
        try {
          boardRef.current.removeObject(boardRef.current.objects);
          boardRef.current = null;
        } catch (e) {
          console.error('Error cleaning up JSXGraph board:', e);
        }
      }
    };
  }, [type, expression, domain, range, elements, containerId, rest]);
  
  return (
    <div
      ref={containerRef}
      style={{
        width,
        height,
        margin: '0 auto'
      }}
      data-testid="jsxgraph-container"
    />
  );
};

export default JSXGraphVisualizer;