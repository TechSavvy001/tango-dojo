'use client'
import { useRouter } from 'next/navigation'

import { useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function NewDeckForm() {
    const supabase = createBrowserSupabaseClient()
  
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
  
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth?.user?.id
    if (!userId) {
      setError('Nicht eingeloggt')
      setLoading(false)
      return
    }
  
    const { data: newDeck, error: insertError } = await supabase
      .from('decks')
      .insert({ name, user_id: userId })
      .select('id')
      .single()
  
    if (insertError) {
      setError(insertError.message)
    } else if (newDeck?.id) {
      router.push(`/decks/${newDeck.id}`)
    }
  
    setLoading(false)
  }
  
  return (
    <div className="space-y-2">
      <Input
        placeholder="Deck-Name eingeben..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={loading || !name}>
        {loading ? 'Speichere...' : 'Deck erstellen'}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
