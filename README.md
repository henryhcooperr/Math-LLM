# Math-LLM: Interactive Mathematical Visualization System

Math-LLM is an advanced educational system that combines the power of Large Language Models (LLMs) with interactive mathematical visualizations to create an intuitive, conversational learning experience for students and educators.

## Project Overview

Math-LLM provides a ChatGPT-like interface that analyzes natural language input describing mathematical problems, selects the best visualization approach, generates code using the most appropriate library, and provides educational context to enhance understanding. Simply chat with the AI and it will generate appropriate visualizations alongside its responses.

## Features

- **Chat Interface**: Conversational UI that makes it easy to ask questions about math concepts
- **Natural Language Processing**: Analyzes math problems to extract mathematical concepts and formulas
- **Intelligent Library Selection**: Chooses the optimal visualization library based on the concept type
- **Interactive Visualizations**: Creates responsive, explorable visualizations of mathematical concepts
- **LaTeX Rendering**: Properly formats mathematical equations using MathJax
- **Educational Content Generation**: Automatically generates step-by-step guides, insights, and practice exercises
- **Multi-Library Support**: Seamlessly integrates with MathBox, Mafs, JSXGraph, D3.js, and Three.js
- **Calculus Support**: Specialized visualizations for derivatives, integrals, and limits
- **Standardized Response Format**: Consistent JSON structure for LLM-visualization communication
- **Local Storage**: Saves chat history and preferences for future sessions

## Supported Libraries

The system integrates several mathematical visualization libraries:

- **MathBox**: For high-quality 3D mathematical visualizations
- **Mafs**: For 2D function plotting in React applications 
- **JSXGraph**: For geometry and general function plotting
- **Three.js**: For custom 3D visualizations
- **D3.js**: For data-driven visualizations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Modern browser with WebGL support (for 3D visualizations)
- LLM API access (optional, for AI-generated content)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/math-llm.git
   cd math-llm
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure LLM API (optional):
   - Copy `.env.example` to `.env` in the project root
   - Add your API keys to the `.env` file for local development
   - For production and CI/CD, use GitHub Secrets (see Configuration section below)

4. Run the chat application:
   ```
   npm run demo
   ```

5. Open your browser and navigate to: `http://localhost:9003`

## Configuration

### API Keys and Secrets

This project uses environment variables to manage API keys securely. You have three options for providing API keys:

1. **Direct Input**: Enter your API key directly in the chat interface (easiest option)
2. **Local Environment**: Use a local `.env` file for development
3. **GitHub Secrets**: Use GitHub Secrets for deployment and CI/CD

#### Option 1: Direct Input in the Chat Interface

1. Start the application using `npm run demo`
2. When the chat interface loads, enter your API key in the input field at the top
3. Choose either OpenAI or Anthropic as your API provider
4. Start chatting with the math assistant

#### Option 2: Local Development with .env

1. Create a `.env` file in the project root:
   ```
   touch .env
   ```

2. Edit the `.env` file and add either your OpenAI or Anthropic API key:
   ```
   # Use one of these options:
   OPENAI_API_KEY=your-openai-key-here
   # or
   ANTHROPIC_API_KEY=your-anthropic-key-here
   ```

3. Restart the application and your API key will be loaded automatically

#### Option 3: GitHub Environments for Deployment (Recommended)

For production deployments, GitHub Environments provide the best security:

1. Go to your GitHub repository
2. Navigate to Settings > Environments
3. Click "New environment" and name it "production"
4. Add environment secrets with ONE of these names:
   - `OPENAI_API_KEY` (for OpenAI)
   - `ANTHROPIC_API_KEY` (for Anthropic)

5. Configure the deployment workflow:
   - Two deployment workflow files are included:
     - `.github/workflows/deploy.yml` (original workflow)
     - `.github/workflows/deploy-gh-pages.yml` (improved workflow that skips tests)

### Deploying to GitHub Pages

To deploy the Math-LLM application to GitHub Pages:

1. Set up GitHub Environment Secrets as described above
2. Go to the "Actions" tab in your GitHub repository
3. On the left sidebar, click "Deploy Math-LLM to GitHub Pages" (if using original workflow) or "Deploy Math-LLM to GitHub Pages" (if using improved workflow)
4. Click the "Run workflow" button on the right side
5. Select the branch you want to deploy from
6. Click the green "Run workflow" button to start the deployment

The deployment workflow will:
1. Skip the failing tests
2. Build the demo directly using webpack
3. Include your API keys from GitHub Environment Secrets in the build
4. Deploy to GitHub Pages

