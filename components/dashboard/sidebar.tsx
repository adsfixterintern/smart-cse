"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
  GraduationCap,
  LayoutDashboard,
  Calendar,
  ClipboardCheck,
  FolderOpen,
  BarChart3,
  MessageSquareText,
  Settings,
  LogOut,
  Bell,
  BookOpen,
  Loader2,
  User // Fallback icon এর জন্য
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@/context/UserContext" // Context ইমপোর্ট

const mainNavItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/notices", label: "Official Notices", icon: Bell },
  { href: "/dashboard/schedule", label: "Class Routine", icon: Calendar },
  { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/dashboard/grades", label: "Exam Results", icon: BarChart3 },
  { href: "/dashboard/resources", label: "Resources", icon: FolderOpen },
  { href: "/dashboard/feedback", label: "Teacher Feedback", icon: MessageSquareText },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useUser() // Context থেকে ডাটা নিচ্ছি
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({
      redirect: false,
      callbackUrl: "/login"
    });
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 bg-[#0f172a] text-slate-300 border-r border-slate-800 lg:flex flex-col">
      
      {/* LOGO SECTION */}
      <div className="p-8 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-black text-white tracking-tighter">
          Smart<span className="text-blue-500">Student</span>
        </span>
      </div>

      {/* MENU SECTION */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="mb-4 px-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Academic Menu
        </div>
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group font-medium",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-white" : "group-hover:text-blue-500"
                )} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* STUDENT PROFILE + SIGN OUT */}
      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-6 px-2">
          {/* প্রোফাইল ইমেজ সেকশন */}
          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border-2 border-slate-700 overflow-hidden shrink-0">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="h-full w-full object-cover" 
              />
            ) : (
              <User className="h-5 w-5 text-slate-400" />
            )}
          </div>

          <div className="leading-tight overflow-hidden">
            <p className="text-sm font-bold text-white truncate">
              {user?.name || "Loading..."}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email || "Fetching..."}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
            <Link 
              href="/dashboard/settings" 
              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors group"
            >
                <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" /> 
                Settings
            </Link>
            
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 w-full rounded-xl transition-all font-bold border border-red-500/20 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoggingOut ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LogOut className="h-5 w-5" />
                )} 
                {isLoggingOut ? "Signing Out..." : "Sign Out"}
            </button>
        </div>
      </div>
    </aside>
  )
}