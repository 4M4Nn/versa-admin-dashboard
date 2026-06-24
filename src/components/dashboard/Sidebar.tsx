"use client"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { LayoutDashboard, Users, BarChart3, Globe, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Leads", href: "/dashboard/leads" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Globe, label: "Websites", href: "/dashboard/websites" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("versa_admin_auth")
    router.push("/login")
  }

  return (
    <div className={`flex flex-col bg-[#1B2A4A] border-r border-white/10 transition-all duration-300 ${collapsed ? "w-16" : "w-64"} min-h-screen flex-shrink-0`}>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center">
              <span className="text-[#1B2A4A] font-bold text-sm">V</span>
            </div>
            <span className="text-white font-bold text-sm">VERSA ADMIN</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-blue-300 hover:text-white transition-colors ml-auto">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <nav className="flex-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <button key={item.label} onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all duration-200 ${isActive ? "bg-[#C9A84C] text-[#1B2A4A]" : "text-blue-200 hover:bg-white/10 hover:text-white"}`}>
              <item.icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-blue-200 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200">
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  )
}
