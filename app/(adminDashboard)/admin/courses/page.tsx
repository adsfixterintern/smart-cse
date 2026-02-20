"use client";
import Swal from "sweetalert2";
import React, { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  User,
  BookOpen,
  Upload,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

type Course = {
  _id: string;
  name: string;
  code: string;
  credit: string;
  semester: string;
  teacherId: string;
  teacherName: string;
  courseImage?: string;
};

export default function FacultyManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    teacherName: "",
    teacherId: "",
    credit: "",
    semester: "",
  });

  // Fetch Courses
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5001/courses", {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchCourses();
    }
  }, [session]);

  const handleOpenAdd = () => {
    setEditingCourse(null); // Clear editing state
    setFormData({
      courseName: "",
      courseCode: "",
      teacherName: "",
      teacherId: "",
      credit: "",
      semester: "",
    });
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  // const handleFormSubmit = async () => {
  //   const isEdit = !!editingCourse;
  //   const url = isEdit
  //     ? `http://localhost:5001/courses/${editingCourse._id}`
  //     : "http://localhost:5001/courses";

  //   // Multer এর জন্য FormData ব্যবহার করতে হবে
  //   const uploadData = new FormData();
  //   uploadData.append("name", formData.courseName);
  //   uploadData.append("code", formData.courseCode);
  //   uploadData.append("teacherName", formData.teacherName);
  //   uploadData.append("teacherId", formData.teacherId);
  //   uploadData.append("credit", formData.credit);
  //   uploadData.append("semester", formData.semester);
  //   if (selectedFile) {
  //     uploadData.append("courseImage", selectedFile);
  //   }

  //   try {
  //     const response = await fetch(url, {
  //       method: isEdit ? "PATCH" : "POST",
  //       headers: {
  //         // Note: FormData পাঠালে Content-Type হেডার ম্যানুয়ালি সেট করবেন না
  //         Authorization: `Bearer ${session?.user?.accessToken}`,
  //       },
  //       body: uploadData,
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       toast.success(isEdit ? "Course Updated! " : "Course Added! ✅");
  //       setIsFormOpen(false);
  //       fetchCourses(); // Refresh list
  //     } else {
  //       toast.error(data.message || "Failed to save course");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Something went wrong");
  //   }
  // };

  const handleFormSubmit = async () => {
    const isEdit = !!editingCourse;

    const url = isEdit
      ? `http://localhost:5001/courses/${editingCourse._id}`
      : "http://localhost:5001/courses";

    try {
      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          name: formData.courseName,
          code: formData.courseCode,
          teacherName: formData.teacherName,
          teacherId: formData.teacherId,
          credit: formData.credit,
          semester: formData.semester,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          isEdit
            ? "Course Updated Successfully "
            : "Course Added Successfully ",
        );
        setIsFormOpen(false);
        fetchCourses(); // refresh list
      } else {
        alert(data.message || "Failed to save course");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This course will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5001/courses/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        });

        if (res.ok) {
          setCourses((prev) => prev.filter((course) => course._id !== id));
          Swal.fire("Deleted!", "Course has been deleted.", "success");
        }
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase underline decoration-primary decoration-4 underline-offset-8">
            Faculty
          </h1>
          <p className="text-slate-500 font-medium italic text-sm pt-2 px-1">
            Manage department courses & teachers
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-primary h-14 px-8 rounded-2xl font-black text-lg shadow-xl shadow-primary/30"
        >
          <Plus className="mr-2 h-6 w-6 stroke-[3px]" /> ADD COURSE
        </Button>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-[2.5rem] border shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by Course Name or Code..."
            className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Course Table */}
      <div className="bg-white rounded-[2.5rem] border overflow-hidden">
        <table className="w-full text-left">
          <TableBody>
            {courses
              ?.filter((c) =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((course) => (
                <TableRow
                  onClick={() => setViewingCourse(course)}
                  key={course._id}
                  className="cursor-pointer hover:bg-slate-50 transition-all group"
                >
                  <TableCell className="px-8 py-6">
                    <div className="h-14 w-14 border-2 border-slate-100 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden">
                      {course.courseImage ? (
                        <img
                          src={`http://localhost:5001/${course.courseImage}`}
                          alt=""
                          className="object-cover h-full w-full"
                        />
                      ) : (
                        <BookOpen className="h-6 w-6 text-slate-300" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="py-6 w-full">
                    <p className="font-black text-slate-800 text-lg uppercase tracking-tight italic group-hover:text-primary transition-colors">
                      {course.name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 italic">
                      Code: {course.code} • Credit: {course.credit} • Semester:{" "}
                      {course.semester}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 italic">
                      Teacher: {course.teacherName} ({course.teacherId})
                    </p>
                  </TableCell>

                  <TableCell
                    className="text-right px-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl"
                        onClick={() => {
                          setEditingCourse(course);
                          setFormData({
                            courseName: course.name,
                            courseCode: course.code,
                            teacherName: course.teacherName,
                            teacherId: course.teacherId,
                            credit: course.credit,
                            semester: course.semester,
                          });
                          setIsFormOpen(true);
                        }}
                      >
                        <Pencil size={16} className="text-blue-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl"
                        onClick={(e) => handleDelete(e, course._id)}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </table>
      </div>

      {/* --- MODAL: VIEW COURSE --- */}
      <Dialog
        open={!!viewingCourse}
        onOpenChange={() => setViewingCourse(null)}
      >
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-slate-900 p-10 flex flex-col items-center text-center space-y-4">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              {viewingCourse?.name}
            </h2>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] italic">
              {viewingCourse?.code}
            </p>
          </div>
          <div className="p-8 space-y-4 bg-white font-bold italic">
            <div className="grid grid-cols-2 gap-4 text-slate-700">
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Credit</p>
                {viewingCourse?.credit}
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Semester</p>
                {viewingCourse?.semester}
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-slate-400 uppercase">Teacher</p>
                {viewingCourse?.teacherName}
              </div>
            </div>
            <Button
              onClick={() => setViewingCourse(null)}
              className="w-full mt-4 rounded-xl font-black uppercase"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- MODAL: ADD / EDIT COURSE --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-xl p-10 rounded-[2.5rem] border-none shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase">
              {editingCourse ? "Update Course" : "New Course"}
            </DialogTitle>
          </DialogHeader>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Course Name
              </Label>
              <Input
                value={formData.courseName}
                onChange={(e) =>
                  setFormData({ ...formData, courseName: e.target.value })
                }
                className="h-12 bg-slate-50 border-none rounded-xl font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Course Code
                </Label>
                <Input
                  value={formData.courseCode}
                  onChange={(e) =>
                    setFormData({ ...formData, courseCode: e.target.value })
                  }
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Credit
                </Label>
                <Input
                  type="number"
                  value={formData.credit}
                  onChange={(e) =>
                    setFormData({ ...formData, credit: e.target.value })
                  }
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Teacher Name
                </Label>
                <Input
                  value={formData.teacherName}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherName: e.target.value })
                  }
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Teacher ID
                </Label>
                <Input
                  value={formData.teacherId}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherId: e.target.value })
                  }
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Semester
              </Label>
              <select
                value={formData.semester}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
                className="h-12 bg-slate-50 border-none rounded-xl font-bold w-full px-3"
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload Section */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Course Thumbnail
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="course-image"
                  accept="image/*"
                />
                <label
                  htmlFor="course-image"
                  className="flex items-center justify-center gap-2 w-full h-12 bg-slate-100 rounded-xl cursor-pointer hover:bg-slate-200 transition-all font-bold text-slate-600"
                >
                  <Upload size={18} />{" "}
                  {selectedFile ? selectedFile.name : "Upload Image"}
                </label>
              </div>
            </div>

            <Button
              onClick={handleFormSubmit}
              className="w-full h-16 rounded-2xl font-black text-xl uppercase tracking-tighter shadow-2xl shadow-primary/30 mt-4 active:scale-95 transition-all"
            >
              {editingCourse ? "Save Changes" : "Add Course"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
