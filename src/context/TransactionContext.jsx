import { createContext, useContext, useState } from 'react'

const TransactionContext = createContext(null)

const INITIAL_TRANSACTIONS = [
  { id: 1, description: 'Beli sayuran',      method: 'Tunai',         category: 'Makanan',      date: '22 Apr', amount: 203000,  type: 'expense', isImpulsive: false },
  { id: 2, description: 'Grab',              method: 'Gopay',         category: 'Transportasi', date: '21 Apr', amount: 15000,   type: 'expense', isImpulsive: false },
  { id: 3, description: 'Freelance Project', method: 'Transfer Bank', category: 'Pemasukan',    date: '20 Apr', amount: 800000,  type: 'income',  isImpulsive: false },
  { id: 4, description: 'Makan siang',       method: 'Tunai',         category: 'Makanan',      date: '19 Apr', amount: 35000,   type: 'expense', isImpulsive: false },
  { id: 5, description: 'Netflix',           method: 'Gopay',         category: 'Hiburan',      date: '18 Apr', amount: 54000,   type: 'expense', isImpulsive: true  },
  { id: 6, description: 'Transfer Gojek',    method: 'Transfer Bank', category: 'Pemasukan',    date: '18 Apr', amount: 1100000, type: 'income',  isImpulsive: false },
]

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS)

  // Tambah transaksi baru (paling atas)
  const addTransaction = (trx) => {
    const newTrx = {
      ...trx,
      id: Date.now(),
      date: trx.date ?? new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      isImpulsive: trx.isImpulsive ?? false,
    }
    setTransactions(prev => [newTrx, ...prev])
  }

  // Edit transaksi berdasarkan id
  const editTransaction = (id, updated) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, ...updated } : t)
    )
  }

  // Hapus transaksi berdasarkan id
  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, editTransaction, deleteTransaction }}>
      {children}
    </TransactionContext.Provider>
  )
}

export const useTransactionContext = () => {
  const ctx = useContext(TransactionContext)
  if (!ctx) throw new Error('useTransactionContext harus dipakai di dalam TransactionProvider')
  return ctx
}