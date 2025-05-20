/**
 * Tests for the VisualizationWrapper component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { VisualizationWrapper } from '../../src/components/VisualizationWrapper';

// Mock the visualizers
jest.mock('../../src/components/visualizers/MafsVisualizer', () => ({
  MafsVisualizer: jest.fn(() => <div data-testid="mafs-visualizer">Mafs Visualizer</div>)
}));

jest.mock('../../src/components/visualizers/MathBoxVisualizer', () => ({
  MathBoxVisualizer: jest.fn(() => <div data-testid="mathbox-visualizer">MathBox Visualizer</div>)
}));

jest.mock('../../src/components/visualizers/ThreeJSVisualizer', () => ({
  ThreeJSVisualizer: jest.fn(() => <div data-testid="threejs-visualizer">ThreeJS Visualizer</div>)
}));

jest.mock('../../src/components/visualizers/JSXGraphVisualizer', () => ({
  JSXGraphVisualizer: jest.fn(() => <div data-testid="jsxgraph-visualizer">JSXGraph Visualizer</div>)
}));

jest.mock('../../src/components/visualizers/D3Visualizer', () => ({
  D3Visualizer: jest.fn(() => <div data-testid="d3-visualizer">D3 Visualizer</div>)
}));

describe('VisualizationWrapper', () => {
  test('renders an error message for unsupported library', () => {
    render(
      <VisualizationWrapper
        library="unsupported"
        type="function2D"
        expression="Math.sin(x)"
      />
    );
    
    expect(screen.getByText(/Unsupported visualization library/i)).toBeInTheDocument();
    expect(screen.getByText(/unsupported/i)).toBeInTheDocument();
  });

  test('selects MafsVisualizer for function2D type', () => {
    render(
      <VisualizationWrapper
        type="function2D"
        expression="Math.sin(x)"
        domain={[-10, 10]}
        range={[-2, 2]}
      />
    );
    
    expect(screen.getByTestId('mafs-visualizer')).toBeInTheDocument();
  });

  test('selects MathBoxVisualizer for function3D type', () => {
    render(
      <VisualizationWrapper
        type="function3D"
        expression="Math.pow(x, 2) + Math.pow(y, 2)"
        domainX={[-3, 3]}
        domainY={[-3, 3]}
        range={[0, 10]}
      />
    );
    
    expect(screen.getByTestId('mathbox-visualizer')).toBeInTheDocument();
  });

  test('selects JSXGraphVisualizer for geometry type', () => {
    render(
      <VisualizationWrapper
        type="geometry"
        elements={[
          { type: "point", coordinates: [0, 0], label: "A" }
        ]}
        domain={[-5, 5]}
        range={[-5, 5]}
      />
    );
    
    expect(screen.getByTestId('jsxgraph-visualizer')).toBeInTheDocument();
  });

  test('selects D3Visualizer for data-driven visualizations', () => {
    render(
      <VisualizationWrapper
        type="scatter"
        data={[
          { x: 1, y: 2 },
          { x: 2, y: 4 },
          { x: 3, y: 6 }
        ]}
        domain={[0, 4]}
        range={[0, 8]}
      />
    );
    
    expect(screen.getByTestId('d3-visualizer')).toBeInTheDocument();
  });

  test('selects ThreeJSVisualizer when library is explicitly set to three', () => {
    render(
      <VisualizationWrapper
        library="three"
        type="function3D"
        expression="Math.pow(x, 2) + Math.pow(y, 2)"
        domainX={[-3, 3]}
        domainY={[-3, 3]}
        range={[0, 10]}
      />
    );
    
    expect(screen.getByTestId('threejs-visualizer')).toBeInTheDocument();
  });

  test('selects MafsVisualizer for calculus visualizations with simple derivatives', () => {
    render(
      <VisualizationWrapper
        type="calculus"
        subtype="derivative"
        function={{
          expression: "Math.pow(x, 2)",
          color: "#3090FF"
        }}
        derivative={{
          expression: "2*x",
          color: "#FF5733"
        }}
        domain={[-3, 3]}
        range={[-1, 9]}
      />
    );
    
    expect(screen.getByTestId('mafs-visualizer')).toBeInTheDocument();
  });

  test('selects appropriate library when zRange is provided (indicates 3D)', () => {
    render(
      <VisualizationWrapper
        type="function2D"
        expression="Math.sin(x)"
        domain={[-10, 10]}
        range={[-2, 2]}
        zRange={[-1, 1]} // This should trigger 3D visualization
      />
    );
    
    expect(screen.getByTestId('mathbox-visualizer')).toBeInTheDocument();
  });

  test('respects explicit library selection over auto-selection', () => {
    render(
      <VisualizationWrapper
        library="jsxgraph" // Explicitly request JSXGraph
        type="function2D" // Would normally use Mafs
        expression="Math.sin(x)"
        domain={[-10, 10]}
        range={[-2, 2]}
      />
    );
    
    expect(screen.getByTestId('jsxgraph-visualizer')).toBeInTheDocument();
  });

  test('passes options to the selected visualizer', () => {
    const { MafsVisualizer } = require('../../src/components/visualizers/MafsVisualizer');
    
    render(
      <VisualizationWrapper
        type="function2D"
        expression="Math.sin(x)"
        domain={[-10, 10]}
        range={[-2, 2]}
        options={{
          showGrid: true,
          theme: 'dark'
        }}
      />
    );
    
    // Check that options were passed to MafsVisualizer
    expect(MafsVisualizer).toHaveBeenCalledWith(
      expect.objectContaining({
        showGrid: true,
        theme: 'dark'
      }),
      expect.anything()
    );
  });
});