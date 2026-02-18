"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, UserPlus, FileText, Activity, Check, X, 
  GraduationCap, ArrowUpRight, Clock, ShieldAlert 
} from "lucide-react"
import { Button } from "@/components/ui/button"

// TypeScript Interface for Users
interface PendingUser {
  id: string;
  name: string;
  role: 'Student' | 'Teacher';
  email: string;
  deptId: string; // studentId or teacherId
}

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false)

  // Hydration fix for Next.js
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const adminStats = [
    { label: "Total Students", value: "1,240", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Teachers", value: "48", icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "New Registrations", value: "12", icon: UserPlus, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Active Notices", value: "5", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
  ]

  const pendingUsers: PendingUser[] = [
    { name: "Rakibul Hasan", role: "Student", deptId: "22CSE-012", email: "rakib@example.com", id: "1" },
    { name: "Dr. Selim Reza", role: "Teacher", deptId: "T-889", email: "selim@example.com", id: "2" },
    { name: "Mehedi Hasan", role: "Student", deptId: "22CSE-045", email: "mehedi@example.com", id: "3" },
  ]

  if (!isMounted) return null

  return (
    <div className="space-y-8 p-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Control Center</h1>
          <p className="text-slate-500 font-medium">Manage department users, approvals, and official notices.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/notices">
            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <FileText className="mr-2 h-4 w-4" /> Post Notice
            </Button>
          </Link>
          <Button variant="outline" className="border-slate-200">
             <Activity className="mr-2 h-4 w-4" /> View Logs
          </Button>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-all border border-slate-100 group">
            <CardContent className="p-6 flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Approvals Section */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="border-b bg-slate-50/50 p-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-500" /> Pending Approvals
              </CardTitle>
              <p className="text-xs text-slate-500 mt-1">Review and verify new account requests.</p>
            </div>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="text-primary font-bold">
                Manage All <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b">
                  <tr>
                    <th className="px-6 py-4">User Info</th>
                    <th className="px-6 py-4">Identity</th>
                    <th className="px-6 py-4">Dept. ID</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingUsers.map((user) => (
                    <tr key={user.deptId} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 group-hover:text-primary transition-colors">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter uppercase ${
                          user.role === 'Student' 
                          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                          : 'bg-purple-100 text-purple-700 border border-purple-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-600">{user.deptId}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Button size="icon" variant="outline" className="h-8 w-8 text-emerald-600 hover:bg-emerald-600 hover:text-white border-emerald-200">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:bg-red-600 hover:text-white border-red-200">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* System Activity & Notifications */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                {[
                  { text: "Notice 'Final Results' published", time: "2 mins ago", type: "notice" },
                  { text: "5 students approved for 21st Batch", time: "1 hour ago", type: "approval" },
                  { text: "System backup completed", time: "4 hours ago", type: "system" },
                  { text: "New Teacher registration: Dr. Selim", time: "Yesterday", type: "user" },
                ].map((activity, i) => (
                  <div key={i} className="flex gap-4 items-start relative pl-6">
                    <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-white shadow-sm flex-shrink-0 z-10" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 leading-tight">{activity.text}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tight">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-xs font-bold text-slate-400 hover:text-primary">
                Clear All Logs
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card className="border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
             <div className="absolute right-[-20px] top-[-20px] opacity-10">
                <GraduationCap size={120} />
             </div>
             <CardContent className="p-6 relative z-10">
                <h4 className="font-bold opacity-80 text-sm">System Health</h4>
                <div className="flex items-end gap-2 mt-2">
                   <span className="text-4xl font-black italic">98%</span>
                   <span className="text-xs font-bold mb-1 opacity-80 uppercase tracking-widest">Stable</span>
                </div>
                <p className="text-[10px] mt-4 opacity-70 font-medium leading-relaxed italic">
                   All department modules are running smoothly without any reported errors.
                </p>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}