# Deployment Guide

## Step 1: Push to GitHub

### Option A: Using Git CLI

```bash
# Navigate to project directory
cd "n:\Elmtalq\Elmtalq\Frontendelmotalq\Recruitment Management UI System"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial deployment - Elmtalq Recruitment System"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/elmotalq-recruitment.git

# Push to GitHub
git push -u origin main
```

### Option B: Using GitHub Desktop or VS Code

1. Open the project in VS Code
2. Click on Source Control (left sidebar)
3. Stage all changes
4. Write commit message: "Initial deployment - Elmtalq Recruitment System"
5. Commit
6. Push to GitHub

---

## Step 2: Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Root Directory**: `./` (or `Frontendelmotalq/Recruitment Management UI System` if repo contains other folders)
4. Click **Deploy**

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to project
cd "n:\Elmtalq\Elmtalq\Frontendelmotalq\Recruitment Management UI System"

# Deploy
vercel --prod
```

---

## Configuration Files Included

### `vercel.json`
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing support (all routes → index.html)

### `vite.config.ts`
- Vite + React configuration
- Tailwind CSS integration

### `package.json`
- Build script: `vite build`
- Dev script: `vite`

---

## Post-Deployment

### Environment Variables (if needed)

If you need to add environment variables:

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add:
   - `VITE_API_URL` = `https://elmotalq.runasp.net` (or your API URL)

### Custom Domain (optional)

1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your custom domain

---

## Troubleshooting

### Build fails?
- Ensure `dist` folder is in `.gitignore`
- Check Node.js version (18+ recommended)

### 404 on refresh?
- `vercel.json` rewrite rules handle this
- Ensure SPA routing is configured

### API not working?
- Check CORS settings on backend
- Verify `API_BASE_URL` in `src/app/services/api.ts`

---

## Quick Checklist

- [ ] Code committed to GitHub
- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] Framework set to "Vite"
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Deployed successfully
