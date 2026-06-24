"use client"
import { useEffect, useState } from "react"
import { getLeads, type Lead } from "@/lib/supabase"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

const COLORS = ["#C9A84C", "#00D4FF", "#6E44FF", "#4A7C59", "#1B2A4A"]

export default function AnalyticsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeads().then((data) => { setLeads(data); setLoading(false) })
  }, [])

  const sourceData = Object.entries(
    leads.reduce((acc: Record<string, number>, l) => {
      const src = l.source_website || "unknown"
      acc[src] = (acc[src] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  const serviceData = Object.entries(
    leads.reduce((acc: Record<string, number>, l) => {
      const svc = l.service_interested || "General Inquiry"
      acc[svc] = (acc[svc] || 0) + 1
      return acc
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name: name.substring(0, 20), value }))

  const conversionData = Object.entries(
    leads.reduce((acc: Record<string, { total: number; converted: number }>, l) => {
      const src = l.source_website || "unknown"
      if (!acc[src]) acc[src] = { total: 0, converted: 0 }
      acc[src].total++
      if (l.status === "converted") acc[src].converted++
      return acc
    }, {})
  ).map(([name, { total, converted }]) => ({ name, rate: total > 0 ? Math.round((converted / total) * 100) : 0 }))

  const dayOfWeek = leads.reduce((acc: Record<string, number>, l) => {
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(l.created_at).getDay()]
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {})
  const dayData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({ day: d, leads: dayOfWeek[d] || 0 }))

  if (loading) return <div className="p-8 flex items-center justify-center"><div className="w-10 h-10 border-2 border-[#C9A84C] rounded-full animate-spin border-t-transparent" /></div>

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Analytics</h1>
        <p className="text-[#6B7280] text-sm mt-1">Performance insights across all websites</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1B2A4A] mb-6">Leads by Source</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {sourceData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1B2A4A] mb-6">Conversion Rate by Source (%)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="rate" fill="#C9A84C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1B2A4A] mb-6">Top Services Requested</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={serviceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={130} />
              <Tooltip />
              <Bar dataKey="value" fill="#1B2A4A" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1B2A4A] mb-6">Leads by Day of Week</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="leads" stroke="#C9A84C" strokeWidth={2} dot={{ fill: "#C9A84C", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
