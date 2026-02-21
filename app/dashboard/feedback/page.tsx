"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Star,
  MessageSquare,
  Send,
  ThumbsUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Users,
  TrendingUp,
  Lightbulb,
} from "lucide-react"
import { FadeIn } from "@/components/ui/motion"

const courses = [
  { code: "CSE-301", name: "Data Structures", instructor: "Dr. Rahman" },
  { code: "CSE-303", name: "Algorithm Design", instructor: "Prof. Karim" },
  { code: "CSE-305", name: "Database Systems", instructor: "Dr. Fatema" },
  { code: "CSE-307", name: "Software Engineering", instructor: "Prof. Mamun" },
  { code: "CSE-309", name: "Computer Networks", instructor: "Dr. Hasan" },
  { code: "CSE-311", name: "Operating Systems", instructor: "Prof. Akter" },
]

const previousFeedback = [
  {
    id: 1,
    course: "Data Structures",
    code: "CSE-301",
    instructor: "Dr. Rahman",
    date: "Jan 20, 2026",
    rating: 5,
    status: "submitted",
    comment: "Excellent teaching methodology. The practical examples really helped understand complex concepts.",
  },
  {
    id: 2,
    course: "Algorithm Design",
    code: "CSE-303",
    instructor: "Prof. Karim",
    date: "Jan 18, 2026",
    rating: 4,
    status: "reviewed",
    comment: "Good course content but would appreciate more coding exercises during class.",
  },
  {
    id: 3,
    course: "Software Engineering",
    code: "CSE-307",
    instructor: "Prof. Mamun",
    date: "Dec 15, 2025",
    rating: 5,
    status: "acknowledged",
    comment: "The project-based learning approach is very effective. Learned a lot about real-world development.",
  },
]

const feedbackCategories = [
  { label: "Teaching Quality", icon: Users },
  { label: "Course Content", icon: FileText },
  { label: "Learning Experience", icon: Lightbulb },
  { label: "Assessment Methods", icon: CheckCircle2 },
]

const suggestions = [
  {
    id: 1,
    title: "More Lab Sessions for Database",
    description: "Request for additional lab hours for practical database exercises",
    category: "Course Content",
    votes: 45,
    status: "under-review",
    date: "Jan 22, 2026",
  },
  {
    id: 2,
    title: "Guest Lectures from Industry",
    description: "Suggestion to invite industry professionals for guest lectures",
    category: "Learning Experience",
    votes: 78,
    status: "approved",
    date: "Jan 15, 2026",
  },
  {
    id: 3,
    title: "Online Office Hours",
    description: "Request for teachers to have online office hours for quick queries",
    category: "Teaching Quality",
    votes: 62,
    status: "implementing",
    date: "Jan 10, 2026",
  },
]

