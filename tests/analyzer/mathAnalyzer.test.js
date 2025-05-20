/**
 * Tests for mathAnalyzer.js functionality
 * Focuses on testing the extractMathematicalExpression function
 */

import * as mathAnalyzer from '../../src/analyzer/mathAnalyzer';
import * as fixtures from '../fixtures/mathProblems';

// The extractMathematicalExpression function is not exported directly,
// so we need to mock the necessary modules and expose it for testing
jest.mock('../../src/services/wolframAlphaService', () => ({
  __esModule: true,
  default: {
    getDerivative: jest.fn(),
    getIntegral: jest.fn(),
    getLimit: jest.fn()
  }
}));

// Extract the function for testing
const extractMathematicalExpression = mathAnalyzer.extractMathematicalExpression 
  || (problem => mathAnalyzer.analyzeMathProblem(problem).concept.expression);

describe('mathAnalyzer - extractMathematicalExpression', () => {
  
  // Basic function expressions tests
  describe('Basic function expressions', () => {
    fixtures.basicFunctionProblems.forEach(({ problem, expected }) => {
      it(`should extract "${expected}" from "${problem}"`, () => {
        const result = extractMathematicalExpression(problem);
        expect(result).toBe(expected);
      });
    });
  });

  // Calculus problems tests
  describe('Calculus problems', () => {
    fixtures.calculusProblems.forEach(({ problem, expected }) => {
      it(`should extract "${expected}" from "${problem}"`, () => {
        const result = extractMathematicalExpression(problem);
        expect(result).toBe(expected);
      });
    });
  });

  // Geometry problems tests
  describe('Geometry problems', () => {
    fixtures.geometryProblems.forEach(({ problem, expected }) => {
      it(`should extract "${expected}" from "${problem}"`, () => {
        const result = extractMathematicalExpression(problem);
        expect(result).toBe(expected);
      });
    });
  });

  // Edge cases tests
  describe('Edge cases', () => {
    fixtures.edgeCaseProblems.forEach(({ problem, expected }) => {
      it(`should handle edge case "${problem}" and return "${expected}"`, () => {
        const result = extractMathematicalExpression(problem);
        expect(result).toBe(expected);
      });
    });
  });

  // Complex function expressions tests
  describe('Complex function expressions', () => {
    fixtures.complexFunctionProblems.forEach(({ problem, expected }) => {
      it(`should extract "${expected}" from "${problem}"`, () => {
        const result = extractMathematicalExpression(problem);
        expect(result).toBe(expected);
      });
    });
  });

  // System of equations tests
  describe('System of equations', () => {
    fixtures.systemProblems.forEach(({ problem, expected }) => {
      it(`should extract "${expected}" from "${problem}"`, () => {
        const result = extractMathematicalExpression(problem);
        expect(result).toBe(expected);
      });
    });
  });

  // Domain/range specifications tests
  describe('Domain/range specifications', () => {
    fixtures.domainRangeProblems.forEach(({ problem, expected }) => {
      it(`should extract "${expected}" from "${problem}"`, () => {
        const result = extractMathematicalExpression(problem);
        expect(result).toBe(expected);
      });
    });
  });

  // 3D function problems tests
  describe('3D function problems', () => {
    fixtures.function3DProblems.forEach(({ problem, expected }) => {
      it(`should extract "${expected}" from "${problem}"`, () => {
        const result = extractMathematicalExpression(problem);
        expect(result).toBe(expected);
      });
    });
  });

  // Testing extraction strategies
  describe('Extraction strategies', () => {
    it('should extract from y = ... notation', () => {
      const problem = 'Graph y = x^2 + 3x - 4';
      const expected = 'x^2 + 3x - 4';
      const result = extractMathematicalExpression(problem);
      expect(result).toBe(expected);
    });

    it('should extract from f(x) = ... notation', () => {
      const problem = 'Plot f(x) = sin(x) * cos(x)';
      const expected = 'sin(x) * cos(x)';
      const result = extractMathematicalExpression(problem);
      expect(result).toBe(expected);
    });

    it('should extract from "the function ..." pattern', () => {
      const problem = 'Visualize the function x^3 + 2x - 1';
      const expected = 'x^3 + 2x - 1';
      const result = extractMathematicalExpression(problem);
      expect(result).toBe(expected);
    });

    it('should extract expressions following keywords', () => {
      const problem = 'Plot 3sin(x) + 2cos(x)';
      const expected = '3sin(x) + 2cos(x)';
      const result = extractMathematicalExpression(problem);
      expect(result).toBe(expected);
    });

    it('should extract from explicit equations', () => {
      const problem = 'Graph x^2 + y^2 = 4';
      const expected = 'x^2 + y^2 - 4';
      const result = extractMathematicalExpression(problem);
      expect(result).toBe(expected);
    });

    it('should extract expressions with common math functions', () => {
      const problem = 'Analyze sqrt(x) * log(x)';
      const expected = 'sqrt(x) * log(x)';
      const result = extractMathematicalExpression(problem);
      expect(result).toBe(expected);
    });

    it('should extract from calculus phrases', () => {
      const problem = 'Find the derivative of x^2 * sin(x)';
      const expected = 'x^2 * sin(x)';
      const result = extractMathematicalExpression(problem);
      expect(result).toBe(expected);
    });

    it('should extract simple variable expressions', () => {
      const problem = 'Show me what happens with x^3';
      const expected = 'x^3';
      const result = extractMathematicalExpression(problem);
      expect(result).toBe(expected);
    });

    it('should handle the simplest forms', () => {
      const problem = 'What is x?';
      const expected = 'x';
      const result = extractMathematicalExpression(problem);
      expect(result).toBe(expected);
    });

    it('should return default for unrecognized patterns', () => {
      const problem = 'Tell me about the history of calculus';
      const expected = 'x'; // Default value
      const result = extractMathematicalExpression(problem);
      expect(result).toBe(expected);
    });
  });
});