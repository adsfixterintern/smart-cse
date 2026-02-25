// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Calendar,
//   Clock,
//   MapPin,
//   Plus,
//   CheckCircle2,
//   Loader2,
//   User,
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import toast from "react-hot-toast";
// import { useSession } from "next-auth/react";

// // ১. টাইপ ডিফাইন করা (Type safety-র জন্য)
// interface ScheduleItem {
//   _id: string;
//   courseName: string;
//   courseCode: string;
//   roomNumber: string;
//   day: string;
//   startTime: string;
//   duration: string;
//   teacherId: string;
// }

// export default function ClassAssign() {
//   const { data: session } = useSession();
//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [courses, setCourses] = useState<any[]>([]);
//   const [classrooms, setClassrooms] = useState<any[]>([]);
//   const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentTeacherInfo, setCurrentTeacherInfo] = useState<any>(null);

//   const [formData, setFormData] = useState({
//     courseName: "",
//     courseCode: "",
//     roomName: "",
//     date: "",
//     startTime: "",
//     duration: "",
//   });

//   // ২. শুধুমাত্র লগইন করা টিচারের শিডিউল ফেচ করা
//   const fetchSchedules = useCallback(
//     async (teacherId: string) => {
//       if (!session || !teacherId) {
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         const res = await fetch(
//           `${API_URL}/class-assign?teacherId=${teacherId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${(session?.user as any)?.accessToken}`,
//             },
//           },
//         );

//         if (!res.ok) throw new Error("Failed to fetch schedules");

//         const data = await res.json();
//         setSchedules(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Fetch Error:", error);
//         setSchedules([]);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [API_URL, session],
//   );

//   // ৩. ইনিশিয়াল ডাটা (User, Courses, Classrooms) লোড করা
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const userEmail = session?.user?.email;
//         if (!userEmail) {
//           setLoading(false);
//           return;
//         }

//         const token = (session?.user as any)?.accessToken;

//         // ইউজারের বিস্তারিত তথ্য আনা
//         const userRes = await fetch(`${API_URL}/users`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const allUsers = await userRes.json();
//         const teacher = allUsers.find((u: any) => u.email === userEmail);

//         if (teacher) {
//           setCurrentTeacherInfo(teacher);

//           // ওই টিচারের জন্য নির্ধারিত কোর্সগুলো আনা
//           const courseRes = await fetch(`${API_URL}/courses`);
//           const allCourses = await courseRes.json();
//           setCourses(
//             allCourses.filter((c: any) => c.teacherId === teacher.teacherId),
//           );

//           // টিচার আইডি দিয়ে শিডিউল লিস্ট ফিল্টার করা
//           fetchSchedules(teacher.teacherId);
//         } else {
//           setLoading(false);
//         }

//         // ক্লাসরুম লিস্ট আনা
//         const roomRes = await fetch(`${API_URL}/classrooms`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const roomData = await roomRes.json();
//         setClassrooms(roomData);
//       } catch (error) {
//         console.error("Data fetching error:", error);
//         setLoading(false);
//       }
//     };

//     if (session?.user) fetchInitialData();
//   }, [session, API_URL, fetchSchedules]);

//   const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedCourse = courses.find((c: any) => c.name === e.target.value);
//     setFormData({
//       ...formData,
//       courseName: e.target.value,
//       courseCode: selectedCourse ? selectedCourse.code : "",
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // ভ্যালিডেশন চেক
//     if (
//       !formData.courseName ||
//       !formData.roomName ||
//       !formData.date ||
//       !formData.startTime ||
//       !formData.duration
//     ) {
//       toast.error("সবগুলো ঘর সঠিকভাবে পূরণ করুন!");
//       return;
//     }

//     try {
//       const classData = {
//         courseName: formData.courseName,
//         courseCode: formData.courseCode,
//         roomNumber: formData.roomName,
//         day: formData.date,
//         startTime: formData.startTime,
//         duration: formData.duration,
//         teacherId: currentTeacherInfo?.teacherId,
//         teacherName: currentTeacherInfo?.name,
//         createdAt: new Date().toISOString(),
//       };

//       toast.loading("শিডিউল যাচাই ও সেভ করা হচ্ছে...", { id: "assign" });

//       const response = await fetch(`${API_URL}/class-assign`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${(session?.user as any).accessToken}`,
//         },
//         body: JSON.stringify(classData),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         // ব্যাকএন্ড থেকে যদি টাইম কনফ্লিক্ট এরর আসে, তবে এখানে দেখাবে
//         toast.error(result.message || "এই সময়ে রুমটি বুক করা সম্ভব নয়", {
//           id: "assign",
//         });
//         return;
//       }

//       toast.success("সফলভাবে শিডিউল সেট করা হয়েছে!", { id: "assign" });
//       setIsFormOpen(false);
//       fetchSchedules(currentTeacherInfo.teacherId); // টেবিল রিফ্রেশ

//       setFormData({
//         courseName: "",
//         courseCode: "",
//         roomName: "",
//         date: "",
//         startTime: "",
//         duration: "",
//       });
//     } catch (error: any) {
//       toast.error("সার্ভার এরর! আবার চেষ্টা করুন।", { id: "assign" });
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
//       {/* HEADER */}
//       <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border shadow-sm">
//         <div>
//           <h1 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase underline decoration-primary decoration-2 underline-offset-4">
//             Class Management
//           </h1>
//           <p className="text-slate-500 font-bold text-[10px] italic mt-1 uppercase tracking-widest flex items-center gap-2">
//             <User size={12} className="text-primary" /> Instructor:{" "}
//             {currentTeacherInfo?.name || "Loading..."} (
//             {currentTeacherInfo?.teacherId || "N/A"})
//           </p>
//         </div>
//         <Button
//           onClick={() => setIsFormOpen(true)}
//           className="bg-primary h-11 px-6 rounded-xl font-black text-sm text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
//         >
//           <Plus className="mr-2 h-4 w-4 stroke-[3px]" /> ASSIGN CLASS
//         </Button>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-[2rem] border overflow-hidden shadow-sm">
//         <Table>
//           <TableHeader className="bg-slate-900">
//             <TableRow className="hover:bg-transparent border-none">
//               <TableHead className="text-[10px] font-black uppercase text-slate-400 py-5 px-6">
//                 Course
//               </TableHead>
//               <TableHead className="text-[10px] font-black uppercase text-slate-400">
//                 Date & Time
//               </TableHead>
//               <TableHead className="text-[10px] font-black uppercase text-slate-400">
//                 Room Info
//               </TableHead>
//               <TableHead className="text-[10px] font-black uppercase text-slate-400 text-right px-6">
//                 Status
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={4} className="text-center py-20">
//                   <Loader2
//                     className="animate-spin mx-auto mb-2 text-primary"
//                     size={24}
//                   />
//                   <p className="text-slate-400 font-bold italic text-xs uppercase">
//                     Fetching Data...
//                   </p>
//                 </TableCell>
//               </TableRow>
//             ) : schedules.length > 0 ? (
//               schedules.map((item) => (
//                 <TableRow
//                   key={item._id}
//                   className="group hover:bg-slate-50/80 transition-colors border-b last:border-0 font-bold text-xs italic"
//                 >
//                   <TableCell className="px-6 py-5">
//                     <p className="font-black text-slate-800 text-sm uppercase italic tracking-tighter">
//                       {item.courseName}
//                     </p>
//                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
//                       {item.courseCode}
//                     </p>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex flex-col gap-1">
//                       <div className="flex items-center gap-1.5 text-slate-500">
//                         <Calendar size={12} className="text-primary" />{" "}
//                         {item.day}
//                       </div>
//                       <div className="flex items-center gap-1.5 text-slate-500">
//                         <Clock size={12} className="text-primary" />{" "}
//                         {item.startTime}{" "}
//                         {item.duration && `(${item.duration}h)`}
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase italic tracking-tighter">
//                       <MapPin size={10} className="text-primary" />{" "}
//                       {item.roomNumber}
//                     </span>
//                   </TableCell>
//                   <TableCell className="text-right px-6">
//                     <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase italic tracking-widest">
//                       <CheckCircle2 size={10} /> Confirmed
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={4} className="text-center py-20 opacity-30">
//                   <Clock size={40} className="mx-auto mb-2 text-slate-400" />
//                   <p className="text-[10px] font-black uppercase italic tracking-widest text-slate-500">
//                     No schedules assigned yet
//                   </p>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* MODAL FORM */}
//       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
//         <DialogContent className="max-w-2xl p-0 rounded-[2rem] border-none shadow-2xl bg-white overflow-hidden">
//           <div className="bg-slate-900 p-8 text-white">
//             <div className="sr-only">
//               <DialogTitle>Assign Classroom</DialogTitle>
//               <DialogDescription>
//                 Create a new schedule without time overlap
//               </DialogDescription>
//             </div>
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 bg-primary/20 rounded-lg text-primary">
//                 <Calendar size={20} />
//               </div>
//               <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest">
//                 Barisal University CSE
//               </span>
//             </div>
//             <h2 className="text-2xl font-black italic uppercase tracking-tighter">
//               Create Class Schedule
//             </h2>
//           </div>

//           <form onSubmit={handleSubmit} className="p-8 space-y-5">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div className="space-y-1.5">
//                 <Label className="text-[10px] font-black uppercase italic text-slate-400 ml-1">
//                   My Courses
//                 </Label>
//                 <select
//                   value={formData.courseName}
//                   onChange={handleCourseChange}
//                   className="h-12 bg-slate-50 border-none rounded-xl font-bold w-full px-4 italic text-[12px] focus:ring-2 ring-primary/20 appearance-none outline-none"
//                 >
//                   <option value="">Select Course</option>
//                   {courses.map((course: any) => (
//                     <option key={course._id} value={course.name}>
//                       {course.name} ({course.code})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="space-y-1.5">
//                 <Label className="text-[10px] font-black uppercase italic text-slate-400 ml-1">
//                   Course Code
//                 </Label>
//                 <Input
//                   value={formData.courseCode}
//                   readOnly
//                   className="h-12 bg-slate-100 border-none rounded-xl font-bold italic text-slate-500 cursor-not-allowed outline-none"
//                 />
//               </div>

//               <div className="space-y-1.5">
//                 <Label className="text-[10px] font-black uppercase italic text-slate-400 ml-1">
//                   Room Allocation
//                 </Label>
//                 <select
//                   value={formData.roomName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, roomName: e.target.value })
//                   }
//                   className="h-12 bg-slate-50 border-none rounded-xl font-bold w-full px-4 italic text-[12px] appearance-none outline-none"
//                 >
//                   <option value="">Choose Room</option>
//                   {classrooms.map((room: any) => (
//                     <option key={room._id} value={`Room ${room.roomNumber}`}>
//                       Room {room.roomNumber} (Cap: {room.capacity})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="space-y-1.5">
//                 <Label className="text-[10px] font-black uppercase italic text-slate-400 ml-1">
//                   Date
//                 </Label>
//                 <Input
//                   type="date"
//                   value={formData.date}
//                   onChange={(e) =>
//                     setFormData({ ...formData, date: e.target.value })
//                   }
//                   className="h-12 bg-slate-50 border-none rounded-xl font-bold italic outline-none"
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <Label className="text-[10px] font-black uppercase italic text-slate-400 ml-1">
//                   Start Time
//                 </Label>
//                 <Input
//                   type="time"
//                   value={formData.startTime}
//                   onChange={(e) =>
//                     setFormData({ ...formData, startTime: e.target.value })
//                   }
//                   className="h-12 bg-slate-50 border-none rounded-xl font-bold italic outline-none"
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <Label className="text-[10px] font-black uppercase italic text-slate-400 ml-1">
//                   Duration (Hours)
//                 </Label>
//                 <Input
//                   type="number"
//                   step="0.5"
//                   min="0.5"
//                   placeholder="e.g. 1.5"
//                   value={formData.duration}
//                   onChange={(e) =>
//                     setFormData({ ...formData, duration: e.target.value })
//                   }
//                   className="h-12 bg-slate-50 border-none rounded-xl font-bold italic outline-none"
//                 />
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-tighter shadow-xl bg-primary text-white hover:scale-[1.01] transition-all active:scale-95"
//             >
//               CONFIRM AND CHECK AVAILABILITY
//             </Button>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Loader2,
  User,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

// টাইপ ডিফাইন করা
interface ScheduleItem {
  _id: string;
  courseName: string;
  courseCode: string;
  roomNumber: string;
  day: string;
  startTime: string;
  duration: string;
  teacherId: string;
}

export default function ClassAssign() {
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTeacherInfo, setCurrentTeacherInfo] = useState<any>(null);

  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    roomName: "",
    date: "",
    startTime: "",
    duration: "",
  });

  // ১. সময়কে ১২ ঘণ্টার ফরম্যাটে (AM/PM) রূপান্তর করার ফাংশন
  const formatTime12h = (time24: string) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    let h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  };

  // ২. শিডিউল ফেচ করা (শুধুমাত্র আজ এবং ভবিষ্যতের ক্লাস)
  const fetchSchedules = useCallback(
    async (teacherId: string) => {
      if (!session || !teacherId) return;
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/class-assign?teacherId=${teacherId}`,
          {
            headers: {
              Authorization: `Bearer ${(session?.user as any)?.accessToken}`,
            },
          },
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          // বর্তমান তারিখ বের করা (YYYY-MM-DD format)
          const today = new Date().toISOString().split("T")[0];
          // ফিল্টার: যে ক্লাসগুলোর তারিখ আজকের সমান বা বড়
          const upcomingSchedules = data.filter((item) => item.day >= today);

          // তারিখ অনুযায়ী সর্ট করা (কাছের ক্লাস আগে দেখাবে)
          upcomingSchedules.sort(
            (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime(),
          );

          setSchedules(upcomingSchedules);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    },
    [API_URL, session],
  );

  // ৩. ইনিশিয়াল ডাটা লোড করা
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userEmail = session?.user?.email;
        if (!userEmail) return;
        const token = (session?.user as any)?.accessToken;

        const userRes = await fetch(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allUsers = await userRes.json();
        const teacher = allUsers.find((u: any) => u.email === userEmail);

        if (teacher) {
          setCurrentTeacherInfo(teacher);
          const courseRes = await fetch(`${API_URL}/courses`);
          const allCourses = await courseRes.json();
          setCourses(
            allCourses.filter((c: any) => c.teacherId === teacher.teacherId),
          );
          fetchSchedules(teacher.teacherId);
        }

        const roomRes = await fetch(`${API_URL}/classrooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const roomData = await roomRes.json();
        setClassrooms(roomData);
      } catch (error) {
        console.error("Initial load error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (session?.user) fetchInitialData();
  }, [session, API_URL, fetchSchedules]);

  // ৪. এডিট হ্যান্ডলার
  const handleEditClick = (item: ScheduleItem) => {
    setEditingId(item._id);
    setFormData({
      courseName: item.courseName,
      courseCode: item.courseCode,
      roomName: item.roomNumber,
      date: item.day,
      startTime: item.startTime,
      duration: item.duration,
    });
    setIsFormOpen(true);
  };

  // ৫. ডিলিট হ্যান্ডলার (SweetAlert2)
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this class schedule!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0F172A", // slate-900
      cancelButtonColor: "#ef4444", // red-500
      confirmButtonText: "Yes, delete it!",
      background: "#ffffff",
      customClass: {
        popup: "rounded-[2rem]",
        confirmButton: "rounded-xl px-6 py-3 font-bold",
        cancelButton: "rounded-xl px-6 py-3 font-bold",
      },
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/class-assign/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${(session?.user as any).accessToken}`,
          },
        });
        if (res.ok) {
          Swal.fire({
            title: "Deleted!",
            text: "Your schedule has been removed.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          fetchSchedules(currentTeacherInfo.teacherId);
        }
      } catch (error) {
        toast.error("Delete failed! Please try again.");
      }
    }
  };

  // ৬. সাবমিট হ্যান্ডলার (POST & PATCH)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.courseName ||
      !formData.roomName ||
      !formData.date ||
      !formData.startTime ||
      !formData.duration
    ) {
      toast.error("Please fill all fields!");
      return;
    }

    const classData = {
      courseName: formData.courseName,
      courseCode: formData.courseCode,
      roomNumber: formData.roomName,
      day: formData.date,
      startTime: formData.startTime,
      duration: formData.duration,
      teacherId: currentTeacherInfo?.teacherId,
      teacherName: currentTeacherInfo?.name,
    };

    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `${API_URL}/class-assign/${editingId}`
      : `${API_URL}/class-assign`;

    try {
      toast.loading(editingId ? "Updating..." : "Verifying & Saving...", {
        id: "action",
      });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session?.user as any).accessToken}`,
        },
        body: JSON.stringify(classData),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(
          result.message || "Conflict! The room is busy at this time.",
          { id: "action" },
        );
        return;
      }

      toast.success(editingId ? "Schedule Updated!" : "Schedule Assigned!", {
        id: "action",
      });
      setIsFormOpen(false);
      setEditingId(null);
      fetchSchedules(currentTeacherInfo.teacherId);
      setFormData({
        courseName: "",
        courseCode: "",
        roomName: "",
        date: "",
        startTime: "",
        duration: "",
      });
    } catch (error) {
      toast.error("Server Error! Try again.", { id: "action" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border shadow-sm">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase underline decoration-primary decoration-2 underline-offset-4">
            Class Management
          </h1>
          <p className="text-slate-500 font-bold text-[10px] italic mt-1 uppercase tracking-widest flex items-center gap-2">
            <User size={12} className="text-primary" /> Instructor:{" "}
            {currentTeacherInfo?.name || "Loading..."}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setIsFormOpen(true);
          }}
          className="bg-primary h-11 px-6 rounded-xl font-black text-sm text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus className="mr-2 h-4 w-4 stroke-[3px]" /> ASSIGN CLASS
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2rem] border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-900">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-[10px] font-black uppercase text-slate-400 py-5 px-6">
                Course
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-slate-400">
                Date & Time
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-slate-400">
                Room Info
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-slate-400 text-right px-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20">
                  <Loader2 className="animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : schedules.length > 0 ? (
              schedules.map((item) => (
                <TableRow
                  key={item._id}
                  className="group hover:bg-slate-50/80 border-b last:border-0 font-bold text-xs italic"
                >
                  <TableCell className="px-6 py-5">
                    <p className="font-black text-slate-800 text-sm uppercase italic tracking-tighter">
                      {item.courseName}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {item.courseCode}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar size={12} className="text-primary" />{" "}
                        {item.day}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock size={12} className="text-primary" />{" "}
                        {formatTime12h(item.startTime)} ({item.duration}h)
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase">
                      <MapPin size={10} className="text-primary" />{" "}
                      {item.roomNumber}
                    </span>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20 opacity-30">
                  <Clock size={40} className="mx-auto mb-2 text-slate-400" />
                  <p className="text-[10px] font-black uppercase italic tracking-widest text-slate-500">
                    No upcoming schedules found
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL FORM */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl p-0 rounded-[2rem] border-none shadow-2xl bg-white overflow-hidden">
          {/* Accessibility Fix for Dialog */}
          <div className="sr-only">
            <DialogTitle>
              {editingId ? "Edit Schedule" : "Assign Classroom"}
            </DialogTitle>
            <DialogDescription>
              Setup your class schedule without time conflicts.
            </DialogDescription>
          </div>

          <div className="bg-slate-900 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <Calendar size={20} />
              </div>
              <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest">
                BU CSE Scheduler
              </span>
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">
              {editingId ? "Update Class Schedule" : "Create Class Schedule"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase italic text-slate-400 ml-1">
                  My Courses
                </Label>
                <select
                  value={formData.courseName}
                  onChange={(e) => {
                    const selected = courses.find(
                      (c) => c.name === e.target.value,
                    );
                    setFormData({
                      ...formData,
                      courseName: e.target.value,
                      courseCode: selected?.code || "",
                    });
                  }}
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold w-full px-4 italic text-[12px] appearance-none outline-none focus:ring-2 ring-primary/20"
                >
                  <option value="">Select Course</option>
                  {courses.map((course: any) => (
                    <option key={course._id} value={course.name}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase italic text-slate-400 ml-1">
                  Room Allocation
                </Label>
                <select
                  value={formData.roomName}
                  onChange={(e) =>
                    setFormData({ ...formData, roomName: e.target.value })
                  }
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold w-full px-4 italic text-[12px] appearance-none outline-none focus:ring-2 ring-primary/20"
                >
                  <option value="">Choose Room</option>
                  {classrooms.map((room: any) => (
                    <option key={room._id} value={room.roomNo}>
                      {room.roomNo} ({room.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase italic text-slate-400 ml-1">
                  Date
                </Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold italic"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase italic text-slate-400 ml-1">
                  Start Time
                </Label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold italic"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-[10px] font-black uppercase italic text-slate-400 ml-1">
                  Duration (Hours)
                </Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold italic"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-tighter shadow-xl bg-primary text-white hover:scale-[1.01] transition-all"
            >
              {editingId
                ? "SAVE CHANGES & VERIFY"
                : "CONFIRM AND CHECK AVAILABILITY"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
