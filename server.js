require('dotenv').config();
const express = require('express');
const multer = require('multer');
const campaignRoutes = require('./routes/campaignRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Routes
app.use('/api/campaign', upload.single('file'), campaignRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Email Marketing Campaign API',
    version: '1.0.0',
    endpoints: {
      sendCampaign: {
        method: 'POST',
        path: '/api/campaign/send',
        description: 'Send bulk emails from Excel file',
        body: 'FormData with file field containing Excel file',
        excelFormat: {
          columnA: 'Email address',
          columnC: 'Subject',
          columnD: 'Body (HTML supported)'
        }
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n[SERVER] Email Marketing Campaign API running on port ${PORT}`);
  console.log(`[SERVER] Environment: ${process.env.NODE_ENV}`);
  console.log(`[SERVER] Email User: ${process.env.EMAIL_USER}\n`);
});
