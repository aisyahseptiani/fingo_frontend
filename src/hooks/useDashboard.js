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

      let defaultBudget = 5000000;
      let aiSuggestion = null;
      let hasBudgetPlanner = false;
      
      try {
        const savedBudgetStr = localStorage.getItem('fingo_budget_values');
        if (savedBudgetStr) {
          const savedBudgetObj = JSON.parse(savedBudgetStr);
          const totalSavedBudget = Object.values(savedBudgetObj).reduce((a, b) => a + b, 0);
          if (totalSavedBudget > 0) {
            defaultBudget = totalSavedBudget;
            hasBudgetPlanner = true;
          }
          
          let maxOverspendPct = 0;
          let maxOverspendCat = null;
          
          Object.keys(savedBudgetObj).forEach(cat => {
            const limit = savedBudgetObj[cat];
            const spent = categoryMap[cat] || 0;
            if (limit > 0) {
              const pct = (spent / limit) * 100;
              if (pct > maxOverspendPct) {
                maxOverspendPct = pct;
                maxOverspendCat = cat;
              }
            }
          });
          
          if (maxOverspendPct > 80 && maxOverspendCat) {
             const limit = savedBudgetObj[maxOverspendCat];
             const pctStr = Math.round(maxOverspendPct);
             aiSuggestion = {
                title: `Perhatikan Pengeluaran ${maxOverspendCat}`,
                message: `Budget ${maxOverspendCat} kamu sudah ${pctStr}% terpakai dari batas Rp ${limit.toLocaleString('id-ID')}. Hati-hati agar tidak melebihi batas bulan ini.`
             };
          }
        }
      } catch (e) {
        console.error('Error parsing budget data', e);
      }

      if (!aiSuggestion) {
         if (balance > defaultBudget * 0.2) {
             aiSuggestion = {
                title: `Kondisi Keuangan Sehat`,
                message: `Keuanganmu bulan ini stabil. Pertimbangkan untuk mengalokasikan sisa saldo ke instrumen tabungan atau investasi.`
             };
         }
      }

      const budgetUsed = Math.min(Math.round((expense / defaultBudget) * 100), 100);
      const budgetUsedLabel = `${budgetUsed}% budget terpakai`;

      const impulsiveDiff = impulsiveCount - prevImpulsiveCount;
      const impulsiveDiffLabel = impulsiveDiff >= 0 ? `↑ ${impulsiveDiff} dari bulan lalu` : `↓ ${Math.abs(impulsiveDiff)} dari bulan lalu`;
      
      const expenseByCategory = Object.keys(categoryMap).map(category => ({
        category,
        amount: categoryMap[category],
        percent: expense > 0 ? Math.round((categoryMap[category] / expense) * 100) : 0
      })).sort((a, b) => b.amount - a.amount);

      let incomePrediction = income > 0 ? income + 500000 : 1000000;
      let hasIncomePredictor = false;
      let predictorHistoryData = null;
      try {
        const savedPredictorStr = localStorage.getItem('fingo_income_predictor_data');
        if (savedPredictorStr) {
          const predictorData = JSON.parse(savedPredictorStr);
          if (Array.isArray(predictorData) && predictorData.length > 0) {
            hasIncomePredictor = true;
            predictorHistoryData = predictorData;
            const n = predictorData.length;
            if (n >= 2) {
               const values = predictorData.map(w => w.amount);
               const trend  = (values[n - 1] - values[0]) / (n - 1);
               const last   = values[n - 1];
               incomePrediction = Math.round(last + trend * 1 * 0.5);
            } else {
               incomePrediction = predictorData[n - 1].amount;
            }
          }
        }
      } catch (e) {
         console.error('Error parsing predictor data', e);
      }

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
        incomePrediction,
        hasIncomePredictor,
        predictorHistoryData,
        aiSuggestion,
        hasBudgetPlanner,
        totalBudget: defaultBudget,
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