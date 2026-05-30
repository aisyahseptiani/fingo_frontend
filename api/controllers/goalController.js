import { prisma } from "../lib/auth.js";

export const getGoals = async (req, res) => {
    try {
        const goals = await prisma.goal.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(goals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get goals" });
    }
};

export const createGoal = async (req, res) => {
    try {
        const { name, targetAmount, deadline, color } = req.body;
        const goal = await prisma.goal.create({
            data: {
                userId: req.user.id,
                name,
                targetAmount: parseFloat(targetAmount),
                currentAmount: 0,
                deadline: deadline ? new Date(deadline) : null,
                color: color || "bg-blue-500"
            }
        });
        res.status(201).json(goal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create goal" });
    }
};
