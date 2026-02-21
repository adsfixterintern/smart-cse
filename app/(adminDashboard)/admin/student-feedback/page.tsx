"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { Search, Star, Trash2 } from "lucide-react";

interface Feedback {
  _id: string;
  studentName: string;
  course: string;
  rating: number;
  message: string;
  createdAt: string;
}

export default function StudentFeedback() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH FEEDBACK ================= */
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/feedback`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        // 🔥 SAFETY: array না হলে empty array
        const list = Array.isArray(data)
          ? data
          : data.data || data.feedback || [];

        setFeedbackList(list);
      } catch (error) {
        console.error("Fetch error:", error);
        setFeedbackList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  /* ================= DELETE FEEDBACK ================= */
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/feedback/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      setFeedbackList((prev) => prev.filter((f) => f._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  /* ================= SEARCH FILTER ================= */
  const filteredFeedback = useMemo(() => {
    if (!Array.isArray(feedbackList)) return [];

    return feedbackList.filter(
      (f) =>
        f.studentName?.toLowerCase().includes(search.toLowerCase()) ||
        f.course?.toLowerCase().includes(search.toLowerCase())
    );
  }, [feedbackList, search]);

  if (loading) {
    return (
      <div className="p-10 text-center font-bold text-muted-foreground">
        Loading feedback...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* ================= HEADER ================= */}
      <h1 className="text-4xl font-black italic tracking-tighter uppercase underline decoration-primary decoration-4 underline-offset-8">
        Student Feedback
      </h1>

      {/* ================= SEARCH ================= */}


      {/* ================= TABLE ================= */}
      <Card className="rounded-[2.5rem] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-slate-900">
            <TableRow>
              <TableHead className="text-white font-bold uppercase">
                Student
              </TableHead>
              <TableHead className="text-white font-bold uppercase">
                Course
              </TableHead>
              <TableHead className="text-white font-bold uppercase">
                Rating
              </TableHead>
              <TableHead className="text-white font-bold uppercase">
                Feedback
              </TableHead>
              <TableHead className="text-white font-bold uppercase text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredFeedback.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  No feedback found
                </TableCell>
              </TableRow>
            )}

            {filteredFeedback.map((fb) => (
              <TableRow key={fb._id} className="hover:bg-muted/40">
                <TableCell className="font-bold text-primary">
                  {fb.studentName}
                  <p className="text-xs text-muted-foreground">
                    {new Date(fb.createdAt).toDateString()}
                  </p>
                </TableCell>

                <TableCell className="font-semibold">
                  {fb.course}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-yellow-500 font-bold">
                    <Star size={16} fill="currentColor" />
                    {fb.rating}.0
                  </div>
                </TableCell>

                <TableCell className="max-w-xs text-sm text-muted-foreground">
                  {fb.message}
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="outline"
                    className="text-red-600"
                    onClick={() => handleDelete(fb._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}