# Email Marketing Campaign API - Project Summary

## 🎯 Project Overview

This is a production-ready Node.js REST API for sending bulk emails from Excel files. It provides comprehensive validation, error handling, and detailed logging.

## ✨ Key Features

✅ **Excel File Processing**
- Upload and parse Excel files (.xlsx, .xls)
- Extract email, subject, and body from specific columns
- Support for HTML email bodies

✅ **Data Validation**
- Email address validation (RFC 5322 format)
- Required field validation (email, subject, body)
- Detailed error reporting with row numbers

✅ **Email Sending**
- Bulk email delivery via SMTP (Hostinger)
- Individual email tracking
- Success/failure status for each email
- Comprehensive logging of all operations

✅ **Error Handling**
- Graceful error management
- Detailed error messages
- Validation error reporting with specific row information
- HTTP status codes as per REST standards

✅ **Security**
- Environment variable configuration
- No hardcoded credentials
- Input validation and sanitization
- File size limits (10MB)

## 📁 Project Structure

```
email-marketing-campain/
├── server.js                    # Main Express application
├── package.json                 # Dependencies and scripts
├── .env                        # Environment variables (local, not in git)
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore rules
├── setup.sh                    # Quick setup script
├── test-api.js                 # API testing script
│
├── routes/
│   └── campaignRoutes.js       # Campaign API endpoints
│
├── services/
│   └── emailService.js         # Email sending logic (nodemailer)
│
├── validators/
│   └── excelValidator.js       # Excel data validation
│
└── Documentation Files
    ├── README.md               # Main documentation
    ├── API_DOCUMENTATION.md    # Complete API reference
    └── SAMPLE_EXCEL_FORMAT.md  # Excel format guide
```

## 🚀 Quick Start

### 1. Installation
```bash
cd email-marketing-campain
npm install
```

### 2. Configuration
Edit `.env` file with your mailbox credentials:
```env
EMAIL_USER=info@filtriva.com
EMAIL_PASS=your_mailbox_password_here
PORT=3000
```

### 3. Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 4. Send Campaign
```bash
curl -X POST http://localhost:3000/api/campaign/send \
  -F "file=@emails.xlsx"
```

## 📋 Excel File Format

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Email | - | Subject | Body |
| user@email.com | | Welcome! | Hello user... |
| user2@email.com | | Offer | Check out... |

**Requirements:**
- Column A: Valid email addresses (required)
- Column C: Email subject (required)
- Column D: Email body/content (required, supports HTML)

## 🔌 API Endpoints

### GET `/`
Returns API information and available endpoints.

### POST `/api/campaign/send`
Sends bulk emails from Excel file.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` parameter with Excel file

**Response:**
```json
{
  "success": true,
  "message": "Campaign executed successfully",
  "summary": {
    "total": 2,
    "success": 2,
    "failed": 0
  },
  "results": [
    {
      "email": "user@email.com",
      "status": "success",
      "message": "Email sent successfully. Message ID: <id>"
    }
  ]
}
```

## 📚 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework |
| nodemailer | ^6.9.1 | Email sending |
| xlsx | ^0.18.5 | Excel file parsing |
| email-validator | ^2.1.0 | Email validation |
| multer | ^1.4.5-lts.1 | File upload handling |
| dotenv | ^16.0.3 | Environment variables |

## 🔐 Security Features

1. **Environment Variables**: Credentials stored in .env (not version controlled)
2. **Input Validation**: All Excel data validated before processing
3. **File Size Limit**: 10MB maximum file size
4. **Email Validation**: RFC 5322 compliant email format checking
5. **Error Handling**: No sensitive data in error messages

## 📝 Logging

All operations are logged to console:

```
[CAMPAIGN] Starting campaign with 2 recipients
[SUCCESS] Email sent to user@email.com - Message ID: <id>
[ERROR] Failed to send email to invalid@invalid - Error message
[CAMPAIGN] Campaign completed - Success: 1, Failed: 1
```

## 🧪 Testing

### Run Test Suite
```bash
npm test
```
or
```bash
node test-api.js
```

### Manual Testing with cURL
```bash
# Upload and send campaign
curl -X POST http://localhost:3000/api/campaign/send \
  -F "file=@emails.xlsx"

# Pretty print JSON
curl -X POST http://localhost:3000/api/campaign/send \
  -F "file=@emails.xlsx" | jq
```

## ⚙️ Configuration

### Environment Variables

```env
# Required
EMAIL_USER=info@filtriva.com
EMAIL_PASS=your_mailbox_password_here

# Optional
PORT=3000                              # Server port
NODE_ENV=development                   # Environment
```

### SMTP Setup (Hostinger)

Use your Hostinger mailbox credentials with `smtp.hostinger.com`.

## 🐛 Troubleshooting

### Server won't start
- Check if port 3000 is available
- Verify Node.js is installed: `node --version`
- Check .env file exists with correct configuration

### Emails not sending
- Verify `EMAIL_USER` / `EMAIL_PASS` in `.env`
- Verify Host/Port/TLS settings for Hostinger SMTP
- Check internet connection

### Validation errors
- Ensure Column A has valid email format
- Ensure Column C (Subject) is not empty
- Ensure Column D (Body) is not empty
- Check for leading/trailing spaces

### File upload errors
- Ensure file is .xlsx or .xls format
- Check file size is under 10MB
- Verify file is valid Excel file (not corrupted)

## 📊 Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Campaign executed successfully",
  "summary": {
    "total": 1,
    "success": 1,
    "failed": 0
  },
  "results": [
    {
      "email": "user@example.com",
      "status": "success",
      "message": "Email sent successfully. Message ID: <123>"
    }
  ]
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Row 1: Invalid email address \"not-an-email\"",
    "Row 2: Subject is required"
  ]
}
```

### Error Response
```json
{
  "success": false,
  "message": "No file uploaded. Please upload an Excel file."
}
```

## 🔄 Data Flow

```
User uploads Excel file
        ↓
File received by multer
        ↓
XLSX parser reads file
        ↓
Validator checks:
  - Email format
  - Subject exists
  - Body exists
        ↓
If validation fails → Return error
        ↓
If validation passes → Send emails
        ↓
Nodemailer sends each email
        ↓
Log result (success/failure)
        ↓
Return JSON with all results
```

## 🚀 Production Considerations

- [ ] Add HTTPS support
- [ ] Add rate limiting
- [ ] Add authentication/API keys
- [ ] Add database for tracking campaigns
- [ ] Add email templates system
- [ ] Add scheduled sending
- [ ] Add retry mechanism for failed emails
- [ ] Add email delivery webhooks
- [ ] Add analytics/reporting
- [ ] Add support for multiple email providers

## 📞 Support & Documentation

- **README.md** - Main documentation and setup guide
- **API_DOCUMENTATION.md** - Complete API reference with examples
- **SAMPLE_EXCEL_FORMAT.md** - Excel file format guide
- **API_EXAMPLES/** - Code examples in different languages

## 📄 License

MIT

---

**Last Updated:** February 2026
**Version:** 1.0.0
**Status:** Production Ready
