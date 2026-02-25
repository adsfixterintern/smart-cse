"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Loader2, Calendar, BookOpen, Clock, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";

// --- Interfaces based on your Database ---
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
  courseCode?: string;
  teacherName: string;
  teacherId: string;
  startTime: string;
  day: string;
  room?: string; // Optional field if you add room numbers
}

export default function TeacherDashboardPage() {
  const { data: session, status } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [myRoutines, setMyRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  const email = session?.user?.email;
  const token = (session?.user as any)?.accessToken;

  const todayName = useMemo(() => 
    new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()), 
  []);

  useEffect(() => {
    if (status !== "authenticated" || !email || !token) return;

    const fetchTeacherDashboardData = async () => {
      try {
        setLoading(true);

        // ১. প্রথমে ইমেইল দিয়ে টিচারের প্রোফাইল থেকে teacherId সংগ্রহ
        const userRes = await fetch(`${API_URL}/users/email/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const teacherProfile = await userRes.json();
        const tId = teacherProfile.teacherId;

        // ২. কোর্স এবং রুটিন ডাটা ফেচ করা
        const [courseRes, routineRes] = await Promise.all([
          fetch(`${API_URL}/courses`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/routines`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const allCourses: Course[] = await courseRes.json();
        const allRoutines: Routine[] = await routineRes.json();

        // ৩. teacherId অনুযায়ী ডাটা ফিল্টার করা
        const filteredCourses = allCourses.filter(c => c.teacherId === tId);
        const filteredRoutines = allRoutines.filter(r => r.teacherId === tId);

        setMyCourses(filteredCourses);
        setMyRoutines(filteredRoutines);

      } catch (error) {
        console.error("Dashboard data fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherDashboardData();
  }, [status, email, token, API_URL]);


  const todaysClasses = useMemo(() => 
    myRoutines.filter(r => r.day.toLowerCase() === todayName.toLowerCase()), 
  [myRoutines, todayName]);

  if (loading || status === "loading") {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
      
      {/* --- WELCOME HEADER --- */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            Welcome Back, <span className="text-blue-400">{session?.user?.name || "Instructor"}</span>!
          </h1>
          <p className="mt-2 text-slate-400 font-medium">Department of Computer Science & Engineering</p>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-md border border-white/10">
              <BookOpen className="h-4 w-4 text-blue-300" />
              <span>{myCourses.length} Assigned Courses</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-md border border-white/10">
              <Calendar className="h-4 w-4 text-green-300" />
              <span>{todaysClasses.length} Classes Today</span>
            </div>
          </div>
        </div>
        {/* Decorative background element */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl"></div>
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* --- LEFT SIDE: TODAY'S SCHEDULE --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" /> Today's Classes
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">
              {todayName}
            </span>
          </div>

          <div className="space-y-4">
            {todaysClasses.length > 0 ? (
              todaysClasses.sort((a,b) => a.startTime.localeCompare(b.startTime)).map((cls) => (
                <Card key={cls._id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {cls.startTime}
                      </span>
                      <span className="text-xs font-medium text-slate-400">Sem {cls.semester}</span>
                    </div>
                    <h3 className="mt-3 font-bold text-slate-800 leading-tight">{cls.courseName}</h3>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3 w-3" />
                        Room: {cls.room || "Lab-01"}
                      </div>
                      <Link 
                        href={`/teacher/attendance?semester=${cls.semester}&course=${cls.courseName}`}
                        className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                      >
                        Take Attendance <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-dashed border-2 bg-slate-50/50">
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <Calendar className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">No classes scheduled for today.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* --- RIGHT SIDE: ALL ASSIGNED COURSES --- */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" /> My Assigned Courses
          </h2>
          
          <Card className="border-none shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[300px]">Course Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead className="text-center">Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myCourses.length > 0 ? (
                  myCourses.map((course) => (
                    <TableRow key={course._id} className="hover:bg-slate-50/50">
                      <TableCell className="font-bold text-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 text-xs font-bold text-blue-700">
                            {course.code.substring(0, 2)}
                          </div>
                          {course.name}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-slate-500">{course.code}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                          Semester {course.semester}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-medium">{course.credit}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                      No courses assigned yet.
                    </TableCell>
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