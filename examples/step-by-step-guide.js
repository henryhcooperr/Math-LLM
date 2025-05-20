/**
 * Math-LLM Step-by-Step Guide Examples
 * Demonstrates how to use the step-by-step explanation generator to create
 * detailed guides for different types of math problems.
 */

// Import the necessary functions from the library
import { processMathProblem, generateStepByStepExplanation } from '../src/index';

// Example 1: Function Analysis Step-by-Step Guide
async function functionExample() {
  const problem = "Analyze the function f(x) = x^3 - 6x^2 + 9x + 1. Find its critical points, determine where it's increasing or decreasing, and identify any extrema.";
  
  console.log("Example 1: Step-by-Step Guide for Function Analysis");
  console.log("Problem:", problem);
  
  // Generate the step-by-step explanation
  const explanation = await generateStepByStepExplanation(problem);
  
  // Display the explanation
  displayExplanation(explanation, 'function-container');
}

// Example 2: Calculus Step-by-Step Guide
async function calculusExample() {
  const problem = "Find the derivative of f(x) = x^2 * ln(x) using the product rule, and then evaluate the derivative at x = 2.";
  
  console.log("Example 2: Step-by-Step Guide for Calculus Problem");
  console.log("Problem:", problem);
  
  // Generate the step-by-step explanation
  const explanation = await generateStepByStepExplanation(problem);
  
  // Display the explanation
  displayExplanation(explanation, 'calculus-container');
}

// Example 3: Geometry Step-by-Step Guide
async function geometryExample() {
  const problem = "Calculate the area and perimeter of a triangle with vertices at (0,0), (4,0), and (2,3).";
  
  console.log("Example 3: Step-by-Step Guide for Geometry Problem");
  console.log("Problem:", problem);
  
  // Generate the step-by-step explanation
  const explanation = await generateStepByStepExplanation(problem);
  
  // Display the explanation
  displayExplanation(explanation, 'geometry-container');
}

// Example 4: Advanced Calculus Step-by-Step Guide
async function advancedCalculusExample() {
  const problem = "Find the volume of the solid obtained by rotating the region bounded by y = x^2, y = 0, and x = 2 about the y-axis using the disk method.";
  
  console.log("Example 4: Step-by-Step Guide for Advanced Calculus Problem");
  console.log("Problem:", problem);
  
  // Process the problem to get both analysis and solution explanation
  const solution = await processMathProblem(problem);
  
  console.log("Analysis:", solution.analysis);
  console.log("Step-by-Step Explanation:", solution.solutionExplanation);
  
  // Display the explanation (from the solution object)
  displayExplanation(solution.solutionExplanation, 'advanced-calculus-container');
}

// Helper function to display the explanation in a structured way
function displayExplanation(explanation, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Create the explanation content
  const content = document.createElement('div');
  content.className = 'explanation-content';
  
  // Add title and summary
  const title = document.createElement('h3');
  title.textContent = explanation.title;
  content.appendChild(title);
  
  const summary = document.createElement('p');
  summary.className = 'summary';
  summary.textContent = explanation.summary;
  content.appendChild(summary);
  
  // Add steps
  const stepsList = document.createElement('div');
  stepsList.className = 'steps-list';
  
  explanation.steps.forEach((step, index) => {
    const stepItem = document.createElement('div');
    stepItem.className = 'step-item';
    
    const stepNumber = document.createElement('div');
    stepNumber.className = 'step-number';
    stepNumber.textContent = `Step ${index + 1}`;
    stepItem.appendChild(stepNumber);
    
    const stepTitle = document.createElement('h4');
    stepTitle.textContent = step.title;
    stepItem.appendChild(stepTitle);
    
    const stepContent = document.createElement('p');
    stepContent.textContent = step.content;
    stepItem.appendChild(stepContent);
    
    if (step.emphasis) {
      const emphasis = document.createElement('div');
      emphasis.className = 'emphasis';
      emphasis.textContent = step.emphasis;
      stepItem.appendChild(emphasis);
    }
    
    stepsList.appendChild(stepItem);
  });
  
  content.appendChild(stepsList);
  
  // Add practice questions if available
  if (explanation.questions && explanation.questions.length > 0) {
    const questionsTitle = document.createElement('h4');
    questionsTitle.textContent = 'Practice Questions';
    content.appendChild(questionsTitle);
    
    const questionsList = document.createElement('ul');
    questionsList.className = 'questions-list';
    
    explanation.questions.forEach(question => {
      const questionItem = document.createElement('li');
      questionItem.className = 'question-item';
      
      const questionText = document.createElement('p');
      questionText.textContent = question.question;
      questionText.className = 'question-text';
      questionItem.appendChild(questionText);
      
      if (question.hint) {
        const hintText = document.createElement('p');
        hintText.textContent = `Hint: ${question.hint}`;
        hintText.className = 'hint-text';
        questionItem.appendChild(hintText);
      }
      
      questionsList.appendChild(questionItem);
    });
    
    content.appendChild(questionsList);
  }
  
  // Add references if available
  if (explanation.references && explanation.references.length > 0) {
    const referencesTitle = document.createElement('h4');
    referencesTitle.textContent = 'References';
    content.appendChild(referencesTitle);
    
    const referencesList = document.createElement('ul');
    referencesList.className = 'references-list';
    
    explanation.references.forEach(reference => {
      const referenceItem = document.createElement('li');
      referenceItem.textContent = reference;
      referencesList.appendChild(referenceItem);
    });
    
    content.appendChild(referencesList);
  }
  
  // Add the content to the container
  container.appendChild(content);
}

// Run the examples when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  // Add container elements to the page
  const app = document.getElementById('app');
  if (app) {
    // Example 1
    const container1 = document.createElement('div');
    container1.id = 'function-container';
    container1.innerHTML = '<h2>Example 1: Function Analysis Step-by-Step Guide</h2>';
    container1.className = 'example-container';
    app.appendChild(container1);
    
    // Example 2
    const container2 = document.createElement('div');
    container2.id = 'calculus-container';
    container2.innerHTML = '<h2>Example 2: Calculus Step-by-Step Guide</h2>';
    container2.className = 'example-container';
    app.appendChild(container2);
    
    // Example 3
    const container3 = document.createElement('div');
    container3.id = 'geometry-container';
    container3.innerHTML = '<h2>Example 3: Geometry Step-by-Step Guide</h2>';
    container3.className = 'example-container';
    app.appendChild(container3);
    
    // Example 4
    const container4 = document.createElement('div');
    container4.id = 'advanced-calculus-container';
    container4.innerHTML = '<h2>Example 4: Advanced Calculus Step-by-Step Guide</h2>';
    container4.className = 'example-container';
    app.appendChild(container4);
    
    // Run the examples
    functionExample();
    calculusExample();
    geometryExample();
    advancedCalculusExample();
  }
});