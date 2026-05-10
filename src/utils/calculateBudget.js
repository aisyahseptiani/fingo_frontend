export const getBudgetPercentage = (spent, limit) =>
  Math.min(Math.round((spent / limit) * 100), 100)

export const getBudgetStatus = (percentage) => {
  if (percentage >= 90) return { label: 'Kritis', color: 'danger' }
  if (percentage >= 75) return { label: 'Hati-hati', color: 'warning' }
  return { label: 'Aman', color: 'success' }
}

export const getRemainingBudget = (limit, spent) => Math.max(limit - spent, 0)