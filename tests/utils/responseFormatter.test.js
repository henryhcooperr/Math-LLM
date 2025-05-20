/**
 * Tests for the response formatter utilities
 */

import { 
  createStandardResponse, 
  validateResponse, 
  parseResponseFromJson 
} from '../../src/utils/responseFormatter';

describe('responseFormatter utility', () => {
  describe('createStandardResponse', () => {
    test('should create a valid response with all fields', () => {
      const response = createStandardResponse({
        explanation: "Test explanation",
        visualizationParams: {
          type: "function2D",
          title: "Test Function",
          expression: "Math.sin(x)",
          domain: [-10, 10],
          range: [-2, 2]
        },
        educationalContent: {
          title: "Understanding Test Function",
          summary: "Test summary",
          steps: [
            { title: "Step 1", content: "Step 1 content" }
          ],
          keyInsights: ["Insight 1"],
          exercises: [
            { question: "Question 1", solution: "Solution 1" }
          ]
        },
        followUpQuestions: ["Follow-up question 1"]
      });

      expect(response).toBeDefined();
      expect(response.explanation).toBe("Test explanation");
      expect(response.visualizationParams.type).toBe("function2D");
      expect(response.educationalContent.title).toBe("Understanding Test Function");
      expect(response.followUpQuestions).toHaveLength(1);
    });

    test('should create a response with minimal fields and add defaults', () => {
      const response = createStandardResponse({
        explanation: "Minimal explanation",
        visualizationParams: {
          type: "function2D"
        }
      });

      expect(response).toBeDefined();
      expect(response.explanation).toBe("Minimal explanation");
      expect(response.visualizationParams.type).toBe("function2D");
      
      // Check defaults were added
      expect(response.visualizationParams.domain).toBeDefined();
      expect(response.visualizationParams.range).toBeDefined();
      expect(response.educationalContent).toBeDefined();
      expect(response.followUpQuestions).toEqual([]);
    });

    test('should add type-specific defaults for function2D', () => {
      const response = createStandardResponse({
        explanation: "Function explanation",
        visualizationParams: {
          type: "function2D",
          expression: "Math.sin(x)"
        }
      });

      expect(response.visualizationParams.domain).toEqual([-10, 10]);
      expect(response.visualizationParams.range).toEqual([-10, 10]);
      expect(response.visualizationParams.gridLines).toBe(true);
    });

    test('should add type-specific defaults for function3D', () => {
      const response = createStandardResponse({
        explanation: "3D Function explanation",
        visualizationParams: {
          type: "function3D",
          expression: "Math.pow(x, 2) + Math.pow(y, 2)"
        }
      });

      expect(response.visualizationParams.domainX).toEqual([-5, 5]);
      expect(response.visualizationParams.domainY).toEqual([-5, 5]);
      expect(response.visualizationParams.range).toEqual([0, 10]);
      expect(response.visualizationParams.resolution).toBe(64);
      expect(response.visualizationParams.colormap).toBe("viridis");
    });

    test('should add type-specific defaults for vectorField', () => {
      const response = createStandardResponse({
        explanation: "Vector field explanation",
        visualizationParams: {
          type: "vectorField"
        }
      });

      expect(response.visualizationParams.dimensionality).toBe("2D");
      expect(response.visualizationParams.domain).toEqual([-3, 3]);
      expect(response.visualizationParams.range).toEqual([-3, 3]);
      expect(response.visualizationParams.density).toBe(15);
      expect(response.visualizationParams.normalize).toBe(true);
      expect(response.visualizationParams.expressions).toBeDefined();
      expect(response.visualizationParams.expressions.x).toBe("y");
      expect(response.visualizationParams.expressions.y).toBe("-x");
    });
  });

  describe('validateResponse', () => {
    test('should validate a correct complete response', () => {
      const response = {
        explanation: "Valid explanation",
        visualizationParams: {
          type: "function2D",
          title: "Valid Function",
          expression: "Math.sin(x)",
          domain: [-10, 10],
          range: [-2, 2]
        },
        educationalContent: {
          title: "Understanding Function",
          summary: "Valid summary",
          steps: [
            { title: "Step 1", content: "Step 1 content" }
          ],
          keyInsights: ["Valid insight"],
          exercises: [
            { question: "Valid question", solution: "Valid solution" }
          ]
        },
        followUpQuestions: ["Valid follow-up question"]
      };

      const validation = validateResponse(response);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    test('should identify missing required fields', () => {
      const response = {
        // Missing explanation
        visualizationParams: {
          // Missing type
          title: "Invalid Function"
        }
      };

      const validation = validateResponse(response);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain("Missing required field: explanation");
      expect(validation.errors).toContain("Missing required field: visualizationParams.type");
    });

    test('should validate type-specific parameters for function2D', () => {
      const response = {
        explanation: "Function explanation",
        visualizationParams: {
          type: "function2D",
          title: "Function",
          // Missing expression
          domain: "invalid domain", // Invalid domain (not an array)
          // Missing range
        }
      };

      const validation = validateResponse(response);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain("Missing required field for function2D: expression");
      expect(validation.errors).toContain("Invalid or missing domain for function2D");
      expect(validation.errors).toContain("Invalid or missing range for function2D");
    });

    test('should validate type-specific parameters for parametric2D', () => {
      const response = {
        explanation: "Parametric explanation",
        visualizationParams: {
          type: "parametric2D",
          title: "Parametric Curve",
          // Missing expressions or only partial expressions
          expressions: {
            x: "2 * Math.cos(t)"
            // Missing y expression
          }
        }
      };

      const validation = validateResponse(response);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain("Missing required x/y expressions for parametric2D");
    });
  });

  describe('parseResponseFromJson', () => {
    test('should parse valid JSON string and validate it', () => {
      const jsonString = JSON.stringify({
        explanation: "JSON explanation",
        visualizationParams: {
          type: "function2D",
          expression: "Math.sin(x)",
          domain: [-10, 10],
          range: [-2, 2]
        }
      });

      const parsed = parseResponseFromJson(jsonString);
      expect(parsed).toBeDefined();
      expect(parsed.explanation).toBe("JSON explanation");
      expect(parsed.visualizationParams.type).toBe("function2D");
    });

    test('should handle invalid JSON and return null', () => {
      const invalidJson = '{explanation: "Invalid JSON"}'; // Missing quotes around property name

      const result = parseResponseFromJson(invalidJson);
      expect(result).toBeNull();
    });

    test('should fix an incomplete response with defaults', () => {
      const incompleteJson = JSON.stringify({
        explanation: "Incomplete explanation",
        visualizationParams: {
          type: "function2D"
          // Missing other fields
        }
      });

      const parsed = parseResponseFromJson(incompleteJson);
      expect(parsed).toBeDefined();
      expect(parsed.explanation).toBe("Incomplete explanation");
      expect(parsed.visualizationParams.type).toBe("function2D");
      
      // Check defaults were added
      expect(parsed.visualizationParams.domain).toBeDefined();
      expect(parsed.visualizationParams.range).toBeDefined();
      expect(parsed.educationalContent).toBeDefined();
    });
  });
});