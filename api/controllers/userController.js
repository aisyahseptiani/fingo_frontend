import { prisma } from "../lib/auth.js";

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
        const { name, phone, city, province, jobType, platform } = req.body;
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                name,
                phone,
                city,
                province,
                jobType,
                platform,
            }
        });
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};
