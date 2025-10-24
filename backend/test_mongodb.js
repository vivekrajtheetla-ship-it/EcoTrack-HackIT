const mongoose = require('mongoose');

// Test MongoDB connection
const MONGODB_URI = 'mongodb+srv://vivekrajtheetla_db_user:lRm8r8uoWAD0U689@cluster0.q1ms9st.mongodb.net/ecotrack_db?retryWrites=true&w=majority&appName=Cluster0';

console.log('🧪 Testing MongoDB Atlas connection...');
console.log('URI:', MONGODB_URI.replace(/:[^:@]*@/, ':****@')); // Hide password in logs

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({
      name: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    
    return TestModel.create({ name: 'Connection Test' });
  })
  .then((doc) => {
    console.log('✅ Test document created:', doc);
    console.log('🎉 Database is working correctly!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', err.message);
    console.error('Code:', err.code);
    console.error('CodeName:', err.codeName);
    
    if (err.message.includes('Authentication failed')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Check if the username and password are correct');
      console.log('2. Verify the database user has proper permissions');
      console.log('3. Check if IP address is whitelisted in MongoDB Atlas');
      console.log('4. Ensure the cluster is running and accessible');
    }
    
    process.exit(1);
  });