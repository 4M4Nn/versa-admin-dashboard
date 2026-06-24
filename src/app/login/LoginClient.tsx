"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, Mail } from "lucide-react"

export default function LoginClient() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    if (password === "VersaAdmin@2026") {
      localStorage.setItem("versa_admin_auth", "true")
      router.push("/dashboard")
    } else {
      setError("Invalid credentials. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1B2D] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#C9A84C]"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0, 0.4, 0], scale: [0, 1, 0] }}
            transition={{ duration: 4, delay: Math.random() * 4, repeat: Infinity }}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#1B2A4A] rounded-3xl p-10 border border-[#C9A84C]/20 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#F5D78E] flex items-center justify-center mx-auto mb-4">
              <span className="text-[#1B2A4A] font-bold text-xl">V</span>
            </div>
            <h1 className="text-white text-2xl font-bold">VERSA ADMIN</h1>
            <p className="text-blue-300 text-sm mt-2">Leads Management Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-blue-300 text-sm outline-none focus:border-[#C9A84C] transition-colors"
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-blue-300 text-sm outline-none focus:border-[#C9A84C] transition-colors"
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#C9A84C] hover:bg-[#F5D78E] text-[#1B2A4A] rounded-xl font-bold transition-all duration-300 disabled:opacity-60 mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
