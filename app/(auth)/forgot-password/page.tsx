"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // আপনার দেওয়া এন্ডপয়েন্টে রিকোয়েস্ট পাঠানো হচ্ছে
      await axios.post(`${API_URL}/forget-password`, { email });
      setIsSubmitted(true);
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong!";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <Card className="w-full max-w-md border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We have sent a password reset link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Did not receive the email? Check your spam folder or try again.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
                Try another email
              </Button>
              <Button asChild className="w-full">
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <Card className="w-full max-w-md border-border/50">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">SmartCSE</span>
          </Link>
          <CardTitle className="text-2xl">Forgot password?</CardTitle>
          <CardDescription>
            No worries, we will send you reset instructions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@bu.edu.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}