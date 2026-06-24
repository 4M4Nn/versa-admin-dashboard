"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Shield, Database, Settings } from "lucide-react"

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Settings</h1>
        <p className="text-[#6B7280] text-sm mt-1">Manage dashboard preferences</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        {[
          { icon: Bell, title: "Notifications", desc: "Email alerts for new leads" },
          { icon: Shield, title: "Security", desc: "Password and access control" },
          { icon: Database, title: "Data Export", desc: "CSV and report generation" },
          { icon: Settings, title: "Preferences", desc: "Dashboard display settings" },
        ].map(({ icon: Icon, title, desc }) => (
          <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
              <Icon size={20} className="text-[#C9A84C]" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-[#1B2A4A]">{title}</p>
              <p className="text-[#6B7280] text-sm">{desc}</p>
            </div>
            <div className="w-10 h-6 rounded-full bg-[#C9A84C] flex items-center cursor-pointer">
              <div className="w-4 h-4 rounded-full bg-white shadow translate-x-5 mx-0.5 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-8">
        <button onClick={handleSave} className="px-8 py-3 bg-[#1B2A4A] text-white rounded-xl font-medium hover:bg-[#2D4A7A] transition-colors">
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  )
}
