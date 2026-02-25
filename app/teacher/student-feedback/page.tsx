"use client";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Star, Trash2 } from "lucide-react";

interface Feedback {
  _id: string;
  courseName: string;
  courseId: string;
  comment: string;
  rating: number;
  createdAt: string;
}

export default function StudentFeedback() {
  const { data: session } = useSession();
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = (session?.user as any)?.accessToken;

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!token) return;

    const fetchFeedback = async () => {
      try {
        const res = await fetch(`${API_URL}/feedback`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return setFeedbackList([]);

        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data.data || data.feedback || [];

        setFeedbackList(list);
      } catch {
        setFeedbackList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [token]);

  /* ================= HELPER ================= */
  const truncateComment = (text: string) => {
    const words = text.split(" ");
    if (words.length <= 3) return text;
    return words.slice(0, 3).join(" ") + "...";
  };

  if (loading) {
    return (
      <div className="p-10 text-center font-bold text-muted-foreground">
        Loading feedback...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase underline decoration-primary decoration-4 underline-offset-8 text-center md:text-left">
        Student Feedback
      </h1>

      {/* ================= DESKTOP TABLE ================= */}
      <Card className="hidden md:block rounded-[2.5rem] overflow-hidden shadow-2xl px-5">
        <Table>
          <TableHeader className="bg-slate-900 ">
            <TableRow>
              <TableHead className="text-white text-center uppercase">
                Course
              </TableHead>
              <TableHead className="text-white uppercase text-center">
                Rating
              </TableHead>
              <TableHead className="text-white uppercase text-center">
                Comment
              </TableHead>
              <TableHead className="text-white uppercase text-right text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {feedbackList.map((fb) => (
              <TableRow key={fb._id}>
                <TableCell className="font-bold text-primary">
                  {fb.courseName}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        className={
                          index < Number(fb.rating)
                            ? "fill-yellow-500 stroke-yellow-500"
                            : "stroke-yellow-500"
                        }
                      />
                    ))}
                    <span className="ml-2 font-bold text-sm">
                      ({fb.rating})
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="">
                    <span className="text-sm text-muted-foreground">
                      {truncateComment(fb.comment)}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right flex items-center justify-end gap-4">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setSelectedFeedback(fb)}
                  >
                    <Eye size={16} className="text-primary" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="md:hidden space-y-4">
        {feedbackList.map((fb) => (
          <Card key={fb._id} className="p-3 rounded-2xl shadow-lg ">
            <div className="font-bold text-primary">{fb.courseName}</div>

            <div className="flex items-center gap-1 text-yellow-500">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={16}
                  className={
                    index < Number(fb.rating)
                      ? "fill-yellow-500 stroke-yellow-500"
                      : "stroke-yellow-500"
                  }
                />
              ))}
              <span className="ml-2 text-sm font-semibold">({fb.rating})</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {truncateComment(fb.comment)}
              </span>
            </div>
            <Button
              size="icon"
              variant="outline"
              className=" w-full text-primary"
              onClick={() => setSelectedFeedback(fb)}
            >
              <Eye size={16} className="mr-1" />
              View
            </Button>
          </Card>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h2 className="text-xl font-bold">Feedback Details</h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Course Name:</strong> {selectedFeedback.courseName}
              </p>
              <p>
                <strong>Course ID:</strong> {selectedFeedback.courseId}
              </p>
              <div className="flex items-center gap-1 text-yellow-500">
                <p>
                  <strong className="text-black">Rating:</strong>
                </p>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    className={
                      index < Number(selectedFeedback.rating)
                        ? "fill-yellow-500 stroke-yellow-500"
                        : "stroke-yellow-500"
                    }
                  />
                ))}
                <span className="ml-2 font-bold text-sm">
                  ({selectedFeedback.rating})
                </span>
              </div>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedFeedback.createdAt).toLocaleString()}
              </p>
              <p className="pt-2">
                <strong>Comment:</strong>
                <br />
                {selectedFeedback.comment}
              </p>
            </div>

            <Button
              className="w-full"
              onClick={() => setSelectedFeedback(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
