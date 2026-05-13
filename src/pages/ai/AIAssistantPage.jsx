import { useState, useRef, useEffect } from 'react'
import { Send, Mic } from 'lucide-react'
import fingoLogo from '../../assets/images/fingo-logo.png'

const QUICK_PROMPTS = [
  'Ringkasan keuanganku',
  'Tips hemat bulan ini',
  'Tip nabung gig worker',
  'Analisis pengeluaran',
  'Rencana darurat',
  'Cek kesehatan keuangan',
]

const INITIAL_MESSAGES = [
  {
    id: 1, role: 'ai', time: '09:30',
    text: 'Halo Aisyah! Aku Fingo AI, asisten keuangan pribadimu. Aku terhubung dengan data keuanganmu dan siap membantu analisis, memberikan saran, dan menjawab seputar keuangan.\n\nBerdasarkan data terbaru, saldo kamu saat ini **Rp 2.45 juta** dengan pengeluaran bulan ini **Rp 1.75 juta**. Ada yang bisa aku bantu?'
  },
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
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = (text) => {
    if (!text.trim()) return
    const userMsg = { id: Date.now(), role: 'user', time: '09:35', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulasi reply AI
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'ai', time: '09:36',
        text: 'Terima kasih atas pertanyaanmu! Berdasarkan data keuanganmu, aku sedang menganalisis pola pengeluaran dan pemasukan kamu. Fitur ini akan terhubung penuh ke AI saat backend tersedia.'
      }])
    }, 1500)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="flex flex-col h-screen">

      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={fingoLogo} alt="Fingo AI" className="w-10 h-10 rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="font-black text-gray-900 text-lg leading-none">Fingo AI Assistant</h1>
              <p className="text-xs text-gray-400">Online · Powered by Gemini</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMessages(INITIAL_MESSAGES)}
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
            >
              Hapus Chat
            </button>
            <button className="px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-semibold transition-colors">
              Laporan Keuangan
            </button>
          </div>
        </div>

        {/* Quick prompts */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {QUICK_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="shrink-0 px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-600 hover:border-[#22c55e] hover:text-[#22c55e] transition-colors whitespace-nowrap"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 bg-gray-50">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>

            {/* AI avatar */}
            {msg.role === 'ai' && (
              <img src={fingoLogo} alt="AI" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" />
            )}

            <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              {msg.role === 'ai' && (
                <p className="text-xs font-semibold text-[#22c55e] mb-1 ml-1">Fingo AI</p>
              )}
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#22c55e] text-white rounded-tr-sm'
                  : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm'
              }`}>
                {formatMessage(msg.text)}
              </div>
              <p className="text-[10px] text-gray-400 mt-1 mx-1">{msg.time}</p>
            </div>

          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <img src={fingoLogo} alt="AI" className="w-8 h-8 rounded-full object-cover shrink-0" />
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
              <span className="text-sm text-gray-400 mr-1">Fingo AI sedang mengetik</span>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="px-6 py-4 bg-white border-t border-gray-100 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <button type="button" className="p-2.5 text-gray-400 hover:text-gray-600 transition-colors">
            <Mic size={18} />
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Tanyakan sesuatu..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 placeholder:text-gray-300 bg-gray-50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-11 h-11 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shrink-0"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}