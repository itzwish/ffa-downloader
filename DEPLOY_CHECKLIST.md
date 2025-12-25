# Deployment Checklist: Replit + Vercel

Your step-by-step checklist for deploying to Replit (backend) and Vercel (frontend).

## ✅ Pre-Deployment Checklist

- [ ] Code is in GitHub repository
- [ ] All files are committed and pushed
- [ ] You have a Replit account (free at replit.com)
- [ ] You have a Vercel account (free at vercel.com)
- [ ] Your GitHub account is connected to Vercel

## 📦 Step 1: Prepare Code (Local)

- [ ] Navigate to project root: `cd ytDownloader-main`
- [ ] Run locally to test: `npm run dev`
- [ ] Open http://localhost:3000 in browser
- [ ] Try downloading a video (make sure it works locally)
- [ ] Commit any changes: `git add . && git commit -m "Ready for deployment"`
- [ ] Push to GitHub: `git push`

## 🚀 Step 2: Deploy Backend to Replit

1. **Create Replit Project**
   - [ ] Go to https://replit.com
   - [ ] Click "Create Replit" → "Import from GitHub"
   - [ ] Select your repository
   - [ ] Wait for import to complete

2. **Configure Secrets**
   - [ ] Click 🔒 Secrets icon on left sidebar
   - [ ] Add: `NODE_ENV=production`
   - [ ] Add: `FRONTEND_URL=` (leave empty for now, update later)
   - [ ] Add: `MAX_FILE_SIZE_MB=500`

3. **Install Dependencies**
   - [ ] Click "Shell" tab
   - [ ] Run: `cd web && npm install`
   - [ ] This takes 1-2 minutes

4. **Install yt-dlp**
   - [ ] In Shell, run: `pip install yt-dlp`
   - [ ] Verify: `yt-dlp --version`

5. **Start Backend**
   - [ ] In Shell, run: `npm start`
   - [ ] See message: "🚀 Server running on http://localhost:3000"
   - [ ] Backend is now live! 🎉

6. **Get Replit URL**
   - [ ] Look at top of Replit window
   - [ ] Find URL like: `https://ytdownloader-backend-username.replit.dev`
   - [ ] **Copy this URL** - you'll need it for frontend!

7. **Update Replit Secrets**
   - [ ] Go back to Secrets (🔒)
   - [ ] Update `FRONTEND_URL=https://your-vercel-domain.vercel.app`
   - [ ] Leave empty for now if you don't have Vercel domain yet
   - [ ] Update after deploying frontend

## 🌐 Step 3: Deploy Frontend to Vercel

1. **Create Vercel Project**
   - [ ] Go to https://vercel.com
   - [ ] Click "Add New" → "Project"
   - [ ] Click "Import Git Repository"
   - [ ] Select your GitHub repository
   - [ ] Click "Import"

2. **Configure Build Settings**
   - [ ] Find "Root Directory" field
   - [ ] Click "Edit"
   - [ ] Change to: `web/public`
   - [ ] Click "Save"

3. **Deploy**
   - [ ] Click "Deploy"
   - [ ] Wait for deployment to complete (takes 1-2 minutes)
   - [ ] You'll see: "Congratulations! Your project has been deployed"

4. **Get Vercel URL**
   - [ ] Copy the deployment URL shown
   - [ ] Format: `https://ytdownloader.vercel.app` (or similar)
   - [ ] **Save this URL**

5. **Update Environment Variables**
   - [ ] Click "Settings" tab in Vercel
   - [ ] Go to "Environment Variables"
   - [ ] Add new variable:
     - Name: `REACT_APP_API_URL`
     - Value: `https://your-replit-url.replit.dev` (from Step 2)
   - [ ] Click "Save"

6. **Redeploy Frontend**
   - [ ] Click "Deployments" tab
   - [ ] Click the latest deployment
   - [ ] Click "Redeploy"
   - [ ] Wait for redeploy to complete

## 🔗 Step 4: Update Backend CORS

1. **Update Replit Secrets**
   - [ ] Go back to Replit
   - [ ] Click Secrets (🔒)
   - [ ] Update `FRONTEND_URL=https://your-vercel-domain.vercel.app`
   - [ ] Example: `FRONTEND_URL=https://ytdownloader.vercel.app`

2. **Restart Backend**
   - [ ] In Replit Shell, stop server (Ctrl+C)
   - [ ] Run: `npm start`
   - [ ] Backend now allows requests from your Vercel domain

## ✨ Step 5: Test Everything

1. **Open Vercel Frontend**
   - [ ] Go to your Vercel URL in browser
   - [ ] Page should load normally
   - [ ] You should see the YouTube downloader UI

2. **Test API Connection**
   - [ ] Open browser Developer Console (F12)
   - [ ] Paste a YouTube URL in the app
   - [ ] Click "Fetch Info"
   - [ ] Check Console for errors
   - [ ] If successful, you see video title & thumbnail

3. **Test Download**
   - [ ] Select a format (MP4 or Audio)
   - [ ] Select quality
   - [ ] Click "Start Download"
   - [ ] See progress bar
   - [ ] Download completes → ✅ Success!

## 🎯 Final Checklist

- [ ] Backend running on Replit
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] Frontend loads without errors
- [ ] API calls work (fetch info succeeds)
- [ ] Downloads work end-to-end
- [ ] Share your Vercel URL! 🚀

## 📝 URLs to Keep

**Backend (Replit):**
```
https://your-replit-url.replit.dev
```

**Frontend (Vercel):**
```
https://your-vercel-domain.vercel.app
```

## 🆘 Troubleshooting

**If frontend shows blank page:**
- Check browser Console (F12) for errors
- Verify `REACT_APP_API_URL` is set in Vercel
- Redeploy frontend

**If API calls fail:**
- Check Replit backend is running (`npm start`)
- Verify `FRONTEND_URL` in Replit matches Vercel domain exactly
- Check browser Console for CORS errors

**If download fails:**
- Check Replit has yt-dlp installed (`pip install yt-dlp`)
- Try lower quality (480p instead of 1080p)
- Check Replit storage quota

**Need help?**
- See [DEPLOY_SPLIT.md](../DEPLOY_SPLIT.md) for detailed guide
- See [DEPLOY_REPLIT.md](../DEPLOY_REPLIT.md) for backend issues
- See [DEPLOY_VERCEL.md](../DEPLOY_VERCEL.md) for frontend issues

## 🎉 You're Done!

Your YouTube downloader is now live:
- Frontend: Vercel (fast, scalable)
- Backend: Replit (handles downloads)
- Both: Free tier!

Share your Vercel URL with friends! 🚀
