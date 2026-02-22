"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useUser } from "@/context/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ClipboardCheck, BookOpen, TrendingUp, Clock, 
  Loader2, GraduationCap, Bell, ChevronRight 
} from "lucide-react"
import { motion } from "framer-motion"

export default function StudentDashboard() {
  const { data: session } = useSession()
  const { user } = useUser()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user) return;
      try {
        const token = (session as any)?.user?.accessToken;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student/dashboard-overview`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        setData(result);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchStats();
  }, [session]);

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="p-4 md:p-10 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* --- HERO BANNER --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 text-white shadow-2xl border border-slate-800"
      >
        <div className="relative z-10">
          <Badge className="bg-blue-500/20 text-blue-400 border-none mb-4 italic font-black">ACTIVE SESSION: 2026</Badge>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
            WELCOME, <span className="text-blue-500">{user?.name?.split(' ')[0]}!</span>
          </h1>
          <p className="mt-4 text-slate-400 font-bold italic uppercase text-xs tracking-widest max-w-md">
            BATCH {user?.batch || "11"} • SEMESTER {user?.semester || "4"} • YOU HAVE {data?.stats?.pendingTasks} UPDATES TODAY.
          </p>
        </div>
        <GraduationCap className="absolute -right-10 -bottom-10 h-72 w-72 text-white/5 -rotate-12 pointer-events-none" />
      </motion.div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "ATTENDANCE", val: `${data?.stats?.attendanceRate}%`, icon: ClipboardCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "TOTAL CGPA", val: data?.stats?.cgpa, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "COURSES", val: data?.stats?.enrolledCourses, icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "TASKS", val: data?.stats?.pendingTasks, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
        ].map((s, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="border-none shadow-sm rounded-3xl group transition-all hover:bg-slate-50">
              <CardContent className="p-6 flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${s.bg} ${s.color} transition-transform group-hover:rotate-12`}>
                  <s.icon size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-[0.2em]">{s.label}</p>
                  <p className="text-2xl font-black italic tracking-tighter">{s.val}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* --- SCHEDULE SECTION --- */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-dashed px-8 py-6">
            <CardTitle className="text-xl font-black italic uppercase tracking-tight">TODAY'S LECTURES</CardTitle>
            <Button variant="ghost" className="text-[10px] font-black italic uppercase hover:text-blue-600">VIEW ALL</Button>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            {data?.todaySchedule?.length > 0 ? data.todaySchedule.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-6 p-5 rounded-[2rem] bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
                <div className="text-xs font-black text-blue-600 italic bg-white px-3 py-2 rounded-xl shadow-sm tracking-tighter">
                  {item.time}
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm uppercase italic tracking-tight text-slate-800">{item.subject}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">RM: {item.room} • {item.instructor}</p>
                </div>
                <Badge className="bg-slate-900 text-white italic text-[9px] px-3 py-1 rounded-lg uppercase">{item.type}</Badge>
              </div>
            )) : (
              <div className="text-center py-10 italic font-bold text-slate-300 uppercase text-xs">NO CLASSES SCHEDULED FOR TODAY</div>
            )}
          </CardContent>
        </Card>

        {/* --- NOTIFICATIONS --- */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white">
          <CardHeader className="px-8 pt-8">
            <CardTitle className="text-lg font-black italic uppercase tracking-widest flex items-center gap-2">
              <Bell size={18} className="text-blue-400" /> UPDATES
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {data?.recentNotifications?.map((n: any, i: number) => (
              <div key={i} className="group cursor-pointer">
                <p className="text-xs font-black italic uppercase tracking-tight group-hover:text-blue-400 transition-colors">{n.title}</p>
                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed italic line-clamp-2">{n.description}</p>
                <div className="h-px w-8 bg-blue-500 mt-3 transition-all group-hover:w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}