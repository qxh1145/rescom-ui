"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Home,
  Search,
  PlusCircle,
  Wallet,
  User,
  ChevronRight,
  Lock,
  Clock,
  Users,
  Sparkles,
  TrendingUp,
  Gift,
  Settings,
  Bell
} from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = "earn" | "discover" | "publish" | "wallet" | "profile"

interface BottomNavProps {
  activeItem: NavItem
  onNavigate: (item: NavItem) => void
}

export function BottomNav({ activeItem, onNavigate }: BottomNavProps) {
  const navItems: { id: NavItem; icon: React.ReactNode; label: string }[] = [
    { id: "earn", icon: <Gift className="h-5 w-5" />, label: "Kiếm điểm" },
    { id: "publish", icon: <PlusCircle className="h-6 w-6" />, label: "Đăng" },
    { id: "wallet", icon: <Wallet className="h-5 w-5" />, label: "Ví" },
    { id: "profile", icon: <User className="h-5 w-5" />, label: "Tôi" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg md:hidden">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200",
              "active:scale-95",
              item.id === "publish"
                ? "bg-primary text-primary-foreground -mt-4 shadow-lg shadow-primary/30"
                : activeItem === item.id
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.icon}
            <span className={cn(
              "text-xs font-medium",
              item.id === "publish" && "sr-only"
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
      {/* Safe area spacer for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}

interface DesktopSidebarProps {
  activeItem: NavItem
  onNavigate: (item: NavItem) => void
}

export function DesktopSidebar({ activeItem, onNavigate }: DesktopSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-100 shadow-sm">
      {/* Logo */}
      <div className="px-6 pt-6 pb-2">
        <Image
          src="/rescom-logo.png"
          alt="Rescom"
          width={130}
          height={46}
          className="object-contain"
          priority
        />
      </div>

      {/* Main navigation */}
      <nav className="px-4 pt-2 space-y-1">
        {/* Khám Phá - active item as green pill button */}
        <button
          onClick={() => onNavigate("discover")}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-semibold text-sm",
            activeItem === "discover"
              ? "bg-[#3db87a] text-white shadow-md shadow-green-200 hover:bg-[#36a86f]"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          {/* Calendar/Discover icon */}
          <span className="flex items-center justify-center w-6 h-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="3" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
            </svg>
          </span>
          <span className="flex-1 text-left">Khám Phá</span>
          {activeItem === "discover" && (
            <ChevronRight className="h-4 w-4 opacity-80" />
          )}
        </button>

        {/* Đăng Khảo Sát */}
        <button
          onClick={() => onNavigate("publish")}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm",
            activeItem === "publish"
              ? "bg-[#3db87a] text-white shadow-md shadow-green-200"
              : "text-gray-700 hover:bg-gray-50"
          )}
        >
          <span className="flex items-center justify-center w-6 h-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </span>
          <span className="font-medium">Đăng Khảo Sát</span>
        </button>

        {/* Tạo Khảo Sát */}
        <button
          onClick={() => onNavigate("earn")}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm",
            activeItem === "earn"
              ? "bg-[#3db87a] text-white shadow-md shadow-green-200"
              : "text-gray-700 hover:bg-gray-50"
          )}
        >
          <span className="flex items-center justify-center w-6 h-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </span>
          <span className="font-medium">Tạo Khảo Sát</span>
        </button>

        {/* Ví Điểm */}
        <button
          onClick={() => onNavigate("wallet")}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm",
            activeItem === "wallet"
              ? "bg-[#3db87a] text-white shadow-md shadow-green-200"
              : "text-gray-700 hover:bg-gray-50"
          )}
        >
          <span className="flex items-center justify-center w-6 h-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="3" />
              <path d="M2 10h20" />
              <circle cx="16" cy="15" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="font-medium">Ví Điểm</span>
        </button>
      </nav>

      {/* Mascot section */}
      <div className="flex-1 px-4 mt-3 min-h-0">
        <div className="w-full h-full relative overflow-hidden rounded-2xl flex flex-col" style={{
          background: "linear-gradient(180deg, #f5fffe 0%, #e6faf3 50%, #c8f0dc 100%)",
          minHeight: "160px"
        }}>
          {/* Stars decoration */}
          <div className="absolute top-3 left-5 z-10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="absolute top-5 right-5 z-10">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="#fde68a">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="absolute top-10 left-10 z-10">
            <svg width="6" height="6" viewBox="0 0 24 24" fill="#fbbf24" opacity="0.7">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>

          {/* Mascot image - sits above the hills */}
          <div className="flex-1 flex justify-center items-end relative z-10 pt-4">
            <Image
              src="/mascot.png"
              alt="Rescom Mascot"
              width={148}
              height={148}
              className="object-contain drop-shadow-lg animate-float"
              style={{ marginBottom: "18px" }}
            />
          </div>

          {/* Green ground/hills */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 256 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%" }}>
              <ellipse cx="80" cy="56" rx="110" ry="36" fill="#86efac" opacity="0.9" />
              <ellipse cx="210" cy="56" rx="90" ry="30" fill="#4ade80" opacity="0.85" />
              <ellipse cx="128" cy="56" rx="140" ry="22" fill="#22c55e" opacity="0.8" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-4 pt-3 pb-4 space-y-1 border-t border-gray-100 mt-3">
        {/* User profile */}
        <button
          onClick={() => onNavigate("profile")}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-gray-50 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
            <Image
              src="/placeholder-user.jpg"
              alt="User avatar"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-800 truncate">Nguyễn Văn A</p>
            <p className="text-xs text-gray-500 truncate">Sinh viên CNTT</p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
        </button>

        {/* Settings */}
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors text-sm">
          <Settings className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">Cài đặt tài khoản</span>
        </button>
      </div>
    </aside>
  )
}

interface AppShellProps {
  children: React.ReactNode
  activeNav: NavItem
  onNavigate: (item: NavItem) => void
}

export function AppShell({ children, activeNav, onNavigate }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar activeItem={activeNav} onNavigate={onNavigate} />

      {/* Main content area */}
      <main className="md:ml-64 pb-24 md:pb-8">
        {/* Mobile header */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur-lg border-b border-border md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <Image
                src="/rescom-logo.png"
                alt="Rescom"
                width={110}
                height={38}
                className="object-contain"
                priority
              />
              <span className="text-[10px] text-muted-foreground leading-tight pl-0.5">Khảo sát thông minh</span>
            </div>
          </div>
          <button className="relative p-2 rounded-xl hover:bg-accent transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-success rounded-full" />
          </button>
        </header>

        {children}
      </main>

      <BottomNav activeItem={activeNav} onNavigate={onNavigate} />
    </div>
  )
}
