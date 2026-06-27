"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, TrendingUp, Star, CheckCircle, Clock } from "lucide-react"
import { getLeads, type Lead } from "@/lib/supabase"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const SOURCE_COLORS: Record<string, string> = {
  "versa-main": "#4A7C59",
  "ipb-kochi": "#003087",
  "versa-digital": "#00D4FF",
  "versa-global": "#1B2A4A",
  "versa-finance": "#00C9A7",
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeads().then((data) => { setLeads(data); setLoading(false) })
  }, [])

  const today = new Date().toDateString()
  const todayLeads = leads.filter((l) => new Date(l.created_at).toDateString() === today).length
  const newLeads = leads.filter((l) => l.status === "new" || !l.status).length
  const contacted = leads.filter((l) => l.status === "contacted").length
  const converted = leads.filter((l) => l.status === "converted").length

  const sourceData = Object.entries(
    leads.reduce((acc: Record<string, number>, l) => {
      const src = l.source_website || "unknown"
      acc[src] = (acc[src] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    const dateStr = d.toISOString().split("T")[0]
    const count = leads.filter((l) => l.created_at.startsWith(dateStr)).length
    return { date: d.getDate().toString(), count }
  })

  const stats = [
    { label: "Total Leads", value: leads.length, icon: Users, color: "#1B2A4A" },
    { label: "Today", value: todayLeads, icon: TrendingUp, color: "#C9A84C" },
    { label: "New", value: newLeads, icon: Star, color: "#00D4FF" },
    { label: "Contacted", value: contacted, icon: Clock, color: "#6E44FF" },
    { label: "Converted", value: converted, icon: CheckCircle, color: "#22C55E" },
  ]

  if (loading) return (
    <div className="p-8 flex items-center justify-center h-full">
      <div className="w-10 h-10 border-2 border-[#C9A84C] rounded-full animate-spin border-t-transparent" />
    </div>
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Dashboard Overview</h1>
        <p className="text-[#6B7280] text-sm mt-1">All leads from all 5 active Versa websites</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: stat.color + "15" }}>
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <div className="text-3xl font-bold text-[#1B2A4A] mb-1">{stat.value}</div>
            <div className="text-[#6B7280] text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1B2A4A] mb-6">Leads — Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={last30Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#C9A84C" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1B2A4A] mb-6">Leads by Source</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {sourceData.map((entry, index) => (
                  <Cell key={index} fill={SOURCE_COLORS[entry.name] || "#C9A84C"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
