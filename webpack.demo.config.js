const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/demo/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'demo.bundle.js',
    publicPath: './',  // This makes GitHub Pages paths work correctly
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
      title: 'Math-LLM Demo'
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
      'process.env.ANTHROPIC_API_KEY': JSON.stringify(process.env.ANTHROPIC_API_KEY)
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