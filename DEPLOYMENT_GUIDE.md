# 🌐 Cloud Dashboard Deployment Guide

## Quick Setup Instructions

### 1. 🗄️ Database Setup (Free MySQL)

Choose one of these free MySQL providers:

#### Option A: PlanetScale (Recommended)
1. Go to [planetscale.com](https://planetscale.com) and sign up
2. Create a new database called `coconut-disease-db`
3. Go to "Connect" → "Create password" → Copy the connection string
4. Use the connection string as your `DATABASE_URL`

#### Option B: Railway
1. Go to [railway.app](https://railway.app) and sign up with GitHub
2. Create new project → Add MySQL service
3. Copy the connection URL from the Variables tab

#### Option C: Aiven (MySQL free tier)
1. Go to [aiven.io](https://aiven.io) and sign up
2. Create MySQL service (choose the free tier)
3. Copy connection details once service is ready

### 2. 📸 Image Storage Setup (Cloudinary)

1. Go to [cloudinary.com](https://cloudinary.com) and sign up
2. From your dashboard, copy:
   - Cloud Name
   - API Key  
   - API Secret
3. Free tier includes 25GB storage and 25GB bandwidth/month

### 3. 🚀 Deploy to Vercel

1. Fork this repository to your GitHub account
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub
3. Click "Import Project" and select your forked repository
4. Set environment variables in Vercel:

```env
DATABASE_URL=mysql://username:password@host:port/database
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. Click "Deploy" - your dashboard will be live in 2-3 minutes!

### 4. 📋 Create Database Schema

Once deployed, create the database table by running this SQL:

```sql
CREATE TABLE scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    disease_detected VARCHAR(255) NOT NULL,
    confidence DECIMAL(5,4) NOT NULL,
    severity_level VARCHAR(255) NOT NULL,
    recommendation TEXT,
    image_url VARCHAR(500),
    location_latitude DECIMAL(10,8),
    location_longitude DECIMAL(11,8),
    app_version VARCHAR(50),
    model_version VARCHAR(50),
    processing_time_ms INT,
    INDEX idx_timestamp (timestamp),
    INDEX idx_device_id (device_id),
    INDEX idx_disease (disease_detected)
);
```

### 5. 📱 Update Mobile App

In your Android app, update the API endpoint in `CloudApiService.kt`:

```kotlin
private const val BASE_URL = "https://your-project-name.vercel.app/"
```

Replace `your-project-name` with your actual Vercel project name.

## 🔧 Configuration Options

### Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | MySQL connection string | ✅ | `mysql://user:pass@host:3306/db` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ | `my-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ | `abcdef123456` |
| `API_SECRET_KEY` | Optional API security | ❌ | `my-secret-key` |
| `DEBUG_MODE` | Enable debug logging | ❌ | `true` |

### Cost Breakdown (All Free Tiers)

| Service | Free Tier Limits | Upgrade Cost |
|---------|------------------|--------------|
| **Vercel** | 100GB bandwidth/month | $20/month for Pro |
| **PlanetScale** | 1 database, 1GB storage | $29/month for paid |
| **Cloudinary** | 25GB storage, 25GB bandwidth | $99/month for paid |
| **Total** | **$0/month** | ~$150/month if scaled |

### Free Tier Capacity
- **Scans per month**: ~50,000 scans (assuming 500KB per scan)
- **Users**: Unlimited (bandwidth limited)
- **Storage**: 25GB = ~50,000 scan images
- **Perfect for**: Small to medium farms, research projects

## 🛠️ Troubleshooting

### Common Deployment Issues

1. **Build Fails**
   ```bash
   # Check Node.js version
   node --version  # Should be 16+
   
   # Clear dependencies and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Database Connection Error**
   - Verify DATABASE_URL is correctly formatted
   - Check if database accepts external connections
   - Test connection with a MySQL client

3. **Images Not Uploading**
   - Verify Cloudinary credentials
   - Check API key permissions
   - Ensure mobile app has internet permission

4. **CORS Errors**
   - Check if API endpoints have proper CORS headers
   - Verify mobile app is using HTTPS endpoints

### Performance Optimization

1. **Database Indexing**
   ```sql
   -- Add indexes for better query performance
   CREATE INDEX idx_timestamp_device ON scans(timestamp, device_id);
   CREATE INDEX idx_disease_confidence ON scans(disease_detected, confidence);
   ```

2. **Image Optimization**
   - Cloudinary automatically optimizes images
   - Use `q_auto,f_auto` in image URLs for best compression

3. **Caching**
   - Vercel automatically caches static assets
   - API responses cached for 60 seconds by default

## 📊 Monitoring & Analytics

### Dashboard Metrics
- **Response Times**: Monitor API endpoint performance
- **Error Rates**: Track failed uploads and database errors  
- **Usage Patterns**: Analyze peak usage times
- **Disease Trends**: Monitor disease pattern changes

### Vercel Analytics
1. Go to your Vercel dashboard
2. Enable Analytics for detailed insights
3. Monitor page views, performance, and errors

### Database Monitoring
```sql
-- Check recent activity
SELECT COUNT(*) as total_scans, 
       DATE(timestamp) as scan_date 
FROM scans 
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(timestamp)
ORDER BY scan_date DESC;

-- Disease distribution
SELECT disease_detected, 
       COUNT(*) as count,
       ROUND(AVG(confidence), 3) as avg_confidence
FROM scans 
GROUP BY disease_detected 
ORDER BY count DESC;
```

## 🔐 Security Best Practices

### API Security
1. **Rate Limiting**: Prevent API abuse
2. **Input Validation**: Sanitize all uploaded data
3. **HTTPS Only**: Force secure connections
4. **Environment Variables**: Never commit secrets to code

### Database Security
1. **Connection Encryption**: Use SSL connections
2. **User Permissions**: Create dedicated database user with minimal permissions
3. **Regular Backups**: Enable automated backups
4. **Access Logs**: Monitor database access patterns

## 🚀 Scaling Strategy

### When to Upgrade
- **Storage**: Approaching 20GB of images
- **Bandwidth**: Consistently hitting 80GB/month
- **Database**: Need more than 1GB storage
- **Performance**: API response times > 2 seconds

### Scaling Options
1. **Horizontal Scaling**: Add more Vercel functions
2. **Database Scaling**: Upgrade to paid MySQL tier
3. **CDN Optimization**: Use Cloudinary transformations
4. **Caching**: Implement Redis for session data

Your coconut disease detection dashboard is now ready to help farmers worldwide! 🌴✨
