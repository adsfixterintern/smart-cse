"use client"

import React, { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  Plus, Pencil, Trash2, Search, BookOpen, User as UserIcon, X, Calendar, BookText
} from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

interface Course {
  id: string;
  courseCode: string;
  courseTitle: string;
  credits: string;
  semester: string;
  assignedTeacher: string;
  description: string;
}

const sampleCourses: Course[] = [
  { id: "1", courseCode: "CSE-321", courseTitle: "Computer Networks", credits: "3.0", semester: "6th", assignedTeacher: "Dr. Selim Reza", description: "Study of network architectures, protocols, and data communication." },
  { id: "2", courseCode: "CSE-322", courseTitle: "Computer Networks Lab", credits: "1.5", semester: "6th", assignedTeacher: "Mehedi Hasan", description: "Hands-on experience with socket programming and network configuration." },
]

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>(sampleCourses)
  const [searchQuery, setSearchQuery] = useState("")
  const [semesterFilter, setSemesterFilter] = useState("all")
  
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  const [formData, setFormData] = useState<Omit<Course, 'id'>>({
    courseCode: "", courseTitle: "", credits: "", semester: "", assignedTeacher: "", description: ""
  })

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesSearch = c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           c.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSemester = semesterFilter === "all" || c.semester === semesterFilter;
      return matchesSearch && matchesSemester;
    })
  }, [courses, searchQuery, semesterFilter])

  const handleOpenAdd = () => {
    setEditingCourse(null)
    setFormData({ courseCode: "", courseTitle: "", credits: "", semester: "", assignedTeacher: "", description: "" })
    setIsFormOpen(true)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...formData, id: c.id } : c))
    } else {
      setCourses([{ ...formData, id: Math.random().toString(36).substr(2, 9) }, ...courses])
    }
    setIsFormOpen(false)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase underline decoration-primary decoration-4 underline-offset-8">Courses</h1>
        <Button onClick={handleOpenAdd} className="bg-primary h-14 px-8 rounded-2xl font-black text-lg shadow-xl shadow-primary/30">
          <Plus className="mr-2 h-6 w-6 stroke-[3px]" /> ADD COURSE
        </Button>
      </div>

      {/* Filter Section */}
      <Card className="p-6 rounded-[2.5rem] border shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 bg-white">
        <div className="relative col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Search by Title or Code..." 
            className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select onValueChange={setSemesterFilter} defaultValue="all">
          <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent className="font-bold">
            <SelectItem value="all">All Semesters</SelectItem>
            <SelectItem value="1st">1st Semester</SelectItem>
            <SelectItem value="6th">6th Semester</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Table Content */}
      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-32 px-8 text-white font-bold py-6 italic uppercase">Code</TableHead>
              <TableHead className="text-white font-bold py-6 italic uppercase">Title</TableHead>
              <TableHead className="text-right px-8 text-white font-bold py-6 italic uppercase text-xs tracking-widest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow 
                key={course.id} 
                className="cursor-pointer hover:bg-slate-50 transition-all group"
                onClick={() => setViewingCourse(course)}
              >
                <TableCell className="px-8 py-6">
                   <span className="font-black text-primary text-sm bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                    {course.courseCode}
                   </span>
                </TableCell>
                <TableCell className="py-6">
                  <p className="font-black text-slate-800 text-lg uppercase tracking-tight italic group-hover:text-primary transition-colors leading-none">{course.courseTitle}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 italic">Credits: {course.credits} • {course.assignedTeacher}</p>
                </TableCell>
                <TableCell className="text-right px-8" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl" onClick={(e) => { e.stopPropagation(); setEditingCourse(course); setFormData({...course}); setIsFormOpen(true); }}><Pencil size={16} className="text-blue-600" /></Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl text-red-600" onClick={(e) => { e.stopPropagation(); setCourses(courses.filter(c => c.id !== course.id)); }}><Trash2 size={16} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* --- MODAL 1: VIEW DETAILS --- */}
      <Dialog open={!!viewingCourse} onOpenChange={() => setViewingCourse(null)}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{viewingCourse?.courseTitle || "Course Info"}</DialogTitle>
            <DialogDescription>Full details of the academic course.</DialogDescription>
          </DialogHeader>
          <div className="bg-slate-900 p-12 text-center space-y-2">
             <div className="inline-flex p-4 bg-primary/20 rounded-3xl mb-4">
                <BookOpen size={40} className="text-primary" />
             </div>
             <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{viewingCourse?.courseTitle}</h2>
             <p className="text-primary text-xs font-black uppercase tracking-[0.3em]">{viewingCourse?.courseCode}</p>
          </div>
          <div className="p-10 space-y-6 bg-white font-bold italic">
             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Semester</p>
                   <p className="text-lg text-slate-700">{viewingCourse?.semester} Semester</p>
                </div>
                <div className="space-y-1 text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Credit Hours</p>
                   <p className="text-lg text-slate-700">{viewingCourse?.credits}</p>
                </div>
                <div className="col-span-2 space-y-2 pt-4 border-t">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><UserIcon size={12} /> Assigned Faculty</p>
                   {/* FIXED LINE BELOW */}
                   <p className="text-xl text-primary leading-none uppercase">{viewingCourse?.assignedTeacher}</p>
                </div>
                <div className="col-span-2 space-y-2 pt-4 border-t">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><BookText size={12} /> Syllabus Preview</p>
                   <p className="text-sm font-medium text-slate-600 leading-relaxed normal-case not-italic">{viewingCourse?.description}</p>
                </div>
             </div>
             <Button onClick={() => setViewingCourse(null)} className="w-full mt-6 h-14 rounded-2xl font-black uppercase text-lg shadow-xl shadow-primary/20">CLOSE VIEW</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- MODAL 2: ADD / EDIT FORM (simplified for demo) --- */}
     {/* --- MODAL 2: ADD / EDIT FORM --- */}
