'use client'

import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Settings() {
  const supabase = createBrowserSupabaseClient()
  const [name, setName] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const { data: auth } = await supabase.auth.getUser()
      const userId = auth?.user?.id
      if (!userId) return

      const { data, error } = await supabase
        .from('users')
        .select('name, email')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Fehler beim Laden des Profils:', error.message)
        return
      }

      setName(data?.name ?? null)
      setEmail(data?.email ?? null)
      setLoading(false)
    }

    loadUser()
  }, [supabase])

  if (loading) return <p className="p-4">Lade Profil...</p>

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Benutzerprofil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name:</p>
            <p className="text-lg font-medium">{name ?? '–'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">E-Mail:</p>
            <p className="text-lg font-medium">{email ?? '–'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
