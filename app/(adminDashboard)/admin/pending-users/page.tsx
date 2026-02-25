"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  ShieldCheck,
  MoreVertical,
  UserCheck,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function PendingUsersPage() {
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= FETCH DATA ================= */
  const fetchPendingUsers = async () => {
    try {
      const token = (session?.user as any)?.accessToken;
      if (!token) return;

      const res = await axios.get(`${API_URL}/users/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pending users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchPendingUsers();
  }, [session]);

  /* ================= UPDATE STATUS ================= */
  const handleAction = async (user: User, status: "approved" | "rejected") => {
    const isApprove = status === "approved";

    const result = await Swal.fire({
      title: `${isApprove ? "Approve" : "Reject"} User?`,
      text: `Are you sure you want to ${status} ${user.name}?`,
      icon: isApprove ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: isApprove ? "#10b981" : "#ef4444",
      confirmButtonText: `Yes, ${status}!`,
    });

    if (!result.isConfirmed) return;

    try {
      const token = (session?.user as any)?.accessToken;
      // আপনার রুট অনুযায়ী কল করা হচ্ছে
      const res = await axios.patch(
        `${API_URL}/users/pending/${user._id}`,
        { status: status }, // বডিতে স্ট্যাটাস পাঠানো হচ্ছে
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.modifiedCount > 0 || res.status === 200) {
        toast.success(`User ${status} successfully!`);
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
      }
    } catch (err) {
      toast.error("Action failed");
    }
  };

  /* ================= SEARCH FILTER ================= */
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [users, searchQuery]);

  if (loading) {
    return (
      <div className="p-10 text-center font-bold italic text-slate-500">
        Loading pending requests...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase underline decoration-primary decoration-4 underline-offset-8">
          Pending Requests
        </h1>
        <div className="bg-primary/10 px-6 py-2 rounded-2xl border border-primary/20 hidden md:block">
          <span className="font-black text-primary uppercase italic">
            Total: {users.length}
          </span>
        </div>
      </div>

      {/* SEARCH CARD */}
      <Card className="p-6 rounded-[2.5rem] border shadow-sm bg-white">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* TABLE SECTION */}
      <Card className="rounded-3xl shadow-sm border overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[420px]">
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold uppercase italic text-slate-900 py-5 px-6">
                  User Info
                </TableHead>
                <TableHead className="font-bold uppercase italic text-slate-900">
                  Role
                </TableHead>
                <TableHead className="font-bold uppercase italic text-slate-900 hidden md:table-cell">
                  Status
                </TableHead>
                <TableHead className="text-right font-bold uppercase italic text-slate-900 px-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-20 text-slate-400 font-bold italic uppercase"
                  >
                    No pending requests at the moment
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* USER INFO */}
                    <TableCell className="px-6">
                      <div className="font-bold text-slate-800 uppercase italic">
                        {user.name || "No Name"}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        {user.email}
                      </div>
                    </TableCell>

                    {/* ROLE */}
                    <TableCell>
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600">
                        {user.role}
                      </span>
                    </TableCell>

                    {/* STATUS */}
                    <TableCell className="hidden md:table-cell">
                      <span className="text-yellow-600 font-black text-xs uppercase flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" /> Pending
                      </span>
                    </TableCell>

                    {/* ACTIONS DROPDOWN */}
                    <TableCell className="text-right px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-slate-100 rounded-full"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-2xl p-2 shadow-xl border-none bg-white"
                        >
                          {/* Approve Item */}
                          <DropdownMenuItem
                            onClick={() => handleAction(user, "approved")}
                            className="gap-2 p-3 text-emerald-600 font-bold uppercase text-xs cursor-pointer rounded-xl focus:bg-emerald-50 focus:text-emerald-600"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve User
                          </DropdownMenuItem>

                          {/* Reject Item */}
                          <DropdownMenuItem
                            onClick={() => handleAction(user, "rejected")}
                            className="gap-2 p-3 text-red-500 font-bold uppercase text-xs cursor-pointer rounded-xl focus:bg-red-50 focus:text-red-500"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* FOOTER INFO (Mobile Only) */}
      <div className="md:hidden text-center text-slate-400 text-xs font-bold italic uppercase">
        Showing {filteredUsers.length} pending requests
      </div>
    </div>
  );
}