export default function FeedbackPage() {
  const [selectedCourse, setSelectedCourse] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState("")
  const [suggestionTitle, setSuggestionTitle] = useState("")
  const [suggestionDescription, setSuggestionDescription] = useState("")

  const pendingFeedback = courses.filter(
    (c) => !previousFeedback.some((pf) => pf.code === c.code)
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Feedback</h1>
            <p className="text-muted-foreground">Share your thoughts to improve the learning experience</p>
          </div>
          <Badge variant="outline" className="w-fit">
            <Clock className="mr-1 h-3 w-3" />
            {pendingFeedback.length} courses pending feedback
          </Badge>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Feedback Given", value: previousFeedback.length.toString(), icon: MessageSquare, color: "text-primary" },
          { label: "Avg. Rating Given", value: "4.7", icon: Star, color: "text-amber-500" },
          { label: "Suggestions Made", value: "3", icon: Lightbulb, color: "text-accent" },
          { label: "Response Rate", value: "85%", icon: TrendingUp, color: "text-chart-3" },
        ].map((stat, index) => (
          <Card key={index} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
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

      {/* Main Content */}
      <Tabs defaultValue="give" className="space-y-6">
        <TabsList>
          <TabsTrigger value="give">Give Feedback</TabsTrigger>
          <TabsTrigger value="history">My Feedback</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="give" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Feedback Form */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Course Feedback
                </CardTitle>
                <CardDescription>Rate and review your courses to help improve teaching quality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Course</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.code} value={course.code}>
                          {course.name} ({course.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCourse && (
                  <>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {courses.find((c) => c.code === selectedCourse)?.instructor.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">
                            {courses.find((c) => c.code === selectedCourse)?.instructor}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {courses.find((c) => c.code === selectedCourse)?.name}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Overall Rating</Label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= (hoverRating || rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          </button>
                        ))}
                        {rating > 0 && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            {rating === 5 ? "Excellent" : rating === 4 ? "Good" : rating === 3 ? "Average" : rating === 2 ? "Below Average" : "Poor"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Feedback Categories</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {feedbackCategories.map((category) => (
                          <Button
                            key={category.label}
                            variant="outline"
                            className="h-auto justify-start gap-2 p-3 bg-transparent"
                          >
                            <category.icon className="h-4 w-4 text-primary" />
                            <span className="text-sm">{category.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Your Comments</Label>
                      <Textarea
                        placeholder="Share your thoughts about the course, teaching methodology, or any suggestions for improvement..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        Your feedback is anonymous and will be used to improve teaching quality.
                      </p>
                    </div>

                    <Button className="w-full" disabled={!rating || !feedbackText}>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Feedback
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Pending Feedback */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-chart-5" />
                  Pending Feedback
                </CardTitle>
                <CardDescription>Courses waiting for your feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingFeedback.map((course) => (
                    <div
                      key={course.code}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-5/10">
                          <AlertCircle className="h-5 w-5 text-chart-5" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{course.name}</div>
                          <div className="text-sm text-muted-foreground">{course.instructor}</div>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => setSelectedCourse(course.code)}>
                        Give Feedback
                      </Button>
                    </div>
                  ))}
                  {pendingFeedback.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CheckCircle2 className="h-12 w-12 text-accent" />
                      <p className="mt-4 text-muted-foreground">All caught up! No pending feedback.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                My Feedback History
              </CardTitle>
              <CardDescription>View all the feedback you have submitted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {previousFeedback.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="rounded-lg border border-border/50 bg-muted/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{feedback.course}</span>
                          <Badge variant="outline">{feedback.code}</Badge>
                          <Badge
                            variant={
                              feedback.status === "acknowledged" ? "default" :
                              feedback.status === "reviewed" ? "secondary" : "outline"
                            }
                          >
                            {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{feedback.instructor}</span>
                          <span>•</span>
                          <span>{feedback.date}</span>
                        </div>
                        <div className="mt-3 flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= feedback.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-muted-foreground">
                            {feedback.rating}/5
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">{feedback.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Submit Suggestion */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  Submit Suggestion
                </CardTitle>
                <CardDescription>Share your ideas to improve the department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Suggestion Title</Label>
                  <Input
                    placeholder="Brief title for your suggestion"
                    value={suggestionTitle}
                    onChange={(e) => setSuggestionTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {feedbackCategories.map((cat) => (
                        <SelectItem key={cat.label} value={cat.label}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe your suggestion in detail..."
                    value={suggestionDescription}
                    onChange={(e) => setSuggestionDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button className="w-full" disabled={!suggestionTitle || !suggestionDescription}>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Suggestion
                </Button>
              </CardContent>
            </Card>

            {/* Community Suggestions */}
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Community Suggestions
                </CardTitle>
                <CardDescription>Popular suggestions from students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="rounded-lg border border-border/50 bg-muted/30 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{suggestion.title}</h3>
                            <Badge
                              variant={
                                suggestion.status === "approved" ? "default" :
                                suggestion.status === "implementing" ? "secondary" : "outline"
                              }
                            >
                              {suggestion.status === "under-review" ? "Under Review" :
                               suggestion.status === "approved" ? "Approved" : "Implementing"}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="mt-2">{suggestion.category}</Badge>
                          <p className="mt-2 text-sm text-muted-foreground">{suggestion.description}</p>
                          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{suggestion.date}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-medium text-foreground">{suggestion.votes}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>
                            {suggestion.status === "under-review" ? "25%" :
                             suggestion.status === "approved" ? "50%" : "75%"}
                          </span>
                        </div>
                        <Progress
                          value={
                            suggestion.status === "under-review" ? 25 :
                            suggestion.status === "approved" ? 50 : 75
                          }
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
