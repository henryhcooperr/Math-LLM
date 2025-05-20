/**
 * Tests for the parameter and expression conversion utilities
 */

import { 
  convertParameters, 
  convertExpression,
  getDefaultParams 
} from '../../src/utils/conversionUtils';

describe('conversionUtils', () => {
  describe('convertParameters', () => {
    test('should return original params when source and target libraries are the same', () => {
      const params = {
        type: "function2D",
        expression: "Math.sin(x)",
        domain: [-10, 10],
        range: [-2, 2]
      };

      const converted = convertParameters(params, 'mafs', 'mafs');
      expect(converted).toEqual(params);
    });

    test('should convert from Mafs to JSXGraph format', () => {
      const mafsParams = {
        type: "function2D",
        expression: "Math.sin(x)",
        domain: [-10, 10],
        range: [-2, 2],
        points: [
          { x: 0, y: 0, color: "#FF0000" },
          { x: 3.14, y: 0, color: "#00FF00" }
        ]
      };

      const converted = convertParameters(mafsParams, 'mafs', 'jsxgraph');
      
      expect(converted.type).toBe("function2D");
      expect(converted.expression).toBe("Math.sin(x)");
      expect(converted.boundingBox).toEqual([-10, 2, 10, -2]); // JSXGraph format [x1, y2, x2, y1]
      expect(converted.elements).toBeDefined();
      expect(converted.elements.length).toBe(2);
      expect(converted.elements[0].type).toBe("point");
      expect(converted.elements[0].coords).toEqual([0, 0]);
      expect(converted.elements[0].color).toBe("#FF0000");
    });

    test('should convert from JSXGraph to Mafs format', () => {
      const jsxgraphParams = {
        type: "geometry",
        boundingBox: [-5, 5, 5, -5],
        elements: [
          {
            type: "point",
            coords: [2, 3],
            color: "blue",
            name: "A"
          },
          {
            type: "line",
            point1: [0, 0],
            point2: [4, 4],
            color: "red"
          }
        ]
      };

      const converted = convertParameters(jsxgraphParams, 'jsxgraph', 'mafs');
      
      expect(converted.type).toBe("geometry");
      expect(converted.domain).toEqual([-5, 5]); // Mafs format [x1, x2]
      expect(converted.range).toEqual([-5, 5]); // Mafs format [y1, y2]
      expect(converted.points).toBeDefined();
      expect(converted.points.length).toBe(1);
      expect(converted.points[0].x).toBe(2);
      expect(converted.points[0].y).toBe(3);
      expect(converted.points[0].color).toBe("blue");
      expect(converted.points[0].name).toBe("A");
      expect(converted.lines).toBeDefined();
      expect(converted.lines.length).toBe(1);
      expect(converted.lines[0].point).toEqual([0, 0]);
      expect(converted.lines[0].slope).toBe(1); // Calculated from points (0,0) and (4,4)
    });

    test('should convert from Mafs to MathBox (2D to 3D)', () => {
      const mafsParams = {
        type: "function2D",
        expression: "Math.sin(x)",
        domain: [-10, 10],
        range: [-2, 2],
        points: [
          { x: 0, y: 0, color: "#FF0000" },
          { x: 3.14, y: 0, color: "#00FF00" }
        ]
      };

      const converted = convertParameters(mafsParams, 'mafs', 'mathbox');
      
      expect(converted.type).toBe("function2D");
      expect(converted.expression).toBe("Math.sin(x)");
      expect(converted.domain).toEqual([-10, 10]);
      expect(converted.range).toEqual([-2, 2]);
      expect(converted.zRange).toEqual([-1, 1]); // Default z-range added
      expect(converted.points3D).toBeDefined();
      expect(converted.points3D.length).toBe(2);
      expect(converted.points3D[0].x).toBe(0);
      expect(converted.points3D[0].y).toBe(0);
      expect(converted.points3D[0].z).toBe(0); // Z-coordinate added
    });

    test('should convert to D3 format for data visualizations', () => {
      const params = {
        type: "function2D",
        expression: "x * x",
        domain: [0, 5],
        range: [0, 25]
      };

      const converted = convertParameters(params, 'generic', 'd3');
      
      expect(converted.type).toBe("function2D");
      expect(converted.expression).toBe("x * x");
      expect(converted.domain).toEqual([0, 5]);
      expect(converted.range).toEqual([0, 25]);
      expect(converted.data).toBeDefined();
      expect(Array.isArray(converted.data)).toBe(true);
      expect(converted.data.length).toBeGreaterThan(0);
      expect(converted.margin).toBeDefined();
    });
  });

  describe('convertExpression', () => {
    test('should return original expression when source and target formats are the same', () => {
      const expression = "Math.sin(x) * Math.cos(y)";
      const converted = convertExpression(expression, 'generic', 'generic');
      expect(converted).toBe(expression);
    });

    test('should return undefined when expression is undefined', () => {
      const converted = convertExpression(undefined, 'generic', 'mathbox');
      expect(converted).toBeUndefined();
    });

    test('should convert from generic JavaScript to MathBox format', () => {
      const expression = "Math.sin(x) * Math.cos(y) + Math.sqrt(Math.abs(x))";
      const converted = convertExpression(expression, 'generic', 'mathbox');
      
      expect(converted).toBe("sin(x) * cos(y) + sqrt(abs(x))");
      expect(converted).not.toContain("Math.");
    });

    test('should convert from MathBox to generic JavaScript format', () => {
      const expression = "sin(x) * cos(y) + sqrt(abs(x))";
      const converted = convertExpression(expression, 'mathbox', 'generic');
      
      expect(converted).toBe("Math.sin(x) * Math.cos(y) + Math.sqrt(Math.abs(x))");
      expect(converted).toContain("Math.");
    });

    test('should convert from generic JavaScript to D3 format', () => {
      const expression = "x * y";
      const converted = convertExpression(expression, 'generic', 'd3');
      
      expect(converted).toBe("d.x * d.y");
    });

    test('should handle constants like PI properly', () => {
      const expression = "Math.sin(x * Math.PI)";
      const converted = convertExpression(expression, 'generic', 'mathbox');
      
      expect(converted).toBe("sin(x * PI)");
    });
  });

  describe('getDefaultParams', () => {
    test('should return defaults for function2D', () => {
      const defaults = getDefaultParams('function2D');
      
      expect(defaults).toBeDefined();
      expect(defaults.domain).toBeDefined();
      expect(defaults.range).toBeDefined();
      expect(defaults.gridLines).toBe(true);
      expect(defaults.axes).toBe(true);
    });

    test('should return defaults for function3D', () => {
      const defaults = getDefaultParams('function3D');
      
      expect(defaults).toBeDefined();
      expect(defaults.domainX).toBeDefined();
      expect(defaults.domainY).toBeDefined();
      expect(defaults.range).toBeDefined();
      expect(defaults.resolution).toBeDefined();
      expect(defaults.colormap).toBe('viridis');
    });

    test('should return defaults for geometry', () => {
      const defaults = getDefaultParams('geometry');
      
      expect(defaults).toBeDefined();
      expect(defaults.domain).toBeDefined();
      expect(defaults.range).toBeDefined();
      expect(defaults.gridLines).toBe(true);
      expect(defaults.axes).toBe(true);
    });

    test('should return defaults for vectorField', () => {
      const defaults = getDefaultParams('vectorField');
      
      expect(defaults).toBeDefined();
      expect(defaults.domain).toBeDefined();
      expect(defaults.range).toBeDefined();
      expect(defaults.density).toBe(10);
      expect(defaults.normalize).toBe(true);
    });

    test('should return defaults for parametric2D', () => {
      const defaults = getDefaultParams('parametric2D');
      
      expect(defaults).toBeDefined();
      expect(defaults.parameterRange).toEqual([0, 2 * Math.PI]);
      expect(defaults.domain).toBeDefined();
      expect(defaults.range).toBeDefined();
    });

    test('should return defaults for parametric3D', () => {
      const defaults = getDefaultParams('parametric3D');
      
      expect(defaults).toBeDefined();
      expect(defaults.parameterRanges).toBeDefined();
      expect(defaults.domainX).toBeDefined();
      expect(defaults.domainY).toBeDefined();
      expect(defaults.domainZ).toBeDefined();
      expect(defaults.resolution).toBe(48);
    });

    test('should return general defaults for unknown visualization types', () => {
      const defaults = getDefaultParams('unknownType');
      
      expect(defaults).toBeDefined();
      expect(defaults.domain).toBeDefined();
      expect(defaults.range).toBeDefined();
    });
  });
});