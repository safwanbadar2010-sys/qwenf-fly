/**
 * Simple API Connection Test
 * Verifies that the API services are properly configured
 */

require('dotenv').config();
const axios = require('axios');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
console.log(`${colors.cyan}🔧 API Configuration Test${colors.reset}`);
console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

// Check environment variables
console.log(`${colors.blue}ℹ${colors.reset} Checking environment variables...\n`);

const config = {
  flightApiKey: process.env.FLIGHT_API_KEY,
  flightApiUrl: process.env.FLIGHT_API_BASE_URL || 'https://api.flightapi.io',
  hotelApiKey: process.env.HOTEL_API_KEY,
  hotelApiUrl: process.env.HOTEL_API_BASE_URL || 'https://api.makcorps.com'
};

// Display configuration
console.log('Configuration Status:');
console.log(`${colors.green}✓${colors.reset} Flight API Key: ${config.flightApiKey ? config.flightApiKey.substring(0, 12) + '...' : 'NOT SET'}`);
console.log(`${colors.green}✓${colors.reset} Flight API URL: ${config.flightApiUrl}`);
console.log(`${colors.green}✓${colors.reset} Hotel API Key: ${config.hotelApiKey ? config.hotelApiKey.substring(0, 12) + '...' : 'NOT SET'}`);
console.log(`${colors.green}✓${colors.reset} Hotel API URL: ${config.hotelApiUrl}`);

console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
console.log(`${colors.cyan}📡 Testing API Connectivity${colors.reset}`);
console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

// Test Flight API
async function testFlightApiConnection() {
  try {
    console.log(`${colors.blue}ℹ${colors.reset} Testing Flight API connection...`);
    
    // Use current date and popular route
    const today = new Date();
    const futureDate = new Date(today.setMonth(today.getMonth() + 2));
    const dateStr = futureDate.toISOString().split('T')[0];
    
    const testUrl = `${config.flightApiUrl}/onewaytrip/${config.flightApiKey}/NYC/LAX/${dateStr}/1/0/0/Economy/USD`;
    
    console.log(`  URL: ${testUrl.substring(0, 80)}...`);
    
    const response = await axios.get(testUrl, {
      timeout: 15000,
      validateStatus: () => true // Accept any status
    });
    
    console.log(`  Status: ${response.status}`);
    console.log(`  Response Type: ${typeof response.data}`);
    
    if (response.status === 200 || response.status === 201) {
      console.log(`${colors.green}✓${colors.reset} Flight API connection successful!`);
      return true;
    } else if (response.status === 401) {
      console.log(`${colors.red}✗${colors.reset} Authentication failed - Check API key`);
      return false;
    } else {
      console.log(`${colors.red}✗${colors.reset} Received status ${response.status}`);
      if (response.data) {
        console.log(`  Message: ${JSON.stringify(response.data).substring(0, 200)}`);
      }
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} Connection error: ${error.message}`);
    return false;
  }
}

// Test Hotel API
async function testHotelApiConnection() {
  try {
    console.log(`\n${colors.blue}ℹ${colors.reset} Testing Hotel API connection...`);
    
    // Use future dates
    const checkIn = new Date();
    checkIn.setMonth(checkIn.getMonth() + 2);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 1);
    
    const checkInStr = checkIn.toISOString().split('T')[0];
    const checkOutStr = checkOut.toISOString().split('T')[0];
    
    const testUrl = `${config.hotelApiUrl}/city?cityid=126693&pagination=0&cur=USD&rooms=1&adults=2&checkin=${checkInStr}&checkout=${checkOutStr}&api_key=${config.hotelApiKey}`;
    
    console.log(`  URL: ${testUrl.substring(0, 80)}...`);
    
    const response = await axios.get(testUrl, {
      timeout: 15000,
      validateStatus: () => true
    });
    
    console.log(`  Status: ${response.status}`);
    console.log(`  Response Type: ${typeof response.data}`);
    
    if (response.status === 200 || response.status === 201) {
      console.log(`${colors.green}✓${colors.reset} Hotel API connection successful!`);
      return true;
    } else if (response.status === 401) {
      console.log(`${colors.red}✗${colors.reset} Authentication failed - Check API key`);
      return false;
    } else {
      console.log(`${colors.red}✗${colors.reset} Received status ${response.status}`);
      if (response.data) {
        console.log(`  Message: ${JSON.stringify(response.data).substring(0, 200)}`);
      }
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} Connection error: ${error.message}`);
    return false;
  }
}

// Run tests
(async () => {
  const flightOk = await testFlightApiConnection();
  const hotelOk = await testHotelApiConnection();
  
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}📊 Summary${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
  
  console.log(`Flight API: ${flightOk ? colors.green + '✓ Connected' : colors.red + '✗ Failed'}${colors.reset}`);
  console.log(`Hotel API: ${hotelOk ? colors.green + '✓ Connected' : colors.red + '✗ Failed'}${colors.reset}`);
  
  if (flightOk && hotelOk) {
    console.log(`\n${colors.green}🎉 All APIs are properly configured!${colors.reset}`);
    console.log('\nYou can now:');
    console.log('  1. Start the server: npm run dev');
    console.log('  2. Test endpoints: See API_INTEGRATION_GUIDE.md');
  } else {
    console.log(`\n${colors.red}⚠️  Some APIs failed connection test${colors.reset}`);
    console.log('\nPossible reasons:');
    console.log('  - Invalid API keys');
    console.log('  - API service is down');
    console.log('  - Network connectivity issues');
    console.log('  - API endpoints have changed');
  }
  
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
})();
