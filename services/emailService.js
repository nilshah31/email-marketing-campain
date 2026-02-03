const nodemailer = require('nodemailer');

// Hardcoded Hostinger SMTP settings
const SMTP_HOST = 'smtp.hostinger.com';
const SMTP_PORT = 587; // 465 = implicit TLS, 587 = STARTTLS
const SMTP_SECURE = false;

// Hardcoded credentials (fill these locally; do NOT commit real passwords)
const SMTP_USER = 'sales@filtriva.com';
const SMTP_PASS = 'Jitu5656@1233';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  },
  tls: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false
  },
  logger: true,
  debug: true
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('[SMTP ERROR]', error);
  } else {
    console.log('[SMTP OK] Server is ready to send emails');
  }
});

/**
 * Sends email to a recipient
 * @param {string} email - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {Object} - { email: string, status: 'success' | 'failed', message: string }
 */
async function sendEmail(email, subject, body) {
  try {
    const mailOptions = {
      from: SMTP_USER,
      to: email,
      subject: subject,
      html: body
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`[SUCCESS] Email sent to ${email} - Message ID: ${info.messageId}`);
    
    return {
      email: email,
      status: 'success',
      message: `Email sent successfully. Message ID: ${info.messageId}`
    };
  } catch (error) {
    console.error(`[ERROR] Failed to send email to ${email} - ${error.message}`);
    
    return {
      email: email,
      status: 'failed',
      message: `Failed to send email: ${error.message}`
    };
  }
}

/**
 * Sends emails to multiple recipients
 * @param {Array} recipients - Array of { email, subject, body }
 * @returns {Array} - Array of results { email, status, message }
 */
async function sendBulkEmails(recipients) {
  const results = [];

  for (const recipient of recipients) {
    const result = await sendEmail(recipient.email, recipient.subject, recipient.body);
    results.push(result);
  }

  return results;
}

module.exports = {
  sendEmail,
  sendBulkEmails
};
