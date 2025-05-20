# Math-LLM API Documentation

This document provides comprehensive documentation for the Math-LLM visualization system API, explaining how to integrate the system into your applications and customize its behavior.

## Table of Contents

1. [Overview](#overview)
2. [Core Components](#core-components)
3. [Integration Methods](#integration-methods)
4. [Visualization Types](#visualization-types)
5. [LLM Integration](#llm-integration)
6. [Library Selection](#library-selection)
7. [Educational Content](#educational-content)
8. [Customization](#customization)
9. [Examples](#examples)

## Overview

Math-LLM is an interactive mathematical visualization system that combines Large Language Models (LLMs) with advanced visualization libraries to create educational, interactive mathematical content. The system can process natural language queries about mathematical concepts and produce appropriate visualizations along with educational content.

## Core Components

The Math-LLM system consists of several core components that work together:

### 1. VisualizationWrapper

The main component that selects the appropriate visualization library based on content type and renders the visualization.

```jsx
import { VisualizationWrapper } from 'math-llm';

// Basic usage
<VisualizationWrapper
  type="function2D"
  expression="Math.sin(x)"
  domain={[-Math.PI * 2, Math.PI * 2]}
  range={[-1.5, 1.5]}
  width="100%"
  height={400}
/>
```

### 2. Response Formatting Utilities

Utilities for creating and validating standardized responses between the LLM and visualization system.

```javascript
import { createStandardResponse, validateResponse } from 'math-llm/utils/responseFormatter';

// Create a standard response
const response = createStandardResponse({
  explanation: "The sine function oscillates between -1 and 1...",
  visualizationParams: {
    type: "function2D",
    expression: "Math.sin(x)",
    domain: [-Math.PI * 2, Math.PI * 2],
    range: [-1.5, 1.5]
  },
  educationalContent: {
    title: "Understanding Sine",
    // Other educational content...
  },
  followUpQuestions: [
    "How is sine related to cosine?",
    // Other follow-up questions...
  ]
});
```

### 3. LLM Response Processing

Utilities for processing and extracting structured information from LLM responses.

```javascript
import { extractStructuredResponse, generateFormattedPrompt } from 'math-llm/utils/llmResponseProcessor';

// Generate a prompt for the LLM
const prompt = generateFormattedPrompt("Explain the quadratic formula", {
  level: "intermediate"
});

// Later, after getting LLM response...
const structuredResponse = extractStructuredResponse(llmResponse);
```

### 4. Conversion Utilities

Utilities for converting between different library formats and parameters.

```javascript
import { convertParameters, convertExpression } from 'math-llm/utils/conversionUtils';

// Convert parameters from Mafs format to JSXGraph
const jsxgraphParams = convertParameters(mafsParams, 'mafs', 'jsxgraph');
```

## Integration Methods

There are several ways to integrate Math-LLM into your application:

### 1. Full Application Integration

Use the complete Math-LLM system with LLM integration and UI components.

```jsx
import { MathLLMApp } from 'math-llm';

// Render the complete application
<MathLLMApp 
  apiKey="your-llm-api-key"
  defaultLevel="intermediate"
  preferredLibraries={['mafs', 'mathbox']}
/>
```

### 2. Visualization-Only Integration

Use only the visualization components without LLM integration.

```jsx
import { VisualizationWrapper } from 'math-llm';

// Render just the visualization with your own parameters
<VisualizationWrapper
  type="function2D"
  expression="Math.pow(x, 2) - 3*x + 2"
  domain={[-2, 4]}
  range={[-1, 5]}
/>
```

### 3. Educational Content Integration

Use the educational content components separately.

```jsx
import { EducationalContent } from 'math-llm';

// Render educational content
<EducationalContent
  title="Understanding Quadratic Functions"
  summary="Quadratic functions are second-degree polynomial functions..."
  steps={[
    {
      title: "Identifying the Parabola's Direction",
      content: "The coefficient 'a' determines whether..."
    },
    // More steps...
  ]}
  keyInsights={[
    "The graph of a quadratic function is always a parabola",
    // More insights...
  ]}
  exercises={[
    {
      question: "Find the vertex of f(x) = 2x² + 4x - 6",
      solution: "Vertex: x = -b/(2a) = -4/(2*2) = -1..."
    },
    // More exercises...
  ]}
/>
```

## Visualization Types

Math-LLM supports the following visualization types:

### 1. function2D

2D Mathematical functions (y = f(x)).

```jsx
<VisualizationWrapper
  type="function2D"
  title="Sine Function"
  expression="Math.sin(x)"
  domain={[-Math.PI * 2, Math.PI * 2]}
  range={[-1.5, 1.5]}
  gridLines={true}
  specialPoints={[
    {x: 0, y: 0, label: "Origin"},
    {x: Math.PI/2, y: 1, label: "Maximum"}
  ]}
/>
```

### 2. functions2D

Multiple 2D functions on the same coordinate system.

```jsx
<VisualizationWrapper
  type="functions2D"
  title="Sine and Cosine"
  functions={[
    {
      expression: "Math.sin(x)",
      label: "sin(x)",
      color: "#3090FF"
    },
    {
      expression: "Math.cos(x)",
      label: "cos(x)",
      color: "#FF9030"
    }
  ]}
  domain={[-Math.PI * 2, Math.PI * 2]}
  range={[-1.5, 1.5]}
/>
```

### 3. function3D

3D surfaces (z = f(x,y)).

```jsx
<VisualizationWrapper
  type="function3D"
  title="Paraboloid"
  expression="Math.pow(x, 2) + Math.pow(y, 2)"
  domainX={[-3, 3]}
  domainY={[-3, 3]}
  range={[0, 10]}
  resolution={64}
  colormap="viridis"
/>
```

### 4. parametric2D

Parametric curves in 2D.

```jsx
<VisualizationWrapper
  type="parametric2D"
  title="Circle via Parametric Equation"
  parameterName="t"
  parameterRange={[0, 2 * Math.PI]}
  expressions={{
    x: "2 * Math.cos(t)",
    y: "2 * Math.sin(t)"
  }}
  domain={[-3, 3]}
  range={[-3, 3]}
/>
```

### 5. parametric3D

Parametric curves and surfaces in 3D.

```jsx
<VisualizationWrapper
  type="parametric3D"
  title="Helical Curve"
  parameterType="curve"
  parameterNames={["t"]}
  parameterRanges={[[0, 6 * Math.PI]]}
  expressions={{
    x: "Math.cos(t)",
    y: "Math.sin(t)",
    z: "0.2 * t"
  }}
  domainX={[-1.5, 1.5]}
  domainY={[-1.5, 1.5]}
  domainZ={[0, 4 * Math.PI]}
/>
```

### 6. vectorField

Vector fields in 2D or 3D.

```jsx
<VisualizationWrapper
  type="vectorField"
  title="2D Vector Field"
  dimensionality="2D"
  expressions={{
    x: "y",
    y: "-x"
  }}
  domain={[-3, 3]}
  range={[-3, 3]}
  density={15}
  normalize={true}
/>
```

### 7. geometry

Geometric constructions.

```jsx
<VisualizationWrapper
  type="geometry"
  title="Triangle with Circumcircle"
  elements={[
    {
      type: "point",
      id: "A",
      coordinates: [0, 0],
      label: "A",
      color: "#FF0000"
    },
    {
      type: "point",
      id: "B",
      coordinates: [4, 0],
      label: "B",
      color: "#FF0000"
    },
    {
      type: "point",
      id: "C",
      coordinates: [2, 3],
      label: "C",
      color: "#FF0000"
    },
    {
      type: "polygon",
      vertices: ["A", "B", "C"],
      id: "triangle",
      color: "#3090FF",
      fillOpacity: 0.2
    }
  ]}
  domain={[-1, 5]}
  range={[-1, 4]}
/>
```

### 8. calculus

Calculus-specific visualizations.

```jsx
<VisualizationWrapper
  type="calculus"
  subtype="integral"
  title="Area Under a Curve"
  function={{
    expression: "Math.pow(x, 2)",
    color: "#3090FF"
  }}
  integral={{
    lowerBound: 0,
    upperBound: 2,
    color: "#FF9030",
    fillOpacity: 0.3,
    approximation: {
      method: "rectangles",
      count: 10,
      show: true
    }
  }}
  domain={[-0.5, 2.5]}
  range={[-0.5, 4.5]}
/>
```

### 9. probabilityDistribution

Statistical distributions.

```jsx
<VisualizationWrapper
  type="probabilityDistribution"
  title="Normal Distribution"
  distribution={{
    name: "normal",
    parameters: {
      mean: 0,
      standardDeviation: 1
    }
  }}
  domain={[-4, 4]}
  range={[0, 0.5]}
  shade={{
    regions: [
      {
        from: -1,
        to: 1,
        label: "68% within 1σ",
        color: "#3090FF"
      }
    ]
  }}
/>
```

### 10. linearAlgebra

Linear algebra visualizations.

```jsx
<VisualizationWrapper
  type="linearAlgebra"
  subtype="transformation"
  title="Linear Transformation"
  space="2D"
  matrix={[
    [2, 1],
    [1, 1]
  ]}
  displayElements={{
    grid: true,
    unitVectors: true,
    additionalVectors: [
      {
        components: [1, 2],
        color: "#FF9030",
        label: "v"
      }
    ]
  }}
  animation={{
    duration: 1.5,
    enabled: true
  }}
  domain={[-5, 5]}
  range={[-5, 5]}
/>
```

## LLM Integration

Math-LLM can be integrated with any LLM API that accepts text prompts. The system provides utilities to format prompts and process responses.

### Generating LLM Prompts

```javascript
import { generateFormattedPrompt } from 'math-llm/utils/llmResponseProcessor';

// Generate a prompt for the specific mathematical concept
const prompt = generateFormattedPrompt("Explain the quadratic formula", {
  level: "intermediate", // "beginner", "intermediate", or "advanced"
  preferredLibraries: ["mafs", "mathbox"] // Optional preferred visualization libraries
});

// Send the prompt to your LLM API
const llmResponse = await yourLLMService.generateResponse(prompt);
```

### Processing LLM Responses

```javascript
import { extractStructuredResponse } from 'math-llm/utils/llmResponseProcessor';

// Extract structured information from the LLM response
const structuredResponse = extractStructuredResponse(llmResponse);

// Use the structured response with the visualization components
<VisualizationWrapper {...structuredResponse.visualizationParams} />
```

## Library Selection

Math-LLM automatically selects the most appropriate visualization library based on the content type, but you can also explicitly specify which library to use.

```jsx
<VisualizationWrapper
  library="mathbox" // Force using MathBox library
  type="function3D"
  expression="Math.pow(x, 2) + Math.pow(y, 2)"
  // Other parameters...
/>
```

The system currently supports the following libraries:

- **mafs**: For 2D functions and basic visualizations in React
- **mathbox**: For 3D mathematical visualizations
- **jsxgraph**: For geometry and function plotting
- **d3**: For data-driven visualizations
- **three**: For general 3D visualizations

## Educational Content

Math-LLM provides educational content components that can be used alongside visualizations:

```jsx
import { EducationalContent } from 'math-llm';

<EducationalContent
  title="Understanding Quadratic Functions"
  summary="Quadratic functions are polynomial functions of degree 2..."
  steps={[
    {
      title: "Step 1: Understanding the Form",
      content: "A quadratic function has the form f(x) = ax² + bx + c..."
    },
    // More steps...
  ]}
  keyInsights={[
    "The graph of a quadratic function is a parabola",
    // More insights...
  ]}
  exercises={[
    {
      question: "Find the vertex of f(x) = x² - 6x + 8",
      solution: "The vertex is at (3, -1)..."
    },
    // More exercises...
  ]}
/>
```

## Customization

Math-LLM provides various customization options:

### Custom Themes

```jsx
<VisualizationWrapper
  type="function2D"
  expression="Math.sin(x)"
  domain={[-Math.PI * 2, Math.PI * 2]}
  range={[-1.5, 1.5]}
  theme={{
    axis: {
      color: "#333333",
      width: 2
    },
    grid: {
      color: "#cccccc",
      width: 1
    },
    function: {
      color: "#3498db",
      width: 3
    },
    background: "#f9f9f9"
  }}
/>
```

### Custom Rendering

```jsx
<VisualizationWrapper
  type="function2D"
  expression="Math.sin(x)"
  domain={[-Math.PI * 2, Math.PI * 2]}
  range={[-1.5, 1.5]}
  renderer="svg" // or "canvas", "webgl"
  onRender={(container, instance) => {
    // Custom rendering logic
    console.log("Visualization rendered:", instance);
  }}
/>
```

### Library-Specific Customization

```jsx
<VisualizationWrapper
  type="function2D"
  expression="Math.sin(x)"
  domain={[-Math.PI * 2, Math.PI * 2]}
  range={[-1.5, 1.5]}
  recommendedLibrary="mafs"
  mafsSpecific={{
    viewBox: { x: [-10, 10], y: [-10, 10] },
    preserveAspectRatio: false,
    pannable: true,
    zoomable: true,
    theme: "light"
  }}
/>
```

## Examples

### Basic Function Visualization

```jsx
import { VisualizationWrapper } from 'math-llm';

function App() {
  return (
    <div className="container">
      <h1>Quadratic Function Example</h1>
      <VisualizationWrapper
        type="function2D"
        title="Quadratic Function: f(x) = x² - 3x + 2"
        expression="Math.pow(x, 2) - 3*x + 2"
        domain={[-2, 4]}
        range={[-1, 5]}
        gridLines={true}
        specialPoints={[
          {x: 1, y: 0, label: "Root at x=1"},
          {x: 2, y: 0, label: "Root at x=2"},
          {x: 1.5, y: -0.25, label: "Vertex (1.5, -0.25)"}
        ]}
      />
    </div>
  );
}
```

### Interactive Visualization with UI Controls

```jsx
import { VisualizationWrapper, ParameterControls } from 'math-llm';
import { useState } from 'react';

function InteractiveApp() {
  const [params, setParams] = useState({
    a: 1,
    b: -3,
    c: 2
  });
  
  const updateParam = (name, value) => {
    setParams({
      ...params,
      [name]: parseFloat(value)
    });
  };
  
  const expression = `${params.a}*Math.pow(x, 2) + ${params.b}*x + ${params.c}`;
  
  return (
    <div className="container">
      <h1>Interactive Quadratic Function</h1>
      <ParameterControls
        parameters={[
          {name: "a", min: -5, max: 5, step: 0.1, value: params.a},
          {name: "b", min: -10, max: 10, step: 0.1, value: params.b},
          {name: "c", min: -10, max: 10, step: 0.1, value: params.c}
        ]}
        onChange={updateParam}
      />
      <VisualizationWrapper
        type="function2D"
        title={`Quadratic Function: f(x) = ${params.a}x² + ${params.b}x + ${params.c}`}
        expression={expression}
        domain={[-5, 5]}
        range={[-10, 10]}
        gridLines={true}
      />
    </div>
  );
}
```

### Complete Math-LLM Integration

```jsx
import { MathLLMApp } from 'math-llm';

function MathLearningApp() {
  const handleVisualizationCreate = (response) => {
    console.log("Generated visualization:", response);
    // Analytics or custom logic
  };
  
  return (
    <div className="app-container">
      <h1>Math Learning Platform</h1>
      <MathLLMApp
        apiKey="your-llm-api-key"
        defaultLevel="intermediate"
        preferredLibraries={['mafs', 'mathbox']}
        onVisualizationCreate={handleVisualizationCreate}
        saveHistory={true}
        theme="light"
      />
    </div>
  );
}
```

---

For more information and detailed examples, please visit the project repository at [github.com/math-llm](https://github.com/math-llm) or contact the development team at support@math-llm.dev.