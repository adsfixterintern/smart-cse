"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ClipboardCheck,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Filter,
  BarChart3,
} from "lucide-react"
import { FadeIn } from "@/components/ui/motion"

const courseAttendance = [
  { course: "Data Structures", code: "CSE-301", present: 12, absent: 2, total: 14, percentage: 86, status: "good" },
  { course: "Algorithm Design", code: "CSE-303", present: 11, absent: 3, total: 14, percentage: 79, status: "warning" },
  { course: "Database Systems", code: "CSE-305", present: 10, absent: 4, total: 14, percentage: 71, status: "danger" },
  { course: "Software Engineering", code: "CSE-307", present: 13, absent: 1, total: 14, percentage: 93, status: "excellent" },
  { course: "Computer Networks", code: "CSE-309", present: 11, absent: 3, total: 14, percentage: 79, status: "warning" },
  { course: "Operating Systems", code: "CSE-311", present: 12, absent: 2, total: 14, percentage: 86, status: "good" },
]

const recentAttendance = [
  { date: "Jan 25, 2026", day: "Saturday", classes: [
    { subject: "Data Structures", time: "09:00 AM", status: "present" },
    { subject: "Algorithm Design", time: "11:00 AM", status: "present" },
    { subject: "Database Lab", time: "02:00 PM", status: "present" },
  ]},
  { date: "Jan 23, 2026", day: "Thursday", classes: [
    { subject: "Algorithm Design", time: "09:00 AM", status: "absent" },
    { subject: "Database Systems", time: "11:00 AM", status: "present" },
  ]},
  { date: "Jan 22, 2026", day: "Wednesday", classes: [
    { subject: "Database Systems", time: "09:00 AM", status: "present" },
    { subject: "Operating Systems", time: "11:00 AM", status: "present" },
    { subject: "OS Lab", time: "02:00 PM", status: "late" },
  ]},
  { date: "Jan 21, 2026", day: "Tuesday", classes: [
    { subject: "Computer Networks", time: "10:00 AM", status: "present" },
    { subject: "Networks Lab", time: "02:00 PM", status: "present" },
  ]},
]

const monthlyStats = [
  { month: "October", percentage: 92 },
  { month: "November", percentage: 88 },
  { month: "December", percentage: 85 },
  { month: "January", percentage: 87 },
]

