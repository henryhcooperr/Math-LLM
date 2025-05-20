/**
 * Utility functions for visualization rendering
 */

/**
 * Ensures a container element exists for JSXGraph and other libraries
 * that require a pre-existing DOM element
 * 
 * @param {string} libraryName - The name of the library requiring a container
 * @returns {HTMLElement} - A div element with a unique ID for the library to use
 */
export const ensureContainer = (libraryName) => {
  // Generate a unique ID
  const uniqueId = `${libraryName.toLowerCase()}-${Math.random().toString(36).substring(2, 8)}`;
  
  // Create a container element
  const container = document.createElement('div');
  container.id = uniqueId;
  container.className = `${libraryName.toLowerCase()}-container`;
  container.style.width = '100%';
  container.style.height = '400px';
  
  return { container, containerId: uniqueId };
};

/**
 * Creates a visualization error message element
 * 
 * @param {string} message - The error message to display
 * @returns {HTMLElement} - A div containing the error message
 */
export const createErrorMessage = (message) => {
  const errorContainer = document.createElement('div');
  errorContainer.style.width = '100%';
  errorContainer.style.height = '400px';
  errorContainer.style.display = 'flex';
  errorContainer.style.alignItems = 'center';
  errorContainer.style.justifyContent = 'center';
  errorContainer.style.color = '#e74c3c';
  errorContainer.style.border = '1px solid #e74c3c';
  errorContainer.style.borderRadius = '4px';
  errorContainer.style.padding = '20px';
  errorContainer.style.backgroundColor = '#fef5f5';
  errorContainer.style.fontFamily = 'sans-serif';
  
  errorContainer.textContent = message;
  
  return errorContainer;
};

/**
 * Creates a loading indicator element
 * 
 * @returns {HTMLElement} - A div containing the loading indicator
 */
export const createLoadingIndicator = () => {
  const loadingContainer = document.createElement('div');
  loadingContainer.style.width = '100%';
  loadingContainer.style.height = '400px';
  loadingContainer.style.display = 'flex';
  loadingContainer.style.alignItems = 'center';
  loadingContainer.style.justifyContent = 'center';
  loadingContainer.style.color = '#3498db';
  loadingContainer.style.fontFamily = 'sans-serif';
  
  loadingContainer.textContent = 'Loading visualization...';
  
  return loadingContainer;
};

export default {
  ensureContainer,
  createErrorMessage,
  createLoadingIndicator
};