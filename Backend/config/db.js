import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, { dbName: "auratracker" });

    mongoose.connection.on("connected", () => console.log("Database connected"));
    mongoose.connection.on("error", (err) =>
      console.error("Mongoose connection error:", err)
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message || error);
    process.exit(1);
  }
};

export default connectDB;