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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  Download,
  Calendar,
  FileText,
  Target,
  Medal,
} from "lucide-react"
import { FadeIn } from "@/components/ui/motion"

const currentSemesterGrades = [
  {
    course: "Data Structures",
    code: "CSE-301",
    credit: 3,
    assignments: [85, 92, 88],
    quizzes: [78, 85],
    midterm: 82,
    final: null,
    attendance: 86,
    currentGrade: "A-",
    gradePoint: 3.7,
  },
  {
    course: "Algorithm Design",
    code: "CSE-303",
    credit: 3,
    assignments: [90, 88, 95],
    quizzes: [92, 88],
    midterm: 88,
    final: null,
    attendance: 79,
    currentGrade: "A",
    gradePoint: 4.0,
  },
  {
    course: "Database Systems",
    code: "CSE-305",
    credit: 3,
    assignments: [75, 80, 82],
    quizzes: [70, 75],
    midterm: 72,
    final: null,
    attendance: 71,
    currentGrade: "B",
    gradePoint: 3.0,
  },
  {
    course: "Software Engineering",
    code: "CSE-307",
    credit: 3,
    assignments: [88, 92, 90],
    quizzes: [85, 90],
    midterm: 85,
    final: null,
    attendance: 93,
    currentGrade: "A",
    gradePoint: 4.0,
  },
  {
    course: "Computer Networks",
    code: "CSE-309",
    credit: 3,
    assignments: [82, 78, 85],
    quizzes: [80, 82],
    midterm: 78,
    final: null,
    attendance: 79,
    currentGrade: "B+",
    gradePoint: 3.3,
  },
  {
    course: "Operating Systems",
    code: "CSE-311",
    credit: 3,
    assignments: [85, 88, 82],
    quizzes: [85, 80],
    midterm: 80,
    final: null,
    attendance: 86,
    currentGrade: "A-",
    gradePoint: 3.7,
  },
]

const semesterHistory = [
  { semester: "Fall 2025", gpa: 3.58, credits: 18, rank: 12 },
  { semester: "Spring 2025", gpa: 3.45, credits: 18, rank: 15 },
  { semester: "Fall 2024", gpa: 3.62, credits: 18, rank: 10 },
  { semester: "Spring 2024", gpa: 3.72, credits: 18, rank: 8 },
]

const gradeDistribution = [
  { grade: "A", count: 2, percentage: 33 },
  { grade: "A-", count: 2, percentage: 33 },
  { grade: "B+", count: 1, percentage: 17 },
  { grade: "B", count: 1, percentage: 17 },
]

const calculateAverage = (arr: number[]) => {
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
}

