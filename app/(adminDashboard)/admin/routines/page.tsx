"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Plus, Trash2, Loader2, Save, Pencil, Calendar, MapPin, Clock } from "lucide-react";
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
  _id: string;
  semester: string;
  courseName: string;
  teacherName: string;
  teacherId: string;
  startTime: string;
  day: string;
  room: string;
}

interface Course {
  _id: string;
  name?: string;
  courseName?: string;
  teacherName: string;
  teacherId: string;
  semester: string;
}

interface Classroom {
  name: string;
  _id: string;
}

export default function RoutineManagement() {
  const { data: session } = useSession();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isFetchingCourses, setIsFetchingCourses] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  
  const [semester, setSemester] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [day, setDay] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [hour, setHour] = useState("10");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  const token = (session?.user as any)?.accessToken;

  const minutesOptions = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  const fetchData = async () => {
    if (!token) return;
    try {
      const [routRes, roomRes] = await Promise.all([
        fetch(`${API_URL}/routines`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/classrooms`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (routRes.ok) setRoutines(await routRes.json());
      if (roomRes.ok) setClassrooms(await roomRes.json());
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchData(); }, [session, token]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!semester || !token) return;
      setIsFetchingCourses(true);
      try {
        const res = await fetch(`${API_URL}/courses/${semester}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setCourses(await res.json());
      } catch (error) { console.error(error); }
      finally { setIsFetchingCourses(false); }
    };
    fetchCourses();
  }, [semester, token]);

  const resetFormFields = () => {
    setSemester("");
    setSelectedCourse(null);
    setDay("");
    setSelectedRoom("");
    setHour("10");
    setMinute("00");
    setPeriod("AM");
  };

  const openAddModal = () => {
    setEditingRoutine(null);
    resetFormFields();
    setIsModalOpen(true);
  };

  const openEditModal = (routine: Routine) => {
    setEditingRoutine(routine);
    setSemester(routine.semester);
    setDay(routine.day);
    setSelectedRoom(routine.room || "");
    const [time, p] = routine.startTime.split(" ");
    const [h, m] = time.split(":");
    setHour(h);
    setMinute(m);
    setPeriod(p);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentCourseName = selectedCourse ? (selectedCourse.name || selectedCourse.courseName) : editingRoutine?.courseName;
    
    if (!currentCourseName) return toast.error("Select a course");
    if (!day || !selectedRoom) return toast.error("Day and Room are required");

    const startTime = `${hour}:${minute} ${period}`;
    
    // --- CONFLICT CHECKS ---

    // ১. একই দিনে একই কোর্স দুবার অ্যাড হওয়া বন্ধ করা (New Logic)
    const sameCourseToday = routines.find(r => 
        r.day === day && 
        r.courseName === currentCourseName && 
        r._id !== editingRoutine?._id
    );
    if (sameCourseToday) {
        return toast.error(`Duplicate Course: "${currentCourseName}" is already scheduled on ${day}.`);
    }

    // ২. একই দিনে, একই সময়ে, একই রুমে অন্য ক্লাস থাকা বন্ধ করা
    const roomConflict = routines.find(r => 
        r.day === day && 
        r.startTime === startTime && 
        r.room === selectedRoom && 
        r._id !== editingRoutine?._id
    );
    if (roomConflict) {
        return toast.error(`Room Conflict: ${selectedRoom} is already busy at ${startTime} on ${day}.`);
    }

    const routineData = {
      semester,
      courseName: currentCourseName,
      teacherName: selectedCourse ? selectedCourse.teacherName : editingRoutine?.teacherName,
      teacherId: selectedCourse ? selectedCourse.teacherId : editingRoutine?.teacherId,
      startTime,
      day,
      room: selectedRoom
    };

    const method = editingRoutine ? "PATCH" : "POST";
    const url = editingRoutine ? `${API_URL}/routines/${editingRoutine._id}` : `${API_URL}/routines`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(routineData),
      });

      if (response.ok) {
        toast.success(editingRoutine ? "Schedule Updated" : "Schedule Added");
        fetchData();
        setIsModalOpen(false);
      } else {
        const errData = await response.json();
        toast.error(errData.message || "Action failed");
      }
    } catch (error) { toast.error("Action failed"); }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete this slot?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Yes, delete it"
    });

    if (result.isConfirmed) {
      const res = await fetch(`${API_URL}/routines/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setRoutines(prev => prev.filter(r => r._id !== id));
        toast.success("Deleted successfully");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8">
      {/* Header */}
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

      {/* Table */}
      <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-900">
            <TableRow className="hover:bg-slate-900 border-none">
              <TableHead className="text-white font-black italic uppercase py-6 pl-8">Time & Day</TableHead>
              <TableHead className="text-white font-black italic uppercase">Course & Room</TableHead>
              <TableHead className="text-white font-black italic uppercase">Instructor</TableHead>
              <TableHead className="text-white font-black italic uppercase text-center">Semester</TableHead>
              <TableHead className="text-white font-black italic uppercase text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routines.map((routine) => (
              <TableRow key={routine._id} className="hover:bg-blue-50/50 transition-colors border-slate-50">
                <TableCell className="pl-8">
                  <div className="font-black text-blue-600 text-xl leading-none">{routine.startTime}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase italic mt-1">{routine.day}</div>
                </TableCell>
                <TableCell>
                   <div className="font-black text-slate-800 uppercase tracking-tight">{routine.courseName}</div>
                   <div className="flex items-center gap-1 text-blue-500 font-bold text-[10px] uppercase">
                     <MapPin size={10} /> {routine.room || "No Room Set"}
                   </div>
                </TableCell>
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
          </TableBody>
        </Table>
      </Card>

      {/* Modal Form */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg p-10 rounded-[3rem] border-none shadow-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
              {editingRoutine ? "Update Slot" : "Add New Slot"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-5 mt-4">
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
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Course</Label>
                <Select 
                  disabled={!semester || isFetchingCourses} 
                  onValueChange={(val) => setSelectedCourse(courses.find(c => c._id === val) || null)}
                >
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold">
                    {isFetchingCourses ? <Loader2 className="animate-spin h-4 w-4" /> : <SelectValue placeholder={editingRoutine?.courseName || "Select Course"} />}
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course._id} value={course._id}>{course?.name || course.courseName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Class Room / Lab</Label>
                <Select onValueChange={setSelectedRoom} value={selectedRoom}>
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold">
                    <SelectValue placeholder="Select Room" />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms.map(room => (
                      <SelectItem key={room._id} value={room.name}>{room?.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>

            {(selectedCourse || editingRoutine) && (
              <div className="p-4 bg-blue-50 rounded-[2rem] border-2 border-dashed border-blue-200 flex items-center gap-4">
                <div className="bg-white p-2 rounded-xl text-blue-600"><User size={18}/></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-none">{selectedCourse?.teacherName || editingRoutine?.teacherName}</h4>
                  <p className="text-[9px] font-black text-slate-400 uppercase mt-1">ID: {selectedCourse?.teacherId || editingRoutine?.teacherId}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Time Selection</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select value={hour} onValueChange={setHour}>
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>{["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={minute} onValueChange={setMinute}>
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>{minutesOptions.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="AM">AM</SelectItem><SelectItem value="PM">PM</SelectItem></SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full h-16 rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-xl uppercase tracking-tighter shadow-2xl shadow-blue-200 mt-4 transition-all flex items-center gap-2">
              <Save size={22} /> {editingRoutine ? "Update" : "Save"} Schedule
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}