"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Award,
  Download,
  Loader2,
  Search,
  Info,
  Eye,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import toast from "react-hot-toast";

export default function ResultsPage() {
  const { data: session } = useSession();
  const [results, setResults] = useState<any[]>([]); // Default empty array
  const [transcript, setTranscript] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = (session as any)?.user?.accessToken;
        const [transcriptRes, resultsRes] = await Promise.all([
          fetch(`${apiUrl}/my-transcript`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${apiUrl}/my-results`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const transcriptData = await transcriptRes.json();
        const resultsData = await resultsRes.json();

        setTranscript(transcriptData);

        // --- এপিআই এরর ফিক্সিং লজিক ---
        // যদি resultsData সরাসরি অ্যারে না হয়ে অবজেক্টের ভেতর থাকে (যেমন: resultsData.data বা resultsData.results)
        if (Array.isArray(resultsData)) {
          setResults(resultsData);
        } else if (resultsData && Array.isArray(resultsData.results)) {
          setResults(resultsData.results);
        } else if (resultsData && Array.isArray(resultsData.data)) {
          setResults(resultsData.data);
        } else {
          setResults([]); // ডাটা না থাকলে খালি অ্যারে
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to fetch academic records");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchData();
  }, [session, apiUrl]);

  // ফিল্টার লজিক - এখন এটি নিরাপদ (Safe)
  const filteredResults = useMemo(() => {
    const safeResults = Array.isArray(results) ? results : [];
    
    return safeResults.filter((res) => {
      const matchesSemester =
        selectedSemester === "all" || String(res.semester) === String(selectedSemester);
      
      const name = res.courseName?.toLowerCase() || "";
      const code = res.courseCode?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();

      const matchesSearch = name.includes(query) || code.includes(query);
      return matchesSemester && matchesSearch;
    });
  }, [results, selectedSemester, searchQuery]);

  // সেমিস্টার ড্রপডাউন জেনারেট করা
  const semesters = useMemo(() => {
    const safeResults = Array.isArray(results) ? results : [];
    return Array.from(new Set(safeResults.map((r) => r.semester))).sort(
      (a, b) => Number(a) - Number(b)
    );
  }, [results]);

  if (loading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header & Search Section */}
      <FadeIn>
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                Academic <span className="text-blue-600 text-glow">Records</span>
              </h1>
              <p className="text-slate-400 font-bold italic text-[10px] uppercase tracking-widest mt-3 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" /> Verified Student Portal
              </p>
            </div>
            <Button className="h-14 px-8 rounded-2xl font-black italic uppercase bg-slate-900 hover:bg-blue-600 text-white transition-all shadow-lg">
              <Download className="mr-2 h-5 w-5" /> Export PDF
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
              <Input
                placeholder="Search Course Name or Code..."
                className="h-16 pl-14 rounded-2xl border-none bg-slate-50 font-bold italic text-slate-700 focus-visible:ring-blue-500 shadow-inner text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-full md:w-64 h-16 rounded-2xl border-none bg-slate-50 font-black italic uppercase text-[11px] shadow-inner">
                <SelectValue placeholder="All Semesters" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl font-bold italic border-none shadow-xl">
                <SelectItem value="all">Total Archive</SelectItem>
                {semesters.map((sem) => (
                  <SelectItem key={sem} value={String(sem)}>
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FadeIn>

      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-slate-900 text-white p-8 relative overflow-hidden group">
          <Award className="absolute right-[-10%] bottom-[-10%] w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-700" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Current CGPA</p>
          <h2 className="text-6xl font-black italic mt-3 tracking-tighter">
            {transcript?.cgpa?.toFixed(2) || "0.00"}
          </h2>
          <div className="mt-4 flex items-center gap-2 text-emerald-400 font-bold italic text-[10px]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Updated Recently
          </div>
        </Card>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8 border border-slate-50 flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Total Credits</p>
          <h2 className="text-5xl font-black italic mt-3 text-blue-600 tracking-tighter">
            {transcript?.totalCredits || "0"}
          </h2>
          <p className="text-[10px] font-bold italic text-slate-300 uppercase mt-1">Completed Units</p>
        </Card>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-blue-600 text-white p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Filtered Results</p>
          <h2 className="text-5xl font-black italic mt-3 tracking-tighter">
            {filteredResults.length} <span className="text-xl">Subjects</span>
          </h2>
        </Card>
      </div>

      {/* Main Table Container */}
      <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white border border-slate-50">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-none">
                <TableHead className="font-black italic uppercase text-[10px] text-slate-400 p-8">Subject & Code</TableHead>
                <TableHead className="font-black italic uppercase text-[10px] text-slate-400 text-center">Semester</TableHead>
                <TableHead className="font-black italic uppercase text-[10px] text-slate-400 text-center">Grade</TableHead>
                <TableHead className="font-black italic uppercase text-[10px] text-slate-400 text-center">Point</TableHead>
                <TableHead className="font-black italic uppercase text-[10px] text-slate-400 text-right pr-12">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-50">
              {filteredResults.length > 0 ? (
                filteredResults.map((res) => (
                  <TableRow key={res._id} className="hover:bg-blue-50/30 transition-all group">
                    <TableCell className="p-8">
                      <div className="font-black italic text-slate-800 uppercase text-base tracking-tight group-hover:text-blue-600 transition-colors">
                        {res.courseName}
                      </div>
                      <Badge className="bg-slate-100 text-slate-500 border-none font-bold text-[9px] mt-2 uppercase tracking-widest px-3">
                        {res.courseCode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-black italic text-slate-400 text-xs">SEM {res.semester}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto font-black italic text-xl shadow-lg">
                        {res.grade}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-black italic text-xl text-blue-600">
                      {res.point.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right pr-10">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button size="icon" variant="ghost" className="rounded-2xl hover:bg-blue-600 hover:text-white transition-all group/btn shadow-sm bg-slate-50">
                            <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-md rounded-l-[3.5rem] border-none p-12 overflow-y-auto">
                          <SheetHeader className="space-y-6">
                            <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center">
                              <BookOpen className="w-10 h-10 text-blue-600" />
                            </div>
                            <div>
                              <SheetTitle className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                                Performance <span className="text-blue-600">Analysis</span>
                              </SheetTitle>
                              <SheetDescription className="font-bold italic text-slate-400 uppercase text-[10px] tracking-widest mt-2">
                                Course ID: {res.courseCode} • {res.courseName}
                              </SheetDescription>
                            </div>
                          </SheetHeader>
                          
                          <div className="mt-12 space-y-10">
                            {/* Detailed Mark Breakdown */}
                            {[
                              { label: "Class Tests (CT)", val: res.breakdown?.ct, max: 10, color: "bg-blue-500" },
                              { label: "Midterm Exam", val: res.breakdown?.mid, max: 20, color: "bg-indigo-600" },
                              { label: "Final Examination", val: res.breakdown?.finalMark, max: 40, color: "bg-slate-900" },
                              { label: "Attendance", val: res.breakdown?.attendance, max: 5, color: "bg-emerald-500" },
                              { label: "Assignments & Presentation", val: (res.breakdown?.assignment || 0) + (res.breakdown?.presentation || 0), max: 10, color: "bg-amber-500" },
                            ].map((item) => (
                              <div key={item.label} className="space-y-4">
                                <div className="flex justify-between items-end">
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                    {item.label}
                                  </span>
                                  <span className="text-base font-black italic text-slate-900">
                                    {item.val || 0} <span className="text-slate-300">/ {item.max}</span>
                                  </span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${item.color} rounded-full transition-all duration-[1500ms]`}
                                    style={{ width: `${((item.val || 0) / item.max) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-40 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <div className="p-8 bg-slate-50 rounded-full">
                        <Search className="w-20 h-20 text-slate-400" />
                      </div>
                      <p className="font-black italic uppercase text-lg tracking-widest text-slate-500">
                        No Matching Records
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      <p className="text-center text-slate-300 font-black italic uppercase text-[9px] tracking-[0.4em] py-10">
        Computer Science & Engineering • BSEC Barishal
      </p>
    </div>
  );
}