import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./configs/env.js";
import rootRouter from "./index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

// ─── Global Middlewares ──────────────────────────────────────

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan("dev")); // Log requests to console
app.use(cors({ 
    origin: env.CLIENT_URL, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));

app.use(express.json({ limit: "16kb" })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser()); // Required for accessing req.cookies

app.set("trust proxy", 1);

// ─── API Routes ─────────────────────────────────────────────

app.use("/api/v1", rootRouter); // Versioning your API is a best practice

// ─── Error Handling ─────────────────────────────────────────

// Global error handler — must be last
app.use(errorMiddleware);

export default app;