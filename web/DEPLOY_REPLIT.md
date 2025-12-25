# Deploy Backend to Replit

This guide shows how to deploy the Node.js backend to Replit.

## Step 1: Create Replit Project

1. Go to [replit.com](https://replit.com)
2. Click "Create Replit"
3. Choose "Import from GitHub"
4. Paste your repository URL
5. Wait for import to complete

## Step 2: Configure Environment Variables

In Replit, click the "Secrets" icon (lock icon on the left sidebar):

```
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-frontend.vercel.app
MAX_FILE_SIZE_MB=500
```

Replace `https://your-vercel-frontend.vercel.app` with your actual Vercel domain.

## Step 3: Install Python & FFmpeg

In the Replit Shell, run:

```bash
pip install yt-dlp
```

Replit includes FFmpeg by default, so no additional setup needed.

## Step 4: Update run command

Edit `.replit` file in the web directory:

```
run = "npm install && npm start"
```

Or run these commands in the shell:

```bash
cd web
npm install
npm start
```

## Step 5: Get Replit URL

Once running, Replit shows your URL at the top:
- Example: `https://ytdownloader-backend-username.replit.dev`

**Copy this URL** - you'll need it for the frontend configuration.

## Step 6: Update Frontend

In your Vercel frontend, set environment variable:

```
REACT_APP_API_URL=https://ytdownloader-backend-username.replit.dev
```

## Testing

Test the backend API:

```bash
curl https://your-replit-url.replit.dev/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-12-24T..."}
```

## Environment Variables Reference

| Variable | Value | Notes |
|----------|-------|-------|
| `PORT` | `3000` | Replit assigns this automatically |
| `NODE_ENV` | `production` | Disables static frontend serving |
| `FRONTEND_URL` | Vercel domain | For CORS configuration |
| `MAX_FILE_SIZE_MB` | `500` | Adjust based on Replit tier |

## Troubleshooting

### yt-dlp not found
```bash
pip install -U yt-dlp
```

### Port already in use
Replit assigns ports automatically, usually works fine.

### CORS errors on frontend
Make sure `FRONTEND_URL` environment variable matches your Vercel domain exactly.

### Memory/Size Issues
- Replit free tier has limits
- Use `MAX_FILE_SIZE_MB=500` for smaller files
- Consider upgrading for larger downloads

## Keeping Updated

To update your Replit project:

1. Push changes to GitHub
2. In Replit, click "Git" → "Pull"
3. Restart the app

Done! Your backend is live on Replit. 🎉