export default function AttendancePage() {
  const [selectedCourse, setSelectedCourse] = useState("all")

  const overallAttendance = Math.round(
    courseAttendance.reduce((sum, c) => sum + c.percentage, 0) / courseAttendance.length
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Attendance</h1>
            <p className="text-muted-foreground">Track and manage your class attendance records</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </section>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Attendance</p>
                <p className="text-3xl font-bold text-foreground">{overallAttendance}%</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <ClipboardCheck className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={overallAttendance} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Classes Attended</p>
                <p className="text-3xl font-bold text-foreground">69</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-4 flex items-center gap-1 text-sm text-accent">
              <TrendingUp className="h-4 w-4" />
              +5 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Classes Missed</p>
                <p className="text-3xl font-bold text-foreground">15</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <p className="mt-4 flex items-center gap-1 text-sm text-destructive">
              <TrendingDown className="h-4 w-4" />
              -2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">At Risk Courses</p>
                <p className="text-3xl font-bold text-foreground">1</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-5/10">
                <AlertTriangle className="h-6 w-6 text-chart-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Below 75% threshold</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">By Course</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Course-wise Attendance
                  </CardTitle>
                  <CardDescription>Your attendance breakdown for each course</CardDescription>
                </div>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courseAttendance.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.course}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {courseAttendance.map((course) => (
                  <div key={course.code} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{course.course}</span>
                          <Badge
                            variant={
                              course.status === "excellent" ? "default" :
                              course.status === "good" ? "secondary" :
                              course.status === "warning" ? "outline" : "destructive"
                            }
                          >
                            {course.status === "excellent" ? "Excellent" :
                             course.status === "good" ? "Good" :
                             course.status === "warning" ? "Warning" : "At Risk"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{course.code}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{course.percentage}%</div>
                        <div className="text-sm text-muted-foreground">
                          {course.present}/{course.total} classes
                        </div>
                      </div>
                    </div>
                    <Progress
                      value={course.percentage}
                      className={`h-3 ${
                        course.status === "danger" ? "[&>div]:bg-destructive" :
                        course.status === "warning" ? "[&>div]:bg-chart-5" : ""
                      }`}
                    />
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1 text-accent">
                        <CheckCircle2 className="h-4 w-4" />
                        {course.present} Present
                      </span>
                      <span className="flex items-center gap-1 text-destructive">
                        <XCircle className="h-4 w-4" />
                        {course.absent} Absent
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attendance Warning */}
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Attendance Warning</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your attendance in <strong>Database Systems (CSE-305)</strong> is at 71%, which is below
                    the required 75% threshold. Please ensure regular attendance to avoid academic penalties.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Attendance History
              </CardTitle>
              <CardDescription>Your attendance records for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentAttendance.map((day, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{day.date}</span>
                      <Badge variant="outline">{day.day}</Badge>
                    </div>
                    <div className="ml-6 space-y-2">
                      {day.classes.map((cls, clsIndex) => (
                        <div
                          key={clsIndex}
                          className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              cls.status === "present" ? "bg-accent/10" :
                              cls.status === "late" ? "bg-chart-5/10" : "bg-destructive/10"
                            }`}>
                              {cls.status === "present" ? (
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                              ) : cls.status === "late" ? (
                                <Clock className="h-4 w-4 text-chart-5" />
                              ) : (
                                <XCircle className="h-4 w-4 text-destructive" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{cls.subject}</div>
                              <div className="text-sm text-muted-foreground">{cls.time}</div>
                            </div>
                          </div>
                          <Badge
                            variant={
                              cls.status === "present" ? "default" :
                              cls.status === "late" ? "secondary" : "destructive"
                            }
                          >
                            {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Monthly Attendance Trend</CardTitle>
                <CardDescription>Your attendance percentage over the past months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyStats.map((stat) => (
                    <div key={stat.month} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{stat.month}</span>
                        <span className="text-sm text-muted-foreground">{stat.percentage}%</span>
                      </div>
                      <Progress value={stat.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Attendance Summary</CardTitle>
                <CardDescription>Overall statistics for this semester</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Classes</TableCell>
                      <TableCell className="text-right font-medium">84</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Classes Attended</TableCell>
                      <TableCell className="text-right font-medium">69</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Classes Missed</TableCell>
                      <TableCell className="text-right font-medium">15</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Late Arrivals</TableCell>
                      <TableCell className="text-right font-medium">4</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Attendance Rate</TableCell>
                      <TableCell className="text-right font-medium text-accent">{overallAttendance}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Required Rate</TableCell>
                      <TableCell className="text-right font-medium">75%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Course Performance Comparison */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Course Attendance Comparison</CardTitle>
              <CardDescription>Visual comparison of attendance across all courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseAttendance
                  .sort((a, b) => b.percentage - a.percentage)
                  .map((course, index) => (
                    <div key={course.code} className="flex items-center gap-4">
                      <div className="w-8 text-center text-sm font-medium text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">{course.course}</span>
                          <span className={`text-sm font-semibold ${
                            course.percentage >= 85 ? "text-accent" :
                            course.percentage >= 75 ? "text-chart-5" : "text-destructive"
                          }`}>
                            {course.percentage}%
                          </span>
                        </div>
                        <div className="h-4 w-full rounded-full bg-muted">
                          <div
                            className={`h-4 rounded-full ${
                              course.percentage >= 85 ? "bg-accent" :
                              course.percentage >= 75 ? "bg-chart-5" : "bg-destructive"
                            }`}
                            style={{ width: `${course.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
