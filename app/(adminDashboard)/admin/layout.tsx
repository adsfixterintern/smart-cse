import React from "react"
import Link from "next/link"
import { 
  GraduationCap, LayoutDashboard, Users, UserCheck, 
  Megaphone, ShieldCheck, Settings, LogOut, BarChart3, 
  BriefcaseBusiness,
  BookOpen,
  Calendar,
  CheckSquare,
  FileSpreadsheet,
  MessageSquareText,
  ShieldAlert
} from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminMenu = [
   { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: UserCheck, label: "Pending Approvals", href: "/admin/approvals" },
  { icon: Users, label: "All Students", href: "/admin/students" },
  { icon: BriefcaseBusiness, label: "Faculty Members", href: "/admin/teachers" },
  { icon: BookOpen, label: "Course Catalog", href: "/admin/courses" },
  { icon: Calendar, label: "Class Routine", href: "/admin/schedules" },
  { icon: GraduationCap, label: "Exam Results", href: "/admin/results" },
  { icon: Megaphone, label: "Official Notices", href: "/admin/notices" },
  { icon: CheckSquare, label: "Attendance Logs", href: "/admin/attendance" },
  { icon: FileSpreadsheet, label: "Financials", href: "/admin/finance" },
  { icon: MessageSquareText, label: "Student Feedback", href: "/admin/student-feedback" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "General Settings", href: "/admin/settings" },
  { icon: ShieldAlert, label: "Security Logs", href: "/admin/security-logs" },
  ]

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-slate-300 hidden lg:flex flex-col shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">Smart<span className="text-primary">Admin</span></span>
        </div>
        
        <nav className="flex-1 p-4 mt-4 space-y-1">
          {adminMenu.map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-800 hover:text-white rounded-xl transition-all group">
              <item.icon className="h-5 w-5 group-hover:text-primary transition-colors" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">AD</div>
            <div>
              <p className="text-sm font-bold text-white">Main Admin</p>
              <p className="text-xs opacity-60">Super User</p>
            </div>
          </div>
          <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 w-full rounded-xl transition-all font-bold border border-red-500/20">
            <LogOut className="h-5 w-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Department Control Center</h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block leading-tight mr-2">
              <p className="text-xs text-slate-500">Current Session</p>
              <p className="text-sm font-bold">Spring 2026</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
               <Settings className="h-5 w-5" />
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8">
          {children}
        </section>
      </main>
    </div>
  )
}