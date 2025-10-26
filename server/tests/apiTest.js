/**
 * API Integration Test Script
 * Tests the external Flight and Hotel APIs
 */

require('dotenv').config();
const flightApiService = require('../services/flightApiService');
const hotelApiService = require('../services/hotelApiService');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) => console.log(`
${colors.cyan}${'='.repeat(60)}${colors.reset}
${colors.cyan}${msg}${colors.reset}
${colors.cyan}${'='.repeat(60)}${colors.reset}
`)
};

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  total: 0
};

async function testFlightSearch() {
  log.section('Testing Flight API - One-Way Search');
  
  try {
    results.total++;
    log.info('Searching flights from HEL to OUL...');
    
    const response = await flightApiService.searchOneWay({
      from: 'HEL',
      to: 'OUL',
      date: '2024-05-20',
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: 'Economy',
      currency: 'USD'
    });

    if (response.success) {
      log.success('Flight search successful!');
      log.info(`Found ${response.flights?.length || 0} flights`);
      results.passed++;
      return true;
    } else {
      log.error('Flight search returned unsuccessful response');
      results.failed++;
      return false;
    }
  } catch (error) {
    log.error(`Flight search failed: ${error.message}`);
    results.failed++;
    return false;
  }
}

async function testRoundTripSearch() {
  log.section('Testing Flight API - Round-Trip Search');
  
  try {
    results.total++;
    log.info('Searching round-trip flights from HAN to SGN...');
    
    const response = await flightApiService.searchRoundTrip({
      from: 'HAN',
      to: 'SGN',
      departDate: '2024-04-10',
      returnDate: '2024-04-12',
      adults: 1,
      children: 0,
      infants: 1,
      cabinClass: 'Economy',
      currency: 'USD'
    });

    if (response.success) {
      log.success('Round-trip search successful!');
      log.info(`Found ${response.flights?.length || 0} flights`);
      results.passed++;
      return true;
    } else {
      log.error('Round-trip search returned unsuccessful response');
      results.failed++;
      return false;
    }
  } catch (error) {
    log.error(`Round-trip search failed: ${error.message}`);
    results.failed++;
    return false;
  }
}

async function testIATASearch() {
  log.section('Testing Flight API - IATA Search');
  
  try {
    results.total++;
    log.info('Searching IATA codes for "american"...');
    
    const response = await flightApiService.searchIATA({
      name: 'american',
      type: 'airline'
    });

    log.success('IATA search successful!');
    console.log('Response:', JSON.stringify(response, null, 2).substring(0, 500));
    results.passed++;
    return true;
  } catch (error) {
    log.error(`IATA search failed: ${error.message}`);
    results.failed++;
    return false;
  }
}

async function testHotelSearch() {
  log.section('Testing Hotel API - City Search');
  
  try {
    results.total++;
    log.info('Searching hotels in city ID 60763...');
    
    const response = await hotelApiService.searchByCity({
      cityId: '60763',
      checkIn: '2023-12-25',
      checkOut: '2023-12-26',
      rooms: 1,
      adults: 2,
      children: 0,
      currency: 'USD',
      pagination: 0
    });

    if (response.success) {
      log.success('Hotel search successful!');
      log.info(`Found ${response.hotels?.length || 0} hotels`);
      results.passed++;
      return true;
    } else {
      log.error('Hotel search returned unsuccessful response');
      results.failed++;
      return false;
    }
  } catch (error) {
    log.error(`Hotel search failed: ${error.message}`);
    results.failed++;
    return false;
  }
}

async function testHotelMapping() {
  log.section('Testing Hotel API - Name Mapping');
  
  try {
    results.total++;
    log.info('Mapping hotel name "the lenox"...');
    
    const response = await hotelApiService.mapHotelName({
      name: 'the lenox'
    });

    log.success('Hotel mapping successful!');
    console.log('Response:', JSON.stringify(response, null, 2).substring(0, 500));
    results.passed++;
    return true;
  } catch (error) {
    log.error(`Hotel mapping failed: ${error.message}`);
    results.failed++;
    return false;
  }
}

async function testAccountInfo() {
  log.section('Testing Hotel API - Account Info');
  
  try {
    results.total++;
    log.info('Fetching account information...');
    
    const response = await hotelApiService.getAccountInfo();

    log.success('Account info retrieved successfully!');
    console.log('Response:', JSON.stringify(response, null, 2).substring(0, 500));
    results.passed++;
    return true;
  } catch (error) {
    log.error(`Account info failed: ${error.message}`);
    results.failed++;
    return false;
  }
}

async function runAllTests() {
  console.clear();
  log.section('🚀 Starting API Integration Tests');
  
  // Check API keys
  log.info('Checking API keys configuration...');
  const flightKey = process.env.FLIGHT_API_KEY;
  const hotelKey = process.env.HOTEL_API_KEY;
  
  if (!flightKey) {
    log.error('FLIGHT_API_KEY not found in environment variables!');
    process.exit(1);
  }
  if (!hotelKey) {
    log.error('HOTEL_API_KEY not found in environment variables!');
    process.exit(1);
  }
  
  log.success(`Flight API Key: ${flightKey.substring(0, 8)}...`);
  log.success(`Hotel API Key: ${hotelKey.substring(0, 8)}...`);

  // Run tests
  await testFlightSearch();
  await testRoundTripSearch();
  await testIATASearch();
  await testHotelSearch();
  await testHotelMapping();
  await testAccountInfo();

  // Print summary
  log.section('📊 Test Results Summary');
  console.log(`Total Tests: ${results.total}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  
  const successRate = ((results.passed / results.total) * 100).toFixed(2);
  console.log(`\nSuccess Rate: ${successRate}%`);
  
  if (results.failed === 0) {
    log.success('\n🎉 All tests passed! APIs are working correctly.');
  } else {
    log.warn('\n⚠️  Some tests failed. Please check the error messages above.');
  }
}

// Run tests
runAllTests().catch(error => {
  log.error(`Test runner failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
