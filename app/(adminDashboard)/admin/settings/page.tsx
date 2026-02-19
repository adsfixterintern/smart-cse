"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Shield, Mail } from "lucide-react"

export default function AdminSettings() {

  const [settings, setSettings] = useState({
    siteName: "University Admin Portal",
    email: "admin@university.edu",
    twoFactor: true,
  })

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">

      {/* Header */}
      <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase underline decoration-primary decoration-4 underline-offset-8">
        System Settings
      </h1>

      <Card className="rounded-[2.5rem] p-10 bg-white shadow-2xl border-none space-y-10">

        {/* Site Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2">
            <Settings className="text-primary" /> General Settings
          </h2>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Site Name</Label>
            <Input
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="h-14 bg-slate-50 border-none rounded-2xl font-bold"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Admin Email</Label>
            <Input
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="h-14 bg-slate-50 border-none rounded-2xl font-bold"
            />
          </div>
        </div>

        {/* Security */}
        <div className="space-y-6 border-t pt-8">
          <h2 className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2">
            <Shield className="text-primary" /> Security Controls
          </h2>

          <div className="flex items-center justify-between bg-slate-50 p-6 rounded-2xl">
            <div>
              <p className="font-bold">Enable Two-Factor Authentication</p>
              <p className="text-sm text-slate-500">Extra security layer for admin login</p>
            </div>
            <Switch
              checked={settings.twoFactor}
              onCheckedChange={(val) => setSettings({ ...settings, twoFactor: val })}
            />
          </div>
        </div>

        <Button className="w-full h-16 rounded-2xl font-black text-xl uppercase tracking-tighter shadow-2xl shadow-primary/30 mt-6 active:scale-95 transition-all">
          Save Changes
        </Button>

      </Card>

    </div>
  )
}
