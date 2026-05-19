import app from "./app.js";
import { env } from "./configs/env.js";
import mongoose from "mongoose";

const startServer = async () => {
    try {
        // 1. Connect to Database
        console.log("Connecting to MongoDB...");
        await mongoose.connect(env.DATABASE_URL);
        console.log("✅ MongoDB Connected");

        // 2. Start Listening
        const PORT = env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`🚀 Server is running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1); // Exit with failure
    }
};

startServer();