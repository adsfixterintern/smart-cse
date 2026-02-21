"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useUser } from "@/context/UserContext"
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Calendar, ClipboardCheck, BookOpen, TrendingUp, Clock, 
  Bell, FileText, Users, ArrowRight, CheckCircle2, 
  AlertCircle, Loader2, GraduationCap 
} from "lucide-react"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const { data: session } = useSession()
  const { user } = useUser()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(`http://localhost:5001/student/dashboard-overview?email=${session.user.email}`, {
          headers: {
            Authorization: `Bearer ${(session as any)?.user?.accessToken || ''}`
          }
        });
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [session]);

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const statConfig = [
    { title: "Attendance", value: data?.stats?.attendanceRate, icon: ClipboardCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "CGPA", value: data?.stats?.cgpa, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Courses", value: data?.stats?.enrolledCourses, icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Tasks", value: data?.stats?.pendingTasks, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-8 p-2 md:p-4">
      
      {/* --- Welcome Banner --- */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl"
      >
        <div className="relative z-10 md:max-w-xl">
          <h1 className="text-3xl font-black md:text-4xl tracking-tight">
            Welcome back, <span className="text-blue-400 capitalize">{user?.name?.split(' ')[0] || "Student"}!</span>
          </h1>
          <p className="mt-3 text-slate-400 font-medium">
            You're doing great! You have {data?.stats?.pendingTasks} assignments due this week. Stay focused and keep grinding.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6">
              <Link href="/dashboard/schedule">My Schedule</Link>
            </Button>
            <Button variant="outline" className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 rounded-xl">
              Browse Notes
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 hidden lg:block">
           <GraduationCap size={240} className="translate-x-10 translate-y-10" />
        </div>
      </motion.section>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statConfig.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={cn("rounded-2xl p-4", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-2xl font-black">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* --- Today's Schedule --- */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-muted/20 pb-4">
            <CardTitle className="text-lg font-bold">Today's Lectures</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary font-bold">View Full Week</Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {data?.todaySchedule?.length > 0 ? data.todaySchedule.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <div className="min-w-[80px] text-sm font-black text-primary">{item.time}</div>
                  <div className="h-8 w-[2px] bg-border" />
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{item.subject}</p>
                    <p className="text-xs text-muted-foreground">{item.room} • {item.instructor}</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">{item.type}</Badge>
                </div>
              )) : <div className="text-center py-10 text-muted-foreground">No classes for today! Enjoy your free time.</div>}
            </div>
          </CardContent>
        </Card>

        {/* --- Notifications --- */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {data?.recentNotifications?.map((notif: any, i: number) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold leading-none">{notif.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{notif.description}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{notif.time || "Recently"}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* --- Course Progress Grid --- */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Course Tracking</h2>
          <Badge variant="outline" className="px-3 py-1">Semester 5</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.courseProgress?.map((course: any, i: number) => (
            <Card key={i} className="border-none shadow-sm group">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold group-hover:text-primary transition-colors">{course.name}</h4>
                    <p className="text-xs text-muted-foreground">{course.code}</p>
                  </div>
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="text-[10px] font-bold bg-primary/5">DR</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex justify-between mb-2 text-xs font-bold">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-primary">{course.progress || 0}%</span>
                </div>
                <Progress value={course.progress || 0} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}

// Utility function for conditional classes
function cn(...inputs: any) {
  return inputs.filter(Boolean).join(" ");
}