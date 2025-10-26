/**
 * MongoDB Connection Test Script
 * Run this to test your MongoDB Atlas connection independently
 */

require('dotenv').config();
const mongoose = require('mongoose');

console.log('\n========================================');
console.log('  MongoDB Connection Test');
console.log('========================================\n');

// Display configuration (hide password)
const connectionString = process.env.MONGODB_URI || 'Not set';
const hiddenConnection = connectionString.replace(/:([^@]+)@/, ':****@');
console.log('📋 Configuration:');
console.log(`   Connection String: ${hiddenConnection}`);
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);

console.log('🔄 Attempting to connect to MongoDB...\n');

// Attempt connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! MongoDB connected successfully!\n');
    console.log('📊 Connection Details:');
    console.log(`   Database Name: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Port: ${mongoose.connection.port}`);
    console.log(`   Ready State: ${mongoose.connection.readyState} (1 = connected)\n`);
    
    console.log('🎉 Your MongoDB Atlas connection is working!\n');
    console.log('Next steps:');
    console.log('   1. Start your server: npm start');
    console.log('   2. Test API: http://localhost:5000/api/health');
    console.log('   3. Deploy to production\n');
    
    // Close connection
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ FAILED! MongoDB connection error\n');
    console.log('Error Details:');
    console.log(`   Message: ${err.message}`);
    console.log(`   Code: ${err.code || 'N/A'}\n`);
    
    console.log('🔧 Troubleshooting Steps:\n');
    
    if (err.message.includes('bad auth') || err.message.includes('authentication failed')) {
      console.log('   Problem: Authentication Failed');
      console.log('   Solution:');
      console.log('   1. Go to MongoDB Atlas → Database Access');
      console.log('   2. Edit your user and reset password');
      console.log('   3. Copy the new password');
      console.log('   4. Update MONGODB_URI in .env file');
      console.log('   5. Make sure password is URL-encoded if it has special characters\n');
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.log('   Problem: Cannot find MongoDB cluster');
      console.log('   Solution:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify cluster URL in MongoDB Atlas');
      console.log('   3. Make sure cluster is running (not paused)\n');
    } else if (err.message.includes('ETIMEDOUT')) {
      console.log('   Problem: Connection timeout');
      console.log('   Solution:');
      console.log('   1. Check MongoDB Atlas → Network Access');
      console.log('   2. Make sure 0.0.0.0/0 is whitelisted');
      console.log('   3. Check your firewall settings\n');
    } else {
      console.log('   1. Read the error message above');
      console.log('   2. Check FIX_MONGODB_CONNECTION.md for solutions');
      console.log('   3. Verify your .env file has correct MONGODB_URI\n');
    }
    
    console.log('📖 Full Guide: FIX_MONGODB_CONNECTION.md\n');
    
    process.exit(1);
  });

// Connection events
mongoose.connection.on('error', err => {
  console.log('Connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// Handle process termination
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('\nMongoDB connection closed through app termination');
    process.exit(0);
  });
});
