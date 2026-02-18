"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  GraduationCap,
  LayoutDashboard,
  Calendar,
  ClipboardCheck,
  FolderOpen,
  BarChart3,
  MessageSquare,
  Star,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/resources", label: "Resources", icon: FolderOpen },
  { href: "/grades", label: "Grades", icon: BarChart3 },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/feedback", label: "Feedback", icon: Star },
]

const secondaryNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help Center", icon: HelpCircle },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-sidebar-border bg-sidebar lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">SmartCSE</span>
        </div>

        <ScrollArea className="flex-1 px-4 py-6">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            Main Menu
          </div>
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <Separator className="my-6 bg-sidebar-border" />

          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            Support
          </div>
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="border-t border-sidebar-border p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            asChild
          >
            <Link href="/login">
              <LogOut className="h-5 w-5" />
              Sign Out
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}
