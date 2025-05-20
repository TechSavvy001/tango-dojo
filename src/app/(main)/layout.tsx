'use client'

import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SidebarWrapper } from '@/components/layout/SidebarWrapper'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session === null) return
    if (!session) {
      router.replace('/login')
    }
  }, [session, router])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (session === null) {
        router.replace('/login')
      }
    }, 5000)
    return () => clearTimeout(timeout)
  }, [session, router])

  if (session === null) {
    return <p className="p-4">Authentifizierung wird geprüft...</p>
  }

  return (
    <div className="md:flex h-screen overflow-hidden">
      <SidebarWrapper />

      {/* 
        Hier sorgen wir dafür, dass main ab mittlerer Bildschirmbreite (md)
        einen linken Abstand von 16rem (w-64) bekommt. 
        Auf kleineren Screens (md:hidden) überlappt es ja eh nicht,
        weil die Sidebar dort per transform verschoben ist.
      */}
      <main className="flex-1 overflow-y-auto transition-all duration-300 md:ml-64">
        {children}
      </main>
    </div>
  )
}
