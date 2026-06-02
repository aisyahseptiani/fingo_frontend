import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

// Middleware auth (already handled globally by better-auth or manually via session)
// Wait, we need a middleware to get user from session.
// In better-auth, we can use auth.api.getSession({ headers: req.headers })
import { auth } from "../lib/auth.js";

router.use(async (req, res, next) => {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = session.user;
    next();
});

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

export default router;
