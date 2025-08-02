// 🆓 REAL CLOUDINARY UPLOAD WITH SUPABASE DATABASE
import { v2 as cloudinary } from 'cloudinary';
import { addScan } from '../lib/supabase-storage.js';
import { analyzeImage } from '../lib/disease-detection.js';
import formidable from 'formidable';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for multipart
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { 
        id, 
        timestamp, 
        disease_detected, 
        confidence, 
        all_predictions, 
        severity_level, 
        recommendation,
        device_info,
        location,
        user_notes,
        image_data // Base64 image data
      } = req.body;

      // Upload image to Cloudinary (FREE)
      let imageUrl = '';
      if (image_data) {
        const uploadResponse = await cloudinary.uploader.upload(image_data, {
          folder: 'coconut-scans',
          public_id: id,
          format: 'jpg',
          quality: 'auto:low' // Optimize for free tier
        });
        imageUrl = uploadResponse.secure_url;
      }

      // Save to database
      const connection = await createConnection();
      
      const insertQuery = `
        INSERT INTO coconut_scans (
          id, timestamp, disease_detected, confidence, image_url, 
          all_predictions, severity_level, recommendation, device_info, 
          location, user_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await connection.execute(insertQuery, [
        id,
        timestamp,
        disease_detected,
        confidence,
        imageUrl,
        JSON.stringify(all_predictions),
        severity_level,
        recommendation,
        JSON.stringify(device_info),
        JSON.stringify(location),
        user_notes
      ]);

      await connection.end();

      res.status(200).json({
        success: true,
        message: 'Scan uploaded successfully!',
        scan_id: id,
        image_url: imageUrl,
        dashboard_url: 'https://coconut-dashboard.vercel.app'
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Upload failed: ' + error.message
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
