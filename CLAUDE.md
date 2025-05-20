# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository is focused on a Math Visualization System that integrates various interactive mathematics libraries. The system provides visualizations for mathematical concepts using libraries selected based on the specific visualization requirements.

## Key Visualization Libraries

The repository integrates several major math visualization libraries:

1. **MathBox** - For 3D mathematical visualizations, built on Three.js
2. **Mafs** - For 2D function plotting in React applications
3. **JSXGraph** - For geometry and function plotting
4. **Three.js** - For general 3D visualizations
5. **D3.js** - For data-driven visualizations and custom charts

## Library Selection Guidelines

When implementing visualizations, select the appropriate library based on:

- Is the visualization for a React application?
- Is it 2D or 3D?
- Is it for education/classroom use?
- Does it require geometric constructions?
- Is it data-driven or needs customization?
- Is it specifically for mathematical concepts?

Refer to the decision tree in `library_integration_guide` for detailed selection criteria.

## Integration Patterns

Each library has specific integration patterns detailed in the codebase:

- MathBox: Use for high-quality 3D mathematical visualizations
- Mafs: Use for simple 2D functions in React applications
- JSXGraph: Use for geometry and general function plotting
- Three.js: Use for custom 3D visualizations
- D3.js: Use for data-driven and highly customized visualizations

## Universal Visualization Wrapper

The `VisualizationWrapper` component automatically selects the appropriate library based on visualization requirements. This is the recommended entry point for new visualizations.

## Converting Between Libraries

Use the provided conversion utilities when switching between libraries:
- `convertParameters()` - To convert visualization parameters
- `convertExpression()` - To convert mathematical expressions between library formats