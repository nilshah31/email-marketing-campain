# API Documentation

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. GET `/` - API Information

Returns basic information about the API and available endpoints.

**Response:** 
```json
{
  "message": "Email Marketing Campaign API",
  "version": "1.0.0",
  "endpoints": {
    "sendCampaign": {
      "method": "POST",
      "path": "/api/campaign/send",
      "description": "Send bulk emails from Excel file",
      "body": "FormData with file field containing Excel file",
      "excelFormat": {
        "columnA": "Email address",
        "columnC": "Subject",
        "columnD": "Body (HTML supported)"
      }
    }
  }
}
```

---

### 2. POST `/api/campaign/send` - Send Campaign

Processes an Excel file and sends emails to all recipients.

#### Request

**Method:** POST

**Content-Type:** multipart/form-data

**Parameters:**
- `file` (required): Excel file (.xlsx or .xls)
  - Max size: 10MB
  - Format: See Excel Format section below

#### Excel File Format

The Excel file must contain the following structure:

| Column | Required | Description |
|--------|----------|-------------|
| A | Yes | Email addresses |
| B | No | (Unused - can be blank) |
| C | Yes | Email subject lines |
| D | Yes | Email body content (supports HTML) |

**Example Excel Data:**
```
Row 1: john@example.com | | Welcome to Our Service | Hello John! Welcome to our platform...
Row 2: jane@example.com | | Special Offer | Check out our special offer...
Row 3: bob@example.com  | | Account Alert | Important: Please verify your account...
```

#### Response - Success (200 OK)

When all emails are sent successfully:

```json
{
  "success": true,
  "message": "Campaign executed successfully",
  "summary": {
    "total": 3,
    "success": 3,
    "failed": 0
  },
  "results": [
    {
      "email": "john@example.com",
      "status": "success",
      "message": "Email sent successfully. Message ID: <message-id>"
    },
    {
      "email": "jane@example.com",
      "status": "success",
      "message": "Email sent successfully. Message ID: <message-id>"
    },
    {
      "email": "bob@example.com",
      "status": "success",
      "message": "Email sent successfully. Message ID: <message-id>"
    }
  ]
}
```

#### Response - Partial Failure (200 OK)

When some emails fail to send:

```json
{
  "success": true,
  "message": "Campaign executed successfully",
  "summary": {
    "total": 3,
    "success": 2,
    "failed": 1
  },
  "results": [
    {
      "email": "john@example.com",
      "status": "success",
      "message": "Email sent successfully. Message ID: <message-id>"
    },
    {
      "email": "jane@example.com",
      "status": "failed",
      "message": "Failed to send email: SMTP connection error"
    },
    {
      "email": "bob@example.com",
      "status": "success",
      "message": "Email sent successfully. Message ID: <message-id>"
    }
  ]
}
```

#### Response - Validation Error (400 Bad Request)

When Excel data fails validation:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Row 1: Invalid email address \"notanemail\"",
    "Row 2: Subject is required",
    "Row 3: Body is required",
    "Row 4: Email is required"
  ]
}
```

#### Response - No File Provided (400 Bad Request)

```json
{
  "success": false,
  "message": "No file uploaded. Please upload an Excel file."
}
```

#### Response - Invalid File Type (400 Bad Request)

```json
{
  "success": false,
  "message": "Invalid file type. Please upload an Excel file (.xls or .xlsx)."
}
```

#### Response - Invalid Excel Format (400 Bad Request)

```json
{
  "success": false,
  "message": "Failed to read Excel file: Error message"
}
```

#### Response - Server Error (500 Internal Server Error)

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message"
}
```

---

## Validation Rules

The API performs the following validations on Excel data:

### Email Address (Column A)
- ✅ Must be present (not empty)
- ✅ Must be a valid email format (RFC 5322)
- ✅ Checked for proper domain structure
- ❌ Fails: Empty cells, invalid format, missing @

**Examples:**
```
Valid:   user@example.com, john.doe@company.co.uk, test+tag@domain.org
Invalid: notanemail, user@, @domain.com, user@domain, user..test@domain.com
```

### Subject (Column C)
- ✅ Must be present (not empty)
- ✅ Supports any text content
- ✅ HTML special characters are allowed

**Examples:**
```
Valid:   Welcome!, Re: Your Order, Special Offer - 50% OFF!
Invalid: (empty), only whitespace
```

