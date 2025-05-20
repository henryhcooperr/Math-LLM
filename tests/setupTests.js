/**
 * Setup file for Jest tests in Math-LLM project
 */

// Import Jest DOM testing library
import '@testing-library/jest-dom';

// Global setup required for testing
global.mockWolframAlphaService = {
  getDerivative: jest.fn(),
  getIntegral: jest.fn(),
  getLimit: jest.fn()
};

// Mock the wolframAlphaService module
jest.mock('../src/services/wolframAlphaService', () => ({
  __esModule: true,
  default: global.mockWolframAlphaService
}));

// Silence React Testing Library's console errors during tests
// This helps with tests that expect to find certain DOM elements
jest.spyOn(console, 'error').mockImplementation(() => {});