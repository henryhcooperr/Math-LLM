const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

// Check if we're in the GitHub Actions environment
const isGitHubAction = process.env.GITHUB_ACTIONS === 'true';
const skipTests = process.env.SKIP_TESTS === 'true';

// Log environment variables for debugging (in build process only)
if (isGitHubAction || skipTests) {
  console.log('Building with environment variables:');
  console.log('- GITHUB_ACTIONS:', process.env.GITHUB_ACTIONS);
  console.log('- SKIP_TESTS:', process.env.SKIP_TESTS);
  console.log('- OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
  console.log('- ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY);
}

// Get the repository name to handle GitHub Pages path correctly
const getRepoName = () => {
  if (process.env.GITHUB_REPOSITORY) {
    return process.env.GITHUB_REPOSITORY.split('/')[1];
  }
  return '';
};

// Determine the publicPath for GitHub Pages
const getPublicPath = () => {
  if (isGitHubAction) {
    const repoName = getRepoName();
    console.log(`Building for GitHub Pages with repository name: ${repoName}`);
    // Use root path when deployed directly to username.github.io
    if (repoName.toLowerCase() === 'username.github.io') {
      return '/';
    }
    // Otherwise use the repository name as the base path
    // Fix case sensitivity issue - GitHub Pages URLs are case-sensitive
    return `/Math-LLM/`;
  }
  return './';
};

const publicPath = getPublicPath();
console.log(`Using publicPath: ${publicPath}`);

module.exports = {
  entry: './src/demo/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'demo.bundle.js',
    publicPath: publicPath,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/demo/index.html',
      title: 'Math-LLM Demo',
      filename: 'index.html', // Ensure the output is named index.html
    }),
    new Dotenv({
      systemvars: true, // Load all system environment variables as well
      safe: false, // Don't require .env.example for all vars
      defaults: false, // Don't load .env.defaults
      prefix: 'process.env.' // Add process.env prefix to each variable
    }),
    // This allows webpack to use environment variables from the build process
    new webpack.DefinePlugin({
      'process.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY),
      'process.env.ANTHROPIC_API_KEY': JSON.stringify(process.env.ANTHROPIC_API_KEY),
      'process.env.SKIP_TESTS': JSON.stringify(process.env.SKIP_TESTS || 'false'),
      'process.env.GITHUB_ACTIONS': JSON.stringify(process.env.GITHUB_ACTIONS || 'false')
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9003,
    open: true
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      fs: false,
      path: false
    }
  }
};