# 🚀 Deployment Guide

This guide covers multiple ways to deploy your HR Profile Tracker application online.

## Option 1: Render (Recommended - Free)

Render is perfect for full-stack Node.js applications and offers free hosting.

### Steps:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to [render.com](https://render.com) and sign up
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Name**: `hr-profile-tracker`
     - **Environment**: `Node`
     - **Build Command**: `npm run install-all && npm run build`
     - **Start Command**: `cd server && npm start`
     - **Environment Variables**:
       - `NODE_ENV` = `production`
       - `JWT_SECRET` = `your-secret-key-here` (generate a strong one)

3. **Access your app**
   - Your app will be available at `https://your-app-name.onrender.com`
   - Default login: `admin` / `admin123`

---

## Option 2: Railway (Easy & Fast)

Railway offers simple deployment with automatic builds.

### Steps:

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set environment variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your-secret-key-here
   ```

---

## Option 3: Heroku (Popular Choice)

### Steps:

1. **Install Heroku CLI**
   - Download from [heroku.com/cli](https://devcenter.heroku.com/articles/heroku-cli)

2. **Create and deploy**
   ```bash
   heroku login
   heroku create your-hr-tracker
   git push heroku main
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret-key-here
   ```

---

## Option 4: Vercel (Frontend) + Railway (Backend)

Deploy frontend and backend separately for better scalability.

### Frontend (Vercel):
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set build settings:
   - **Framework**: React
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Backend (Railway):
1. Deploy backend separately on Railway
2. Update your frontend environment variables to point to the backend URL

---

## Option 5: DigitalOcean App Platform

### Steps:

1. **Go to DigitalOcean**
   - Sign up at [digitalocean.com](https://digitalocean.com)
   - Go to "Apps" in the control panel

2. **Create new app**
   - Connect your GitHub repository
   - Configure build settings:
     - **Source Directory**: `/`
     - **Build Command**: `npm run install-all && npm run build`
     - **Run Command**: `cd server && npm start`

3. **Set environment variables**
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `your-secret-key`

---

## Option 6: Netlify (Static) + Backend Service

### For Static Deployment:

1. **Build for static hosting**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `client/build` folder
   - Or connect your GitHub repo

**Note**: You'll need a separate backend service for this option.

---

## 🔧 Production Configuration

### Environment Variables

Make sure to set these in your production environment:

```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
PORT=10000
```

### Database Considerations

The app uses SQLite by default, which works for small to medium applications. For production at scale, consider:

1. **PostgreSQL** (recommended for production)
2. **MySQL**
3. **MongoDB**

### Security Checklist

- ✅ Set strong JWT_SECRET
- ✅ Use HTTPS (most platforms provide this automatically)
- ✅ Set NODE_ENV=production
- ✅ Review CORS settings
- ✅ Consider rate limiting for API endpoints

---

## 📱 Quick Deploy Commands

### For Render:
```bash
# After pushing to GitHub, deploy automatically triggers
git push origin main
```

### For Railway:
```bash
railway up
```

### For Heroku:
```bash
git push heroku main
```

---

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check Node.js version (requires 16+)
   - Ensure all dependencies are installed
   - Check build logs for specific errors

2. **Database Issues**
   - SQLite database is created automatically
   - Check file permissions in production

3. **Environment Variables**
   - Ensure JWT_SECRET is set
   - Check that NODE_ENV=production

4. **API Connection Issues**
   - Verify API base URL configuration
   - Check CORS settings

### Getting Help:

- Check deployment platform logs
- Verify environment variables are set
- Test locally first with `NODE_ENV=production`

---

## 💡 Performance Tips

1. **Enable gzip compression**
2. **Use CDN for static assets**
3. **Implement caching strategies**
4. **Monitor application performance**
5. **Set up error logging**

---

Choose the deployment option that best fits your needs. Render is recommended for beginners due to its simplicity and free tier.