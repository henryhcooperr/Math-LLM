/**
 * Main application script for Math-LLM
 * This file connects the user interface with the Math-LLM library functionality
 */

// Import visualization styles
import './styles/visualizations.css';

import {
  processMathProblem,
  renderVisualization,
  getDerivative,
  getIntegral,
  getLimit,
  solveEquation,
  simplifyExpression,
  generateStepByStepExplanation
} from './index';

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get references to DOM elements
  const problemInput = document.getElementById('problem-input');
  const processButton = document.getElementById('process-button');
  const visualizationDisplay = document.getElementById('visualization-display');
  const analysisContent = document.getElementById('analysis-content');
  const codeContent = document.getElementById('code-content');
  const educationContent = document.getElementById('education-content');
  const exampleButtons = document.querySelectorAll('.example-button');
  
  // Set up tab switching
  setupTabs();
  
  // Set up example buttons
  setupExampleButtons(exampleButtons, problemInput, processButton);
  
  // Set up process button
  if (processButton) {
    processButton.addEventListener('click', async () => {
      await handleProblemSubmission(
        problemInput, 
        visualizationDisplay, 
        analysisContent, 
        codeContent, 
        educationContent
      );
    });
  }
});

/**
 * Set up tab switching functionality
 */
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and content
      document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      document.getElementById(button.dataset.tab + '-tab').classList.add('active');
    });
  });
}

/**
 * Set up example buttons functionality
 */
function setupExampleButtons(buttons, inputElement, processButton) {
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      if (inputElement) {
        inputElement.value = button.dataset.example;
        if (processButton) {
          processButton.click();
        }
      }
    });
  });
}

/**
 * Handle the submission of a problem
 */
async function handleProblemSubmission(
  problemInput, 
  visualizationDisplay, 
  analysisContent, 
  codeContent, 
  educationContent
) {
  const problem = problemInput?.value;
  
  if (!problem?.trim()) {
    alert('Please enter a math problem or question.');
    return;
  }
  
  // Show loading states
  if (visualizationDisplay) {
    visualizationDisplay.innerHTML = '<div style="text-align: center; padding-top: 180px;">Processing...</div>';
  }
  if (analysisContent) {
    analysisContent.textContent = 'Analyzing...';
  }
  if (codeContent) {
    codeContent.textContent = 'Generating code...';
  }
  if (educationContent) {
    educationContent.innerHTML = 'Creating educational content...';
  }
  
  try {
    // Process the math problem using the library
    const solution = await processMathProblem(problem);
    
    // Update the visualization display
    if (visualizationDisplay) {
      // First, clear the visualization display
      visualizationDisplay.innerHTML = '';
      
      try {
        // Create a container for JSXGraph to use
        const jsxContainer = document.createElement('div');
        jsxContainer.id = `jsxgraph-container-${Math.random().toString(36).substring(2, 8)}`;
        jsxContainer.style.width = '100%';
        jsxContainer.style.height = '400px';
        visualizationDisplay.appendChild(jsxContainer);
        
        // Render the visualization
        const visualization = renderVisualization({
          type: solution.analysis.concept.type,
          library: solution.selectedLibrary,
          expression: solution.analysis.concept.expression,
          domain: solution.analysis.parameters?.domain || [-10, 10],
          range: solution.analysis.parameters?.range || [-10, 10],
          zRange: solution.analysis.visualization?.viewport?.z,
          points: solution.analysis.parameters?.points,
          containerId: jsxContainer.id // Pass the container ID to the renderer
        });
        
        // Only append if it's not JSXGraph (which renders directly into the container)
        if (solution.selectedLibrary !== 'jsxgraph') {
          visualizationDisplay.appendChild(visualization);
        }
      } catch (vizError) {
        console.error("Visualization error:", vizError);
        visualizationDisplay.innerHTML = `
          <div style="text-align: center; padding-top: 180px; color: red;">
            Visualization Error: ${vizError.message || 'An error occurred while rendering the visualization.'}
          </div>
        `;
      }
    }
    
    // Update the analysis tab
    if (analysisContent) {
      analysisContent.textContent = JSON.stringify(solution.analysis, null, 2);
    }
    
    // Update the code tab
    if (codeContent) {
      codeContent.textContent = solution.visualizationCode?.code || 'No code generated.';
    }
    
    // Update the educational content tab
    if (educationContent) {
      const content = solution.educationalContent;
      const explanation = solution.solutionExplanation;
      
      const educationHtml = `
        <h4>${content.title || 'Mathematical Concept'}</h4>
        <p>${content.summary || ''}</p>
        ${explanation ? `<h4>Step-by-Step Explanation:</h4>
        <ol>
          ${explanation.steps?.map(step => `<li>${step.content}</li>`).join('') || ''}
        </ol>` : ''}
        <h4>Key Points:</h4>
        <ul>
          ${content.keyPoints?.map(point => `<li>${point}</li>`).join('') || ''}
        </ul>
      `;
      
      educationContent.innerHTML = educationHtml;
    }
    
  } catch (error) {
    console.error('Error processing problem:', error);
    
    // Update UI with error message
    if (visualizationDisplay) {
      visualizationDisplay.innerHTML = `
        <div style="text-align: center; padding-top: 180px; color: red;">
          Error: ${error.message || 'An error occurred while processing the problem.'}
        </div>
      `;
    }
    if (analysisContent) {
      analysisContent.textContent = 'Error during analysis.';
    }
    if (codeContent) {
      codeContent.textContent = 'Error generating code.';
    }
    if (educationContent) {
      educationContent.innerHTML = 'Error creating educational content.';
    }
  }
}

// Expose key functionality to the global scope for debugging and direct usage
window.MathLLM = {
  processMathProblem,
  renderVisualization,
  getDerivative,
  getIntegral,
  getLimit,
  solveEquation,
  simplifyExpression,
  generateStepByStepExplanation
};