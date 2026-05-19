
// purpose:
// - establish a connection to MongoDB using Mongoose
// - handle connection errors and lifecycle events
// method:
// - read DB URI from environment variables
// - use Mongoose's connect method with appropriate options for production
// - log connection status and errors
// in production, consider implementing retry logic for transient connection issues
// retry logic example:
// const connectWithRetry = () => {
//     mongoose.connect(dbUri, connectionOptions)
//         .then(() => console.log("MongoDB connected successfully"))
//         .catch((err) => {
//             console.error(`MongoDB connection failed: ${err.message}. Retrying in 5 seconds...`);
//             setTimeout(connectWithRetry, 5000);
//         });
// };
// connectWithRetry();  

// connection options can be further tuned based on your application's needs and expected load
// maxPoolSize can be increased for high-traffic applications, but monitor resource usage to avoid overloading the DB server
// serverSelectionTimeoutMS should be set to a reasonable value to avoid long waits during connection issues, especially in production environments
// database connection takes place once at app startup, and Mongoose will manage the connection pool for subsequent operations
// for each user request, you can simply use Mongoose models to interact with the database without worrying about connection management, as Mongoose handles that internally.
// if app scales horizontally, ensure that your MongoDB deployment can handle multiple connections from different instances of your app, and consider using a connection pool or a managed MongoDB service that supports scaling.
// so connection flow is:
// 1. App starts and calls connectDB()
// 2. connectDB() reads MONGODB_URI from environment variables
// 3. If MONGODB_URI is missing, log error and exit
// 4. If MONGODB_URI is present, attempt to connect to MongoDB using Mongoose
// 5. On successful connection, log success message
// 6. If connection fails, log error and exit (or implement retry logic in production)
// 7. During runtime, listen for connection errors and disconnections to log issues and attempt reconnection if needed.
// in productivity, an app is continuously running, so handling mid-runtime connection issues is crucial for maintaining uptime and reliability.
// for development, you might want to log more detailed errors and stack traces, while in production, you might want to log only critical errors and use a monitoring tool to track database health and performance.
// how checker works:
// - when connectDB() is called, it checks for MONGODB_URI in environment variables
// - if MONGODB_URI is missing, it logs a critical error and exits the app to prevent it from running without a database connection
// - if MONGODB_URI is present, it attempts to connect to MongoDB using Mongoose with specified options for stability and performance
// - if the connection is successful, it logs a success message with the host information
// - if the connection fails, it catches the error, logs a failure message with the error details, and exits the app (or retries in production)
// - during runtime, it listens for connection errors and disconnections to log issues and attempt reconnection if needed, ensuring that the app can recover from transient database issues without crashing.
// what is more robust way to handle db connection in production:
// - implement retry logic with exponential backoff to handle transient connection issues without crashing the app
// - use a connection pool to manage multiple connections efficiently and reduce latency
// - monitor database performance and connection health using a monitoring tool (e.g., MongoDB Atlas, New Relic, Datadog) to proactively identify and address issues
// - consider using a managed MongoDB service that offers built-in scalability, high availability, and automated backups to reduce operational overhead and improve reliability.
// how check health on mongodb atlas:
// - log in to your MongoDB Atlas account and navigate to your cluster
// - go to the "Metrics" tab to view real-time performance metrics such as CPU usage, memory usage, disk I/O, and network traffic
// - check the "Connections" metric to see the number of active connections to your cluster and monitor for any spikes or drops that could indicate connection issues
// - use the "Alerts" feature to set up notifications for specific events (e.g., high CPU usage, connection errors) so you can respond quickly to potential issues
// - regularly review the "Logs" section for any error messages or warnings that could indicate problems with your database connection or performance.
// npm install mongoose
import mongoose from "mongoose";

/**
 * Professional DB Connection Handler
 * Handles initial connection, errors, and lifecycle events.
 */
export const connectDB = async () => {
    const dbUri = process.env.DATABASE_URL;

    if (!dbUri) {
        console.error("CRITICAL: DATABASE_URL is not defined in environment variables.");
        process.exit(1); // Stop the app if no DB URI is found
    }

    try {
        // Options for stability in production
        const connectionOptions = {
            autoIndex: true, // Set to false in high-scale prod to build indexes manually
            maxPoolSize: 10,  // Standard for medium traffic
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        };

        const connection = await mongoose.connect(dbUri, connectionOptions);
        
        console.log(`✅ MongoDB Connected: ${connection.connection.host}`);

        // Handle mid-runtime disconnections (Scalability/Resilience)
        mongoose.connection.on("error", (err) => {
            console.error(`❌ MongoDB Runtime Error: ${err}`);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB Disconnected. Attempting to reconnect...");
        });

    } catch (error) {
        console.error(`❌ Database connection failed: ${error.message}`);
        // In production, you might want to use a retry logic or exit
        process.exit(1);
    }
};

export default connectDB;