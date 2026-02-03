const express = require('express');
const XLSX = require('xlsx');
const { validateExcelData } = require('../validators/excelValidator');
const { sendBulkEmails } = require('../services/emailService');

const router = express.Router();

/**
 * POST /api/campaign/send
 * Handles file upload, validation, and sends bulk emails
 */
router.post('/send', async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please upload an Excel file.'
      });
    }

    // Check file type - accept Excel files and octet-stream (sometimes sent as binary)
    const filename = req.file.originalname.toLowerCase();
    const isXlsx = filename.endsWith('.xlsx') || filename.endsWith('.xls');
    const isExcelMime = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/x-xlsx',
      'application/octet-stream'
    ].includes(req.file.mimetype);

    if (!isXlsx && !isExcelMime) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type "${req.file.mimetype}". Please upload an Excel file (.xls or .xlsx).`
      });
    }

    // Read the Excel file
    let workbook;
    try {
      workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: `Failed to read Excel file: ${error.message}`
      });
    }

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return res.status(400).json({
        success: false,
        message: 'Excel file has no sheets.'
      });
    }

    const sheet = workbook.Sheets[sheetName];
    // Read all cells and convert to array format
    const range = XLSX.utils.decode_range(sheet['!ref']);
    const rawData = [];
    
    // Iterate through rows, starting from row 2 (skip header in row 1)
    for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
      const row = [];
      for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
        const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
        const cell = sheet[cellAddress];
        row.push(cell ? cell.v : '');
      }
      rawData.push(row);
    }

    // Validate the Excel data
    const validation = validateExcelData(rawData);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Send emails
    console.log(`\n[CAMPAIGN] Starting campaign with ${validation.data.length} recipients`);
    const emailResults = await sendBulkEmails(validation.data);

    // Keep response small: only return email + status (+ short error if failed)
    const results = emailResults.map(r => ({
      email: r.email,
      status: r.status,
      ...(r.status === 'failed' && r.error ? { error: r.error } : {})
    }));

    // Summary
    const successCount = results.filter(r => r.status === 'success').length;
    const failedCount = results.filter(r => r.status === 'failed').length;

    console.log(`[CAMPAIGN] Campaign completed - Success: ${successCount}, Failed: ${failedCount}\n`);

    return res.status(200).json({
      success: true,
      message: 'Campaign executed successfully',
      summary: {
        total: results.length,
        success: successCount,
        failed: failedCount
      },
      results
    });

  } catch (error) {
    console.error('[ERROR] Unexpected error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;
