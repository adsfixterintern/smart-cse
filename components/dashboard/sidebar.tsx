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
  User,
  Menu, 
  X,    
  Home  
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@/context/UserContext"
import logo from "@/public/cse.avif"
import Image from "next/image"

const mainNavItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/notices", label: "Official Notices", icon: Bell },
  { href: "/dashboard/schedule", label: "Class Routine", icon: Calendar },
  { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/dashboard/grades", label: "Exam Results", icon: BarChart3 },
  { href: "/dashboard/feedback", label: "Student Feedback", icon: MessageSquareText },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isOpen, setIsOpen] = useState(false) // মোবাইল মেনু স্টেট
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({ redirect: false, callbackUrl: "/login" });
    router.push("/login");
  };

  // নেভিগেশন কম্পোনেন্ট (Desktop & Mobile দুজনেই ব্যবহার করবে)
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-300">
      {/* LOGO */}
      <div className="p-8 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <div className="bg-white p-1 ">
            <Image src={logo} alt="SmartCSE Logo" width={34} height={34} className="object-contain" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">
            Smart<span className="text-blue-500">Student</span>
          </span>
        </Link>
        <button className="lg:hidden" onClick={() => setIsOpen(false)}>
          <X className="h-6 w-6 text-slate-400" />
        </button>
      </div>

      {/* MENU */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="mb-4 px-4 text-xs font-semibold uppercase tracking-widest text-slate-500 flex justify-between items-center">
          Academic Menu
          <Link href="/" className="lg:hidden text-blue-500 hover:underline">Home</Link>
        </div>
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)} // মোবাইল মেনু বন্ধ হবে
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group font-medium",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-white" : "group-hover:text-blue-500"
                )} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* FOOTER: PROFILE + SETTINGS */}
      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 overflow-hidden shrink-0">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-slate-400" />
            )}
          </div>
          <div className="leading-tight overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.name || "Loading..."}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || "Fetching..."}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link 
            href="/dashboard/settings" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white group"
          >
            <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform" /> 
            Settings
          </Link>
          
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 w-full rounded-xl transition-all font-bold border border-red-500/20 disabled:opacity-50"
          >
            {isLoggingOut ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />} 
            {isLoggingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. MOBILE HEADER (Top Bar for small devices) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0f172a] border-b border-slate-800 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
            <button onClick={() => setIsOpen(true)} className="p-2 text-slate-300">
                <Menu className="h-6 w-6" />
            </button>
            <span className="font-black text-white italic">SMART STUDENT</span>
        </div>
        <Link href="/" className="p-2 text-slate-300 bg-slate-800 rounded-lg">
            <Home className="h-5 w-5" />
        </Link>
      </header>

      {/* 2. MOBILE OVERLAY & DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay background */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          {/* Sidebar Drawer */}
          <div className="fixed left-0 top-0 bottom-0 w-80 shadow-2xl transition-transform">
             <SidebarContent />
          </div>
        </div>
      )}

      {/* 3. DESKTOP SIDEBAR (Static) */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 lg:flex flex-col border-r border-slate-800">
        <SidebarContent />
      </aside>
      
      {/* মোবাইল স্পেসার (যাতে কন্টেন্ট মেনুর নিচে না ঢাকা পড়ে) */}
      <div className="h-16 lg:hidden" />
    </>
  )
}