import { useState, useRef, useEffect } from 'react'
import { Send, Mic } from 'lucide-react'
import fingoLogo from '../../assets/images/fingo-logo.png'

import { useAuthContext } from '../../context/AuthContext'
import { useDashboard } from '../../hooks/useDashboard'
import { chatWithAi } from '../../services/fingoAi'

const QUICK_PROMPTS = [
  'Ringkasan keuanganku', 'Tips hemat bulan ini',
  'Tip nabung gig worker', 'Analisis pengeluaran',
  'Rencana darurat', 'Cek kesehatan keuangan',
]

function formatMessage(text) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g)
    return (
      <p key={i} className={i > 0 ? 'mt-1' : ''}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
      </p>
    )
  })
}

export default function AIAssistantPage() {
  const { user } = useAuthContext()
  const { data: dashboardData } = useDashboard()
  
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'ai', time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      text: `Halo ${user?.name?.split(' ')[0] ?? 'Pengguna'}! Aku Fingo AI, asisten keuangan pribadimu. Aku terhubung dengan data keuanganmu dan siap membantu analisis, memberikan saran, dan menjawab seputar keuangan. Sedang memuat data keuanganmu...`,
    }
  ])
  const [input, setInput]       = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const inputRef  = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (dashboardData) {
      setMessages(prev => {
        const newMsgs = [...prev]
        if (newMsgs[0] && newMsgs[0].id === 1) {
          const balanceStr = new Intl.NumberFormat('id-ID').format(dashboardData.balance || 0)
          const expenseStr = new Intl.NumberFormat('id-ID').format(dashboardData.expense || 0)
          newMsgs[0].text = `Halo ${user?.name?.split(' ')[0] ?? 'Pengguna'}! Aku Fingo AI, asisten keuangan pribadimu. Aku terhubung dengan data keuanganmu dan siap membantu analisis, memberikan saran, dan menjawab seputar keuangan.\n\nBerdasarkan data terbaru, saldo kamu saat ini **Rp ${balanceStr}** dengan pengeluaran bulan ini **Rp ${expenseStr}**. Ada yang bisa aku bantu?`
        }
        return newMsgs
      })
    }
  }, [dashboardData, user?.name])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text) => {
    if (!text.trim()) return
    const t = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', time: t, text }])
    setInput('')
    setIsTyping(true)
    setTimeout(() => inputRef.current?.focus(), 100)
    
    try {
      const financialContext = {
        income: dashboardData?.income || 0,
        expense: dashboardData?.expense || 0,
        budget_remaining: dashboardData?.balance || 0,
        impulsive_count: dashboardData?.impulsiveCount || 0
      };
      const response = await chatWithAi(text, financialContext);
      
      const t2 = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'ai', time: t2,
        text: response.reply || 'Maaf, saya tidak mengerti maksud Anda.',
      }])
    } catch (error) {
      const t2 = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'ai', time: t2,
        text: 'Maaf, terjadi kesalahan saat menghubungi server Fingo AI.',
      }])
    } finally {
      setIsTyping(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
  }

  const clearChat = () => {
    const t = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    const balanceStr = new Intl.NumberFormat('id-ID').format(dashboardData?.balance || 0)
    const expenseStr = new Intl.NumberFormat('id-ID').format(dashboardData?.expense || 0)
    
    setMessages([
      {
        id: 1, role: 'ai', time: t,
        text: `Halo ${user?.name?.split(' ')[0] ?? 'Pengguna'}! Aku Fingo AI, asisten keuangan pribadimu. Aku terhubung dengan data keuanganmu dan siap membantu analisis, memberikan saran, dan menjawab seputar keuangan.\n\nBerdasarkan data terbaru, saldo kamu saat ini **Rp ${balanceStr}** dengan pengeluaran bulan ini **Rp ${expenseStr}**. Ada yang bisa aku bantu?`,
      }
    ])
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    // flex-1 + min-h-0 agar mengisi sisa tinggi dari MainLayout
    <div className="flex flex-col h-full min-h-0 bg-gray-50">

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-100 shrink-0">
        <div className="px-4 lg:px-6 py-3 lg:py-4">

          {/* Avatar + nama + tombol */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative shrink-0">
                <img src={fingoLogo} alt="Fingo AI"
                  className="w-9 h-9 lg:w-10 lg:h-10 rounded-full object-cover" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div className="min-w-0">
                <h1 className="font-black text-gray-900 text-base lg:text-lg leading-none">
                  Fingo AI Assistant
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">Online · Powered by Gemini</p>
              </div>
            </div>
          </div>

          {/* Quick prompts */}
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-0.5">
            {QUICK_PROMPTS.map(prompt => (
              <button key={prompt} onClick={() => sendMessage(prompt)}
                className="shrink-0 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs text-gray-600 hover:border-[#22c55e] hover:text-[#22c55e] transition-colors whitespace-nowrap">
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CHAT AREA ── */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-4 lg:space-y-5 min-h-0">
        {messages.map(msg => (
          <div key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

            {msg.role === 'ai' && (
              <img src={fingoLogo} alt="AI"
                className="w-7 h-7 lg:w-8 lg:h-8 rounded-full object-cover shrink-0 mt-1" />
            )}

            <div className={`flex flex-col max-w-[85%] sm:max-w-[78%] lg:max-w-[70%]
              ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>

              {msg.role === 'ai' && (
                <p className="text-xs font-semibold text-[#22c55e] mb-1 ml-1">Fingo AI</p>
              )}

              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words
                ${msg.role === 'user'
                  ? 'bg-[#22c55e] text-white rounded-tr-sm'
                  : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm'
                }`}>
                {formatMessage(msg.text)}
              </div>

              <p className="text-[10px] text-gray-400 mt-1 mx-1">{msg.time}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <img src={fingoLogo} alt="AI"
              className="w-7 h-7 lg:w-8 lg:h-8 rounded-full object-cover shrink-0" />
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
              <span className="text-sm text-gray-400 mr-1">Fingo AI sedang mengetik</span>
              {[0,1,2].map(i => (
                <div key={i}
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── INPUT ── */}
      <div className="bg-white border-t border-gray-100 shrink-0">
        <div className="px-4 lg:px-6 py-3 lg:py-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 lg:gap-3">
            <button type="button"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0">
              <Mic size={18} />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (input.trim()) sendMessage(input)
                }
              }}
              placeholder="Tanyakan sesuatu..."
              className="flex-1 min-w-0 px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 placeholder:text-gray-300 bg-gray-50"
            />

            <button type="submit" disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shrink-0">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}