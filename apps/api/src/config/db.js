import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from .env");
  }

  try {
    console.log("Checking MongoDB configuration...");
    console.log("MongoDB URI found.");
    console.log("Attempting MongoDB connection...");

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error("\n=================================");
    console.error("MONGODB CONNECTION FAILED");
    console.error("=================================");
    console.error("Error:", error.message);
    console.error("Code:", error.code || "N/A");
    console.error("=================================\n");
    throw error;
  }
};

export default connectDB;
