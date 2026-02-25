"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Clock, User, CalendarDays, Plus, Trash2, BadgeInfo, Loader2, Save, Pencil, X, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface Routine {
  name: string;
  _id: string;
  semester: string;
  courseName: string;
  teacherName: string;
  teacherId: string;
  startTime: string;
  day: string;
}

interface Course {
  name: string;
  _id: string;
  courseName: string;
  teacherName: string;
  teacherId: string;
  semester: string;
}

export default function RoutineManagement() {
  const { data: session } = useSession();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isFetchingCourses, setIsFetchingCourses] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  
  // Form States
  const [semester, setSemester] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("10");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Generate Minutes (00 to 55 by 5 mins)
  const minutesOptions = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  const fetchRoutines = async () => {
    const token = (session?.user as any)?.accessToken;
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/routines`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setRoutines(await res.json());
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      if (!semester) return;
      setIsFetchingCourses(true);
      try {
        const res = await fetch(`${API_URL}/courses/${semester}`, {
          headers: { Authorization: `Bearer ${(session?.user as any)?.accessToken}` },
        });
        if (res.ok) setCourses(await res.json());
      } catch (error) { console.error(error); }
      finally { setIsFetchingCourses(false); }
    };
    fetchCourses();
  }, [semester, session]);

  useEffect(() => { fetchRoutines(); }, [session]);

  // --- OPEN MODAL FOR ADD ---
  const openAddModal = () => {
    setEditingRoutine(null);
    resetFormFields();
    setIsModalOpen(true);
  };

  // --- OPEN MODAL FOR EDIT ---
  const openEditModal = (routine: Routine) => {
    setEditingRoutine(routine);
    setSemester(routine.semester);
    setDay(routine.day);
    const [time, p] = routine.startTime.split(" ");
    const [h, m] = time.split(":");
    setHour(h);
    setMinute(m);
    setPeriod(p);
    setIsModalOpen(true);
  };

  const resetFormFields = () => {
    setSemester("");
    setSelectedCourse(null);
    setDay("");
    setHour("10");
    setMinute("00");
    setPeriod("AM");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse && !editingRoutine) return toast.error("Please select a course");

    const startTime = `${hour}:${minute} ${period}`;
    const routineData = {
      semester,
      courseName: selectedCourse ? (selectedCourse.name || selectedCourse.courseName) : editingRoutine?.courseName,
      teacherName: selectedCourse ? selectedCourse.teacherName : editingRoutine?.teacherName,
      teacherId: selectedCourse ? selectedCourse.teacherId : editingRoutine?.teacherId,
      startTime,
      day,
    };

    const method = editingRoutine ? "PATCH" : "POST";
    const url = editingRoutine ? `${API_URL}/routines/${editingRoutine._id}` : `${API_URL}/routines`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session?.user as any)?.accessToken}`,
        },
        body: JSON.stringify(routineData),
      });

      if (response.ok) {
        toast.success(editingRoutine ? "Updated successfully" : "Added successfully");
        fetchRoutines();
        setIsModalOpen(false);
      }
    } catch (error) { toast.error("Action failed"); }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete this slot?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete"
    });

    if (result.isConfirmed) {
      const res = await fetch(`${API_URL}/routines/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${(session?.user as any)?.accessToken}` }
      });
      if (res.ok) {
        setRoutines(prev => prev.filter(r => r._id !== id));
        toast.success("Deleted");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase flex items-center gap-3">
            <Calendar className="text-blue-600 h-10 w-10" /> Class <span className="text-blue-600">Routine</span>
          </h1>
          <p className="text-slate-400 font-bold italic text-xs uppercase tracking-widest mt-1">Academic Schedule Management</p>
        </div>
        <Button onClick={openAddModal} className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-95">
          <Plus className="mr-2 h-6 w-6 stroke-[3px]" /> ADD NEW SLOT
        </Button>
      </div>

      {/* Table Section */}
      <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-900">
            <TableRow className="hover:bg-slate-900 border-none">
              <TableHead className="text-white font-black italic uppercase py-6 pl-8">Time</TableHead>
              <TableHead className="text-white font-black italic uppercase">Day</TableHead>
              <TableHead className="text-white font-black italic uppercase">Course Info</TableHead>
              <TableHead className="text-white font-black italic uppercase">Instructor</TableHead>
              <TableHead className="text-white font-black italic uppercase text-center">Semester</TableHead>
              <TableHead className="text-white font-black italic uppercase text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routines.map((routine) => (
              <TableRow key={routine._id} className="hover:bg-blue-50/50 transition-colors border-slate-50">
                <TableCell className="font-black text-blue-600 text-xl pl-8">{routine.startTime}</TableCell>
                <TableCell className="font-bold text-slate-500 italic">{routine.day}</TableCell>
                <TableCell className="font-black text-slate-800 uppercase tracking-tight">{routine?.courseName}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-slate-700">{routine.teacherName}</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase">ID: {routine.teacherId}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase italic">Sem {routine.semester}</span>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(routine)} className="h-10 w-10 text-blue-500 hover:bg-blue-100 rounded-full transition-all">
                      <Pencil size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(routine._id)} className="h-10 w-10 text-rose-500 hover:bg-rose-100 rounded-full transition-all">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {routines.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-slate-300 font-bold italic uppercase tracking-widest">No scheduled data found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* --- FORM MODAL (ADD & UPDATE) --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg p-10 rounded-[3rem] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
              {editingRoutine ? "Update Slot" : "Add New Slot"}
            </DialogTitle>
            <DialogDescription className="font-bold text-slate-400 italic">
              Please fill in the course details and timing.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Semester</Label>
                <Select onValueChange={setSemester} value={semester}>
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3", "4", "5", "6", "7", "8"].map(sem => (
                      <SelectItem key={sem} value={sem}>{sem} Semester</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Day</Label>
                <Select onValueChange={setDay} value={day}>
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold">
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Select Course</Label>
              <Select 
                key={`course-select-${semester}`}
                disabled={!semester || isFetchingCourses} 
                onValueChange={(val) => setSelectedCourse(courses.find(c => c._id === val) || null)}
              >
                <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold">
                  {isFetchingCourses ? <Loader2 className="animate-spin h-4 w-4" /> : <SelectValue placeholder={editingRoutine ? `Current: ${editingRoutine.courseName}` : "Choose Course"} />}
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course._id} value={course._id}>{course?.name || course.courseName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(selectedCourse || editingRoutine) && (
              <div className="p-5 bg-blue-50 rounded-[2rem] border-2 border-dashed border-blue-200 flex items-center gap-4 animate-in zoom-in-95">
                <div className="bg-white p-3 rounded-2xl shadow-sm text-blue-600"><User size={20}/></div>
                <div>
                  <p className="text-[9px] font-black uppercase text-blue-400 italic leading-none mb-1">Assigned Instructor</p>
                  <h4 className="font-bold text-slate-800 leading-none">{selectedCourse?.teacherName || editingRoutine?.teacherName}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">ID: {selectedCourse?.teacherId || editingRoutine?.teacherId}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Start Time (Hour : Min : AM/PM)</Label>
              <div className="grid grid-cols-3 gap-3">
                <Select value={hour} onValueChange={setHour}>
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold italic"><SelectValue /></SelectTrigger>
                  <SelectContent>{["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={minute} onValueChange={setMinute}>
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold italic"><SelectValue /></SelectTrigger>
                  <SelectContent>{minutesOptions.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold italic"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="AM">AM</SelectItem><SelectItem value="PM">PM</SelectItem></SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full h-16 rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-xl uppercase tracking-tighter shadow-2xl shadow-blue-200 transition-all active:scale-95 flex items-center gap-2">
              <Save size={22} /> {editingRoutine ? "Update Schedule" : "Save Schedule"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}