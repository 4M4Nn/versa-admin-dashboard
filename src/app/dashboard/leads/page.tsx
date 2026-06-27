"use client"
import { useEffect, useState, useMemo } from "react"
import { Search, Download, ExternalLink, MessageCircle } from "lucide-react"
import { getLeads, updateLeadStatus, type Lead } from "@/lib/supabase"

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  converted: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
}

const SOURCE_LABELS: Record<string, string> = {
  "versa-main": "Versa Main",
  "ipb-kochi": "IPB Kochi",
  "versa-digital": "Versa Digital",
  "versa-global": "Versa Global",
  "versa-finance": "Versa Finance",
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const PER_PAGE = 20

  useEffect(() => {
    getLeads().then((data) => { setLeads(data); setLoading(false) })
  }, [])

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const q = search.toLowerCase()
      const matchSearch = !q || l.name.toLowerCase().includes(q) || l.phone.includes(q) || (l.email || "").toLowerCase().includes(q)
      const matchSource = sourceFilter === "all" || l.source_website === sourceFilter
      const matchStatus = statusFilter === "all" || (l.status || "new") === statusFilter
      return matchSearch && matchSource && matchStatus
    })
  }, [leads, search, sourceFilter, statusFilter])

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const exportCSV = () => {
    const headers = ["Name", "Phone", "Email", "Company", "Service", "Source", "Date", "Status"]
    const rows = filtered.map((l) => [l.name, l.phone, l.email || "", l.company || "", l.service_interested || "", l.source_website || "", new Date(l.created_at).toLocaleDateString(), l.status || "new"])
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "versa-leads.csv"; a.click()
  }

  const handleStatusChange = async (id: string, status: string) => {
    await updateLeadStatus(id, status)
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l))
    if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status })
  }

  if (loading) return <div className="p-8 flex items-center justify-center"><div className="w-10 h-10 border-2 border-[#C9A84C] rounded-full animate-spin border-t-transparent" /></div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">All Leads</h1>
          <p className="text-[#6B7280] text-sm mt-1">{filtered.length} leads found</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-white rounded-xl text-sm font-medium hover:bg-[#B8973B] transition-colors">
          <Download size={16} />Export CSV
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name, phone, email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#C9A84C] transition-colors" />
          </div>
          <select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#C9A84C] bg-white text-[#1B2A4A]">
            <option value="all">All Sources</option>
            <option value="versa-main">Versa Main</option>
            <option value="ipb-kochi">IPB Kochi</option>
            <option value="versa-digital">Versa Digital</option>
            <option value="versa-global">Versa Global</option>
            <option value="versa-finance">Versa Finance</option>
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#C9A84C] bg-white text-[#1B2A4A]">
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["#", "Name", "Phone", "Email", "Service", "Source", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[#6B7280] font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((lead, i) => (
                <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-[#6B7280]">{(page - 1) * PER_PAGE + i + 1}</td>
                  <td className="px-4 py-3 font-medium text-[#1B2A4A]">{lead.name}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{lead.phone}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{lead.email || "-"}</td>
                  <td className="px-4 py-3 text-[#6B7280] max-w-[150px] truncate">{lead.service_interested || "-"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 bg-[#1B2A4A]/10 text-[#1B2A4A] rounded-full font-medium">{SOURCE_LABELS[lead.source_website || ""] || lead.source_website || "-"}</span>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select value={lead.status || "new"} onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-0 outline-none cursor-pointer ${STATUS_COLORS[lead.status || "new"]}`}>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedLead(lead)} className="text-[#1B2A4A] hover:text-[#C9A84C] transition-colors p-1">
                        <ExternalLink size={14} />
                      </button>
                      <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer"
                        className="text-[#25D366] hover:opacity-70 transition-opacity p-1">
                        <MessageCircle size={14} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-[#6B7280]">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:border-[#C9A84C] transition-colors">Prev</button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:border-[#C9A84C] transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setSelectedLead(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#1B2A4A] text-xl">{selectedLead.name}</h3>
              <button onClick={() => setSelectedLead(null)} className="text-[#6B7280] hover:text-[#1B2A4A]">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: "Phone", value: selectedLead.phone },
                { label: "Email", value: selectedLead.email || "-" },
                { label: "Company", value: selectedLead.company || "-" },
                { label: "Source", value: SOURCE_LABELS[selectedLead.source_website || ""] || selectedLead.source_website || "-" },
                { label: "Service", value: selectedLead.service_interested || "-" },
                { label: "Date", value: new Date(selectedLead.created_at).toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[#6B7280] text-xs uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-[#1B2A4A] font-medium text-sm">{value}</p>
                </div>
              ))}
            </div>
            {selectedLead.message && (
              <div className="mb-6">
                <p className="text-[#6B7280] text-xs uppercase tracking-wider mb-2">Message</p>
                <p className="text-[#1B2A4A] text-sm bg-gray-50 rounded-xl p-3">{selectedLead.message}</p>
              </div>
            )}
            <div className="mb-6">
              <p className="text-[#6B7280] text-xs uppercase tracking-wider mb-2">Update Status</p>
              <select value={selectedLead.status || "new"} onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#C9A84C] bg-white">
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <a href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
              <MessageCircle size={18} />WhatsApp {selectedLead.name}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
