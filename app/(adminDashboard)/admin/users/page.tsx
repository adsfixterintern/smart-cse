"use client"

import React, { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Search, Eye, Trash2, Ban, User
} from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

interface UserType {
  id: string
  name: string
  email: string
  role: "admin" | "teacher" | "student"
  phone: string
  address: string
  banned: boolean
}

const sampleUsers: UserType[] = [
  {
    id: "1",
    name: "Arif Hossain",
    email: "arif@gmail.com",
    role: "student",
    phone: "01700000000",
    address: "Dhaka, Bangladesh",
    banned: false
  },
  {
    id: "2",
    name: "Dr. Selim Reza",
    email: "selim@university.edu",
    role: "teacher",
    phone: "01800000000",
    address: "Rajshahi, Bangladesh",
    banned: false
  },
]

export default function AllUsersPage() {

  const [users, setUsers] = useState<UserType[]>(sampleUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewUser, setViewUser] = useState<UserType | null>(null)

  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [users, searchQuery])

  const updateRole = (id: string, newRole: "admin" | "teacher" | "student") => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
  }

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
  }

  const toggleBan = (id: string) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, banned: !u.banned } : u
    ))
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

      {/* HEADER */}
      <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase underline decoration-primary decoration-4 underline-offset-8">
        All Users
      </h1>

      {/* SEARCH */}
      <Card className="p-6 rounded-[2.5rem] border shadow-sm bg-white">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by name, email or role..."
            className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block">
        <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-900">
                <TableRow>
                  <TableHead className="text-white font-bold py-6 px-8 uppercase italic">
                    Name
                  </TableHead>
                  <TableHead className="text-white font-bold py-6 uppercase italic">
                    Role
                  </TableHead>
                  <TableHead className="text-white font-bold py-6 uppercase italic text-right px-8">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className={`hover:bg-slate-50 transition-all ${
                      user.banned ? "opacity-50" : ""
                    }`}
                  >
                    <TableCell className="px-8 py-6">
                      <p className="font-black text-slate-800 text-lg uppercase italic">
                        {user.name}
                      </p>
                      <p className="text-xs font-bold text-slate-400 mt-1">
                        ID: {user.id}
                      </p>
                      {user.banned && (
                        <span className="text-xs text-red-500 font-bold">
                          BANNED
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="py-6">
                      <Select
                        value={user.role}
                        onValueChange={(value: any) => updateRole(user.id, value)}
                      >
                        <SelectTrigger className="h-10 w-36 bg-slate-100 border-none rounded-xl font-bold capitalize">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell className="text-right px-8">
                      <div className="flex justify-end gap-3">
                        <Button size="icon" variant="outline" onClick={() => setViewUser(user)}>
                          <Eye size={16} />
                        </Button>

                        <Button size="icon" variant="outline" onClick={() => toggleBan(user.id)}>
                          <Ban size={16} />
                        </Button>

                        <Button size="icon" variant="outline" className="text-red-600" onClick={() => deleteUser(user.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="md:hidden space-y-4">
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            className={`p-5 rounded-3xl shadow-lg ${
              user.banned ? "opacity-50" : ""
            }`}
          >
            <div>
              <p className="font-black text-lg uppercase">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
              {user.banned && (
                <span className="text-xs text-red-500 font-bold">
                  BANNED
                </span>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Select
                value={user.role}
                onValueChange={(value: any) => updateRole(user.id, value)}
              >
                <SelectTrigger className="h-10 w-28 bg-slate-100 border-none rounded-xl font-bold capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={() => setViewUser(user)}>
                  <Eye size={16} />
                </Button>
                <Button size="icon" variant="outline" onClick={() => toggleBan(user.id)}>
                  <Ban size={16} />
                </Button>
                <Button size="icon" variant="outline" className="text-red-600" onClick={() => deleteUser(user.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ================= USER DETAILS MODAL ================= */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">

          <DialogHeader className="sr-only">
            <DialogTitle>User Info</DialogTitle>
            <DialogDescription>Full identity information</DialogDescription>
          </DialogHeader>

          <div className="bg-slate-900 p-10 text-center space-y-3">
            <div className="inline-flex p-4 bg-primary/20 rounded-3xl">
              <User size={36} className="text-primary" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic">
              {viewUser?.name}
            </h2>
            <p className="text-primary uppercase tracking-widest text-xs font-black">
              {viewUser?.role}
            </p>
          </div>

          <div className="p-10 space-y-6 bg-white font-bold italic">
            <div>
              <p className="text-xs uppercase text-slate-400">Email</p>
              <p className="text-lg text-slate-700">{viewUser?.email}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-400">Phone</p>
              <p className="text-lg text-slate-700">{viewUser?.phone}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-400">Address</p>
              <p className="text-lg text-slate-700">{viewUser?.address}</p>
            </div>

            <Button
              onClick={() => setViewUser(null)}
              className="w-full h-14 rounded-2xl font-black uppercase shadow-xl shadow-primary/20"
            >
              Close
            </Button>
          </div>

        </DialogContent>
      </Dialog>

    </div>
  )
}
