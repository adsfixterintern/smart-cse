// components/teacher/sidebar.tsx
"use client"
import logo from "@/public/cse.avif"
import Image from "next/image"
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
  BarChart3,
  MessageSquareText,
  Settings,
  LogOut,
  Bell,
  BookOpen,
  Loader2,
  Users,
  User
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@/context/UserContext"

const teacherNavItems = [
  { href: "/teacher", label: "Overview", icon: LayoutDashboard },
  { href: "/teacher/notices", label: "Notices", icon: Bell },
  { href: "/teacher/routines", label: "Class Routine", icon: Calendar },
  { href: "/teacher/students-overview", label: "Students", icon: Users },
  { href: "/teacher/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/teacher/results", label: "Results", icon: BarChart3 },
  { href: "/teacher/student-feedback", label: "Student Feedback", icon: MessageSquareText },
]

export function TeacherSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 bg-[#0f172a] text-slate-300 border-r border-slate-800 lg:flex flex-col">
      
      {/* LOGO */}
      <Link href="/">
        <div className="p-8 border-b border-slate-800 flex items-center gap-3">
          <div className=" p-2 rounded-xl">
             <Image src={logo} alt="SmartCSE Logo" width={34} height={34} className="object-contain" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">
            Smart<span className="text-blue-500">Teacher</span>
          </span>
        </div>
      </Link>

      {/* MENU */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="mb-4 px-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Teacher Panel
        </div>
        <nav className="space-y-1">
          {teacherNavItems.map((item) => {
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
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-white" : "group-hover:text-blue-500"
                  )}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* PROFILE + LOGOUT */}
      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 overflow-hidden">
            {user?.profileImage ? (
              <img src={user.profileImage} className="h-full w-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-slate-400" />
            )}
          </div>
          <div className="leading-tight overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>



        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-3 flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 border border-red-500/20 hover:bg-red-500/10"
        >
          {isLoggingOut ? <Loader2 className="animate-spin" /> : <LogOut />}
          {isLoggingOut ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </aside>
  )
}