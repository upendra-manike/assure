# GitHub Pages Setup Instructions

## Automatic Deployment

The GitHub Pages site is automatically deployed via GitHub Actions when you push to the `main` branch.

## Manual Setup (if needed)

1. Go to your GitHub repository: https://github.com/upendra-manike/assure
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select:
   - **Deploy from a branch**
   - Branch: `main`
   - Folder: `/docs`
4. Click **Save**

## Important Files

- `.nojekyll` - Disables Jekyll processing (required for static HTML)
- `index.html` - Main documentation page
- `_config.yml` - Jekyll config (fallback)

## Troubleshooting

If the site doesn't deploy:

1. Check GitHub Actions tab for deployment status
2. Verify `.nojekyll` file exists in `/docs` folder
3. Ensure GitHub Pages is enabled in repository settings
4. Check that the workflow file `.github/workflows/pages.yml` exists

## Site URL

Once deployed, your site will be available at:
**https://upendra-manike.github.io/assure/**

