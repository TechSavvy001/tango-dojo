'use client'

import { useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function NewDeckForm() {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserSupabaseClient()

  const handleCreate = async () => {
    setError('')
    setLoading(true)

    if (!name.trim()) {
      setError('Bitte gib einen Namen für das Deck ein.')
      setLoading(false)
      return
    }

    const { data: auth, error: authError } = await supabase.auth.getUser()
    const userId = auth?.user?.id
    if (!userId || authError) {
      setError('Nicht eingeloggt oder Session ungültig')
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('decks')
      .insert({ name: name.trim(), user_id: userId })
      .select('id')
      .single()

    if (error) {
      setError(error.message)
    } else if (data?.id) {
      setName('')
      router.push(`/decks/${data.id}`)
    }

    setLoading(false)
  }

  return (
      <div className="space-y-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {
            if (name.trim() && !loading) {
              handleCreate()
            }
          }}
          placeholder="Name des neuen Decks"
          disabled={loading}
          className={`
            w-full
            transition-colors
    
            /* Light-Mode */
            bg-white
            border border-gray-300
            text-gray-900
            placeholder-gray-400
            focus:ring-2 focus:ring-indigo-500
    
            /* Dark-Mode */
            dark:bg-gray-800
            dark:border-gray-600
            dark:text-gray-100
            dark:placeholder-gray-500
            dark:focus:ring-indigo-400
          `}
        />
        <Button onClick={handleCreate} disabled={loading}>
          {loading ? 'Erstelle...' : '➕ Neues Deck'}
        </Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
    
}
