"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useUser } from "@/context/UserContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Calendar,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import toast from "react-hot-toast";

export default function DynamicAttendancePage() {
  const { data: session } = useSession();
  const { user } = useUser();
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchUserAttendance = async () => {
      // সেশন এবং ইউজার আইডি নিশ্চিত করা
      if (!session?.user || !user?._id) return;

      try {
        const token = (session as any)?.user?.accessToken;
        const headers = { Authorization: `Bearer ${token}` };
        
        // আপনার ব্যাকএন্ডের স্পেসিফিক এন্ডপয়েন্ট কল করা হচ্ছে
        const res = await fetch(`${apiUrl}/attendance/user/${user._id}`, { headers });
        
        if (!res.ok) throw new Error("Failed to fetch data");
        
        const data = await res.json();

        // এপিআই থেকে আসা formattedData সরাসরি সেট করা হচ্ছে
        if (Array.isArray(data)) {
          setAttendanceHistory(data);
        }
      } catch (error) {
        console.error("Error fetching user attendance:", error);
        toast.error("Could not load attendance records");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAttendance();
  }, [session, user?._id, apiUrl]);

  // --- ডাটা এনালাইসিস লজিক ---
  const { courseAnalysis, stats } = useMemo(() => {
    const analysisMap: Record<string, any> = {};
    let totalPresent = 0;
    let totalAbsent = 0;

    // হিস্ট্রি থেকে কোর্স ওয়াইজ ডাটা আলাদা করা
    attendanceHistory.forEach((record) => {
      const courseName = record.course;
      if (!analysisMap[courseName]) {
        analysisMap[courseName] = { 
          name: courseName, 
          present: 0, 
          total: 0,
          semester: record.semester 
        };
      }

      analysisMap[courseName].total += 1;
      // P = Present, L = Late (Late কেও সাধারণত প্রেজেন্ট ধরা হয়)
      if (record.status === "P" || record.status === "L") {
        analysisMap[courseName].present += 1;
        totalPresent += 1;
      } else {
        totalAbsent += 1;
      }
    });

    const analysisArray = Object.values(analysisMap).map((c: any) => ({
      ...c,
      percentage: c.total > 0 ? Math.round((c.present / c.total) * 100) : 0,
      absent: c.total - c.present
    }));

    const avg = analysisArray.length > 0
      ? Math.round(analysisArray.reduce((sum, c) => sum + c.percentage, 0) / analysisArray.length)
      : 0;

    // ৭৫% এর নিচে থাকা কোর্সগুলো খুঁজে বের করা
    const riskCount = analysisArray.filter(c => c.percentage < 75).length;

    return {
      courseAnalysis: analysisArray,
      stats: { avg, present: totalPresent, absent: totalAbsent, risk: riskCount }
    };
  }, [attendanceHistory]);

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* --- HEADER SECTION --- */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <Badge className="bg-blue-600 mb-4 uppercase font-black italic">Student Report</Badge>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
              Attendance <span className="text-blue-500">Sync</span>
            </h1>
            <p className="text-slate-400 font-bold italic text-[10px] uppercase tracking-[0.3em] mt-2">
              Semester {user?.semester} • Academic Session 2026
            </p>
          </div>
          <div className="flex items-center gap-4 relative z-10">
             <div className="text-right hidden md:block">
                <p className="text-[10px] font-black uppercase text-slate-500 italic">Last Updated</p>
                <p className="text-sm font-bold italic">{new Date().toLocaleDateString()}</p>
             </div>
          </div>
          <div className="absolute right-[-5%] top-[-20%] w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />
        </div>
      </FadeIn>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Avg. Presence" value={`${stats.avg}%`} icon={ClipboardCheck} progress={stats.avg} color="text-blue-600" />
        <StatCard title="Days Present" value={stats.present} icon={CheckCircle2} subText="Classes Attended" color="text-emerald-500" />
        <StatCard title="Days Absent" value={stats.absent} icon={XCircle} subText="Unexcused Absences" color="text-rose-500" />
        <StatCard title="Critical Risk" value={stats.risk} icon={AlertTriangle} subText="Below 75% Threshold" color="text-amber-500" />
      </div>

      <Tabs defaultValue="courses" className="space-y-8">
        <TabsList className="bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto inline-flex shadow-inner">
          <TabsTrigger value="courses" className="rounded-xl font-black italic uppercase px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all text-xs">
            Course Statistics
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl font-black italic uppercase px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all text-xs">
            Logs & History
          </TabsTrigger>
        </TabsList>

        {/* --- COURSE WISE PROGRESS --- */}
        <TabsContent value="courses">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courseAnalysis.length > 0 ? (
              courseAnalysis.map((course, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <Card className="border-none shadow-xl rounded-[2rem] bg-white hover:shadow-blue-500/5 transition-all overflow-hidden border-b-4 border-slate-50">
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                          <BookOpen size={24} />
                        </div>
                        <div className={`px-4 py-1.5 rounded-xl font-black italic text-sm ${course.percentage < 75 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
                          {course.percentage}%
                        </div>
                      </div>
                      <h4 className="font-black italic uppercase text-lg text-slate-800 leading-tight mb-2 min-h-[3rem]">{course.name}</h4>
                      <div className="space-y-4">
                        <Progress value={course.percentage} className={`h-2.5 rounded-full ${course.percentage < 75 ? "[&>div]:bg-rose-500" : "[&>div]:bg-blue-600"}`} />
                        <div className="flex justify-between items-center text-[10px] font-black uppercase italic tracking-widest text-slate-400">
                          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Present: {course.present}</span>
                          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-200" /> Total: {course.total}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
                <p className="font-black italic uppercase text-slate-300 tracking-widest">No Active Records Found</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* --- ATTENDANCE LOG TABLE --- */}
        <TabsContent value="history">
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 text-white italic uppercase text-[10px] tracking-[0.2em] sticky top-0 z-20">
                  <tr>
                    <th className="p-6 font-black">Date</th>
                    <th className="p-6 font-black">Subject Details</th>
                    <th className="p-6 text-center font-black">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {attendanceHistory.length > 0 ? (
                    attendanceHistory.map((record, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30 transition-all">
                        <td className="p-6">
                           <div className="flex items-center gap-3">
                              <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                                <Calendar size={14} />
                              </div>
                              <span className="text-xs font-black italic text-slate-600">{record.date}</span>
                           </div>
                        </td>
                        <td className="p-6">
                          <div className="font-black uppercase italic text-sm text-slate-800 tracking-tight">{record.course}</div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Core Lecture</div>
                        </td>
                        <td className="p-6 text-center">
                          <Badge className={`rounded-xl italic uppercase text-[9px] font-black px-4 py-1.5 border-none shadow-sm ${
                            record.status === "P" ? "bg-emerald-500 text-white" : 
                            record.status === "L" ? "bg-amber-500 text-white" : 
                            "bg-rose-500 text-white"
                          }`}>
                            {record.status === "P" ? "Present" : record.status === "L" ? "Late" : "Absent"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-20 text-center font-black italic text-slate-300 uppercase tracking-widest">
                        No history available for this semester
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-center text-slate-300 font-black italic uppercase text-[8px] tracking-[0.5em] pt-10">
        Attendance Management System • Verified Data • BSEC
      </p>
    </div>
  );
}

// --- হেল্পার কম্পোনেন্ট: স্ট্যাট কার্ড ---
function StatCard({ title, value, icon: Icon, progress, subText, color }: any) {
  return (
    <Card className="border-none shadow-xl rounded-[2rem] bg-white group hover:-translate-y-1 transition-transform duration-300">
      <CardContent className="p-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2 group-hover:text-blue-600 transition-colors">{title}</p>
            <p className="text-4xl font-black italic tracking-tighter text-slate-900">{value}</p>
          </div>
          <div className={`p-4 rounded-[1.5rem] bg-slate-50 ${color} group-hover:bg-slate-900 group-hover:text-white transition-all`}>
            <Icon size={24} />
          </div>
        </div>
        {progress !== undefined ? (
          <div className="mt-6 space-y-2">
            <Progress value={progress} className="h-1.5 rounded-full" />
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-6">
            <ArrowUpRight size={12} className="text-slate-300" />
            <p className="text-[9px] font-bold text-slate-400 italic uppercase tracking-widest">{subText}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}