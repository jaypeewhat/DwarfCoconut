// API to get all scans for dashboard
const mysql = require('mysql2/promise');

const createConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });
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

  if (req.method === 'GET') {
    try {
      const connection = await createConnection();
      
      const [rows] = await connection.execute(`
        SELECT 
          id, timestamp, disease_detected, confidence, image_url,
          all_predictions, severity_level, recommendation, 
          device_info, location, user_notes
        FROM coconut_scans 
        ORDER BY timestamp DESC 
        LIMIT 100
      `);

      await connection.end();

      // Parse JSON fields
      const scans = rows.map(scan => ({
        ...scan,
        all_predictions: JSON.parse(scan.all_predictions || '{}'),
        device_info: JSON.parse(scan.device_info || '{}'),
        location: JSON.parse(scan.location || '{}')
      }));

      res.status(200).json(scans);

    } catch (error) {
      console.error('Get scans error:', error);
      res.status(500).json({
        error: 'Failed to fetch scans: ' + error.message
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
