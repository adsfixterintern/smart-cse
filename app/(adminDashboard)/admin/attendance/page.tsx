"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { Loader2, Download, Save, Calendar, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Status = "P" | "A" | "L"

type Student = {
  _id: string
  name: string
  studentId: string
  semester: string
  batch: string
  role: string
}

type Course = {
  _id: string
  name: string
  courseCode: string
  semester: string
}

export default function AttendanceSheetPage() {
  const { data: session, status } = useSession()

  // States
  const [semester, setSemester] = useState("")
  const [batch, setBatch] = useState("")
  const [course, setCourse] = useState("") // Selected Course Name
  const [selectedMonth, setSelectedMonth] = useState("")
  
  const [courseList, setCourseList] = useState<Course[]>([])
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Record<string, Status>>({})
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  
  const [isMonthlyView, setIsMonthlyView] = useState(false)
  const [loading, setLoading] = useState(true)
  const [courseLoading, setCourseLoading] = useState(false)

  const todayDate = new Date().toISOString().split("T")[0]
  const currentTeacher = session?.user?.name || "Teacher"
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers()
    }
  }, [status])

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${apiUrl}/users`, {
        headers: { Authorization: `Bearer ${(session?.user as any)?.accessToken}` },
      })
      const studentsOnly = res.data.filter((user: Student) => user.role === "student")
      setAllStudents(studentsOnly)
    } catch (error) {
      toast.error("Failed to fetch students")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchCourses = async () => {
      if (!semester) {
        setCourseList([])
        setCourse("")
        return
      }
      setCourseLoading(true)
      try {
        const res = await axios.get(`${apiUrl}/courses/${semester}`, {
          headers: { Authorization: `Bearer ${(session?.user as any)?.accessToken}` },
        })
        setCourseList(res.data || [])
      } catch (error) {
        toast.error("Could not load courses")
      } finally {
        setCourseLoading(false)
      }
    }
    fetchCourses()
  }, [semester])

  const loadDailySheet = () => {
    if (!semester || !batch || !course) {
      toast.error("Select Semester, Batch & Course")
      return
    }
    setIsMonthlyView(false)
    const filtered = allStudents
      .filter((s) => s.semester === semester && s.batch === batch)
      .sort((a, b) => a.studentId.localeCompare(b.studentId))

    setStudents(filtered)
    const initial: Record<string, Status> = {}
    filtered.forEach((s) => { initial[s._id] = "P" })
    setAttendance(initial)
  }

  // ================= FIXED SAVE FUNCTION =================
  const saveAttendance = async () => {
    if (!course || students.length === 0) {
      toast.error("Please load students and select a course first")
      return
    }

    try {
      // আমরা নিশ্চিত করছি যে 'course' স্টেটে থাকা পূর্ণ নাম ও কোডটিই সার্ভারে যাচ্ছে
      const payload = {
        semester,
        batch,
        course: course.trim(), // ড্রপডাউন থেকে আসা নাম (e.g., "Algorithms")
        date: todayDate,
        teacher: currentTeacher,
        attendance
      }

      await axios.post(`${apiUrl}/attendance`, payload, {
        headers: { Authorization: `Bearer ${(session?.user as any)?.accessToken}` }
      })
      
      toast.success(`Attendance saved for ${course}`)
    } catch (error) {
      console.error("Save error:", error)
      toast.error("Failed to save attendance")
    }
  }

  const fetchMonthlyAttendance = async () => {
    if (!semester || !batch || !selectedMonth || !course) {
      toast.error("Select all filters including Course & Month")
      return
    }
    try {
      const res = await axios.get(
        `${apiUrl}/attendance/monthly?semester=${semester}&batch=${batch}&month=${selectedMonth}&course=${course}`,
        { headers: { Authorization: `Bearer ${(session?.user as any)?.accessToken}` } }
      )
      setMonthlyData(res.data)
      setIsMonthlyView(true)
      if (res.data.length > 0) {
        const ids = Object.keys(res.data[0].attendance)
        const monthlyStudents = allStudents.filter((s) => ids.includes(s._id))
        setStudents(monthlyStudents)
      } else {
        toast.error("No records for this month")
      }
    } catch (error) {
      toast.error("Error loading monthly data")
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>

  return (
    <div className="p-4 md:p-10 space-y-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
          Attendance <span className="text-blue-600 tracking-normal">Management</span>
        </h1>
        <div className="flex gap-2">
           <Badge className="bg-slate-900 text-white italic uppercase px-4 py-1">Teacher: {currentTeacher}</Badge>
           <Badge className="bg-blue-600 text-white italic uppercase px-4 py-1">Date: {todayDate}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="border-2 rounded-xl p-2 font-bold italic text-sm outline-none focus:border-blue-600">
          <option value="">Semester</option>
          {[...Array(8)].map((_, i) => (
            <option key={i} value={i + 1}>Sem {i + 1}</option>
          ))}
        </select>

        <select value={batch} onChange={(e) => setBatch(e.target.value)} className="border-2 rounded-xl p-2 font-bold italic text-sm outline-none focus:border-blue-600">
          <option value="">Batch</option>
          {[...Array(15)].map((_, i) => (
            <option key={i} value={i + 10}>Batch {i + 10}</option>
          ))}
        </select>

        <select 
          value={course} 
          onChange={(e) => setCourse(e.target.value)} 
          className="border-2 rounded-xl p-2 font-bold italic text-sm md:col-span-2 outline-none focus:border-blue-600"
          disabled={!semester || courseLoading}
        >
          <option value="">{courseLoading ? "Loading..." : "Select Course"}</option>
          {courseList.map((c) => (
            <option key={c._id} value={c.name}>{c.courseCode} - {c.name}</option>
          ))}
        </select>

        <button onClick={loadDailySheet} className="bg-slate-900 text-white font-black italic uppercase text-xs rounded-xl p-2 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-md">
          <Calendar size={14} /> Load Daily
        </button>

        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border-2 rounded-xl p-2 font-bold italic text-sm outline-none">
          <option value="">Month</option>
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>

        <button onClick={fetchMonthlyAttendance} className="bg-blue-600 text-white font-black italic uppercase text-xs rounded-xl p-2 hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-md">
          <FileText size={14} /> Monthly
        </button>
      </div>

      {students.length > 0 && (
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white italic uppercase text-[10px] tracking-widest">
                  <th className="p-5 border-b border-slate-800">Student ID</th>
                  <th className="p-5 border-b border-slate-800">Student Name</th>
                  {isMonthlyView
                    ? [...new Set(monthlyData.map((d) => d.date))].sort().map((date) => (
                        <th key={date} className="p-5 border-b border-slate-800 text-center">{date.split('-')[2]}</th>
                      ))
                    : <th className="p-5 border-b border-slate-800 text-center uppercase tracking-tighter italic">Today's Status</th>
                  }
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 text-sm font-black italic text-blue-600">{s.studentId}</td>
                    <td className="p-5 text-sm font-bold uppercase italic text-slate-700">{s.name}</td>
                    {isMonthlyView
                      ? [...new Set(monthlyData.map((d) => d.date))].sort().map((date) => {
                          const record = monthlyData.find((d) => d.date === date)
                          const status = record?.attendance?.[s._id]
                          return (
                            <td key={date} className={`p-5 text-center font-black italic text-xs ${status === 'P' ? 'text-emerald-500' : status === 'L' ? 'text-amber-500' : 'text-rose-500'}`}>
                              {status || "-"}
                            </td>
                          )
                        })
                      : (
                        <td className="p-5 text-center">
                          <select
                            value={attendance[s._id]}
                            onChange={(e) => setAttendance({ ...attendance, [s._id]: e.target.value as Status })}
                            className={`font-black italic text-xs p-2 rounded-lg border-2 uppercase outline-none transition-all ${
                                attendance[s._id] === 'P' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 
                                attendance[s._id] === 'L' ? 'border-amber-200 text-amber-600 bg-amber-50' : 'border-rose-200 text-rose-600 bg-rose-50'
                            }`}
                          >
                            <option value="P">P</option>
                            <option value="A">A</option>
                            <option value="L">L</option>
                          </select>
                        </td>
                      )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 bg-slate-50 flex flex-wrap gap-4 justify-between items-center border-t border-slate-100">
            {!isMonthlyView && (
              <button onClick={saveAttendance} className="bg-emerald-500 text-white font-black italic uppercase px-10 py-4 rounded-2xl hover:bg-emerald-600 shadow-lg shadow-emerald-200 flex items-center gap-2 transform active:scale-95 transition-all">
                <Save size={18} /> Save Attendance
              </button>
            )}
            <div className="flex gap-2">
              <button className="bg-slate-900 text-white font-black italic uppercase px-10 py-4 rounded-2xl hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                <Download size={18} /> Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}