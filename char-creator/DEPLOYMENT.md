# Deployment Guide - GitHub Pages

This guide explains how to deploy the Shimmering Reach Character Creator to GitHub Pages.

## Automatic Deployment (Recommended)

The app is configured to automatically deploy to GitHub Pages whenever you push to the `main` branch.

### Setup Steps:

1. **Create GitHub Repository**
   ```bash
   # Initialize and push if not already done
   git add .
   git commit -m "Prepare for GitHub Pages deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/char-creator.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: **GitHub Actions**
   - Save the settings

3. **Deployment**
   - The GitHub Action will automatically run on every push to `main`
   - Check the **Actions** tab to see deployment progress
   - Once complete, your app will be live at:
     `https://YOUR_USERNAME.github.io/char-creator/`

## Manual Deployment

If you prefer to deploy manually:

```bash
# Build the app
npm run build

# The built files are in the dist/ folder
# You can manually upload these to GitHub Pages or any static host
```

## Configuration

The app is configured for GitHub Pages in `vite.config.ts`:
```typescript
base: '/char-creator/'
```

If you deploy to a different path or custom domain, update this value accordingly.

## Troubleshooting

**Assets not loading?**
- Make sure the `base` path in `vite.config.ts` matches your repository name
- Clear your browser cache

**GitHub Action failing?**
- Check that GitHub Pages is enabled in repository settings
- Ensure the workflow has the correct permissions
- View the Actions tab for detailed error logs

**404 on navigation?**
- This is a single-page app (SPA) - you may need to add a `404.html` that redirects to `index.html`
- The app uses client-side routing, so all routes work once loaded

## Custom Domain

To use a custom domain:

1. Add a `CNAME` file to the `public/` folder with your domain
2. Update `base: '/'` in `vite.config.ts`
3. Configure DNS settings with your domain provider
4. Enable HTTPS in GitHub Pages settings
