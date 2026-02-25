"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useUser } from "@/context/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Clock,
  CalendarDays,
  MapPin,
  User,
  AlertCircle,
  Eye,
  Layers
} from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import toast from "react-hot-toast";

export default function DynamicSchedulePage() {
  const { data: session } = useSession();
  const { user } = useUser();

  const [allRoutines, setAllRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"single" | "all">("single");

  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>(
    new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date())
  );

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  useEffect(() => {
    if (user?.semester) setSelectedSemester(String(user.semester));
  }, [user]);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const token = (session as any)?.user?.accessToken;
        const res = await fetch(`${apiUrl}/routines`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAllRoutines(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Failed to load routine database");
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchRoutines();
  }, [session, apiUrl]);

  const filteredSchedule = useMemo(() => {
    return allRoutines
      .filter((item) => {
        const dayMatch = item.day?.toLowerCase() === selectedDay.toLowerCase();
        const semMatch = viewMode === "all" ? true : String(item.semester) === selectedSemester;
        return dayMatch && semMatch;
      })
      .sort((a, b) => {
        if (a.semester !== b.semester) return a.semester - b.semester;
        return a.startTime.localeCompare(b.startTime);
      });
  }, [allRoutines, selectedSemester, selectedDay, viewMode]);

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* --- HEADER --- */}
      <FadeIn>
        <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className="bg-blue-600 px-4 py-1 rounded-full font-black italic uppercase text-[10px]">Academic Sync</Badge>
                <div className="flex items-center gap-4">
                  <button onClick={() => setViewMode("single")} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${viewMode === 'single' ? 'text-blue-400' : 'text-slate-500 hover:text-white'}`}>
                    <Eye size={14} /> Single
                  </button>
                  <button onClick={() => setViewMode("all")} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${viewMode === 'all' ? 'text-blue-400' : 'text-slate-500 hover:text-white'}`}>
                    <Layers size={14} /> All Semester
                  </button>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-8">
                Master <span className="text-blue-500">Board</span>
              </h1>
              
              <div className="flex flex-wrap gap-5">
                {viewMode === "single" && (
                  <select 
                    value={selectedSemester} 
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="bg-slate-800 border-none rounded-2xl px-6 py-4 font-black italic uppercase text-xs outline-none ring-2 ring-white/5 focus:ring-blue-500 transition-all min-w-[150px]"
                  >
                    {[...Array(8)].map((_, i) => <option key={i} value={i + 1}>SEM {i + 1}</option>)}
                  </select>
                )}
                <select 
                  value={selectedDay} 
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="bg-slate-800 border-none rounded-2xl px-6 py-4 font-black italic uppercase text-xs outline-none ring-2 ring-white/5 focus:ring-blue-500 transition-all min-w-[180px]"
                >
                  {["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* --- SCROLLABLE TABLE CARD --- */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="italic font-black uppercase text-2xl text-slate-800 tracking-tighter">{selectedDay}</CardTitle>
              <CardDescription className="italic font-bold text-blue-500 uppercase text-[10px] mt-1">
                {viewMode === "all" ? "Combined Departmental Routine" : `Semester ${selectedSemester} Schedule`}
              </CardDescription>
            </div>
            <Badge className="bg-slate-900 text-white px-4 py-2 rounded-xl font-black italic uppercase text-[10px]">
              {filteredSchedule.length} Classes
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* এই ডিভটি টেবিল বডিতে স্ক্রলবার তৈরি করবে */}
          <div className="max-h-[500px] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <Table className="min-w-[800px] relative">
              <TableHeader className="bg-slate-900 sticky top-0 z-10">
                <TableRow className="hover:bg-slate-900 border-none">
                  {viewMode === "all" && <TableHead className="py-6 px-8 text-white font-black uppercase text-[11px] italic">Sem</TableHead>}
                  <TableHead className="py-6 px-8 text-white font-black uppercase text-[11px] italic">Time Slot</TableHead>
                  <TableHead className="py-6 px-8 text-white font-black uppercase text-[11px] italic">Course Name</TableHead>
                  <TableHead className="py-6 px-8 text-white font-black uppercase text-[11px] italic text-center">Room</TableHead>
                  <TableHead className="py-6 px-8 text-white font-black uppercase text-[11px] italic text-right">Instructor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedule.length > 0 ? (
                  filteredSchedule.map((cls, idx) => (
                    <TableRow key={idx} className="hover:bg-blue-50/30 transition-colors border-slate-50">
                      {viewMode === "all" && (
                        <TableCell className="py-6 px-8">
                          <Badge className="bg-slate-100 text-slate-600 border-none font-black italic text-[10px]">S{cls.semester}</Badge>
                        </TableCell>
                      )}
                      <TableCell className="py-6 px-8">
                        <div className="flex items-center gap-2 font-black text-slate-700 text-sm italic whitespace-nowrap tracking-tighter">
                          <Clock size={14} className="text-blue-500" /> {cls.startTime} - {cls.endTime || "TBA"}
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-8">
                        <div className="font-black text-slate-900 uppercase italic text-xs tracking-tight">{cls.courseName}</div>
                      </TableCell>
                      <TableCell className="py-6 px-8 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg font-black text-blue-600 text-[10px] uppercase border border-blue-100">
                          <MapPin size={12} /> {cls.room || "Room-0"}
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-8 text-right font-black text-blue-600 uppercase italic text-[11px] tracking-tighter">
                        {cls.teacherName || "TBA"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={viewMode === "all" ? 5 : 4} className="py-32 text-center">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="w-12 h-12 text-slate-100 mb-4" />
                        <h3 className="text-lg font-black italic uppercase text-slate-300">No Classes Found</h3>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-center text-slate-300 font-black italic uppercase text-[8px] tracking-[0.4em] pt-4">
        Dynamic Scheduling Engine • BSEC Barishal
      </p>
    </div>
  );
}