export default function GradesPage() {
  const [selectedSemester, setSelectedSemester] = useState("current")

  const currentGPA = (
    currentSemesterGrades.reduce((sum, course) => sum + course.gradePoint * course.credit, 0) /
    currentSemesterGrades.reduce((sum, course) => sum + course.credit, 0)
  ).toFixed(2)

  const totalCredits = currentSemesterGrades.reduce((sum, course) => sum + course.credit, 0)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Grades & Results</h1>
            <p className="text-muted-foreground">View your academic performance and grade history</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Semester</SelectItem>
                <SelectItem value="fall2025">Fall 2025</SelectItem>
                <SelectItem value="spring2025">Spring 2025</SelectItem>
                <SelectItem value="fall2024">Fall 2024</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Transcript
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
                <p className="text-sm text-muted-foreground">Current CGPA</p>
                <p className="text-3xl font-bold text-foreground">3.62</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-4 flex items-center gap-1 text-sm text-accent">
              <TrendingUp className="h-4 w-4" />
              +0.04 from last semester
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Semester GPA</p>
                <p className="text-3xl font-bold text-foreground">{currentGPA}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Based on current grades</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-3xl font-bold text-foreground">90</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3/10">
                <BookOpen className="h-6 w-6 text-chart-3" />
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{totalCredits} this semester</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Class Rank</p>
                <p className="text-3xl font-bold text-foreground">#10</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-5/10">
                <Medal className="h-6 w-6 text-chart-5" />
              </div>
            </div>
            <p className="mt-4 flex items-center gap-1 text-sm text-accent">
              <TrendingUp className="h-4 w-4" />
              Up 2 positions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="current" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">Current Semester</TabsTrigger>
          <TabsTrigger value="history">Grade History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {/* Course Grades Table */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Course Grades - Spring 2026
              </CardTitle>
              <CardDescription>Your grades breakdown for each course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead className="text-center">Credits</TableHead>
                      <TableHead className="text-center">Assignments</TableHead>
                      <TableHead className="text-center">Quizzes</TableHead>
                      <TableHead className="text-center">Midterm</TableHead>
                      <TableHead className="text-center">Final</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead className="text-center">GP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentSemesterGrades.map((course) => (
                      <TableRow key={course.code}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">{course.course}</div>
                            <div className="text-sm text-muted-foreground">{course.code}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{course.credit}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{calculateAverage(course.assignments)}%</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{calculateAverage(course.quizzes)}%</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{course.midterm}%</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {course.final ? (
                            <Badge variant="outline">{course.final}%</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              course.currentGrade.startsWith("A") ? "default" :
                              course.currentGrade.startsWith("B") ? "secondary" : "outline"
                            }
                          >
                            {course.currentGrade}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-semibold">{course.gradePoint}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Course Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {currentSemesterGrades.slice(0, 4).map((course) => (
              <Card key={course.code} className="border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.course}</CardTitle>
                      <CardDescription>{course.code}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        course.currentGrade.startsWith("A") ? "default" :
                        course.currentGrade.startsWith("B") ? "secondary" : "outline"
                      }
                      className="text-lg px-3 py-1"
                    >
                      {course.currentGrade}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Assignments ({course.assignments.length})</span>
                        <span className="font-medium">{calculateAverage(course.assignments)}%</span>
                      </div>
                      <Progress value={calculateAverage(course.assignments)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Quizzes ({course.quizzes.length})</span>
                        <span className="font-medium">{calculateAverage(course.quizzes)}%</span>
                      </div>
                      <Progress value={calculateAverage(course.quizzes)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Midterm Exam</span>
                        <span className="font-medium">{course.midterm}%</span>
                      </div>
                      <Progress value={course.midterm} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Attendance</span>
                        <span className={`font-medium ${course.attendance < 75 ? "text-destructive" : ""}`}>
                          {course.attendance}%
                        </span>
                      </div>
                      <Progress
                        value={course.attendance}
                        className={`h-2 ${course.attendance < 75 ? "[&>div]:bg-destructive" : ""}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Semester History
              </CardTitle>
              <CardDescription>Your academic performance over past semesters</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semester</TableHead>
                    <TableHead className="text-center">Credits</TableHead>
                    <TableHead className="text-center">GPA</TableHead>
                    <TableHead className="text-center">Class Rank</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {semesterHistory.map((semester) => (
                    <TableRow key={semester.semester}>
                      <TableCell className="font-medium">{semester.semester}</TableCell>
                      <TableCell className="text-center">{semester.credits}</TableCell>
                      <TableCell className="text-center">
                        <span className={`font-semibold ${semester.gpa >= 3.5 ? "text-accent" : ""}`}>
                          {semester.gpa}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">#{semester.rank}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="default">Completed</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* GPA Trend */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>GPA Trend</CardTitle>
              <CardDescription>Your GPA progression over semesters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {semesterHistory.map((semester, index) => (
                  <div key={semester.semester} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium text-foreground">{semester.semester}</div>
                    <div className="flex-1">
                      <div className="h-8 rounded-full bg-muted">
                        <div
                          className="h-8 rounded-full bg-primary flex items-center justify-end pr-3"
                          style={{ width: `${(semester.gpa / 4) * 100}%` }}
                        >
                          <span className="text-sm font-semibold text-primary-foreground">{semester.gpa}</span>
                        </div>
                      </div>
                    </div>
                    {index > 0 && (
                      <div className="w-16 text-right">
                        {semester.gpa > semesterHistory[index - 1].gpa ? (
                          <span className="flex items-center justify-end gap-1 text-sm text-accent">
                            <TrendingUp className="h-4 w-4" />
                            +{(semester.gpa - semesterHistory[index - 1].gpa).toFixed(2)}
                          </span>
                        ) : (
                          <span className="flex items-center justify-end gap-1 text-sm text-destructive">
                            <TrendingDown className="h-4 w-4" />
                            {(semester.gpa - semesterHistory[index - 1].gpa).toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Grade Distribution */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Current semester grade breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gradeDistribution.map((item) => (
                    <div key={item.grade} className="flex items-center gap-4">
                      <div className="w-12 text-center">
                        <Badge
                          variant={item.grade.startsWith("A") ? "default" : "secondary"}
                          className="w-10"
                        >
                          {item.grade}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="h-6 rounded bg-muted">
                          <div
                            className={`h-6 rounded ${
                              item.grade.startsWith("A") ? "bg-primary" : "bg-muted-foreground/50"
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-20 text-right text-sm text-muted-foreground">
                        {item.count} courses ({item.percentage}%)
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Target */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Performance Target
                </CardTitle>
                <CardDescription>Track your academic goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Target CGPA</span>
                      <span className="font-semibold text-foreground">3.75</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current CGPA</span>
                      <span className="font-semibold text-foreground">3.62</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Gap</span>
                      <span className="font-semibold text-chart-5">0.13</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress to Target</span>
                      <span className="font-medium">96%</span>
                    </div>
                    <Progress value={96} className="h-3" />
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                      To achieve your target CGPA of 3.75, you need to maintain at least a <strong>3.88 GPA</strong> this semester.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Performance Comparison */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Course Performance Comparison</CardTitle>
              <CardDescription>Compare your performance across different assessment types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentSemesterGrades.map((course) => (
                  <div key={course.code} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{course.course}</span>
                      <Badge variant="outline">{course.currentGrade}</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="rounded-lg bg-primary/10 p-2 text-center">
                        <div className="text-xs text-muted-foreground">Assignments</div>
                        <div className="font-semibold text-primary">{calculateAverage(course.assignments)}%</div>
                      </div>
                      <div className="rounded-lg bg-accent/10 p-2 text-center">
                        <div className="text-xs text-muted-foreground">Quizzes</div>
                        <div className="font-semibold text-accent">{calculateAverage(course.quizzes)}%</div>
                      </div>
                      <div className="rounded-lg bg-chart-3/10 p-2 text-center">
                        <div className="text-xs text-muted-foreground">Midterm</div>
                        <div className="font-semibold text-chart-3">{course.midterm}%</div>
                      </div>
                      <div className="rounded-lg bg-chart-5/10 p-2 text-center">
                        <div className="text-xs text-muted-foreground">Attendance</div>
                        <div className={`font-semibold ${course.attendance < 75 ? "text-destructive" : "text-chart-5"}`}>
                          {course.attendance}%
                        </div>
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
