import { prisma } from "../lib/auth.js";

export const getTransactions = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: req.user.id },
            orderBy: { date: 'desc' }
        });
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get transactions" });
    }
};

export const createTransaction = async (req, res) => {
    try {
        const { amount, type, category, note, date } = req.body;
        const transaction = await prisma.transaction.create({
            data: {
                userId: req.user.id,
                amount: parseFloat(amount),
                type,
                category,
                note,
                date: date ? new Date(date) : new Date()
            }
        });
        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create transaction" });
    }
};

export const getSummary = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: req.user.id }
        });

        let totalIncome = 0;
        let totalExpense = 0;
        
        // This calculates the all-time summary for simplicity. Can be filtered by month.
        transactions.forEach(t => {
            if (t.type === 'INCOME') totalIncome += t.amount;
            if (t.type === 'EXPENSE') totalExpense += t.amount;
        });

        res.json({
            balance: totalIncome - totalExpense,
            totalIncome,
            totalExpense
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get summary" });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, type, category, description, date } = req.body;
        const transaction = await prisma.transaction.update({
            where: { id, userId: req.user.id },
            data: {
                amount: parseFloat(amount),
                type,
                category,
                note: description,
                date: date ? new Date(date) : undefined
            }
        });
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update transaction" });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.transaction.delete({
            where: { id, userId: req.user.id }
        });
        res.json({ message: "Transaction deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete transaction" });
    }
};
