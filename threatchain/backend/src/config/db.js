import mongoose from "mongoose";

/**
 * DATABASE CONNECTION
 * Connects to MongoDB Atlas (online database)
 * This keeps your data safe even after you close your laptop!
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit if database connection fails
  }
};

export default connectDB;
