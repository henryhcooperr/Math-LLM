/**
 * Test Script for Expression Parser
 * 
 * This script tests the expression parser with various mathematical expressions
 * to ensure it properly handles different formats, especially the ones causing
 * issues in the Math-LLM system.
 */

const { evaluateExpression } = require('../src/utilities/expressionParser');

// List of test expressions
const testExpressions = [
  '7x+4+x^2', // Implicit multiplication: 7x
  '2x',       // Simple implicit multiplication
  '2',        // Constant function
  'x^2 + 3x - 4', // Polynomial with implicit multiplication
  'sin(x)',   // Trigonometric function
  'x*sin(x)', // Explicit multiplication
  '3(x+2)',   // Coefficient with parenthesis
  '(x+1)(x-1)', // Adjacent parentheses multiplication
  '2^x',      // Exponentiation
  'e^(-x^2/2)', // Complex expression
  'log(x)',   // Logarithm
  'sqrt(x)',  // Square root
  '1/x',      // Division
  '3x^2 + 2x + 1', // Standard polynomial
  'x / (1 + x^2)' // Complex fraction
];

// Test x values
const xValues = [-5, -1, 0, 1, 5];

console.log('Testing Expression Parser...');
console.log('----------------------------');

// Evaluate each expression at different x values
testExpressions.forEach(expr => {
  console.log(`\nExpression: ${expr}`);
  console.log('-'.repeat(expr.length + 12));
  
  xValues.forEach(x => {
    try {
      const result = evaluateExpression(expr, x);
      console.log(`  x = ${x.toString().padEnd(3)} -> ${result}`);
    } catch (e) {
      console.log(`  x = ${x.toString().padEnd(3)} -> ERROR: ${e.message}`);
    }
  });
});

console.log('\nTest completed.');