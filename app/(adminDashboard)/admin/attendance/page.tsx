

"use client"

import { useState } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

type Status = "P" | "A" | "L"

type Student = {
  id: string
  name: string
  roll: string
}

export default function AttendanceSheetPage() {
  const [semester, setSemester] = useState("")
  const [batch, setBatch] = useState("")
  const [month, setMonth] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<any>({})

  // 🔥 Demo current teacher (later from auth)
  const currentTeacher = "Md. Hasan Ali"

  const demoStudents: Student[] = [
    { id: "1", name: "Rahim", roll: "2023001" },
    { id: "2", name: "Karim", roll: "2023002" },
    { id: "3", name: "Sakib", roll: "2023003" },
    { id: "4", name: "Nafis", roll: "2023004" },
  ]

  const generateDays = (month: string) => {
    const days = new Date(2026, parseInt(month), 0).getDate()
    return Array.from({ length: days }, (_, i) => i + 1)
  }

  const loadSheet = () => {
    if (!semester || !batch || !month) {
      alert("Select Semester, Batch & Month")
      return
    }

    setStudents(demoStudents)

    const days = generateDays(month)
    const initialData: any = {}

    demoStudents.forEach((student) => {
      initialData[student.id] = {}
      days.forEach((day) => {
        initialData[student.id][day] = "A"
      })
    })

    setAttendance(initialData)
  }

  const handleChange = (
    studentId: string,
    day: number,
    value: Status
  ) => {
    setAttendance((prev: any) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [day]: value,
      },
    }))
  }

  const saveSheet = () => {
    alert("Sheet Updated Successfully ✅")
  }

  // 🔥 PDF Download
  const downloadPDF = () => {
    const doc = new jsPDF("landscape")

    doc.setFontSize(18)
    doc.text("Greenfield International University", 14, 15)

    doc.setFontSize(12)
    doc.text(`Teacher: ${currentTeacher}`, 14, 25)
    doc.text(`Semester: ${semester}`, 14, 32)
    doc.text(`Batch: ${batch}`, 14, 39)
    doc.text(`Month: ${month}`, 14, 46)

    const days = generateDays(month)

    const tableHead = [
      ["Roll", "Name", ...days.map((d) => d.toString())],
    ]

    const tableBody = students.map((student) => [
      student.roll,
      student.name,
      ...days.map((day) => attendance[student.id]?.[day] || "A"),
    ])

    autoTable(doc, {
      startY: 55,
      head: tableHead,
      body: tableBody,
      styles: { fontSize: 7 },
    })

    doc.save(`Attendance_${batch}_${semester}_${month}.pdf`)
  }

  const days = month ? generateDays(month) : []

  return (
    <div className="space-y-6 p-4 md:p-8">
      <h1 className="text-xl md:text-2xl font-bold">
        Monthly Attendance Sheet
      </h1>

      {/* 🔎 Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 md:p-6 rounded-xl shadow">
        <select
          className="border p-2 rounded w-full"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="">Select Semester</option>
          <option value="Spring 2026">Spring 2026</option>
          <option value="Fall 2025">Fall 2025</option>
        </select>

        <select
          className="border p-2 rounded w-full"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        >
          <option value="">Select Batch</option>
          <option value="Batch 2023">Batch 2023</option>
          <option value="Batch 2022">Batch 2022</option>
        </select>

        <select
          className="border p-2 rounded w-full"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">Select Month</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
        </select>

        <button
          onClick={loadSheet}
          className="bg-blue-600 text-white rounded px-4 py-2 w-full"
        >
          Generate Sheet
        </button>
      </div>

      {/*  Sheet */}
      {students.length > 0 && (
        <div className="bg-white p-4 md:p-6 rounded-xl shadow overflow-x-auto">
          <table className="min-w-max border text-xs md:text-sm">
            <thead>
              <tr>
                <th className="border p-2">Roll</th>
                <th className="border p-2">Name</th>
                {days.map((day) => (
                  <th key={day} className="border p-2">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="border p-2">{student.roll}</td>
                  <td className="border p-2">{student.name}</td>
                  {days.map((day) => (
                    <td key={day} className="border p-2 text-center">
                      <select
                        value={attendance[student.id]?.[day]}
                        onChange={(e) =>
                          handleChange(
                            student.id,
                            day,
                            e.target.value as Status
                          )
                        }
                        className="border rounded text-xs p-2"
                      >
                        <option value="P">P</option>
                        <option value="A">A</option>
                        <option value="L">L</option>
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={saveSheet}
              className="bg-green-600 text-white px-6 py-2 rounded w-full sm:w-auto"
            >
              Save Sheet
            </button>

            <button
              onClick={downloadPDF}
              className="bg-purple-600 text-white px-6 py-2 rounded w-full sm:w-auto"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
