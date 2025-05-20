/**
 * Jest configuration for Math-LLM project
 */

module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'jsdom',
  
  // Directories to search for test files
  roots: ['<rootDir>/tests'],
  
  // File patterns for test files
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  
  // File patterns to ignore
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  
  // Show test coverage
  collectCoverage: true,
  
  // Directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',
  
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  
  // Transform files before running tests
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  
  // Files to include in test coverage analysis
  collectCoverageFrom: ['src/**/*.js', '!src/index.js', '!**/node_modules/**']
};