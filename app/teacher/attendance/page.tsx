"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { 
  Loader2, Download, Save, Calendar, FileText, 
  CheckCircle2, Search, UserCheck 
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Status = "P" | "A" | "L"

export default function AttendanceSheetPage() {
  const { data: session, status } = useSession()
  const [semester, setSemester] = useState("")
  const [batch, setBatch] = useState("")
  const [course, setCourse] = useState("") 
  const [selectedMonth, setSelectedMonth] = useState("")
  
  const [courseList, setCourseList] = useState<any[]>([])
  const [allStudents, setAllStudents] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [attendance, setAttendance] = useState<Record<string, Status>>({})
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  
  const [isMonthlyView, setIsMonthlyView] = useState(false)
  const [loading, setLoading] = useState(true)
  const [courseLoading, setCourseLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const todayDate = new Date().toISOString().split("T")[0]
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://smart-cse-server.vercel.app"

  useEffect(() => {
    if (status === "authenticated") {
      const fetchUsers = async () => {
        try {
          const res = await axios.get(`${apiUrl}/users`, {
            headers: { Authorization: `Bearer ${(session as any)?.user?.accessToken}` },
          })
          setAllStudents(res.data.filter((user: any) => user.role === "student"))
        } catch (error) { toast.error("Students load failed") }
        finally { setLoading(false) }
      }
      fetchUsers()
    }
  }, [status, apiUrl, session])

  useEffect(() => {
    const fetchCourses = async () => {
      if (!semester) { setCourseList([]); setCourse(""); return; }
      setCourseLoading(true)
      try {
        const res = await axios.get(`${apiUrl}/courses/${semester}`, {
          headers: { Authorization: `Bearer ${(session as any)?.user?.accessToken}` },
        })
        setCourseList(res.data || [])
      } catch (error) { toast.error("Course fetch error") }
      finally { setCourseLoading(false) }
    }
    fetchCourses()
  }, [semester, apiUrl, session])

  const loadDailySheet = async () => {
    if (!semester || !batch || !course) return toast.error("Select filters first")
    setIsMonthlyView(false)
    const filtered = allStudents
      .filter((s) => s.semester === semester && s.batch === batch)
      .sort((a, b) => a.studentId.localeCompare(b.studentId))
    setStudents(filtered)

    try {
      const res = await axios.get(`${apiUrl}/attendance/check?semester=${semester}&batch=${batch}&course=${course}&date=${todayDate}`, {
        headers: { Authorization: `Bearer ${(session as any)?.user?.accessToken}` }
      })
      if (res.data?.attendance) {
        setAttendance(res.data.attendance)
        toast.success("Previous record loaded")
      } else {
        const initial: Record<string, Status> = {}
        filtered.forEach((s) => { initial[s._id] = "P" })
        setAttendance(initial)
      }
    } catch (e) { /* fallback to default P */ }
  }

  const saveAttendance = async () => {
    if (!course || students.length === 0) return toast.error("No data to save")
    setIsSaving(true)
    try {
      await axios.post(`${apiUrl}/attendance/upsert`, {
        semester, batch, course, date: todayDate,
        teacher: session?.user?.name, attendance
      }, { headers: { Authorization: `Bearer ${(session as any)?.user?.accessToken}` } })
      toast.success("Saved successfully")
    } catch (e) { toast.error("Save failed") }
    finally { setIsSaving(false) }
  }

  const fetchMonthlyAttendance = async () => {
    if (!semester || !batch || !selectedMonth || !course) return toast.error("Fill all filters")
    try {
      const res = await axios.get(`${apiUrl}/attendance/monthly?semester=${semester}&batch=${batch}&month=${selectedMonth}&course=${course}`, {
        headers: { Authorization: `Bearer ${(session as any)?.user?.accessToken}` }
      })
      if (res.data.length === 0) return toast.error("No records this month")
      
      setMonthlyData(res.data.sort((a: any, b: any) => a.date.localeCompare(b.date)))
      setIsMonthlyView(true)
      const ids = Array.from(new Set(res.data.flatMap((d: any) => Object.keys(d.attendance))))
      setStudents(allStudents.filter(s => ids.includes(s._id)))
    } catch (e) { toast.error("Monthly fetch failed") }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" size={40} /></div>

  return (
    <div className="p-4 md:p-10 space-y-8 bg-slate-50 min-h-screen">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 bg-white p-6 rounded-[2rem] shadow-sm">
        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="bg-slate-50 rounded-xl p-3 font-bold italic text-xs outline-none">
          <option value="">Semester</option>
          {[...Array(8)].map((_, i) => <option key={i} value={i + 1}>SEM {i + 1}</option>)}
        </select>

        <select value={batch} onChange={(e) => setBatch(e.target.value)} className="bg-slate-50 rounded-xl p-3 font-bold italic text-xs outline-none">
          <option value="">Batch</option>
          {[...Array(15)].map((_, i) => <option key={i} value={i + 10}>Batch {i + 10}</option>)}
        </select>

        <select value={course} onChange={(e) => setCourse(e.target.value)} disabled={courseLoading} className="bg-slate-50 rounded-xl p-3 font-bold italic text-xs md:col-span-2 outline-none">
          <option value="">{courseLoading ? "Syncing..." : "Select Course"}</option>
          {courseList.map((c) => (
            <option key={c._id} value={c.courseName || c.name}>{c.courseCode || c.code} - {c.courseName || c.name}</option>
          ))}
        </select>

        <button onClick={loadDailySheet} className="bg-slate-900 text-white font-black italic uppercase text-[10px] rounded-xl p-3 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg">
          <Calendar size={14} /> Daily
        </button>

        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-slate-50 rounded-xl p-3 font-bold italic text-xs outline-none">
          <option value="">Month</option>
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>

        <button onClick={fetchMonthlyAttendance} className="bg-blue-600 text-white font-black italic uppercase text-[10px] rounded-xl p-3 hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
          <FileText size={14} /> Monthly
        </button>
      </div>

      {/* Table */}
      {students.length > 0 && (
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900 text-white italic uppercase text-[9px] tracking-widest">
                  <th className="p-6">Identification</th>
                  <th className="p-6">Student Name</th>
                  {isMonthlyView 
                    ? monthlyData.map(d => <th key={d.date} className="p-4 text-center border-l border-slate-800">{d.date.split('-')[2]}</th>)
                    : <th className="p-6 text-center border-l border-slate-800">Status</th>
                  }
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50">
                    <td className="p-6 font-black italic text-blue-600">{s.studentId}</td>
                    <td className="p-6 font-bold uppercase italic text-slate-700">{s.name}</td>
                    {isMonthlyView ? (
                      monthlyData.map(d => {
                        const status = d.attendance?.[s._id]
                        return (
                          <td key={d.date} className={`p-4 text-center font-black italic text-xs border-l ${status === 'P' ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {status || "-"}
                          </td>
                        )
                      })
                    ) : (
                      <td className="p-6 text-center border-l bg-slate-50/30">
                        <select
                          value={attendance[s._id]}
                          onChange={(e) => setAttendance({ ...attendance, [s._id]: e.target.value as Status })}
                          className={`font-black italic text-xs px-4 py-2 rounded-lg border-2 uppercase outline-none ${
                            attendance[s._id] === 'P' ? 'border-emerald-200 text-emerald-600 bg-white' : 'border-rose-200 text-rose-600 bg-white'
                          }`}
                        >
                          <option value="P">P</option><option value="A">A</option><option value="L">L</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-8 bg-slate-50 flex justify-between items-center border-t">
            {!isMonthlyView && (
              <button onClick={saveAttendance} disabled={isSaving} className="bg-emerald-500 text-white font-black italic uppercase px-10 py-4 rounded-2xl hover:bg-emerald-600 flex items-center gap-2 disabled:opacity-50">
                {isSaving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />} Save/Update
              </button>
            )}
            <button className="bg-slate-900 text-white font-black italic uppercase px-10 py-4 rounded-2xl hover:bg-blue-600 flex items-center gap-2">
              <Download size={18} /> Export PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}