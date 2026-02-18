"use client"

import React, { useState, useMemo } from "react"
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Plus, Pencil, Trash2, Calendar, Search, Image as ImageIcon, X 
} from "lucide-react"
import Image from "next/image"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

interface Notice {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

const sampleNotices: Notice[] = [
  { id: "1", title: "Final Exam Routine Spring 2026", content: "The final examinations for all batches will commence from March 15. Students are advised to collect admit cards from the office.", imageUrl: "", createdAt: "2026-02-18" },
  { id: "2", title: "Workshop on Next.js & Tailwind", content: "Join us for a hands-on workshop on modern web development. Registration mandatory for all CSE students.", imageUrl: "https://res.cloudinary.com/demo/image/upload/v1631234567/sample.jpg", createdAt: "2026-02-17" },
]

export default function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>(sampleNotices)
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const filteredNotices = useMemo(() => {
    return notices.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [notices, searchQuery])

  const handleOpenAdd = () => {
    setEditingNotice(null)
    setTitle(""); setContent(""); setImageUrl("")
    setIsFormOpen(true)
  }

  const handleOpenEdit = (e: React.MouseEvent, notice: Notice) => {
    e.stopPropagation() 
    setEditingNotice(notice)
    setTitle(notice.title); setContent(notice.content); setImageUrl(notice.imageUrl)
    setIsFormOpen(true)
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation() 
    if (window.confirm("Are you sure you want to delete this notice?")) {
      setNotices(notices.filter(n => n.id !== id))
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingNotice) {
      setNotices(notices.map(n => n.id === editingNotice.id ? { ...n, title, content, imageUrl } : n))
    } else {
      const newNotice: Notice = {
        id: Math.random().toString(36).substr(2, 9),
        title, content, imageUrl,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setNotices([newNotice, ...notices])
    }
    setIsFormOpen(false)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic tracking-tighter text-slate-900">NOTICES</h1>
          <p className="text-slate-500 font-medium italic text-sm">Manage official department announcements</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-primary hover:bg-primary/90 h-14 px-8 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95">
          <Plus className="mr-2 h-6 w-6 stroke-[3px]" /> CREATE NEW
        </Button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-3xl border shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Search by title..." 
            className="pl-12 h-12 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="px-4 py-2 bg-slate-100 rounded-full text-xs font-black text-slate-500 uppercase tracking-widest">
          {filteredNotices.length} Records Found
        </div>
      </div>

      {/* Table Content */}
      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900 border-none">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-24 px-8 text-white font-bold py-6 italic uppercase tracking-widest">Media</TableHead>
              <TableHead className="text-white font-bold py-6 italic uppercase tracking-widest">Information</TableHead>
              <TableHead className="text-right px-8 text-white font-bold py-6 italic uppercase tracking-widest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotices.map((notice) => (
              <TableRow 
                key={notice.id} 
                className="cursor-pointer hover:bg-slate-50/80 border-b border-slate-100 transition-all group"
                onClick={() => setViewingNotice(notice)}
              >
                <TableCell className="px-8 py-6">
                  <div className="h-16 w-16 border-2 border-slate-100 rounded-2xl bg-slate-50 relative overflow-hidden flex items-center justify-center shadow-inner group-hover:border-primary/40 transition-colors">
                    {notice.imageUrl ? (
                      <Image src={notice.imageUrl} alt="" fill className="object-cover" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-slate-300" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-6">
                  <div className="space-y-1">
                    <p className="font-black text-slate-800 text-lg group-hover:text-primary transition-colors uppercase tracking-tight italic">{notice.title}</p>
                    <div className="flex items-center gap-3">
                       <span className="flex items-center text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">
                          <Calendar className="h-3 w-3 mr-1" /> {notice.createdAt}
                       </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right px-8" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl hover:bg-blue-50 hover:text-blue-600 border-slate-200" onClick={(e) => handleOpenEdit(e, notice)}>
                      <Pencil className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl hover:bg-red-50 hover:text-red-600 border-slate-200" onClick={(e) => handleDelete(e, notice.id)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* --- FIXED VIEW MODAL --- */}
      <Dialog open={!!viewingNotice} onOpenChange={() => setViewingNotice(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
          {/* Accessibility fix: Added DialogHeader with Title and Description */}
          <DialogHeader className="sr-only">
            <DialogTitle>{viewingNotice?.title || "Notice Details"}</DialogTitle>
            <DialogDescription>Full description of the departmental notice.</DialogDescription>
          </DialogHeader>

          {viewingNotice?.imageUrl && (
            <div className="relative h-72 w-full bg-slate-900 border-b-4 border-primary">
              <Image src={viewingNotice.imageUrl} alt="" fill className="object-contain p-4" />
            </div>
          )}
          <div className="p-10 space-y-4 bg-white">
            <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase italic tracking-widest">Official Post</span>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{viewingNotice?.title}</h2>
            <div className="pt-6 border-t border-slate-100">
               <p className="text-slate-600 leading-relaxed font-medium italic whitespace-pre-wrap">{viewingNotice?.content}</p>
            </div>
            <div className="pt-8 flex justify-between items-center text-slate-400">
               <div className="flex items-center text-xs font-bold uppercase tracking-widest">
                  <Calendar className="h-4 w-4 mr-2" /> {viewingNotice?.createdAt}
               </div>
               <Button onClick={() => setViewingNotice(null)} className="rounded-xl px-10 font-bold">DISMISS</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- FIXED ADD / EDIT FORM MODAL --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-xl p-10 rounded-[2.5rem] border-none shadow-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase leading-none">
              {editingNotice ? "Modify" : "New"} Post
            </DialogTitle>
            <DialogDescription className="italic font-medium text-slate-400">Update or create a new notice for the department.</DialogDescription>
          </DialogHeader>
          
          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notice Title" className="h-14 bg-slate-50 border-none rounded-2xl font-bold text-lg" required />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Description</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} placeholder="Full Details..." className="bg-slate-50 border-none rounded-2xl font-medium italic p-4" required />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Featured Image</Label>
              {imageUrl ? (
                <div className="relative h-48 w-full rounded-3xl border-4 border-slate-50 overflow-hidden group">
                  <Image src={imageUrl} alt="" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button type="button" variant="destructive" size="icon" className="h-12 w-12 rounded-full shadow-2xl" onClick={() => setImageUrl("")}>
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              ) : (
                <CldUploadWidget 
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={(result: CloudinaryUploadWidgetResults) => {
                    if (result.info && typeof result.info !== "string") {
                      setImageUrl(result.info.secure_url);
                    }
                  }}
                >
                  {({ open }) => (
                    <div 
                      className="w-full h-32 border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-primary/20 transition-all cursor-pointer group"
                      onClick={() => open()}
                    >
                      <div className="p-3 bg-white rounded-full shadow-md text-slate-400 group-hover:text-primary transition-colors">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Click to Upload</span>
                    </div>
                  )}
                </CldUploadWidget>
              )}
            </div>

            <Button type="submit" className="w-full h-16 rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 uppercase tracking-tighter">
              {editingNotice ? "Update" : "Publish"} Announcement
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}