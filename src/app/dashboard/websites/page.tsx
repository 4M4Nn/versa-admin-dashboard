"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Users } from "lucide-react"
import { getLeads, type Lead } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const websites = [
  { id: "versa-main", name: "Versa Main", url: "https://versagrowthventures.vercel.app", description: "Main Versa Growth Ventures website", color: "#4A7C59" },
  { id: "ipb-kochi", name: "IPB Kochi", url: "https://ipb-kochi.vercel.app", description: "Banking institute — 13,200+ students placed", color: "#003087" },
  { id: "versa-digital", name: "Versa Digital", url: "https://versa-digital.vercel.app", description: "AI-powered digital marketing agency", color: "#00D4FF" },
  { id: "versa-global", name: "Versa Global", url: "https://versa-global-education.vercel.app", description: "Study abroad consultancy — 60+ countries", color: "#1B2A4A" },
  { id: "versa-finance", name: "Versa Finance", url: "https://finance-mauve-seven.vercel.app", description: "Financial services — stocks, MF, insurance", color: "#00C9A7" },
]

export default function WebsitesPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getLeads().then((data) => { setLeads(data); setLoading(false) })
  }, [])

  const getLeadCount = (sourceId: string) => leads.filter((l) => l.source_website === sourceId).length

  if (loading) return <div className="p-8 flex items-center justify-center"><div className="w-10 h-10 border-2 border-[#C9A84C] rounded-full animate-spin border-t-transparent" /></div>

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Venture Websites</h1>
        <p className="text-[#6B7280] text-sm mt-1">Monitor and manage all 5 active websites</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites.map((site, i) => (
          <motion.div key={site.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-2" style={{ backgroundColor: site.color }} />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: site.color }}>
                  {site.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Users size={14} />
                  <span className="font-bold text-[#1B2A4A]">{getLeadCount(site.id)}</span>
                  <span>leads</span>
                </div>
              </div>
              <h3 className="font-bold text-[#1B2A4A] text-lg mb-1">{site.name}</h3>
              <p className="text-[#6B7280] text-sm mb-6">{site.description}</p>
              <div className="flex gap-3">
                <a href={site.url} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200 hover:opacity-80"
                  style={{ borderColor: site.color, color: site.color }}>
                  <ExternalLink size={14} />Visit Website
                </a>
                <button onClick={() => router.push(`/dashboard/leads`)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: site.color }}>
                  <Users size={14} />View Leads
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
