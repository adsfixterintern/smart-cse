"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useUser } from "@/context/UserContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ClipboardCheck, TrendingUp, TrendingDown, AlertTriangle, 
  CheckCircle2, XCircle, Clock, Download, Loader2, BarChart3, Calendar 
} from "lucide-react"
import { motion } from "framer-motion"

export default function DynamicAttendancePage() {
  const { data: session } = useSession()
  const { user } = useUser()
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const fetchData = async () => {
    if (!session?.user || !user?._id) return;
    try {
      const token = (session as any)?.user?.accessToken;
      
      const attRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance?semester=${user.semester}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const attJson = attRes.ok ? await attRes.json() : []; 
      
      const courseRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${user.semester}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const courseJson = courseRes.ok ? await courseRes.json() : [];

      setAttendanceData(attJson);
      setCourses(courseJson);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAttendanceData([]); 
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [session, user]);

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  // --- লজিক: কোর্স অনুযায়ী ক্যালকুলেশন ---
  const studentId = user._id.toString();
  
  const courseAnalysis = courses.map(course => {
    const relevantRecords = attendanceData.filter(r => r.course === course.name || r.courseCode === course.courseCode);
    const attended = relevantRecords.filter(r => r.attendance[studentId] === "P" || r.attendance[studentId] === "L").length;
    const total = relevantRecords.length;
    const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

    return {
      ...course,
      present: attended,
      absent: total - attended,
      total,
      percentage,
      status: percentage >= 85 ? "excellent" : percentage >= 75 ? "good" : percentage >= 60 ? "warning" : "danger"
    };
  });

  const overallAvg = Math.round(courseAnalysis.reduce((sum, c) => sum + c.percentage, 0) / (courses.length || 1));
  const totalAttended = courseAnalysis.reduce((sum, c) => sum + c.present, 0);
  const totalMissed = courseAnalysis.reduce((sum, c) => sum + c.absent, 0);
  const atRiskCount = courseAnalysis.filter(c => c.percentage < 75).length;

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          ATTENDANCE <span className="text-blue-600 tracking-normal italic">REPORT</span>
        </h1>
        <Button variant="outline" className="rounded-xl font-bold italic uppercase border-2">
          <Download className="mr-2 h-4 w-4" /> Export PDF
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Overall Rate" value={`${overallAvg}%`} icon={ClipboardCheck} progress={overallAvg} color="text-blue-600" />
        <StatCard title="Total Present" value={totalAttended} icon={CheckCircle2} subText="+2 this week" color="text-emerald-500" />
        <StatCard title="Total Absent" value={totalMissed} icon={XCircle} subText="Across all courses" color="text-rose-500" />
        <StatCard title="At Risk" value={atRiskCount} icon={AlertTriangle} subText="Below 75%" color="text-amber-500" />
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="courses" className="rounded-lg font-bold italic uppercase px-6">Course Wise</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg font-bold italic uppercase px-6">History</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <Card className="border-none shadow-sm rounded-[2rem]">
            <CardHeader>
              <CardTitle className="italic font-black uppercase text-xl">Academic Breakdown</CardTitle>
              <CardDescription className="italic font-medium">Detailed attendance per subject for Semester {user?.semester}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {courseAnalysis.map((course, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="font-black italic uppercase text-sm">{course.name || course.course}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.courseCode || course.code}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-black italic ${course.percentage < 75 ? 'text-rose-500' : 'text-slate-900'}`}>
                        {course.percentage}%
                      </span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase italic">{course.present}/{course.total} Lectures</p>
                    </div>
                  </div>
                  <Progress value={course.percentage} className={`h-2 ${course.percentage < 75 ? '[&>div]:bg-rose-500' : '[&>div]:bg-slate-900'}`} />
                  <div className="flex gap-4">
                     <Badge variant="outline" className="rounded-lg font-bold text-[9px] border-emerald-200 text-emerald-600 bg-emerald-50">PRESENT: {course.present}</Badge>
                     <Badge variant="outline" className="rounded-lg font-bold text-[9px] border-rose-200 text-rose-600 bg-rose-50">ABSENT: {course.absent}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-none shadow-sm rounded-[2.5rem]">
             <CardContent className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 text-white italic uppercase text-[10px] tracking-widest">
                       <tr>
                         <th className="p-5 font-black">Date</th>
                         <th className="p-5 font-black">Course</th>
                         <th className="p-5 font-black">Instructor</th>
                         <th className="p-5 font-black">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendanceData.slice(0, 10).map((record, idx) => {
                        const status = record.attendance[studentId];
                        return (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-5 text-xs font-bold italic">{record.date}</td>
                            <td className="p-5 text-xs font-black uppercase italic">{record.course}</td>
                            <td className="p-5 text-xs font-medium text-slate-500 italic">{record.teacher}</td>
                            <td className="p-5">
                               <Badge className={`rounded-lg italic uppercase text-[9px] ${
                                 status === 'P' ? 'bg-emerald-500' : status === 'L' ? 'bg-amber-500' : 'bg-rose-500'
                               }`}>
                                 {status === 'P' ? 'Present' : status === 'L' ? 'Late' : 'Absent'}
                               </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, progress, subText, color }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">{title}</p>
            <p className="text-3xl font-black italic tracking-tighter">{value}</p>
          </div>
          <div className={`p-3 rounded-2xl bg-slate-50 ${color}`}>
            <Icon size={20} />
          </div>
        </div>
        {progress !== undefined ? (
          <Progress value={progress} className="h-1.5 mt-4" />
        ) : (
          <p className="text-[9px] font-bold text-slate-400 mt-4 italic uppercase">{subText}</p>
        )}
      </CardContent>
    </Card>
  )
}