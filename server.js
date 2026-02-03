require('dotenv').config();
const express = require('express');
const multer = require('multer');
const campaignRoutes = require('./routes/campaignRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    fieldNameSize: 100,
    fieldSize: 50 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    // Accept Excel files only
    const filename = file.originalname.toLowerCase();
    if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'), false);
    }
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

// Start server with extended timeout
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n[SERVER] Email Marketing Campaign API running on port ${PORT}`);
  console.log(`[SERVER] Environment: ${process.env.NODE_ENV}`);
  console.log(`[SERVER] Email User: ${process.env.EMAIL_USER}\n`);
});

// Set request timeout to 5 minutes for large file uploads
server.timeout = 5 * 60 * 1000;
server.keepAliveTimeout = 65000;
