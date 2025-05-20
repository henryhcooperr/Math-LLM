/**
 * Setup file for Jest tests in Math-LLM project
 */

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