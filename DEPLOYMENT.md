# Deployment Guide - BookIt Fullstack Application

This guide covers deploying the BookIt application to production using Vercel (frontend) and Render (backend) with MongoDB Atlas.

## 🚀 Prerequisites

- GitHub repository with the code
- MongoDB Atlas account
- Vercel account
- Render account (or Railway/Heroku)

## 📊 Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Choose your region
4. Create database user with read/write permissions
5. Whitelist IP addresses (0.0.0.0/0 for Render)

### 2. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `bookit`

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bookit?retryWrites=true&w=majority`

## 🔧 Backend Deployment (Render)

### 1. Connect Repository
1. Go to [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository

### 2. Configure Service
- **Name**: `bookit-backend`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 3. Environment Variables
Add these environment variables in Render dashboard:

```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bookit?retryWrites=true&w=majority
NODE_ENV=production
PORT=10000
```

### 4. Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note the service URL (e.g., `https://bookit-backend.onrender.com`)

### 5. Seed Database
After deployment, run the seed script:
```bash
# SSH into Render service or use Render's shell
cd backend
npm run seed
```

## 🎨 Frontend Deployment (Vercel)

### 1. Connect Repository
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

### 2. Configure Project
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. Environment Variables
Add environment variable in Vercel dashboard:

```
VITE_API_URL=https://bookit-backend.onrender.com/api
```

### 4. Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Note the frontend URL (e.g., `https://bookit-frontend.vercel.app`)

## 🔄 Alternative Deployment Options

### Railway (Backend Alternative)
1. Go to [Railway](https://railway.app)
2. Connect GitHub repository
3. Select `backend` folder
4. Add environment variables
5. Deploy

### Netlify (Frontend Alternative)
1. Go to [Netlify](https://netlify.com)
2. Connect GitHub repository
3. Set build command: `cd frontend && npm run build`
4. Set publish directory: `frontend/dist`
5. Add environment variables
6. Deploy

## 🧪 Testing Production Deployment

### 1. Health Check
Visit: `https://your-backend-url.com/api/health`
Should return: `{"status":"OK","message":"BookIt API is running"}`

### 2. Test API Endpoints
```bash
# Test experiences endpoint
curl https://your-backend-url.com/api/experiences

# Test promo validation
curl -X POST https://your-backend-url.com/api/promo/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"SAVE10"}'
```

### 3. Test Frontend
1. Visit your frontend URL
2. Browse experiences
3. Try booking flow
4. Test promo codes

## 🔧 Environment Variables Reference

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bookit?retryWrites=true&w=majority
NODE_ENV=production
PORT=10000
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com/api
```

## 🚨 Common Issues & Solutions

### 1. CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: Ensure backend URL is correct in frontend environment variables

### 2. Database Connection Issues
**Problem**: Backend can't connect to MongoDB
**Solution**: 
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure database user has correct permissions

### 3. Build Failures
**Problem**: Frontend/backend build fails
**Solution**:
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check for TypeScript errors

### 4. Environment Variables Not Loading
**Problem**: Variables not available at runtime
**Solution**:
- Restart services after adding variables
- Check variable names match exactly
- Verify no extra spaces or quotes

## 📊 Monitoring & Maintenance

### 1. Logs
- **Render**: Check service logs in dashboard
- **Vercel**: Check function logs in dashboard
- **MongoDB Atlas**: Monitor database performance

### 2. Performance
- Monitor response times
- Check database query performance
- Optimize images and assets

### 3. Security
- Regularly update dependencies
- Monitor for security vulnerabilities
- Review access logs

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        # Add Render deployment step

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        # Add Vercel deployment step
```

## 📈 Scaling Considerations

### Database
- Upgrade MongoDB Atlas cluster as needed
- Implement database indexing
- Consider read replicas for high traffic

### Backend
- Use Render's auto-scaling features
- Implement caching (Redis)
- Add load balancing

### Frontend
- Use Vercel's CDN
- Implement image optimization
- Add service worker for offline support

## 🎯 Production Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend deployed to Render/Railway
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Environment variables set correctly
- [ ] Database seeded with sample data
- [ ] Health check endpoint working
- [ ] All API endpoints tested
- [ ] Frontend booking flow tested
- [ ] Promo codes working
- [ ] Mobile responsiveness verified
- [ ] Error handling tested
- [ ] Performance monitoring set up

## 📞 Support

If you encounter issues:
1. Check service logs
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas dashboard
5. Review deployment platform documentation

---

**Happy Deploying! 🚀**
