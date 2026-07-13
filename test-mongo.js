const mongoose = require('mongoose');

const uri = "mongodb+srv://aparnajakka27_db_user:aparna70804264@cluster0.ulcxvro.mongodb.net/dateforcode?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  console.log("Attempting to connect to MongoDB...");
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("SUCCESS: Connected to MongoDB Atlas!");
    process.exit(0);
  } catch (error) {
    console.error("FAILED: Could not connect.");
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();
