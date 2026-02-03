/**
 * Test script to validate the Email Marketing Campaign API
 * Run with: node test-api.js
 */

const http = require('http');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3000/api/campaign/send';

console.log('\n' + '='.repeat(50));
console.log('Email Marketing Campaign API - Test Script');
console.log('='.repeat(50) + '\n');

/**
 * Test 1: Check if server is running
 */
async function testServerConnection() {
  console.log('📝 Test 1: Checking server connection...');
  
  return new Promise((resolve) => {
    const request = http.get('http://localhost:3000', (response) => {
      if (response.statusCode === 200) {
        console.log('✅ Server is running\n');
        resolve(true);
      } else {
        console.log('❌ Server is not responding correctly\n');
        resolve(false);
      }
    });

    request.on('error', (error) => {
      console.log('❌ Server is not running. Start it with: npm run dev\n');
      resolve(false);
    });
  });
}

/**
 * Test 2: Test API with file upload
 */
async function testFileUpload() {
  console.log('📝 Test 2: Testing file upload...');
  
  const testFilePath = path.join(__dirname, 'test-emails.xlsx');
  
  if (!fs.existsSync(testFilePath)) {
    console.log('⚠️  test-emails.xlsx not found. Skipping file upload test.');
    console.log('   Create a test Excel file with columns: Email | B | Subject | Body\n');
    return;
  }

  return new Promise((resolve) => {
    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath));

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/campaign/send',
      method: 'POST',
      headers: form.getHeaders()
    };

    const request = http.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (result.success) {
            console.log('✅ File upload successful');
            console.log(`   Total emails: ${result.summary.total}`);
            console.log(`   Success: ${result.summary.success}`);
            console.log(`   Failed: ${result.summary.failed}\n`);
          } else {
            console.log('❌ File upload failed');
            if (result.errors) {
              console.log('   Errors:');
              result.errors.forEach(error => console.log(`   - ${error}`));
            }
            console.log();
          }
        } catch (error) {
          console.log('❌ Error parsing response:', error.message, '\n');
        }
        resolve();
      });
    });

    request.on('error', (error) => {
      console.log('❌ Request error:', error.message, '\n');
      resolve();
    });

    form.pipe(request);
  });
}

/**
 * Test 3: Test without file (should fail)
 */
async function testNoFile() {
  console.log('📝 Test 3: Testing request without file...');
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/campaign/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const request = http.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (!result.success && response.statusCode === 400) {
            console.log('✅ Correctly rejected request without file');
            console.log(`   Message: ${result.message}\n`);
          } else {
            console.log('❌ Should reject requests without file\n');
          }
        } catch (error) {
          console.log('❌ Error parsing response:', error.message, '\n');
        }
        resolve();
      });
    });

    request.on('error', (error) => {
      console.log('❌ Request error:', error.message, '\n');
      resolve();
    });

    request.write('{}');
    request.end();
  });
}

/**
 * Test 4: Get API info
 */
async function testApiInfo() {
  console.log('📝 Test 4: Getting API information...');
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET'
    };

    const request = http.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ API information retrieved');
          console.log(`   Version: ${result.version}`);
          console.log(`   Message: ${result.message}\n`);
        } catch (error) {
          console.log('❌ Error parsing response:', error.message, '\n');
        }
        resolve();
      });
    });

    request.on('error', (error) => {
      console.log('❌ Request error:', error.message, '\n');
      resolve();
    });

    request.end();
  });
}

/**
 * Main test runner
 */
async function runTests() {
  try {
    const isServerRunning = await testServerConnection();
    
    if (!isServerRunning) {
      console.log('❌ Tests aborted - server is not running\n');
      process.exit(1);
    }

    await testApiInfo();
    await testNoFile();
    await testFileUpload();

    console.log('='.repeat(50));
    console.log('Tests completed!');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('Test error:', error.message);
    process.exit(1);
  }
}

// Run tests
runTests();
