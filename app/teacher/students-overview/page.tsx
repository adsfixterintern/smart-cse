"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface StudentOverview {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  batch: string;
  semester: string;
  avgResult: number;
  avgAttendance: number;
}

export default function StudentOverviewPage() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<StudentOverview[]>([]);
  const [loading, setLoading] = useState(true);

  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ---------------- FETCH DATA ----------------
  const fetchStudents = async () => {
    try {
      const token = (session?.user as any)?.accessToken;
      if (!token) return;

      setLoading(true);

      const params = new URLSearchParams();
      if (batch) params.append("batch", batch);
      if (semester) params.append("semester", semester);

      const res = await fetch(
        `${API_URL}/student-overview?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Failed to load student overview", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [session, batch, semester]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* ---------------- HEADER ---------------- */}
      <div>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase underline decoration-primary decoration-4 underline-offset-8">
          Student Overview
        </h1>
        <p className="text-slate-500 font-bold italic text-xs uppercase tracking-widest mt-4">
          Result & Attendance Summary
        </p>
      </div>

      {/* ---------------- FILTERS ---------------- */}
      <div className="flex flex-wrap gap-4">
        <Select value={batch} onValueChange={setBatch}>
          <SelectTrigger className="w-40 font-bold">
            <SelectValue placeholder="Select Batch" />
          </SelectTrigger>
          <SelectContent>
            {["1", "2", "3", "4", "5"].map((b) => (
              <SelectItem key={b} value={b}>
                Batch {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={semester} onValueChange={setSemester}>
          <SelectTrigger className="w-40 font-bold">
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            {["1","2","3","4","5","6","7","8"].map((s) => (
              <SelectItem key={s} value={s}>
                Semester {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ---------------- TABLE ---------------- */}
      <Card className="rounded-3xl shadow-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-900">
                <TableHead className="text-center text-white">#</TableHead>
                <TableHead className="text-center text-white">Name</TableHead>
                <TableHead className="text-center text-white">Student ID</TableHead>
                <TableHead className="text-center text-white">Batch</TableHead>
                <TableHead className="text-center text-white">Semester</TableHead>
                <TableHead className="text-center text-white">
                  Avg Result
                </TableHead>
                <TableHead className="text-center text-white">
                  Avg Attendance
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No students found
                  </TableCell>
                </TableRow>
              )}

              {students.map((s, i) => (
                <TableRow key={s._id} className="hover:bg-muted/40">
                  <TableCell className="text-center">{i + 1}</TableCell>
                  <TableCell className="text-center font-bold">
                    {s.name}
                  </TableCell>
                  <TableCell className="text-center">{s.studentId}</TableCell>
                  <TableCell className="text-center">{s.batch}</TableCell>
                  <TableCell className="text-center">{s.semester}</TableCell>
                  <TableCell className="text-center font-bold text-green-600">
                    {s.avgResult}
                  </TableCell>
                  <TableCell className="text-center font-bold text-blue-600">
                    {s.avgAttendance}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}