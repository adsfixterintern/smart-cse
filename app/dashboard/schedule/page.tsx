"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUser } from "@/context/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Loader2,
  Maximize2,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import toast from "react-hot-toast";

export default function DynamicSchedulePage() {
  const { data: session } = useSession();
  const { user } = useUser();

  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const token = (session as any)?.user?.accessToken;
        const res = await fetch(`${apiUrl}/routines`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRoutines(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Failed to load routine data");
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchRoutines();
  }, [session, apiUrl]);

  // স্টুডেন্টের সেমিস্টার (Number) অনুযায়ী রুটিন ম্যাচ করা
  const studentRoutine = routines.find(
    (r) => String(r.semester) === String(user?.semester),
  );

  if (loading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto overflow-hidden">
      {/* Header Section */}
      <FadeIn>
        <section className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-slate-900 p-6 md:p-12 text-white">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none px-4 py-1 rounded-full font-black italic uppercase text-[10px] whitespace-nowrap">
                  Official Schedule
                </Badge>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 whitespace-nowrap">
                  <Clock className="w-3 h-3" /> Updated:{" "}
                  {studentRoutine?.updatedAt
                    ? new Date(studentRoutine.updatedAt).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
                Class <span className="text-blue-500">Routine</span>
              </h1>
              <p className="text-slate-400 font-medium italic mt-4 text-sm md:text-base">
                Showing routine for{" "}
                <span className="text-white underline">
                  {user?.semester || "N/A"}th Semester
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {studentRoutine?.imageUrl && (
                <Button
                  onClick={() => window.open(studentRoutine.imageUrl, "_blank")}
                  className="bg-white text-slate-900 hover:bg-blue-500 hover:text-white rounded-xl md:rounded-2xl font-black italic uppercase px-6 h-12 md:h-14 transition-all text-xs md:text-sm shadow-lg"
                >
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
              )}
            </div>
          </div>
          <div className="absolute right-[-5%] top-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />
        </section>
      </FadeIn>

      {/* Routine Display Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Routine Image (8 Columns on Laptop) */}
        <Card className="lg:col-span-8 border-none shadow-2xl shadow-blue-500/5 rounded-[2rem] bg-white overflow-hidden">
          <CardHeader className="p-6 md:p-8 border-b border-slate-50 flex flex-row items-center justify-between">
            <div className="overflow-hidden">
              <CardTitle className="italic font-black uppercase text-lg md:text-xl text-slate-800 truncate">
                Visual Schedule
              </CardTitle>
              <CardDescription className="italic font-medium text-xs md:text-sm">
                Click to expand
              </CardDescription>
            </div>
            <Maximize2 className="text-slate-300 w-5 h-5 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-4 md:p-6 bg-slate-50/50">
            {studentRoutine ? (
              <div className="relative group cursor-zoom-in rounded-xl md:rounded-[1.5rem] overflow-hidden border-2 md:border-4 border-white shadow-md">
                <img
                  src={studentRoutine.imageUrl}
                  alt="Routine"
                  className="w-full h-auto rounded-lg transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <Button
                    variant="secondary"
                    className="font-black italic uppercase rounded-full text-xs"
                    onClick={() =>
                      window.open(studentRoutine.imageUrl, "_blank")
                    }
                  >
                    <ExternalLink className="w-3 h-3 mr-2" /> View Full
                    Resolution
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <AlertCircle className="w-12 h-12 text-slate-200 mb-4" />
                <h3 className="text-lg font-black italic uppercase text-slate-400">
                  No Routine Found
                </h3>
                <p className="text-xs text-slate-400 italic mt-1">
                  Contact admin for {user?.semester}th semester schedule.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar Info (4 Columns on Laptop) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl rounded-[1.5rem] md:rounded-[2rem] bg-blue-600 text-white p-6 md:p-8">
            <h4 className="font-black italic uppercase text-[10px] mb-6 opacity-80 tracking-[0.2em]">
              Quick Info
            </h4>
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-white/10 pb-3 gap-2">
                <span className="text-[10px] font-bold italic uppercase whitespace-nowrap">
                  Semester
                </span>
                <span className="font-black italic text-sm truncate">
                  {user?.semester || "N/A"}th
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3 gap-2">
                <span className="text-[10px] font-bold italic uppercase whitespace-nowrap">
                  Status
                </span>
                <Badge className="bg-emerald-400 text-slate-900 font-black italic text-[8px] px-2 py-0 border-none">
                  Active
                </Badge>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[10px] font-bold italic uppercase whitespace-nowrap">
                  Format
                </span>
                <span className="font-black italic uppercase text-[10px] text-blue-100 truncate">
                  PNG / JPEG
                </span>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-xl rounded-[1.5rem] md:rounded-[2rem] bg-white p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
              <h4 className="font-black italic uppercase text-slate-400 text-[10px] tracking-[0.2em]">
                Important
              </h4>
            </div>
            <p className="text-[11px] font-medium italic text-slate-500 leading-relaxed break-words">
              Please keep this schedule saved. For any discrepancies in class
              timing, consult your department head immediately.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
