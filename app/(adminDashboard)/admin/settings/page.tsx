"use client"

import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Settings, Shield, Mail, GraduationCap, 
  Loader2, Save, Globe, AlertTriangle 
} from "lucide-react"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"

export default function AdminSettings() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const [settings, setSettings] = useState({
    siteName: "",
    adminEmail: "",
    currentSemester: "",
    maintenanceMode: false,
    twoFactor: false,
    registrationOpen: true
  })

  // --- ১. ব্যাকএন্ড থেকে বর্তমান সেটিংস লোড করা ---
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`)
        const data = await res.json()
        if (data) {
          setSettings({
            siteName: data.siteName || "SmartCSE Portal",
            adminEmail: data.adminEmail || "",
            currentSemester: data.currentSemester || "Spring 2026",
            maintenanceMode: data.maintenanceMode || false,
            twoFactor: data.twoFactor || false,
            registrationOpen: data.registrationOpen ?? true
          })
        }
      } catch (error) {
        toast.error("Failed to load settings")
      } finally {
        setIsFetching(false)
      }
    }
    fetchSettings()
  }, [])

  // --- ২. সেটিংস আপডেট করা ---
  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.user?.accessToken}`
        },
        body: JSON.stringify(settings)
      })

      if (res.ok) {
        toast.success("System settings updated! 🎉")
      } else {
        throw new Error()
      }
    } catch (error) {
      toast.error("Update failed. Check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase underline decoration-primary decoration-4 underline-offset-8">
            System Settings
          </h1>
          <p className="text-slate-500 font-bold italic text-xs uppercase tracking-widest pt-2">Global portal configuration</p>
        </div>
        <Button 
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="bg-primary h-14 px-8 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 active:scale-95 transition-all"
        >
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
          SAVE CHANGES
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: General & Academic */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-[2.5rem] p-8 bg-white shadow-xl border-none space-y-8">
            
            {/* Site Info */}
            <div className="space-y-6">
              <h2 className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2 text-slate-800">
                <Globe className="text-primary h-5 w-5" /> General Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Portal Name</Label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 ring-primary/20"
                    placeholder="e.g. SmartCSE University"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Support Email</Label>
                  <Input
                    value={settings.adminEmail}
                    onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                    className="h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 ring-primary/20"
                    placeholder="admin@university.edu"
                  />
                </div>
              </div>
            </div>

            {/* Academic Controls */}
            <div className="space-y-6 border-t pt-8">
              <h2 className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2 text-slate-800">
                <GraduationCap className="text-primary h-5 w-5" /> Academic Session
              </h2>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Active Semester</Label>
                <Select 
                  value={settings.currentSemester} 
                  onValueChange={(val) => setSettings({...settings, currentSemester: val})}
                >
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold">
                    <SelectValue placeholder="Select active semester" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl font-bold italic">
                    <SelectItem value="Spring 2026">Spring 2026</SelectItem>
                    <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                    <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-slate-400 font-medium italic mt-1">* This affects routine and attendance modules</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Security & Status */}
        <div className="space-y-8">
          <Card className="rounded-[2.5rem] p-8 bg-white shadow-xl border-none space-y-8">
            <h2 className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2 text-slate-800">
              <Shield className="text-primary h-5 w-5" /> Controls
            </h2>

            <div className="space-y-4">
              {/* Registration Switch */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-sm font-black uppercase italic tracking-tighter">Registration</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Student Sign-ups</p>
                </div>
                <Switch
                  checked={settings.registrationOpen}
                  onCheckedChange={(val) => setSettings({ ...settings, registrationOpen: val })}
                />
              </div>

              {/* 2FA Switch */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-sm font-black uppercase italic tracking-tighter">Two-Factor</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Admin Security</p>
                </div>
                <Switch
                  checked={settings.twoFactor}
                  onCheckedChange={(val) => setSettings({ ...settings, twoFactor: val })}
                />
              </div>

              {/* Maintenance Mode */}
              <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 ${settings.maintenanceMode ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                <div className="space-y-0.5">
                  <p className={`text-sm font-black uppercase italic tracking-tighter ${settings.maintenanceMode ? 'text-red-600' : 'text-slate-800'}`}>Maintenance</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Global Lock</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(val) => setSettings({ ...settings, maintenanceMode: val })}
                />
              </div>
            </div>

            {settings.maintenanceMode && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
                <AlertTriangle className="text-amber-500 h-5 w-5 shrink-0" />
                <p className="text-[10px] font-bold text-amber-700 leading-tight uppercase italic">
                  Warning: Maintenance mode will prevent students from accessing the portal.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}