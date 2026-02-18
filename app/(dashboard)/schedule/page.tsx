"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Download,
  Filter,
} from "lucide-react"
import { FadeIn } from "@/components/ui/motion"

const weekDays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]
const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"]

const scheduleData = {
  Saturday: [
    { time: "09:00 AM", subject: "Data Structures", code: "CSE-301", room: "Room 201", instructor: "Dr. Rahman", type: "Lecture", duration: "1.5 hrs" },
    { time: "11:00 AM", subject: "Algorithm Design", code: "CSE-303", room: "Room 305", instructor: "Prof. Karim", type: "Lecture", duration: "1.5 hrs" },
    { time: "02:00 PM", subject: "Database Lab", code: "CSE-305L", room: "Lab 102", instructor: "Dr. Fatema", type: "Lab", duration: "2 hrs" },
  ],
  Sunday: [
    { time: "09:00 AM", subject: "Software Engineering", code: "CSE-307", room: "Room 401", instructor: "Prof. Mamun", type: "Lecture", duration: "1.5 hrs" },
    { time: "11:00 AM", subject: "Computer Networks", code: "CSE-309", room: "Room 203", instructor: "Dr. Hasan", type: "Lecture", duration: "1.5 hrs" },
    { time: "03:00 PM", subject: "Operating Systems", code: "CSE-311", room: "Room 301", instructor: "Prof. Akter", type: "Lecture", duration: "1.5 hrs" },
  ],
  Monday: [
    { time: "09:00 AM", subject: "Data Structures", code: "CSE-301", room: "Room 201", instructor: "Dr. Rahman", type: "Lecture", duration: "1.5 hrs" },
    { time: "02:00 PM", subject: "Algorithm Lab", code: "CSE-303L", room: "Lab 103", instructor: "Prof. Karim", type: "Lab", duration: "2 hrs" },
    { time: "04:00 PM", subject: "Software Engineering", code: "CSE-307", room: "Room 401", instructor: "Prof. Mamun", type: "Lecture", duration: "1.5 hrs" },
  ],
  Tuesday: [
    { time: "10:00 AM", subject: "Computer Networks", code: "CSE-309", room: "Room 203", instructor: "Dr. Hasan", type: "Lecture", duration: "1.5 hrs" },
    { time: "02:00 PM", subject: "Networks Lab", code: "CSE-309L", room: "Lab 104", instructor: "Dr. Hasan", type: "Lab", duration: "2 hrs" },
  ],
  Wednesday: [
    { time: "09:00 AM", subject: "Database Systems", code: "CSE-305", room: "Room 302", instructor: "Dr. Fatema", type: "Lecture", duration: "1.5 hrs" },
    { time: "11:00 AM", subject: "Operating Systems", code: "CSE-311", room: "Room 301", instructor: "Prof. Akter", type: "Lecture", duration: "1.5 hrs" },
    { time: "02:00 PM", subject: "OS Lab", code: "CSE-311L", room: "Lab 101", instructor: "Prof. Akter", type: "Lab", duration: "2 hrs" },
  ],
  Thursday: [
    { time: "09:00 AM", subject: "Algorithm Design", code: "CSE-303", room: "Room 305", instructor: "Prof. Karim", type: "Lecture", duration: "1.5 hrs" },
    { time: "11:00 AM", subject: "Database Systems", code: "CSE-305", room: "Room 302", instructor: "Dr. Fatema", type: "Lecture", duration: "1.5 hrs" },
  ],
}

