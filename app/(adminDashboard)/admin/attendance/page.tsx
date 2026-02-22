"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { Loader2, Download, Save, Calendar, FileText, Badge } from "lucide-react"

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
  const [course, setCourse] = useState("")
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

  // ================= 1. FETCH ALL STUDENTS (ON LOAD) =================
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
      console.error(error)
      toast.error("Failed to fetch students")
    } finally {
      setLoading(false)
    }
  }

  // ================= 2. FETCH COURSES DYNAMICALLY (ON SEMESTER CHANGE) =================
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
        console.error("Course fetch error:", error)
        toast.error("Could not load courses for this semester")
      } finally {
        setCourseLoading(false)
      }
    }
    fetchCourses()
  }, [semester, session])

  const sortStudents = (list: Student[]) => {
    return list.sort((a, b) => {
      const getNumber = (id: string) => parseInt(id.split("-").pop() || "0", 10)
      return getNumber(a.studentId) - getNumber(b.studentId)
    })
  }

  // ================= 3. DAILY SHEET LOGIC =================
  const loadDailySheet = () => {
    if (!semester || !batch || !course) {
      toast.error("Please select Semester, Batch & Course")
      return
    }

    setIsMonthlyView(false)
    const filtered = sortStudents(
      allStudents.filter((s) => s.semester === semester && s.batch === batch)
    )

    if (filtered.length === 0) {
      toast.error("No students found for this Batch/Semester")
    }

    setStudents(filtered)
    const initial: Record<string, Status> = {}
    filtered.forEach((s) => { initial[s._id] = "P" }) // Default Present
    setAttendance(initial)
  }

  const saveAttendance = async () => {
    try {
      await axios.post(`${apiUrl}/attendance`,
        { semester, batch, course, date: todayDate, teacher: currentTeacher, attendance },
        { headers: { Authorization: `Bearer ${(session?.user as any)?.accessToken}` } }
      )
      toast.success('Attendance saved successfully!')
    } catch (error) {
      toast.error("Failed to save attendance")
    }
  }

  // ================= 4. MONTHLY LOGIC =================
  const fetchMonthlyAttendance = async () => {
    if (!semester || !batch || !selectedMonth || !course) {
      toast.error("Select Semester, Batch, Course & Month")
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
        const monthlyStudents = sortStudents(allStudents.filter((s) => ids.includes(s._id)))
        setStudents(monthlyStudents)
      } else {
        toast.error("No records found for this month")
      }
    } catch (error) {
      toast.error("Error loading monthly data")
    }
  }

  // PDF Generators (Keep same as your logic)
  const downloadDailyPDF = () => { /* ... same logic as your provided code ... */ }
  const downloadMonthlyPDF = () => { /* ... same logic as your provided code ... */ }

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  )

  return (
    <div className="p-4 md:p-10 space-y-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
          Attendance <span className="text-blue-600">Management</span>
        </h1>
        <div className="flex gap-2">
           <Badge className="bg-slate-900 text-white italic uppercase px-4 py-1">Teacher: {currentTeacher}</Badge>
           <Badge className="bg-blue-600 text-white italic uppercase px-4 py-1">Date: {todayDate}</Badge>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        
        {/* Semester */}
        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="border-2 rounded-xl p-2 font-bold italic text-sm">
          <option value="">Semester</option>
          {[...Array(8)].map((_, i) => (
            <option key={i} value={i + 1}>Sem {i + 1}</option>
          ))}
        </select>

        {/* Batch */}
        <select value={batch} onChange={(e) => setBatch(e.target.value)} className="border-2 rounded-xl p-2 font-bold italic text-sm">
          <option value="">Batch</option>
          {[...Array(15)].map((_, i) => (
            <option key={i} value={i + 10}>Batch {i + 10}</option>
          ))}
        </select>

        {/* Dynamic Course Dropdown */}
        <select 
          value={course} 
          onChange={(e) => setCourse(e.target.value)} 
          className="border-2 rounded-xl p-2 font-bold italic text-sm md:col-span-2"
          disabled={!semester || courseLoading}
        >
          <option value="">{courseLoading ? "Loading..." : "Select Course"}</option>
          {courseList.map((c) => (
            <option key={c._id} value={c.name}>{c.courseCode} - {c.name}</option>
          ))}
        </select>

        <button onClick={loadDailySheet} className="bg-slate-900 text-white font-black italic uppercase text-xs rounded-xl p-2 hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
          <Calendar size={14} /> Load Daily
        </button>

        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border-2 rounded-xl p-2 font-bold italic text-sm">
          <option value="">Month</option>
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>

        <button onClick={fetchMonthlyAttendance} className="bg-blue-600 text-white font-black italic uppercase text-xs rounded-xl p-2 hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
          <FileText size={14} /> Monthly
        </button>
      </div>

      {/* Attendance Table */}
      {students.length > 0 && (
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
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
                    : <th className="p-5 border-b border-slate-800 text-center">Status ({todayDate})</th>
                  }
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-5 text-sm font-black italic text-blue-600">{s.studentId}</td>
                    <td className="p-5 text-sm font-bold uppercase italic text-slate-700">{s.name}</td>
                    {isMonthlyView
                      ? [...new Set(monthlyData.map((d) => d.date))].sort().map((date) => {
                          const record = monthlyData.find((d) => d.date === date)
                          const status = record?.attendance?.[s._id]
                          return (
                            <td key={date} className={`p-5 text-center font-black italic text-xs ${status === 'P' ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {status || "-"}
                            </td>
                          )
                        })
                      : (
                        <td className="p-5 text-center">
                          <select
                            value={attendance[s._id]}
                            onChange={(e) => setAttendance({ ...attendance, [s._id]: e.target.value as Status })}
                            className={`font-black italic text-xs p-2 rounded-lg border-2 uppercase ${
                                attendance[s._id] === 'P' ? 'border-emerald-200 text-emerald-600' : 
                                attendance[s._id] === 'L' ? 'border-amber-200 text-amber-600' : 'border-rose-200 text-rose-600'
                            }`}
                          >
                            <option value="P">P (Present)</option>
                            <option value="A">A (Absent)</option>
                            <option value="L">L (Late)</option>
                          </select>
                        </td>
                      )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 bg-slate-50 flex flex-wrap gap-4 justify-between items-center">
            {!isMonthlyView && (
              <button onClick={saveAttendance} className="bg-emerald-500 text-white font-black italic uppercase px-8 py-3 rounded-2xl hover:bg-emerald-600 shadow-lg shadow-emerald-200 flex items-center gap-2">
                <Save size={18} /> Save Attendance
              </button>
            )}
            <div className="flex gap-2">
              <button onClick={isMonthlyView ? downloadMonthlyPDF : downloadDailyPDF} className="bg-slate-900 text-white font-black italic uppercase px-8 py-3 rounded-2xl hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                <Download size={18} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}