"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem("versa_admin_auth") === "true"
    if (!isAuth) { router.push("/login"); return }
    setAuth(true)
    setLoading(false)
  }, [router])

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#C9A84C] rounded-full animate-spin border-t-transparent" />
    </div>
  )

  if (!auth) return null
  return <>{children}</>
}
