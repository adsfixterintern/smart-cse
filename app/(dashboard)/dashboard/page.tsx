"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Calendar,
  ClipboardCheck,
  BookOpen,
  TrendingUp,
  Clock,
  Bell,
  FileText,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { FadeIn, CountUp } from "@/components/ui/motion"

const stats = [
  {
    title: "Attendance Rate",
    value: "87%",
    change: "+2.5%",
    trend: "up",
    icon: ClipboardCheck,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Current CGPA",
    value: "3.62",
    change: "+0.15",
    trend: "up",
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Courses Enrolled",
    value: "6",
    change: "This Semester",
    trend: "neutral",
    icon: BookOpen,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    title: "Pending Tasks",
    value: "4",
    change: "Due this week",
    trend: "neutral",
    icon: Clock,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
]

const todaySchedule = [
  { time: "09:00 AM", subject: "Data Structures", room: "Room 201", type: "Lecture" },
  { time: "11:00 AM", subject: "Algorithm Design", room: "Room 305", type: "Lecture" },
  { time: "02:00 PM", subject: "Database Lab", room: "Lab 102", type: "Lab" },
  { time: "04:00 PM", subject: "Software Engineering", room: "Room 401", type: "Lecture" },
]

const recentNotifications = [
  { title: "Assignment Deadline Extended", description: "Data Structures assignment deadline extended to Jan 28", type: "info", time: "2h ago" },
  { title: "New Resource Uploaded", description: "Algorithm Design lecture notes for Week 3", type: "success", time: "5h ago" },
  { title: "Attendance Warning", description: "Your attendance in Database is below 75%", type: "warning", time: "1d ago" },
]

const upcomingDeadlines = [
  { title: "Data Structures Assignment", course: "CSE-301", dueDate: "Jan 28", progress: 65 },
  { title: "Algorithm Quiz", course: "CSE-303", dueDate: "Jan 30", progress: 0 },
  { title: "Database Project Report", course: "CSE-305", dueDate: "Feb 5", progress: 30 },
]

const quickActions = [
  { label: "View Schedule", href: "/schedule", icon: Calendar },
  { label: "Check Attendance", href: "/attendance", icon: ClipboardCheck },
  { label: "Browse Resources", href: "/resources", icon: FileText },
  { label: "View Grades", href: "/grades", icon: TrendingUp },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section with Image */}
      <FadeIn>
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 p-6 md:p-8">
          <div className="absolute right-0 top-0 hidden h-full w-1/3 md:block">
            <Image
              src="/images/dashboard-preview.jpg"
              alt="Dashboard"
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
          </div>
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Welcome back, Mosaraf!
              </h1>
              <p className="text-muted-foreground">
                Here is what is happening with your academic progress today.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild className="hover-lift bg-transparent">
                <Link href="/schedule">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Schedule
                </Link>
              </Button>
              <Button asChild className="hover-lift">
                <Link href="/resources">
                  <FileText className="mr-2 h-4 w-4" />
                  Browse Resources
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Stats Grid */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <FadeIn key={stat.title} delay={index * 0.1}>
            <Card className="border-border/50 hover-lift transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} transition-transform hover:scale-110`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <Badge variant={stat.trend === "up" ? "default" : "secondary"} className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.title}</div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today Schedule
              </CardTitle>
              <CardDescription>Your classes for today</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/schedule">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySchedule.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-lg border border-border/50 bg-muted/30 p-4"
                >
                  <div className="text-center">
                    <div className="text-sm font-semibold text-foreground">{item.time}</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{item.subject}</div>
                    <div className="text-sm text-muted-foreground">{item.room}</div>
                  </div>
                  <Badge variant={item.type === "Lab" ? "default" : "secondary"}>
                    {item.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>Recent updates</CardDescription>
            </div>
            <Badge variant="secondary">3 New</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification, index) => (
                <div key={index} className="flex gap-3">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    notification.type === "success" ? "bg-accent/10" :
                    notification.type === "warning" ? "bg-chart-5/10" : "bg-primary/10"
                  }`}>
                    {notification.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    ) : notification.type === "warning" ? (
                      <AlertCircle className="h-4 w-4 text-chart-5" />
                    ) : (
                      <Bell className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{notification.title}</div>
                    <div className="text-xs text-muted-foreground">{notification.description}</div>
                    <div className="mt-1 text-xs text-muted-foreground/70">{notification.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Deadlines */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Assignments and tasks due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">{deadline.title}</div>
                      <div className="text-sm text-muted-foreground">{deadline.course}</div>
                    </div>
                    <Badge variant="outline">Due {deadline.dueDate}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={deadline.progress} className="h-2 flex-1" />
                    <span className="text-sm text-muted-foreground">{deadline.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto flex-col gap-2 p-4 bg-transparent"
                  asChild
                >
                  <Link href={action.href}>
                    <action.icon className="h-5 w-5 text-primary" />
                    <span className="text-xs">{action.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress Section */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Course Progress
          </CardTitle>
          <CardDescription>Your progress in current semester courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Data Structures", code: "CSE-301", progress: 72, instructor: "Dr. Rahman" },
              { name: "Algorithm Design", code: "CSE-303", progress: 65, instructor: "Prof. Karim" },
              { name: "Database Systems", code: "CSE-305", progress: 58, instructor: "Dr. Fatema" },
              { name: "Software Engineering", code: "CSE-307", progress: 80, instructor: "Prof. Mamun" },
              { name: "Computer Networks", code: "CSE-309", progress: 45, instructor: "Dr. Hasan" },
              { name: "Operating Systems", code: "CSE-311", progress: 55, instructor: "Prof. Akter" },
            ].map((course, index) => (
              <div key={index} className="rounded-lg border border-border/50 p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="font-medium text-foreground">{course.name}</div>
                    <div className="text-sm text-muted-foreground">{course.code}</div>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-xs text-primary">
                      {course.instructor.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your recent actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Submitted Assignment", detail: "Data Structures - Linked List Implementation", time: "Today, 10:30 AM" },
              { action: "Downloaded Resource", detail: "Algorithm Design - Lecture Notes Week 2", time: "Yesterday, 3:45 PM" },
              { action: "Marked Present", detail: "Database Lab - Automatic attendance", time: "Yesterday, 2:00 PM" },
              { action: "Viewed Grade", detail: "Software Engineering - Quiz 1 Result", time: "2 days ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 rounded-lg border border-border/50 bg-muted/30 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{activity.action}</div>
                  <div className="text-sm text-muted-foreground">{activity.detail}</div>
                </div>
                <div className="text-sm text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
