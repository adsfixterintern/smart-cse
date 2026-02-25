"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Loader2, Calendar, BookOpen, Clock, MapPin, ExternalLink, UserCheck, GraduationCap } from "lucide-react";
import Link from "next/link";

interface Course {
  _id: string;
  name: string;
  code: string;
  teacherId: string;
  semester: string;
  credit: number;
}

interface Routine {
  _id: string;
  semester: string;
  courseName: string;
  teacherName: string;
  teacherId: string;
  startTime: string;
  day: string;
  room?: string;
}

export default function TeacherDashboardPage() {
  const { data: session, status } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  const [allTodaysRoutines, setAllTodaysRoutines] = useState<Routine[]>([]);
  const [myAssignedClasses, setMyAssignedClasses] = useState<Routine[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const token = (session?.user as any)?.accessToken;
  const email = session?.user?.email;

  const todayName = useMemo(() => 
    new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()), 
  []);

  useEffect(() => {
    if (status !== "authenticated" || !token || !email) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // ১. জেনারেল রুটিন (আজকের সব ক্লাস)
        const routineRes = await fetch(`${API_URL}/routines`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allRoutines: Routine[] = await routineRes.json();
        setAllTodaysRoutines(allRoutines.filter(r => r.day.toLowerCase() === todayName.toLowerCase()));

        // ২. টিচারের আজকের নির্দিষ্ট ক্লাস (আপনার নতুন এপিআই দিয়ে)
        const myAssignedRes = await fetch(`${API_URL}/my-assigned-classes?day=${todayName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (myAssignedRes.ok) {
          setMyAssignedClasses(await myAssignedRes.json());
        }

        // ৩. টিচারের প্রোফাইল থেকে teacherId নিয়ে তার সব কোর্সের লিস্ট আনা
        const userRes = await fetch(`${API_URL}/users/email/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const teacherProfile = await userRes.json();
        const tId = teacherProfile.teacherId;

        const courseRes = await fetch(`${API_URL}/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allCourses: Course[] = await courseRes.json();
        setMyCourses(allCourses.filter(c => c.teacherId === tId)); 

      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [status, token, email, API_URL, todayName]);

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-4 md:p-8">
      
      {/* --- WELCOME HEADER --- */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 text-white shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tighter md:text-5xl italic uppercase">
            Instructor <span className="text-blue-400">Portal</span>
          </h1>
          <p className="mt-2 text-slate-400 font-bold tracking-widest uppercase text-xs">
            {session?.user?.name} | Computer Science & Engineering
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm backdrop-blur-md border border-white/10 font-bold">
              <BookOpen className="h-5 w-5 text-blue-300" />
              <span>{myCourses.length} Assigned Courses</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm backdrop-blur-md border border-white/10 font-bold">
              <Calendar className="h-5 w-5 text-green-300" />
              <span>{myAssignedClasses.length} Your Classes Today</span>
            </div>
          </div>
        </div>
        <div className="absolute right-[-40px] top-[-40px] opacity-10 rotate-12">
          <GraduationCap size={300} />
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-12">
        
        {/* --- SECTION 1: MY CLASSES TODAY (LEFT) --- */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-xl font-black uppercase italic flex items-center gap-2 text-blue-600 tracking-tighter">
            <UserCheck size={24} /> My Schedule Today
          </h2>
          <div className="space-y-4">
            {myAssignedClasses.length > 0 ? (
              myAssignedClasses.map((cls) => (
                <Card key={cls._id} className="border-none shadow-xl rounded-[2rem] bg-blue-600 text-white transform transition hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                        <Clock size={14} />
                        <span className="text-xs font-black">{cls.startTime}</span>
                      </div>
                      <span className="font-bold text-[10px] uppercase tracking-widest bg-black/20 px-2 py-1 rounded">Sem {cls.semester}</span>
                    </div>
                    <h3 className="text-xl font-black leading-tight mb-6 uppercase italic">{cls.courseName}</h3>
                    <div className="flex justify-between items-center pt-4 border-t border-white/20">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase">
                        <MapPin size={14} className="text-blue-200" /> {cls.room || "Lab-01"}
                      </div>
                      <Link 
                        href={`/teacher/attendance?semester=${cls.semester}&course=${cls.courseName}`} 
                        className="bg-white text-blue-600 p-2.5 rounded-2xl hover:bg-blue-50 transition-colors shadow-lg"
                      >
                        <ExternalLink size={18}/>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-12 border-4 border-dashed rounded-[2.5rem] text-center text-slate-300 font-black uppercase italic text-xs tracking-[0.2em] bg-slate-50">
                No classes assigned today
              </div>
            )}
          </div>
        </div>

        {/* --- SECTION 2: GENERAL TODAY'S ROUTINE (RIGHT) --- */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xl font-black uppercase italic flex items-center gap-2 text-slate-800 tracking-tighter">
            <Clock size={24} /> Department Routine ({todayName})
          </h2>
          <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-slate-900">
                <TableRow className="hover:bg-slate-900">
                  <TableHead className="text-white font-black uppercase text-[10px] py-5 pl-6">Time</TableHead>
                  <TableHead className="text-white font-black uppercase text-[10px]">Course & Semester</TableHead>
                  <TableHead className="text-white font-black uppercase text-[10px]">Instructor</TableHead>
                  <TableHead className="text-white font-black uppercase text-[10px] text-center pr-6">Room</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTodaysRoutines.length > 0 ? (
                  allTodaysRoutines.map((r) => (
                    <TableRow key={r._id} className="hover:bg-blue-50/50 border-slate-50 transition-colors">
                      <TableCell className="font-black text-blue-600 pl-6">{r.startTime}</TableCell>
                      <TableCell>
                        <div className="font-bold text-slate-800 uppercase text-sm">{r.courseName}</div>
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Semester {r.semester}</div>
                      </TableCell>
                      <TableCell className="font-bold text-slate-600 text-xs">{r.teacherName}</TableCell>
                      <TableCell className="text-center pr-6">
                        <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-slate-200">
                          {r.room || "N/A"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-40 text-center font-bold text-slate-400 italic">No classes today.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* --- SECTION 3: MY ASSIGNED COURSES (BOTTOM FULL WIDTH) --- */}
        <div className="lg:col-span-12 space-y-6 pt-10">
          <h2 className="text-xl font-black uppercase italic flex items-center gap-2 text-slate-800 tracking-tighter">
            <BookOpen size={24} /> My Assigned Course Inventory
          </h2>
          <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-slate-50 border-b">
                <TableRow>
                  <TableHead className="font-black uppercase text-[10px] py-5 pl-8 text-slate-500">Course Detail</TableHead>
                  <TableHead className="font-black uppercase text-[10px] text-slate-500">Course Code</TableHead>
                  <TableHead className="font-black uppercase text-[10px] text-slate-500">Semester</TableHead>
                  <TableHead className="font-black uppercase text-[10px] text-center pr-8 text-slate-500">Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myCourses.length > 0 ? (
                  myCourses.map((course) => (
                    <TableRow key={course._id} className="hover:bg-slate-50/50 border-slate-50 transition-colors">
                      <TableCell className="py-5 pl-8">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <BookOpen size={20} />
                          </div>
                          <span className="font-black text-slate-800 uppercase italic tracking-tight">{course.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-black text-slate-600">
                          {course.code}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                          Batch {course.semester}
                        </span>
                      </TableCell>
                      <TableCell className="text-center pr-8 font-black text-blue-600">
                        {course.credit}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-slate-400 font-bold italic uppercase text-xs">No courses assigned to your profile yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

      </div>
    </div>
  );
}
