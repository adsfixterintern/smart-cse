"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"

type Status = "P" | "A" | "L"

type Student = {
  _id: string
  name: string
  studentId: string
  semester: string
  batch: string
  role: string
}

export default function AttendanceSheetPage() {
  const { data: session, status } = useSession()

  const [semester, setSemester] = useState("")
  const [batch, setBatch] = useState("")
  const [course, setCourse] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Record<string, Status>>({})
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [isMonthlyView, setIsMonthlyView] = useState(false)
  const [loading, setLoading] = useState(true)

  const todayDate = new Date().toISOString().split("T")[0]
  const currentTeacher = session?.user?.name || "Teacher"

  // ================= COURSE LIST =================
  const majorCourses = [
    "CSE-1101 Structured Programming",
    "CSE-1102 Structured Programming Lab",
    "CSE-2101 Data Structures",
    "CSE-2102 Data Structures Lab",
    "CSE-2201 Algorithms",
    "CSE-3101 Database Management System",
    "CSE-4101 Artificial Intelligence"
  ]

  const nonMajorCourses = [
    "CSE-1011 Computer Fundamentals",
    "CSE-1012 Computer Fundamentals Lab",
    "CSE-2011 ICT",
    "CSE-3011 Web Technology"
  ]

  // ================= FETCH USERS =================
  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers()
    }
  }, [status])

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/users", {
        headers: {
          Authorization: `Bearer ${(session?.user as any)?.accessToken}`,
        },
      })

      const studentsOnly = res.data.filter(
        (user: Student) => user.role === "student"
      )

      setAllStudents(studentsOnly)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const sortStudents = (list: Student[]) => {
    return list.sort((a, b) => {
      const getNumber = (id: string) => {
        const last = id.split("-").pop() || "0"
        return parseInt(last, 10)
      }
      return getNumber(a.studentId) - getNumber(b.studentId)
    })
  }

  // ================= DAILY =================
  const loadDailySheet = () => {
    if (!semester || !batch || !course) {
      alert("Please select Semester, Batch & Course")
      return
    }

    setIsMonthlyView(false)

    const filtered = sortStudents(
      allStudents.filter(
        (s) => s.semester === semester && s.batch === batch
      )
    )

    setStudents(filtered)

    const initial: Record<string, Status> = {}
    filtered.forEach((s) => {
      initial[s._id] = "A"
    })

    setAttendance(initial)
  }

  const handleChange = (id: string, value: Status) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const saveAttendance = async () => {
    await axios.post(
      "http://localhost:5001/attendance",
      {
        semester,
        batch,
        course,
        date: todayDate,
        teacher: currentTeacher,
        attendance,
      },
      {
        headers: {
          Authorization: `Bearer ${(session?.user as any)?.accessToken}`,
        },
      }
    )

    toast.success('Successfully toasted!')
  }

  // ================= DAILY PDF =================
  const downloadDailyPDF = () => {
    if (students.length === 0) return

    const doc = new jsPDF("landscape")

    doc.setFontSize(18)
    doc.text("Daily Attendance Report", 14, 15)

    doc.setFontSize(11)
    doc.text(`Teacher: ${currentTeacher}`, 14, 25)
    doc.text(`Semester: ${semester}`, 14, 32)
    doc.text(`Batch: ${batch}`, 14, 39)
    doc.text(`Course: ${course}`, 14, 46)
    doc.text(`Date: ${todayDate}`, 14, 53)

    const tableHead = [["Student ID", "Name", "Status"]]

    const tableBody = students.map((student) => [
      student.studentId,
      student.name,
      attendance[student._id] || "A",
    ])

    autoTable(doc, {
      startY: 60,
      head: tableHead,
      body: tableBody,
    })

    doc.save(`Daily_Attendance_${course}_${batch}_${semester}_${todayDate}.pdf`)
  }

  // ================= MONTHLY =================
  const fetchMonthlyAttendance = async () => {
    if (!semester || !batch || !selectedMonth || !course) {
      alert("Select Semester, Batch, Course & Month")
      return
    }

    const res = await axios.get(
      `http://localhost:5001/attendance/monthly?semester=${semester}&batch=${batch}&month=${selectedMonth}&course=${course}`,
      {
        headers: {
          Authorization: `Bearer ${(session?.user as any)?.accessToken}`,
        },
      }
    )

    const data = res.data
    setMonthlyData(data)
    setIsMonthlyView(true)

    if (data.length > 0) {
      const ids = Object.keys(data[0].attendance)

      const monthlyStudents = sortStudents(
        allStudents.filter((s) => ids.includes(s._id))
      )

      setStudents(monthlyStudents)
    }
  }

  // ================= MONTHLY PDF =================
  const downloadMonthlyPDF = () => {
    if (monthlyData.length === 0) return

    const doc = new jsPDF("landscape")

    const allDates = [
      ...new Set(monthlyData.map((item) => item.date)),
    ].sort()

    doc.setFontSize(18)
    doc.text("Monthly Attendance Report", 14, 15)

    doc.setFontSize(11)
    doc.text(`Teacher: ${currentTeacher}`, 14, 25)
    doc.text(`Semester: ${semester}`, 14, 32)
    doc.text(`Batch: ${batch}`, 14, 39)
    doc.text(`Course: ${course}`, 14, 46)
    doc.text(`Month: ${selectedMonth}`, 14, 53)
    doc.text(`Generated Date: ${todayDate}`, 14, 60)

    const tableHead = [["Student ID", "Name", ...allDates]]

    const tableBody = students.map((student) => {
      const row = [student.studentId, student.name]

      allDates.forEach((date) => {
        const record = monthlyData.find((d) => d.date === date)
        const status = record?.attendance?.[student._id] || "-"
        row.push(status)
      })

      return row
    })

    autoTable(doc, {
      startY: 65,
      head: tableHead,
      body: tableBody,
      styles: { fontSize: 7 },
    })

    doc.save(
      `Monthly_Attendance_${course}_${batch}_${semester}_${selectedMonth}.pdf`
    )
  }

  if (loading) return <div className="p-10">Loading...</div>

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Attendance System</h1>

      <div className="grid grid-cols-4 gap-4 bg-white p-6 rounded shadow">

        {/* Semester */}
        <select value={semester} onChange={(e)=>setSemester(e.target.value)} className="border p-2">
          <option value="">Semester</option>
          {[...Array(8)].map((_, i) => (
            <option key={i} value={i + 1}>Semester {i + 1}</option>
          ))}
        </select>

        {/* Batch */}
        <select value={batch} onChange={(e)=>setBatch(e.target.value)} className="border p-2">
          <option value="">Batch</option>
          {[...Array(20)].map((_, i) => (
            <option key={i} value={i + 1}>Batch {i + 1}</option>
          ))}
        </select>

        {/* Course Dropdown */}
        <select value={course} onChange={(e)=>setCourse(e.target.value)} className="border p-2">
          <option value="">Select Course</option>
          <optgroup label="Major Courses">
            {majorCourses.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </optgroup>
          <optgroup label="Non-Major Courses">
            {nonMajorCourses.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </optgroup>
        </select>

        <button onClick={loadDailySheet} className="bg-blue-600 text-white p-2 rounded">
          Daily
        </button>

        <select value={selectedMonth} onChange={(e)=>setSelectedMonth(e.target.value)} className="border p-2">
          <option value="">Month</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>{i + 1}</option>
          ))}
        </select>

        <button onClick={fetchMonthlyAttendance} className="bg-orange-600 text-white p-2 rounded">
          Load Monthly
        </button>

        {isMonthlyView && (
          <button onClick={downloadMonthlyPDF} className="bg-red-600 text-white p-2 rounded">
            Download Monthly PDF
          </button>
        )}

        {!isMonthlyView && students.length > 0 && (
          <button onClick={downloadDailyPDF} className="bg-purple-600 text-white p-2 rounded">
            Download Daily PDF
          </button>
        )}
      </div>

      {students.length > 0 && (
        <div className="bg-white p-6 rounded shadow overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                {isMonthlyView
                  ? [...new Set(monthlyData.map((d) => d.date))]
                      .sort()
                      .map((date) => (
                        <th key={date} className="border p-2">{date}</th>
                      ))
                  : <th className="border p-2">{todayDate}</th>}
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td className="border p-2">{s.studentId}</td>
                  <td className="border p-2">{s.name}</td>
                  {isMonthlyView
                    ? [...new Set(monthlyData.map((d) => d.date))]
                        .sort()
                        .map((date) => {
                          const record = monthlyData.find((d) => d.date === date)
                          return (
                            <td key={date} className="border p-2 text-center">
                              {record?.attendance?.[s._id] || "-"}
                            </td>
                          )
                        })
                    : (
                      <td className="border p-2 text-center">
                        <select
                          value={attendance[s._id]}
                          onChange={(e)=>handleChange(s._id, e.target.value as Status)}
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

          {!isMonthlyView && (
            <button
              onClick={saveAttendance}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          )}
        </div>
      )}
    </div>
  )
}