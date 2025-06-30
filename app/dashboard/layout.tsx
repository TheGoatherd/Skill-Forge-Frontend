"use client"

import Link from "next/link"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getAuthToken, getUserEmail, removeAuthToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Monitor, Users, Target, Shield, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const userEmail = getUserEmail()
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "U"

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/auth/login")
    }
  }, [router])

  const handleLogout = () => {
    removeAuthToken()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/auth/login")
  }

  const navItems = [
    { id: "overview", icon: Monitor, label: "Dashboard", href: "/dashboard" },
    { id: "career-finder", icon: Users, label: "Career Finder", href: "/dashboard/career-finder" },
    { id: "roadmap", icon: Target, label: "Roadmap", href: "/dashboard/roadmap" },
    { id: "resources", icon: Shield, label: "Resources", href: "/dashboard/resources" },
    { id: "resume-upgrade", icon: Settings, label: "Resume Upgrade", href: "/dashboard/resume-upgrade" },
  ]

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between h-16 border-b border-border">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-white font-heading tracking-wide">Skill Forge</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full flex items-center justify-start gap-3 p-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start gap-3 p-3 rounded-lg text-destructive hover:text-destructive/90 hover:bg-secondary transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="text-lg font-semibold text-foreground">
            {navItems.find((item) => item.href === pathname)?.label || "Dashboard"}
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="bg-primary text-primary-foreground">
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-background">{children}</main>
      </div>
    </div>
  )
}