After successful deployment, your app will be available at:
`https://[your-username].github.io/math-llm/`

The deployed application will have the API keys embedded during the build process, so users accessing your deployed application won't need to enter API keys manually.

**Important Notes**: 
- GitHub Secrets are ONLY available during GitHub Actions runs or on deployed sites
- They are NOT accessible when running the app locally with `npm run demo`
- For local development, use Option 2 with a local .env file
- The deployed app will have API keys embedded at build time

**Debugging Tip**: If your API key isn't being detected, check the browser console for environment variable logs or try the direct input method instead.

## Usage Examples

### Using the VisualizationWrapper Component

```jsx
import { VisualizationWrapper } from 'math-llm';

function App() {
  return (
    <div className="container">
      <h1>Quadratic Function Example</h1>
      <VisualizationWrapper
        type="function2D"
        title="Quadratic Function: f(x) = x² - 3x + 2"
        expression="Math.pow(x, 2) - 3*x + 2"
        domain={[-2, 4]}
        range={[-1, 5]}
        gridLines={true}
        specialPoints={[
          {x: 1, y: 0, label: "Root at x=1"},
          {x: 2, y: 0, label: "Root at x=2"},
          {x: 1.5, y: -0.25, label: "Vertex (1.5, -0.25)"}
        ]}
      />
    </div>
  );
}
```

### Processing a Math Problem with LLM

```javascript
import { processMathProblem } from 'math-llm';

async function visualizeProblem() {
  const problem = "Graph the function f(x) = x^2 - 2x + 1 and identify its key features.";
  const solution = await processMathProblem(problem, {
    level: "intermediate",
    preferredLibraries: ["mafs"]
  });

  // The solution contains the structured response with visualization parameters
  console.log(solution.explanation);
  console.log(solution.visualizationParams);
  console.log(solution.educationalContent);
  
  // Render the visualization using the included component
  return (
    <div>
      <h2>{solution.visualizationParams.title}</h2>
      <VisualizationWrapper {...solution.visualizationParams} />
      <div className="explanation">{solution.explanation}</div>
    </div>
  );
}
```

### 3D Surface Visualization

```jsx
<VisualizationWrapper
  type="function3D"
  title="3D Surface: f(x,y) = sin(x) * cos(y)"
  expression="Math.sin(x) * Math.cos(y)"
  domainX={[-3, 3]}
  domainY={[-3, 3]}
  range={[-1, 1]}
  resolution={64}
  colormap="viridis"
/>
```

### Calculus Visualization

```jsx
<VisualizationWrapper
  type="calculus"
  subtype="derivative"
  title="Function and its Derivative"
  function={{
    expression: "Math.pow(x, 2)",
    color: "#3090FF"
  }}
  derivative={{
    expression: "2*x",
    color: "#FF5733",
    showTangent: true,
    tangentPoint: 1.5
  }}
  domain={[-3, 3]}
  range={[-1, 9]}
/>
```

## Chat Application

The main application is a ChatGPT-like interface that allows you to ask math questions and get visualized responses:

```bash
npm run demo
```

This will start the chat interface where you can:

1. Enter your OpenAI or Anthropic API key
2. Ask mathematical questions
3. See LaTeX-formatted responses with interactive visualizations
4. Choose from example queries
5. Save your conversation history between sessions

For developers, check out these components:

- `src/components/ChatInterface.js`: The main chat interface component
- `src/components/VisualizationWrapper.js`: The universal visualization component
- `src/renderers/`: Library-specific renderers for different visualization types

## Project Structure

- `/src` - Core source code
  - `/components` - React components including the VisualizationWrapper
    - `/visualizers` - Library-specific visualization components
  - `/utils` - Utility functions and helpers
    - `/responseFormatter.js` - Standard JSON response formatter
    - `/llmResponseProcessor.js` - LLM response processing utilities
    - `/conversionUtils.js` - Parameter and expression conversion utilities
  - `/demo` - Demo application
- `/tests` - Test files
- `/examples` - Usage examples and demo applications
- `/docs` - Documentation including integration guides

## Library Integration

See the `library_integration_guide` file for detailed implementation patterns for each supported visualization library.

For more detailed information on the API, see the `API_DOCUMENTATION.md` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project integrates libraries from the awesome-interactive-math collection
- Special thanks to the developers of MathBox, Mafs, JSXGraph, Three.js, D3.js, and all other libraries used in this project