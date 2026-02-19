"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Star, Trash2, MessageSquare } from "lucide-react";

interface Feedback {
  id: string;
  studentName: string;
  course: string;
  rating: number;
  message: string;
  date: string;
}

const sampleFeedback: Feedback[] = [
  {
    id: "1",
    studentName: "Ayesha Rahman",
    course: "Computer Networks",
    rating: 5,
    message: "Excellent course structure and teaching method.",
    date: "18 Feb 2026",
  },
  {
    id: "2",
    studentName: "Tanvir Hasan",
    course: "Data Structures",
    rating: 4,
    message: "Very informative but needs more practical sessions.",
    date: "17 Feb 2026",
  },
];

export default function StudentFeedback() {
  const [feedbackList, setFeedbackList] = useState(sampleFeedback);
  const [search, setSearch] = useState("");

  const filteredFeedback = useMemo(() => {
    return feedbackList.filter(
      (f) =>
        f.studentName.toLowerCase().includes(search.toLowerCase()) ||
        f.course.toLowerCase().includes(search.toLowerCase()),
    );
  }, [feedbackList, search]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase underline decoration-primary decoration-4 underline-offset-8">
          Student Feedback
        </h1>
      </div>

      {/* Search */}
      <Card className="p-6 rounded-[2.5rem] border shadow-sm bg-white">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by Student or Course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-bold"
          />
        </div>
      </Card>

      {/* Feedback Content */}
      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-slate-900">
              <TableRow>
                <TableHead className="text-white font-bold py-6 italic uppercase">
                  Student
                </TableHead>
                <TableHead className="text-white font-bold py-6 italic uppercase">
                  Course
                </TableHead>
                <TableHead className="text-white font-bold py-6 italic uppercase">
                  Rating
                </TableHead>
                <TableHead className="text-white font-bold py-6 italic uppercase">
                  Feedback
                </TableHead>
                <TableHead className="text-white font-bold py-6 italic uppercase text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredFeedback.map((fb) => (
                <TableRow
                  key={fb.id}
                  className="hover:bg-slate-50 transition-all"
                >
                  <TableCell className="font-black text-primary">
                    {fb.studentName}
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {fb.date}
                    </p>
                  </TableCell>

                  <TableCell className="font-bold">{fb.course}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 font-black text-yellow-500">
                      <Star size={16} fill="currentColor" />
                      {fb.rating}.0
                    </div>
                  </TableCell>

                  <TableCell className="max-w-xs text-sm text-slate-600">
                    {fb.message}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-xl text-red-600"
                      onClick={() =>
                        setFeedbackList(
                          feedbackList.filter((f) => f.id !== fb.id),
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ===== MOBILE CARD VIEW ===== */}
        <div className="md:hidden p-4 space-y-4">
          {filteredFeedback.map((fb) => (
            <div
              key={fb.id}
              className="bg-slate-50 rounded-2xl p-5 space-y-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-black text-primary text-lg">
                    {fb.studentName}
                  </p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {fb.date}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl text-red-600"
                  onClick={() =>
                    setFeedbackList(feedbackList.filter((f) => f.id !== fb.id))
                  }
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                  Course
                </p>
                <p className="font-bold">{fb.course}</p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                  Rating
                </p>
                <div className="flex items-center gap-2 font-black text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  {fb.rating}.0
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                  Feedback
                </p>
                <p className="text-sm text-slate-600">{fb.message}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