### Body (Column D)
- ✅ Must be present (not empty)
- ✅ Supports plain text
- ✅ Supports HTML formatting and tags
- ✅ Supports Unicode and special characters

**Examples:**
```
Valid:   Hello world, <h1>Welcome</h1>, Multiple\nlines\nof\ntext
Invalid: (empty), only whitespace
```

---

## Error Codes & Messages

| HTTP Status | Error Type | Meaning |
|-------------|-----------|---------|
| 200 | Success | Campaign executed (check individual results) |
| 400 | Bad Request | Invalid file, missing file, or validation errors |
| 400 | Validation Error | Excel data doesn't meet requirements |
| 500 | Server Error | Unexpected server error |

---

## Usage Examples

### Using cURL

```bash
# Send campaign
curl -X POST http://localhost:3000/api/campaign/send \
  -F "file=@emails.xlsx"

# Pretty print JSON response
curl -X POST http://localhost:3000/api/campaign/send \
  -F "file=@emails.xlsx" | jq
```

### Using Python

```python
import requests
import json

# Send campaign
with open('emails.xlsx', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://localhost:3000/api/campaign/send', files=files)
    
# Pretty print response
result = response.json()
print(json.dumps(result, indent=2))

# Check results
if result['success']:
    print(f"Campaign sent: {result['summary']['success']} success, {result['summary']['failed']} failed")
    for email_result in result['results']:
        print(f"{email_result['email']}: {email_result['status']}")
```

### Using JavaScript/Node.js

```javascript
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function sendCampaign() {
  const form = new FormData();
  form.append('file', fs.createReadStream('emails.xlsx'));

  try {
    const response = await axios.post(
      'http://localhost:3000/api/campaign/send',
      form,
      { headers: form.getHeaders() }
    );

    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      console.log(`Campaign sent: ${response.data.summary.success} success, ${response.data.summary.failed} failed`);
      response.data.results.forEach(result => {
        console.log(`${result.email}: ${result.status}`);
      });
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

sendCampaign();
```

### Using HTML Form

```html
<!DOCTYPE html>
<html>
<head>
    <title>Email Campaign</title>
</head>
<body>
    <h1>Send Email Campaign</h1>
    <form id="campaignForm">
        <input type="file" id="fileInput" accept=".xlsx,.xls" required>
        <button type="submit">Send Campaign</button>
    </form>
    <pre id="response"></pre>

    <script>
        document.getElementById('campaignForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const form = new FormData();
            form.append('file', document.getElementById('fileInput').files[0]);
            
            try {
                const response = await fetch('/api/campaign/send', {
                    method: 'POST',
                    body: form
                });
                
                const result = await response.json();
                document.getElementById('response').textContent = JSON.stringify(result, null, 2);
            } catch (error) {
                document.getElementById('response').textContent = 'Error: ' + error.message;
            }
        });
    </script>
</body>
</html>
```

---

## Response Status Reference

| Status | Meaning | Action |
|--------|---------|--------|
| `success` | Email sent successfully | No action needed |
| `failed` | Email failed to send | Check message for reason; can be retried |

---

## Common Issues & Solutions

### "No file uploaded"
**Problem:** Didn't attach Excel file
**Solution:** Make sure to include file in multipart form data with field name `file`

### "Invalid file type"
**Problem:** File is not Excel format
**Solution:** Use .xlsx or .xls files only

### "Validation failed"
**Problem:** Excel data doesn't meet requirements
**Solution:** Check errors returned; ensure all rows have:
- Valid email in Column A
- Subject in Column C
- Body in Column D

### "SMTP connection error"
**Problem:** Cannot connect to email server
**Solution:** Check EMAIL_USER and EMAIL_PASS in .env; verify SMTP host/port/TLS for your provider

### "Invalid login"
**Problem:** Email credentials are wrong
**Solution:** Verify EMAIL_PASS in .env; ensure it matches the mailbox password for the SMTP account

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:
- Per-IP rate limits
- Per-user rate limits
- Campaign size limits

---

## Security Considerations

1. **Credentials:** Store EMAIL_USER and EMAIL_PASS in .env (never hardcode)
2. **File Size:** Limited to 10MB to prevent DoS
3. **Input Validation:** All Excel data is validated before processing
4. **HTTPS:** Use HTTPS in production
5. **Authentication:** Consider adding API key authentication for production

