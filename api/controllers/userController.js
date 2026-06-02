import { prisma } from "../lib/auth.js";
import { auth } from "../lib/auth.js";

// ... existing code
export const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                phone: true,
                city: true,
                province: true,
                jobType: true,
                platform: true,
                notifications: true,
                preferences: true,
            }
        });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        console.error("Error getting profile:", error);
        res.status(500).json({ error: "Failed to get profile" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, phone, city, province, jobType, platform, notifications, preferences } = req.body;
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                name,
                phone,
                city,
                province,
                jobType,
                platform,
                notifications,
                preferences,
            }
        });
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Gunakan fungsi bawaan API better-auth di sisi server untuk lebih amannya
        const result = await auth.api.changePassword({
            headers: req.headers,
            body: {
                currentPassword,
                newPassword,
                revokeOtherSessions: true
            }
        });

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(400).json({ error: error.message || "Failed to change password" });
    }
};