<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
  <DialogContent className="max-w-2xl p-10 rounded-[2.5rem] border-none shadow-2xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase leading-none">
        {editingCourse ? "Edit" : "New"} Academic Course
      </DialogTitle>
      <DialogDescription className="italic font-medium text-slate-400 mt-2">
        Assign course code, credits, and semester for this curriculum.
      </DialogDescription>
    </DialogHeader>

    <form className="grid grid-cols-2 gap-6 mt-8" onSubmit={handleFormSubmit}>
      {/* Course Title */}
      <div className="space-y-1 col-span-2">
         <Label className="text-[10px] font-black uppercase ml-1 tracking-widest text-slate-500">Course Full Title</Label>
         <Input 
           value={formData.courseTitle} 
           onChange={(e) => setFormData({...formData, courseTitle: e.target.value})} 
           placeholder="e.g. Data Structures & Algorithms" 
           className="h-14 bg-slate-50 border-none rounded-2xl font-bold text-lg" 
           required 
         />
      </div>

      {/* Course Code */}
      <div className="space-y-1 col-span-2 sm:col-span-1">
         <Label className="text-[10px] font-black uppercase ml-1 tracking-widest text-slate-500">Course Code</Label>
         <Input 
           value={formData.courseCode} 
           onChange={(e) => setFormData({...formData, courseCode: e.target.value})} 
           placeholder="e.g. CSE-211" 
           className="h-14 bg-slate-50 border-none rounded-2xl font-bold uppercase" 
           required 
         />
      </div>

      {/* Credits */}
      <div className="space-y-1 col-span-2 sm:col-span-1">
         <Label className="text-[10px] font-black uppercase ml-1 tracking-widest text-slate-500">Credit Hours</Label>
         <Input 
           value={formData.credits} 
           onChange={(e) => setFormData({...formData, credits: e.target.value})} 
           placeholder="e.g. 3.0" 
           className="h-14 bg-slate-50 border-none rounded-2xl font-bold" 
           required 
         />
      </div>

      {/* Semester Selection (নতুন যোগ করা হয়েছে) */}
      <div className="space-y-1 col-span-2 sm:col-span-1">
         <Label className="text-[10px] font-black uppercase ml-1 tracking-widest text-slate-500">Target Semester</Label>
         <Select 
           onValueChange={(value) => setFormData({...formData, semester: value})} 
           value={formData.semester}
         >
           <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold">
             <SelectValue placeholder="Select Semester" />
           </SelectTrigger>
           <SelectContent className="rounded-xl border-none shadow-2xl font-bold">
             {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map((sem) => (
               <SelectItem key={sem} value={sem}>{sem} Semester</SelectItem>
             ))}
           </SelectContent>
         </Select>
      </div>

      {/* Assign Teacher */}
      <div className="space-y-1 col-span-2 sm:col-span-1">
         <Label className="text-[10px] font-black uppercase ml-1 tracking-widest text-slate-500">Assign Faculty</Label>
         <Input 
           value={formData.assignedTeacher} 
           onChange={(e) => setFormData({...formData, assignedTeacher: e.target.value})} 
           placeholder="Teacher Name" 
           className="h-14 bg-slate-50 border-none rounded-2xl font-bold" 
         />
      </div>

      {/* Description */}
      <div className="space-y-1 col-span-2">
         <Label className="text-[10px] font-black uppercase ml-1 tracking-widest text-slate-500">Course Syllabus / Notes</Label>
         <textarea 
           value={formData.description} 
           onChange={(e) => setFormData({...formData, description: e.target.value})} 
           rows={4} 
           className="w-full bg-slate-50 border-none rounded-2xl p-4 font-medium text-slate-700 outline-none focus:ring-2 ring-primary/20"
           placeholder="Enter brief course content..."
         />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full h-16 rounded-2xl font-black text-xl uppercase tracking-tighter col-span-2 shadow-2xl shadow-primary/30 mt-4 active:scale-95 transition-all">
        {editingCourse ? "Update Course Info" : "Register New Course"}
      </Button>
    </form>
  </DialogContent>
</Dialog>
    </div>
  )
}