const upcomingEvents = [
  { title: "Mid-Term Exam", subject: "Data Structures", date: "Feb 15, 2026", time: "10:00 AM", venue: "Exam Hall 1" },
  { title: "Project Presentation", subject: "Software Engineering", date: "Feb 20, 2026", time: "02:00 PM", venue: "Room 401" },
  { title: "Quiz", subject: "Algorithm Design", date: "Feb 22, 2026", time: "09:00 AM", venue: "Room 305" },
  { title: "Lab Viva", subject: "Database Lab", date: "Feb 25, 2026", time: "03:00 PM", venue: "Lab 102" },
]

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState("Saturday")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  return (
    <div className="space-y-8">
      {/* Page Header with Image */}
      <FadeIn>
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 p-6 md:p-8">
          <div className="absolute right-0 top-0 hidden h-full w-1/3 md:block">
            <Image
              src="/images/schedule-calendar.jpg"
              alt="Schedule"
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
          </div>
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">Class Schedule</h1>
              <p className="text-muted-foreground">View and manage your weekly class schedule</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="hover-lift bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export Schedule
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Week Navigation */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">January 2026</div>
              <div className="text-sm text-muted-foreground">Week 4 (Jan 25 - Jan 30)</div>
            </div>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule View */}
      <Tabs defaultValue="weekly" className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="daily">Daily View</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="weekly" className="space-y-6">
          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {weekDays.map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "outline"}
                onClick={() => setSelectedDay(day)}
                className="shrink-0"
              >
                {day}
              </Button>
            ))}
          </div>

          {/* Schedule for Selected Day */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {selectedDay} Schedule
              </CardTitle>
              <CardDescription>
                {scheduleData[selectedDay as keyof typeof scheduleData]?.length || 0} classes scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scheduleData[selectedDay as keyof typeof scheduleData]?.length > 0 ? (
                <div className="space-y-4">
                  {scheduleData[selectedDay as keyof typeof scheduleData].map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-4 rounded-lg border border-border/50 bg-muted/30 p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-primary/10">
                          <Clock className="h-5 w-5 text-primary" />
                          <span className="mt-1 text-xs font-medium text-primary">{item.time}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{item.subject}</span>
                          <Badge variant={item.type === "Lab" ? "default" : "secondary"}>
                            {item.type}
                          </Badge>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">{item.code}</div>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {item.room}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {item.instructor}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {item.duration}
                          </span>
                        </div>
                      </div>
                      <Avatar className="hidden h-10 w-10 sm:flex">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {item.instructor.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No classes scheduled for {selectedDay}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Overview Grid */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
              <CardDescription>Quick view of your entire week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-7 gap-2">
                    <div className="p-2 text-center text-sm font-medium text-muted-foreground">Time</div>
                    {weekDays.map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-foreground">
                        {day.slice(0, 3)}
                      </div>
                    ))}
                  </div>
                  {timeSlots.slice(0, 6).map((time) => (
                    <div key={time} className="grid grid-cols-7 gap-2 border-t border-border/50">
                      <div className="p-2 text-center text-xs text-muted-foreground">{time}</div>
                      {weekDays.map((day) => {
                        const classItem = scheduleData[day as keyof typeof scheduleData]?.find(
                          (c) => c.time === time
                        )
                        return (
                          <div
                            key={`${day}-${time}`}
                            className={`min-h-[60px] rounded p-1 ${
                              classItem ? "bg-primary/10" : "bg-muted/30"
                            }`}
                          >
                            {classItem && (
                              <div className="text-xs">
                                <div className="font-medium text-primary">{classItem.subject.slice(0, 12)}...</div>
                                <div className="text-muted-foreground">{classItem.room}</div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Today - Saturday, January 25, 2026</CardTitle>
                  <CardDescription>3 classes scheduled for today</CardDescription>
                </div>
                <Select defaultValue="today">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="custom">Custom Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-8">
                  {scheduleData.Saturday.map((item, index) => (
                    <div key={index} className="relative pl-10">
                      <div className="absolute left-2 top-1 h-4 w-4 rounded-full border-2 border-primary bg-background" />
                      <Card className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <Badge variant={item.type === "Lab" ? "default" : "secondary"} className="mb-2">
                                {item.type}
                              </Badge>
                              <div className="text-lg font-semibold text-foreground">{item.subject}</div>
                              <div className="text-sm text-muted-foreground">{item.code}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-primary">{item.time}</div>
                              <div className="text-sm text-muted-foreground">{item.duration}</div>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {item.room}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {item.instructor}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Exams, presentations, and other academic events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 rounded-lg border border-border/50 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-chart-5/10">
                        <span className="text-xs font-medium text-chart-5">
                          {event.date.split(" ")[0]}
                        </span>
                        <span className="text-lg font-bold text-chart-5">
                          {event.date.split(" ")[1].replace(",", "")}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{event.title}</div>
                        <div className="text-sm text-muted-foreground">{event.subject}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground sm:text-right">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.venue}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Class Statistics */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Total Classes/Week", value: "15", icon: Calendar },
          { label: "Lecture Hours", value: "18 hrs", icon: Clock },
          { label: "Lab Sessions", value: "5", icon: Grid3X3 },
          { label: "Free Days", value: "1 (Friday)", icon: User },
        ].map((stat, index) => (
          <Card key={index} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
