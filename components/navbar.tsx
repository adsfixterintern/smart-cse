"use client"

import Link from "next/link"
import { useState, useRef } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { 
  Menu, 
  X, 
  GraduationCap, 
  LayoutDashboard, 
  LogOut, 
  Settings 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/context/UserContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false) // Mobile menu state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) // Desktop hover state
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { user } = useUser()

  const isLoggedIn = !!user

  // হোভার শুরু হলে ড্রপডাউন ওপেন হবে
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsDropdownOpen(true)
  }

  // হোভার শেষ হলে ২০০ মিলিসেকেন্ড ডিলে করবে যেন ইউজার মাউস মেনুতে নিতে পারে
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 200)
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* --- LOGO --- */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary transition-transform duration-300 group-hover:scale-110">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-foreground">SmartCSE</span>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* --- AUTH / PROFILE SECTION --- */}
        <div className="hidden items-center gap-3 md:flex">
          {!isLoggedIn ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="px-6 shadow-md hover:opacity-90">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          ) : (
            /* Hoverable Wrapper */
            <div 
              className="relative" 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Button 
                variant="ghost" 
                className={cn(
                  "relative h-10 w-10 rounded-full p-0 transition-all duration-300",
                  isDropdownOpen ? "bg-muted ring-4 ring-primary/10" : "hover:bg-muted"
                )}
              >
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage src={user?.profileImage} alt={user?.name} className="object-cover" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>

              {/* স্মুথ অ্যানিমেটেড ড্রপডাউন মেনু */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-border bg-popover p-2 shadow-xl"
                  >
                    <div className="px-3 py-3">
                      <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <div className="h-px bg-border my-1" />
                    
                    <div className="space-y-1">
                      <Link 
                        href="/dashboard" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <LayoutDashboard className="h-4 w-4 text-primary" /> 
                        Dashboard
                      </Link>
                      <Link 
                        href="/dashboard/settings" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Settings className="h-4 w-4 text-primary" /> 
                        Settings
                      </Link>
                    </div>

                    <div className="h-px bg-border my-1" />
                    
                    <button 
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" /> 
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* --- MOBILE MENU TOGGLE --- */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden transition-colors hover:bg-muted"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* --- MOBILE MENU CONTENT --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <nav className="container mx-auto flex flex-col gap-2 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="mt-2 border-t pt-4">
                {isLoggedIn ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-xl">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={user?.profileImage} />
                        <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" asChild className="justify-start gap-2" onClick={() => setIsOpen(false)}>
                      <Link href="/dashboard"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
                    </Button>
                    <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/" })} className="gap-2">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" asChild className="w-full" onClick={() => setIsOpen(false)}>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}