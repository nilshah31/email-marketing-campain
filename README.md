# Email Marketing Campaign API

A Node.js REST API for sending bulk emails from Excel files.

## Features

- ✅ Upload Excel files (.xlsx, .xls)
- ✅ Validate email addresses, subjects, and email bodies
- ✅ Send bulk emails using SMTP (Hostinger)
- ✅ Detailed error reporting and validation
- ✅ Email delivery status tracking
- ✅ Comprehensive logging

## Project Structure

```
email-marketing-campain/
├── server.js                 # Main Express server
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (not tracked in git)
├── .gitignore                # Git ignore rules
├── routes/
│   └── campaignRoutes.js     # API endpoints
├── services/
│   └── emailService.js       # Nodemailer configuration and email sending
├── validators/
│   └── excelValidator.js     # Excel data validation
└── README.md                 # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd email-marketing-campain
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
  - Edit `.env` file with your mailbox credentials:
     ```
     EMAIL_USER=info@filtriva.com
    EMAIL_PASS=your_mailbox_password_here
     PORT=3000
     NODE_ENV=development
     ```

  > **Note**: Use the mailbox password for the SMTP account.

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

### GET `/`
Returns API information and available endpoints.

**Response:**
```json
{
  "message": "Email Marketing Campaign API",
  "version": "1.0.0",
  "endpoints": {
    "sendCampaign": {
      "method": "POST",
      "path": "/api/campaign/send",
      "description": "Send bulk emails from Excel file"
    }
  }
}
```

### POST `/api/campaign/send`
Sends bulk emails from an Excel file.

**Request:**
- **Content-Type**: `multipart/form-data`
- **Body Parameter**: `file` (Excel file: .xlsx or .xls)

**Excel File Format:**
| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Email | - | Subject | Body |
| user1@example.com | - | Welcome! | Hello User 1... |
| user2@example.com | - | Hello | Hi User 2... |

**Response (Success):**
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
      "email": "user1@example.com",
      "status": "success",
      "message": "Email sent successfully. Message ID: <id>"
    },
    {
      "email": "user2@example.com",
      "status": "success",
      "message": "Email sent successfully. Message ID: <id>"
    }
  ]
}
```

**Response (Validation Error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Row 2: Invalid email address \"notanemail\"",
    "Row 3: Subject is required"
  ]
}
```

## Validation Rules

The API validates Excel data before sending emails:

- **Email (Column A)**:
  - Must be present and not empty
  - Must be a valid email format
  
- **Subject (Column C)**:
  - Must be present and not empty
  
- **Body (Column D)**:
  - Must be present and not empty
  - Supports HTML formatting

If validation fails, the API returns a 400 status with detailed error messages for each problematic row.

## Email Body Support

The email body supports HTML formatting. Examples:

```html
<h1>Welcome!</h1>
<p>Dear Customer,</p>
<p>Thank you for signing up.</p>
```

## Logging

The API logs all email sending activities to the console:

```
[CAMPAIGN] Starting campaign with 2 recipients
[SUCCESS] Email sent to user1@example.com - Message ID: <id>
[SUCCESS] Email sent to user2@example.com - Message ID: <id>
[CAMPAIGN] Campaign completed - Success: 2, Failed: 0
```

Error logs:
```
[ERROR] Failed to send email to user@example.com - Error message
```

## Error Handling

The API provides detailed error responses:

| Status Code | Scenario |
|-------------|----------|
| 200 | Campaign executed (check results for individual email statuses) |
| 400 | Invalid file type, empty file, or validation errors |
| 500 | Internal server error |

## Testing with cURL

```bash
curl -X POST http://localhost:3000/api/campaign/send \
  -F "file=@emails.xlsx"
```

## Testing with Python

```python
import requests

with open('emails.xlsx', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://localhost:3000/api/campaign/send', files=files)
    print(response.json())
```

## Testing with Node.js/JavaScript

```javascript
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const form = new FormData();
form.append('file', fs.createReadStream('emails.xlsx'));

axios.post('http://localhost:3000/api/campaign/send', form, {
  headers: form.getHeaders()
}).then(response => console.log(response.data))
  .catch(error => console.error(error));
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Email Configuration (Hostinger SMTP mailbox)
EMAIL_USER=info@filtriva.com
EMAIL_PASS=your_mailbox_password_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Dependencies

- **express**: Web framework
- **nodemailer**: Email sending
- **xlsx**: Excel file parsing
- **email-validator**: Email validation
- **multer**: File upload handling
- **dotenv**: Environment variable management

## Security Considerations

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Never commit credentials** (keep them in `.env`)
3. **Validate file size** - Default limit is 10MB
4. **Input validation** - All Excel data is validated before processing

## Troubleshooting

### "Failed to read Excel file"
- Ensure the uploaded file is a valid Excel file (.xlsx or .xls)
- Check file size is under 10MB

### "Email sending failed"
- Verify EMAIL_USER and EMAIL_PASS are correct in `.env`
- Verify `EMAIL_USER` / `EMAIL_PASS` in `.env`
- Verify SMTP host/port match your provider (Hostinger: `smtp.hostinger.com`, port `587` STARTTLS or `465` TLS)

### "Validation failed"
- Ensure Column A contains valid email addresses
- Ensure Column C (Subject) is not empty
- Ensure Column D (Body) is not empty
- Check for leading/trailing spaces in data

## Future Enhancements

- [ ] Support for CC and BCC recipients
- [ ] Email templates with variable substitution
- [ ] Scheduled campaign sending
- [ ] Campaign history and analytics
- [ ] Database integration for tracking
- [ ] Support for multiple email providers (SendGrid, AWS SES, etc.)

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
