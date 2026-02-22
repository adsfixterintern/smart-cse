"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useUser } from "@/context/UserContext"
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ClipboardCheck,
  BookOpen,
  TrendingUp,
  Clock,
  Users,
  Loader2,
  GraduationCap
} from "lucide-react"
import { motion } from "framer-motion"

export default function TeacherDashboardPage() {
  const { data: session } = useSession()
  const { user } = useUser()

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.email) return

    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/teacher/dashboard-overview?email=${session?.user?.email}`,
          {
            headers: {
              Authorization: `Bearer ${(session as any)?.user?.accessToken || ""}`,
            },
          }
        )
        const result = await res.json()
        setData(result)
      } catch (err) {
        console.error("Teacher dashboard load failed", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  const statConfig = [
    {
      title: "My Courses",
      value: data?.stats?.courses,
      icon: BookOpen,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Students",
      value: data?.stats?.students,
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Attendance Taken",
      value: data?.stats?.attendance,
      icon: ClipboardCheck,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Pending Tasks",
      value: data?.stats?.pendingTasks,
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ]

  return (
    <div className="space-y-8 p-2 md:p-4">

      {/* Welcome */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl"
      >
        <div className="relative z-10 md:max-w-xl">
          <h1 className="text-3xl font-black md:text-4xl">
            Welcome,{" "}
            <span className="text-blue-400">
              {user?.name?.split(" ")[0] || "Teacher"}
            </span>
          </h1>
          <p className="mt-3 text-slate-400 font-medium">
            You have {data?.stats?.pendingTasks || 0} tasks to review today.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6">
              <Link href="/teacher/courses">My Courses</Link>
            </Button>
            <Button
              variant="outline"
              className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 rounded-xl"
            >
              View Routine
            </Button>
          </div>
        </div>

        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 hidden lg:block">
          <GraduationCap size={240} className="translate-x-10 translate-y-10" />
        </div>
      </motion.section>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statConfig.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={cn("rounded-2xl p-4", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase text-muted-foreground">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-black">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Courses */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            My Active Courses
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.courses?.map((course: any, i: number) => (
            <Card key={i} className="border-none shadow-sm group">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold group-hover:text-primary">
                      {course.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {course.code}
                    </p>
                  </div>
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="text-[10px] font-bold bg-primary/5">
                      {course.semester}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex justify-between mb-2 text-xs font-bold">
                  <span className="text-muted-foreground">
                    Course Completion
                  </span>
                  <span className="text-primary">
                    {course.progress || 0}%
                  </span>
                </div>
                <Progress value={course.progress || 0} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}