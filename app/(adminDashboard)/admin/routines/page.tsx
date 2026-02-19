"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  Plus, Pencil, Trash2, Search, Calendar, Image as ImageIcon, X, Eye, Loader2
} from "lucide-react"
import Image from "next/image"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

interface Routine {
  _id: string;
  title: string;
  semester: string;
  imageUrl: string;
  public_id?: string;
}

export default function RoutineManagement() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [semesterFilter, setSemesterFilter] = useState("all")
  
  // Modal & Loading States
  const [viewingRoutine, setViewingRoutine] = useState<Routine | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Form States
  const [title, setTitle] = useState("")
  const [semester, setSemester] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [publicId, setPublicId] = useState("")

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/routines`)
      .then(res => res.json())
      .then(data => setRoutines(data))
  }, [])

  // --- IMAGE UPLOAD TO BACKEND API ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("image", file) 

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-image`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      })

      const data = await response.json()
      if (response.ok) {
        setImageUrl(data.url)
        setPublicId(data.public_id)
      }
    } catch (error) {
      console.error("Upload failed", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const routineData = { title, semester, imageUrl, public_id: publicId }

    const url = editingRoutine 
      ? `${process.env.NEXT_PUBLIC_API_URL}/routines/${editingRoutine._id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/routines`
    
    const response = await fetch(url, {
      method: editingRoutine ? "PATCH" : "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(routineData)
    })

    if (response.ok) {
      setIsFormOpen(false)
      window.location.reload()
    }
  }

  // --- DELETE ROUTINE AND IMAGE ---
  const handleDelete = async (routine: Routine) => {
    if (!window.confirm("Delete this routine permanently?")) return
    if (routine.public_id) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete-image/${routine.public_id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      })
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/routines/${routine._id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })

    if (res.ok) window.location.reload()
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase">Class Routine</h1>
          <p className="text-primary font-bold italic text-xs uppercase tracking-widest mt-1">Management Dashboard</p>
        </div>
        <Button onClick={() => { setEditingRoutine(null); setTitle(""); setSemester(""); setImageUrl(""); setIsFormOpen(true); }} className="bg-primary h-14 px-8 rounded-2xl font-black text-lg shadow-xl shadow-primary/30">
          <Plus className="mr-2 h-6 w-6 stroke-[3px]" /> ADD NEW
        </Button>
      </div>

      {/* Routine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routines.map((routine) => (
          <Card key={routine._id} className="group border-none shadow-lg rounded-[2.5rem] overflow-hidden bg-white">
            <div className="relative h-60 w-full bg-slate-50">
               {routine.imageUrl ? (
                 <Image src={routine.imageUrl} alt="" fill className="object-cover" />
               ) : (
                 <div className="flex items-center justify-center h-full"><ImageIcon className="text-slate-200 h-12 w-12" /></div>
               )}
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <Button size="icon" variant="secondary" className="rounded-full" onClick={() => setViewingRoutine(routine)}><Eye /></Button>
                  <Button size="icon" variant="secondary" className="rounded-full text-blue-600" onClick={(e) => { setEditingRoutine(routine); setTitle(routine.title); setSemester(routine.semester); setImageUrl(routine.imageUrl); setPublicId(routine.public_id || ""); setIsFormOpen(true); }}><Pencil /></Button>
                  <Button size="icon" variant="secondary" className="rounded-full text-red-600" onClick={() => handleDelete(routine)}><Trash2 /></Button>
               </div>
            </div>
            <div className="p-6">
              <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{routine.semester} Semester</span>
              <h3 className="text-xl font-black text-slate-800 uppercase italic mt-2 truncate">{routine.title}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* --- FORM MODAL --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-xl p-10 rounded-[3rem] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase">{editingRoutine ? "Edit" : "Upload"} Routine</DialogTitle>
            <DialogDescription className="italic font-medium text-slate-400">Select an image file to upload to your server.</DialogDescription>
          </DialogHeader>

          <form className="space-y-6 mt-4" onSubmit={handleFormSubmit}>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Routine Title" className="h-14 bg-slate-50 border-none rounded-2xl font-bold" required />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Semester</Label>
              <Select onValueChange={setSemester} value={semester}>
                <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent className="font-bold rounded-xl">
                  {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(sem => (
                    <SelectItem key={sem} value={sem}>{sem} Semester</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">File Upload</Label>
              {imageUrl ? (
                <div className="relative h-48 w-full rounded-[2rem] border-4 border-slate-50 overflow-hidden group">
                  <Image src={imageUrl} alt="" fill className="object-cover" />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-3 right-3 h-10 w-10 rounded-full shadow-lg" onClick={() => setImageUrl("")}><X /></Button>
                </div>
              ) : (
                <div className="relative">
                   <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    id="file-upload" 
                    disabled={isUploading}
                   />
                   <label htmlFor="file-upload" className="w-full h-32 border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 transition-all">
                      {isUploading ? (
                        <Loader2 className="animate-spin text-primary h-8 w-8" />
                      ) : (
                        <>
                          <ImageIcon className="text-slate-300 h-8 w-8" />
                          <span className="text-[10px] font-black uppercase text-slate-400 italic">Click to browse image</span>
                        </>
                      )}
                   </label>
                </div>
              )}
            </div>

            <Button type="submit" disabled={isUploading || !imageUrl} className="w-full h-16 rounded-2xl font-black text-xl uppercase tracking-tighter shadow-2xl shadow-primary/30 active:scale-95 transition-all">
              {editingRoutine ? "Update" : "Save"} Schedule
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}