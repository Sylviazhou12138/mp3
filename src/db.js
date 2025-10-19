import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    if (!uri) {
      throw new Error("❌ MONGODB_URI is missing");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};