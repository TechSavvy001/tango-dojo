
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { getUserWithRole } from '@/lib/getUserWithRole'
import type { AppUser } from '@/types/user'
import {
  Menu,
  Grid,
  BookOpen,
  Mail,
  Flag,
  Calendar,
  User,
  Bell,
  MessageSquare,
  Settings,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Puzzle,
  ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Sidebar() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  
  // User laden
  useEffect(() => {
    const supabase = createBrowserSupabaseClient()
    getUserWithRole(supabase).then(setUser)
  }, [])

  const handleLogout = async () => {
    const supabase = createBrowserSupabaseClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  // Navigation items
  const mainNav = [
    { label: 'Übersicht', href: '/start', icon: Grid },
    { label: 'Vokabeln',  href: '/vokabeln', icon: BookOpen },
    { label: 'Karteikarten', href: '/karteikarten', icon: Flag },
    { label: 'Quiz', href: '/quiz', icon: Mail },
    { label: 'Puzzle', href: '/puzzle', icon: Puzzle },
    { label: 'Grammatik', href: '/grammatik', icon: Calendar },
    { label: 'Dashboard', href: '/dashboard', icon: User },
    { label: 'Kanji', href: '/kanji', icon: BookOpen },
  ]

  const accountNav = [
    { label: 'Notifications', icon: Bell },
    { label: 'Chat', icon: MessageSquare },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 bg-gray-100 p-2 rounded shadow z-50"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Menü öffnen"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
          className={`
            fixed top-0 left-0 h-full
            ${collapsed ? 'w-20' : 'w-64'}
            transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            transition-all duration-300 z-50 flex flex-col justify-between

            bg-sidebar
            text-sidebar-foreground
            border-r border-sidebar-border

            md:bg-sidebar md:text-sidebar-foreground md:border-sidebar-border

            /* Hover- und Active-Styles */
            hover:bg-sidebar-hover
            active:bg-sidebar-active

            /* Dark-Mode explizit – falls du Variablen nicht in tailwind.config.js gepackt hast */
            dark:bg-[var(--sidebar)]
            dark:text-[var(--sidebar-foreground)]
            dark:border-[var(--sidebar-border)]
            dark:hover:bg-[var(--sidebar-hover)]
            dark:active:bg-[var(--sidebar-active)]
          `}
        >
        <div>
          {/* Desktop Collapse-Button */}
          <div className="hidden md:flex justify-end p-2">
            <button onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </button>
          </div>

          {/* Logo + Personal/Business Toggle */}
          <div className="px-4 py-6 flex items-center justify-between">
            {!collapsed 
              ? <h2 className="text-xl font-bold">TangoDojo</h2>
              : <div className="w-6 h-6 bg-gray-200 rounded" />}
            
          </div>

          {/* Haupt-Menü */}
          <nav className="mt-4 space-y-1">
            {mainNav.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`
                  group flex items-center px-4 py-2 rounded-md
                  transition-colors
                  hover:bg-gray-100
                  dark:hover:bg-gray-700
                `}
                
              >
                <Icon className="flex-shrink-0" size={20} />
                {!collapsed && (
                  <span className="ml-3 text-sm font-medium">{label}</span>
                )}
              </Link>
            ))}

            {/* Admin-Link extra */}
          {user?.role === 'admin' && (
            <Link
              href="/admin/kanji"
              onClick={() => setMobileOpen(false)}
              className="group flex items-center px-4 py-2 rounded-md
                  transition-colors
                  hover:bg-gray-100
                  dark:hover:bg-gray-700"
            >
              <ShieldCheck size={20} />
              {!collapsed && <span className="ml-3 text-sm font-medium">Kanji verwalten</span>}
            </Link>
          )}
          </nav>

          {/* Account-Bereich */}
          <div className="mt-6 border-t pt-4 space-y-1">
          {accountNav.map(({ label, icon: Icon, href }) => (
              <Link
                key={label}
                onClick={() => setMobileOpen(false)}
                href={href || '#'}
                className="group flex items-center px-4 py-2 rounded-md
                  transition-colors
                  hover:bg-gray-100
                  dark:hover:bg-gray-700"
              >
                <Icon size={20} />
                {!collapsed && <span className="ml-3 text-sm">{label}</span>}
                
              </Link>
            ))}

          </div>
        </div>

        {/* Profil unten */}
        {user && (
          <div className="px-4 py-6 border-t">
            <div className="flex items-center">
            <div className="w-10 h-10 relative flex items-center justify-center bg-gray-300 rounded-full text-white font-bold">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt="Avatar"
                  fill
                  className="rounded-full"
                />
              ) : (
                <span className="text-lg">{user.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
              {!collapsed && (
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              )}
              {!collapsed && (
                <button className="ml-2">
                  <MoreHorizontal size={20} />
                </button>
              )}
            </div>
            {!collapsed && (
              <Button
                className="w-full mt-4"
                variant="outline"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
        )}
      </aside>
    </>
  )
}
