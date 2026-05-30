import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data: transactions } = await api.get('/transactions')
      
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      let income = 0;
      let expense = 0;
      let prevIncome = 0;
      let prevExpense = 0;
      let impulsiveCount = 0;
      let prevImpulsiveCount = 0;
      const categoryMap = {};

      transactions.forEach(t => {
        const d = new Date(t.date);
        const tMonth = d.getMonth();
        const tYear = d.getFullYear();

        if (tYear === currentYear && tMonth === currentMonth) {
          if (t.type === 'INCOME') income += t.amount;
          else if (t.type === 'EXPENSE') {
            expense += t.amount;
            if (!categoryMap[t.category]) categoryMap[t.category] = 0;
            categoryMap[t.category] += t.amount;
            
            if (['Hiburan', 'Belanja', 'Lain-lain'].includes(t.category)) {
              impulsiveCount++;
            }
          }
        } else if (tYear === previousMonthYear && tMonth === previousMonth) {
          if (t.type === 'INCOME') prevIncome += t.amount;
          else if (t.type === 'EXPENSE') {
            prevExpense += t.amount;
            if (['Hiburan', 'Belanja', 'Lain-lain'].includes(t.category)) {
              prevImpulsiveCount++;
            }
          }
        }
      });

      const balance = income - expense;
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const monthLabel = `Bulan ${monthNames[currentMonth]} ${currentYear}`;
      
      const incomeDiff = prevIncome > 0 ? Math.round(((income - prevIncome) / prevIncome) * 100) : (income > 0 ? 100 : 0);
      const incomeDiffLabel = incomeDiff >= 0 ? `+${incomeDiff}% dari bulan lalu` : `${incomeDiff}% dari bulan lalu`;

      const defaultBudget = 5000000;
      const budgetUsed = Math.min(Math.round((expense / defaultBudget) * 100), 100);
      const budgetUsedLabel = `${budgetUsed}% budget terpakai`;

      const impulsiveDiff = impulsiveCount - prevImpulsiveCount;
      const impulsiveDiffLabel = impulsiveDiff >= 0 ? `↑ ${impulsiveDiff} dari bulan lalu` : `↓ ${Math.abs(impulsiveDiff)} dari bulan lalu`;
      
      const expenseByCategory = Object.keys(categoryMap).map(category => ({
        category,
        amount: categoryMap[category],
        percent: expense > 0 ? Math.round((categoryMap[category] / expense) * 100) : 0
      })).sort((a, b) => b.amount - a.amount);

      return {
        balance,
        income,
        expense,
        monthLabel,
        incomeDiffLabel,
        budgetUsedLabel,
        impulsiveDiffLabel,
        impulsiveCount,
        recentTransactions: transactions.slice(0, 6).map(t => ({
          id: t.id,
          description: t.note || t.category,
          category: t.category,
          type: t.type.toLowerCase(),
          amount: t.amount,
          date: t.date
        })),
        expenseByCategory,
        incomePrediction: income > 0 ? income + 500000 : 1000000,
        weeklyChart: [
          { week: 'Mg 1', income: income * 0.2, expense: expense * 0.1  },
          { week: 'Mg 2', income: income * 0.3, expense: expense * 0.4  },
          { week: 'Mg 3', income: income * 0.1, expense: expense * 0.2 },
          { week: 'Mg 4', income: income * 0.4, expense: expense * 0.3  },
        ],
      }
    },
  })
}