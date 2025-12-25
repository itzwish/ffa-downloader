# Deploy Frontend to Vercel

This guide shows how to deploy the HTML/CSS/JS frontend to Vercel.

## Step 1: Prepare Frontend Files

The frontend is in `web/public/` directory:
- `index.html` - Main UI
- `app.js` - Frontend logic
- `styles.css` - Styling

## Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Paste your GitHub repository URL
5. Click "Import"

## Step 3: Configure Build Settings

In Vercel Project Settings:

**Root Directory:** `web/public`

**Build Command:** (leave empty - static site)

**Install Command:** (leave empty)

**Output Directory:** (leave empty)

Then click "Deploy"

## Step 4: Set Environment Variables

After deployment, go to **Settings** → **Environment Variables**:

Add the backend API URL:

```
VITE_API_URL=https://your-replit-url.replit.dev
```

Or if using different env name:

```
REACT_APP_API_URL=https://your-replit-url.replit.dev
```

Replace with your actual Replit backend URL.

## Step 5: Update Frontend Code

In `web/public/app.js`, make sure it uses the backend URL:

```javascript
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000'
  : process.env.REACT_APP_API_URL || 'https://your-replit-url.replit.dev';
```

Or update the API_URL constant at the top of app.js:

```javascript
// At the top of app.js
const API_URL = 'https://your-replit-backend.replit.dev';
```

## Step 6: Deploy

1. Push your changes to GitHub
2. Vercel auto-deploys on push
3. Check deployment status in Vercel dashboard

Your frontend URL will be:
- `https://ytdownloader-frontend.vercel.app` (or custom domain)

## Testing the Connection

1. Open your Vercel URL
2. Try to download a video
3. Check browser console (F12) for errors
4. Verify backend API is responding

## API Endpoints Your Frontend Calls

```
POST /api/info - Get video metadata
POST /api/download/start - Start download
GET /api/download/status/:id - Check progress
GET /api/download/file/:id - Get file
DELETE /api/download/:id - Cancel download
GET /api/health - Health check
```

All requests must go to your Replit backend URL.

## Troubleshooting

### CORS Errors
Make sure your Replit backend has correct CORS:
```javascript
// In server.js
app.use(cors({
  origin: 'https://your-vercel-domain.vercel.app',
  credentials: true
}));
```

### API URL Not Set
Check that `REACT_APP_API_URL` environment variable is set in Vercel Settings.

### 404 on API calls
Verify the Replit backend is running:
```bash
curl https://your-replit-url.replit.dev/api/health
```

### Static files not loading
Make sure Vercel root directory is set to `web/public`.

## Environment Variables Reference

| Variable | Value | Location |
|----------|-------|----------|
| `REACT_APP_API_URL` | Replit URL | Vercel Settings |

## Custom Domain (Optional)

To use a custom domain:
1. Go to Vercel Project Settings
2. Click "Domains"
3. Add your domain
4. Follow DNS setup instructions

## Redeployment

To redeploy after backend changes:
1. Push to GitHub
2. Vercel auto-deploys
3. No code changes needed if backend URL stays same

Done! Your frontend is live on Vercel. 🎉
