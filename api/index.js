import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { auth } from "./lib/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
    "http://localhost:5173", 
    process.env.BETTER_AUTH_URL,
    process.env.VITE_API_URL ? process.env.VITE_API_URL.replace(/\/api\/?$/, '') : null
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // penting untuk cookie session (better-auth)
}));
app.use(express.json());

import { toNodeHandler } from "better-auth/node";

// Auth middleware for better-auth
app.use("/api/auth", toNodeHandler(auth));


import transactionRoutes from "./routes/transactionRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";

// Contoh endpoint API lain
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Fingo backend is running." });
});

// App Routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/goals", goalRoutes);

// Export for Vercel Serverless
export default app;

// Jalankan server jika dijalankan secara lokal (bukan di Vercel)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
