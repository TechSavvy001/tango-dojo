'use client'

import { useEffect, useState } from 'react'
import { getUserWithRole } from '@/lib/getUserWithRole'
import type { AppUser } from '@/types/user'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'

export default function ProfilPage() {
  const [user, setUser] = useState<AppUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      const supabase = createBrowserSupabaseClient() // <== Client erzeugen
      const u = await getUserWithRole(supabase)      // <== korrekt übergeben
      if (!u) {
        router.push('/login')
      } else {
        setUser(u)
      }
    }
    loadUser()
  }, [router])
  

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return <p className="p-8">Wird geladen...</p>

  return (
    <div className="p-8 space-y-4 max-w-md">
      <h1 className="text-2xl font-bold">👋 Hallo, {user.name}</h1>
      <p><strong>Rolle:</strong> {user.role}</p>
      <p><strong>E-Mail:</strong> {user.email}</p>

      {user.role === 'admin' && (
        <Link href="/admin">
          <Button variant="outline">Zum Admin-Dashboard</Button>
        </Link>
      )}

      <Button onClick={handleLogout} variant="destructive">
        Logout
      </Button>
    </div>
  )
}
