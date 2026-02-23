"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface Resource {
  title: string;
  url: string;
  type: string;
}

interface Course {
  _id: string;
  name: string;
  code: string;
  teacherName: string;
  teacherId: string;
  credit: string;
  semester: string;
  imageUrl: string;
  resources: Resource[];
}

export default function TeacherDashboardPage() {
  const { data: session, status } = useSession();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const teacherId = (session?.user as any)?.id;
  const token = (session?.user as any)?.accessToken;

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!teacherId || !token) return;

    const fetchCourses = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data: Course[] = await res.json();

        // filter courses by teacher
        const myCourses = data.filter(
          (course) => course.teacherId === teacherId
        );

        setCourses(myCourses);
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [status, teacherId, token, API_URL]);

  const totalCourses = useMemo(() => courses.length, [courses]);

  // session loading
  if (status === "loading" || loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* ===== TOP SECTION ===== */}
      <section className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
        <h1 className="text-3xl font-black">
          Welcome,{" "}
          <span className="text-blue-400">
            {session?.user?.name || "Teacher"}
          </span>
        </h1>

        <p className="mt-3 text-slate-400 font-medium">
          You are teaching{" "}
          <span className="text-white font-bold">
            {totalCourses}
          </span>{" "}
          course(s).
        </p>
      </section>

      {/* ===== COURSE TABLE ===== */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            My Courses
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Credit</TableHead>
                <TableHead>Resources</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {courses.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8"
                  >
                    No courses found
                  </TableCell>
                </TableRow>
              )}

              {courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>
                    <img
                      src={course.imageUrl}
                      alt={course.name}
                      className="h-12 w-20 rounded-lg object-cover"
                    />
                  </TableCell>

                  <TableCell className="font-bold">
                    {course.name}
                  </TableCell>

                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.semester}</TableCell>
                  <TableCell>{course.credit}</TableCell>
                  <TableCell>
                    {course.resources?.length || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}