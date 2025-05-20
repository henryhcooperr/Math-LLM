# GitHub Pages Setup Guide

To successfully deploy the Math-LLM project to GitHub Pages, make sure you properly configure your repository settings:

## 1. Repository Permissions

Ensure your repository has proper permissions for GitHub Actions:

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Navigate to "Actions" > "General" on the left sidebar
4. Under "Workflow permissions", select:
   - "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"
5. Click "Save"

## 2. GitHub Pages Settings

Configure the GitHub Pages settings:

1. Go to your repository on GitHub 
2. Click on "Settings" tab
3. Navigate to "Pages" on the left sidebar
4. Under "Build and deployment", configure:
   - Source: "GitHub Actions"
5. Click "Save"

## 3. Branch Protection (Optional)

If you use branch protection rules, ensure GitHub Actions can push to protected branches:

1. Go to "Settings" > "Branches"
2. Select the branch protection rule for your default branch
3. Under "Allow specified actors to bypass required pull requests", add:
   - "github-actions[bot]"
4. Save the changes

## 4. Running the Deployment

After configuring these settings:

1. Go to the "Actions" tab in your repository
2. Select the "Deploy Math-LLM to GitHub Pages (Unified)" workflow
3. Click "Run workflow" button
4. Select the branch you want to deploy from
5. Click "Run workflow"

The workflow will build and deploy your application to GitHub Pages.

## Troubleshooting

If you encounter 403 errors during deployment:
- Double-check the workflow permissions in the "Settings" > "Actions" section
- Ensure GITHUB_TOKEN has proper permissions in the workflow file
- Check that the repository allows GitHub Actions to write to the repository