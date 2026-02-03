const validator = require('email-validator');

/**
 * Validates Excel data for email campaign
 * @param {Array} data - Array of rows from Excel
 * @returns {Object} - { isValid: boolean, errors: Array, data: Array }
 */
function validateExcelData(data) {
  const errors = [];
  const validatedData = [];

  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      isValid: false,
      errors: ['Excel file is empty or invalid'],
      data: []
    };
  }

  data.forEach((row, index) => {
    const rowNumber = index + 1;
    const rowErrors = [];

    // Extract values from columns A, C, D
    const emailRaw = row[0]; // Column A
    const subjectRaw = row[2]; // Column C
    const bodyRaw = row[3]; // Column D

    const email = (emailRaw ?? '').toString();
    const subject = (subjectRaw ?? '').toString();
    const body = (bodyRaw ?? '').toString();

    // Validate email
    if (!email || typeof email !== 'string' || email.trim() === '') {
      rowErrors.push(`Row ${rowNumber}: Email is required`);
    } else if (!validator.validate(email.trim())) {
      rowErrors.push(`Row ${rowNumber}: Invalid email address "${email}"`);
    }

    // Validate subject
    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
      rowErrors.push(`Row ${rowNumber}: Subject is required`);
    }

    // Validate body
    if (!body || typeof body !== 'string' || body.trim() === '') {
      rowErrors.push(`Row ${rowNumber}: Body is required`);
    }

    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
    } else {
      validatedData.push({
        email: email.trim(),
        // Keep original spacing/newlines; validation already used trim()
        subject,
        body,
        rowNumber
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validatedData
  };
}

module.exports = {
  validateExcelData
};
