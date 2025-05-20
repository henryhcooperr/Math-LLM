/**
 * Tests for the LLM response processor utilities
 */

import { 
  extractStructuredResponse, 
  generateFormattedPrompt 
} from '../../src/utils/llmResponseProcessor';

describe('llmResponseProcessor utility', () => {
  describe('extractStructuredResponse', () => {
    test('should extract a response from a JSON block in markdown', () => {
      const llmResponse = `
I'll explain the sine function.

\`\`\`json
{
  "explanation": "The sine function is a fundamental trigonometric function that oscillates between -1 and 1.",
  "visualizationParams": {
    "type": "function2D",
    "title": "Sine Function",
    "expression": "Math.sin(x)",
    "domain": [-6.28, 6.28],
    "range": [-1.5, 1.5]
  },
  "educationalContent": {
    "title": "Understanding Sine",
    "summary": "The sine function relates angles to ratios in right triangles."
  },
  "followUpQuestions": [
    "What is the relationship between sine and cosine?"
  ]
}
\`\`\`

I hope this helps!
      `;

      const structured = extractStructuredResponse(llmResponse);
      expect(structured).toBeDefined();
      expect(structured.explanation).toContain("sine function");
      expect(structured.visualizationParams.type).toBe("function2D");
      expect(structured.visualizationParams.expression).toBe("Math.sin(x)");
    });

    test('should extract a response from a complete JSON response', () => {
      const llmResponse = `{
  "explanation": "The quadratic formula is used to solve quadratic equations.",
  "visualizationParams": {
    "type": "function2D",
    "title": "Quadratic Function",
    "expression": "x*x - 3*x + 2",
    "domain": [-2, 5],
    "range": [-2, 6]
  },
  "educationalContent": {
    "title": "The Quadratic Formula",
    "summary": "The quadratic formula gives solutions to ax² + bx + c = 0."
  },
  "followUpQuestions": [
    "When does a quadratic equation have exactly one solution?"
  ]
}`;

      const structured = extractStructuredResponse(llmResponse);
      expect(structured).toBeDefined();
      expect(structured.explanation).toContain("quadratic formula");
      expect(structured.visualizationParams.type).toBe("function2D");
      expect(structured.visualizationParams.expression).toBe("x*x - 3*x + 2");
    });

    test('should extract information from free text when no JSON is found', () => {
      const llmResponse = `
The sine function is a periodic function with a period of 2π. It oscillates between -1 and 1.

Explanation:
In mathematics, the sine function relates angles to the ratio of two sides of a right triangle. 
In a unit circle, it's the y-coordinate of a point on the circle corresponding to a given angle.

For visualization, we can plot y = sin(x) from -2π to 2π.

Key Insights:
- The sine function has a period of 2π
- Its range is from -1 to 1
- It's an odd function, meaning sin(-x) = -sin(x)
- The derivative of sin(x) is cos(x)

Steps:
1. Understanding the Unit Circle: Sine is the y-coordinate on the unit circle.
2. Recognizing the Pattern: Sine completes one full cycle every 2π radians.
3. Analyzing Key Points: At x = 0, sin(0) = 0. At x = π/2, sin(π/2) = 1.

Follow-up Questions:
1. How is the sine function related to the cosine function?
2. What real-world phenomena can be modeled using sine functions?
3. How do you find the general solution to sin(x) = 0.5?
      `;

      const structured = extractStructuredResponse(llmResponse);
      expect(structured).toBeDefined();
      expect(structured.explanation).toContain("sine function");
      expect(structured.visualizationParams.type).toBe("geometry");
      expect(structured.visualizationParams.title).toContain("sin");
      expect(structured.educationalContent.keyInsights.length).toBeGreaterThan(0);
      expect(structured.educationalContent.steps.length).toBeGreaterThan(0);
      expect(structured.followUpQuestions.length).toBeGreaterThan(0);
    });

    test('should handle incomplete JSON by adding defaults', () => {
      const llmResponse = `\`\`\`json
{
  "explanation": "Minimal explanation",
  "visualizationParams": {
    "type": "function2D"
  }
}
\`\`\``;

      const structured = extractStructuredResponse(llmResponse);
      expect(structured).toBeDefined();
      expect(structured.explanation).toBe("Minimal explanation");
      expect(structured.visualizationParams.type).toBe("function2D");
      
      // Defaults should be added
      expect(structured.visualizationParams.domain).toBeDefined();
      expect(structured.visualizationParams.range).toBeDefined();
      expect(structured.educationalContent).toBeDefined();
      expect(structured.followUpQuestions).toEqual([]);
    });
  });

  describe('generateFormattedPrompt', () => {
    test('should generate a well-formatted prompt with default options', () => {
      const query = "Explain the sine function";
      const prompt = generateFormattedPrompt(query);

      expect(prompt).toContain(query);
      expect(prompt).toContain("JSON structure");
      expect(prompt).toContain("explanation");
      expect(prompt).toContain("visualizationParams");
      expect(prompt).toContain("educationalContent");
      expect(prompt).toContain("followUpQuestions");
      expect(prompt).toContain("Consider the user's knowledge level (intermediate)");
    });

    test('should include knowledge level in the prompt', () => {
      const query = "Explain the quadratic formula";
      const prompt = generateFormattedPrompt(query, { level: "beginner" });

      expect(prompt).toContain(query);
      expect(prompt).toContain("Consider the user's knowledge level (beginner)");
    });

    test('should include preferred libraries in the prompt', () => {
      const query = "Explain vectors";
      const prompt = generateFormattedPrompt(query, { 
        level: "advanced",
        preferredLibraries: ["mathbox", "mafs"]
      });

      expect(prompt).toContain(query);
      expect(prompt).toContain("Consider the user's knowledge level (advanced)");
      expect(prompt).toContain("Preferred visualization libraries: mathbox, mafs");
    });

    test('should list all visualization types in the prompt', () => {
      const query = "Explain calculus";
      const prompt = generateFormattedPrompt(query);

      expect(prompt).toContain("function2D");
      expect(prompt).toContain("function3D");
      expect(prompt).toContain("parametric2D");
      expect(prompt).toContain("vectorField");
      expect(prompt).toContain("geometry");
      expect(prompt).toContain("probabilityDistribution");
      expect(prompt).toContain("linearAlgebra");
    });
  });
});