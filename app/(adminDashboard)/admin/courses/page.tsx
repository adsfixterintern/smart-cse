"use client"

import React, { useState, useMemo } from "react"
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  Plus, Pencil, Trash2, Search, User, Mail, GraduationCap, X, Filter, ImageIcon
} from "lucide-react"
import Image from "next/image"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  specialization: string;
  experience: string;
  imageUrl: string;
  teacherId: string;
}

const sampleTeachers: Teacher[] = [
  { id: "1", teacherId: "T-101", name: "Dr. Selim Reza", email: "selim@bu.edu.bd", phone: "+8801711223344", designation: "Professor", specialization: "Machine Learning & AI", experience: "15", imageUrl: "" },
  { id: "2", teacherId: "T-102", name: "Mehedi Hasan", email: "mehedi@bu.edu.bd", phone: "+8801811223344", designation: "Lecturer", specialization: "Web Development", experience: "3", imageUrl: "" },
]

export default function FacultyManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>(sampleTeachers)
  const [searchQuery, setSearchQuery] = useState("")
  const [designationFilter, setDesignationFilter] = useState("all")
  
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)

  const [formData, setFormData] = useState<Omit<Teacher, 'id'>>({
    name: "", email: "", phone: "", designation: "", specialization: "", experience: "", teacherId: "", imageUrl: ""
  })

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.teacherId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDesignation = designationFilter === "all" || t.designation === designationFilter;
      return matchesSearch && matchesDesignation;
    })
  }, [teachers, searchQuery, designationFilter])

  const handleOpenAdd = () => {
    setEditingTeacher(null)
    setFormData({ name: "", email: "", phone: "", designation: "", specialization: "", experience: "", teacherId: "", imageUrl: "" })
    setIsFormOpen(true)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTeacher) {
      setTeachers(teachers.map(t => t.id === editingTeacher.id ? { ...formData, id: t.id } : t))
    } else {
      setTeachers([{ ...formData, id: Math.random().toString(36).substr(2, 9) }, ...teachers])
    }
    setIsFormOpen(false)
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (window.confirm("Delete this profile?")) {
      setTeachers(teachers.filter(t => t.id !== id))
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase underline decoration-primary decoration-4 underline-offset-8">Faculty</h1>
          <p className="text-slate-500 font-medium italic text-sm pt-2 px-1">Manage department teachers & staff</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-primary h-14 px-8 rounded-2xl font-black text-lg shadow-xl shadow-primary/30">
          <Plus className="mr-2 h-6 w-6 stroke-[3px]" /> ADD TEACHER
        </Button>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-[2.5rem] border shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Search by Name or ID..." 
            className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select onValueChange={setDesignationFilter} defaultValue="all">
          <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold">
            <SelectValue placeholder="Designation" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-none shadow-2xl font-bold">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Professor">Professor</SelectItem>
            <SelectItem value="Lecturer">Lecturer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Teacher Table */}
      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900 border-none">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-24 px-8 text-white font-bold py-6 italic uppercase">Photo</TableHead>
              <TableHead className="text-white font-bold py-6 italic uppercase">Info</TableHead>
              <TableHead className="text-right px-8 text-white font-bold py-6 italic uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.map((teacher) => (
              <TableRow 
                key={teacher.id} 
                className="cursor-pointer hover:bg-slate-50 transition-all group"
                onClick={() => setViewingTeacher(teacher)}
              >
                <TableCell className="px-8 py-6">
                  <div className="h-14 w-14 border-2 border-slate-100 rounded-2xl bg-slate-50 relative overflow-hidden flex items-center justify-center">
                    {teacher.imageUrl ? <Image src={teacher.imageUrl} alt="" fill className="object-cover" /> : <User className="h-6 w-6 text-slate-300" />}
                  </div>
                </TableCell>
                <TableCell className="py-6">
                  <p className="font-black text-slate-800 text-lg uppercase tracking-tight italic group-hover:text-primary transition-colors leading-none">{teacher.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 leading-none italic">{teacher.teacherId} • {teacher.designation}</p>
                </TableCell>
                <TableCell className="text-right px-8" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl" onClick={(e) => { e.stopPropagation(); setEditingTeacher(teacher); setFormData({...teacher}); setIsFormOpen(true); }}><Pencil size={16} className="text-blue-600" /></Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl" onClick={(e) => handleDelete(e, teacher.id)}><Trash2 size={16} className="text-red-600" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* --- MODAL 1: VIEW PROFILE --- */}
      <Dialog open={!!viewingTeacher} onOpenChange={() => setViewingTeacher(null)}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{viewingTeacher?.name || "Profile"}</DialogTitle>
            <DialogDescription>Full details of the faculty member.</DialogDescription>
          </DialogHeader>
          <div className="bg-slate-900 p-10 flex flex-col items-center text-center space-y-4">
             <div className="h-32 w-32 rounded-[2rem] border-4 border-primary/30 relative overflow-hidden bg-white shadow-2xl">
                {viewingTeacher?.imageUrl ? <Image src={viewingTeacher.imageUrl} alt="" fill className="object-cover" /> : <User className="h-12 w-12 m-auto mt-8 text-slate-200" />}
             </div>
             <div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{viewingTeacher?.name}</h2>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">{viewingTeacher?.designation}</p>
             </div>
          </div>
          <div className="p-8 space-y-4 bg-white font-bold italic">
             <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 border-b pb-2"><p className="text-[10px] text-slate-400 uppercase leading-none mb-1">Specialization</p><p className="text-slate-700 leading-tight">{viewingTeacher?.specialization}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase leading-none mb-1">Teacher ID</p><p className="text-slate-700 leading-none">{viewingTeacher?.teacherId}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase leading-none mb-1">Experience</p><p className="text-slate-700 leading-none">{viewingTeacher?.experience} Years</p></div>
             </div>
             <Button onClick={() => setViewingTeacher(null)} className="w-full mt-4 rounded-xl font-black">CLOSE PROFILE</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- MODAL 2: ADD / EDIT FORM --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-xl p-10 rounded-[2.5rem] border-none shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase leading-none">
              {editingTeacher ? "Edit" : "New"} Faculty
            </DialogTitle>
            <DialogDescription className="italic font-medium text-slate-400 mt-2">Enter teacher's official information.</DialogDescription>
          </DialogHeader>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase ml-1 tracking-widest text-slate-500">Full Name</Label>
               <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="h-12 bg-slate-50 border-none rounded-xl font-bold" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase ml-1 tracking-widest text-slate-500">Teacher ID</Label>
                <Input value={formData.teacherId} onChange={(e) => setFormData({...formData, teacherId: e.target.value})} className="h-12 bg-slate-50 border-none rounded-xl font-bold" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase ml-1 tracking-widest text-slate-500">Designation</Label>
                <Input value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} className="h-12 bg-slate-50 border-none rounded-xl font-bold" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase ml-1 tracking-widest text-slate-500">Media</Label>
              {formData.imageUrl ? (
                <div className="relative h-40 w-full rounded-3xl border-4 border-slate-50 overflow-hidden group">
                  <Image src={formData.imageUrl} alt="" fill className="object-cover" />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 rounded-full" onClick={() => setFormData({...formData, imageUrl: ""})}><X className="h-4 w-4" /></Button>
                </div>
              ) : (
                <CldUploadWidget 
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={(result: CloudinaryUploadWidgetResults) => {
                    if (result.info && typeof result.info !== "string") setFormData({...formData, imageUrl: result.info.secure_url})
                  }}
                >
                  {({ open }) => (
                    <div 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        open?.();
                      }} 
                      className="w-full h-24 border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 transition-all"
                    >
                      <ImageIcon className="h-6 w-6 text-slate-300" />
                      <span className="text-[10px] font-black uppercase text-slate-400 italic">Click to Upload Photo</span>
                    </div>
                  )}
                </CldUploadWidget>
              )}
            </div>

            <Button onClick={handleFormSubmit} className="w-full h-16 rounded-2xl font-black text-xl uppercase tracking-tighter shadow-2xl shadow-primary/30 mt-4 active:scale-95 transition-all">
              {editingTeacher ? "Update" : "Register"} Profile
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}