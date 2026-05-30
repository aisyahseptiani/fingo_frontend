import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { auth } from "./lib/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: "http://localhost:5173", // URL frontend Vite
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
