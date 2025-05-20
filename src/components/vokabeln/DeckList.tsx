'use client'

import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import Link from 'next/link'

type Deck = { id: string; name: string }

export function DeckList() {
  const [decks, setDecks] = useState<Deck[]>([])
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    const fetchDecks = async () => {
      const { data: auth } = await supabase.auth.getUser()
      const userId = auth?.user?.id
      if (!userId) return

      const { data } = await supabase
        .from('decks')
        .select('id, name')
        .eq('user_id', userId)

      if (data) setDecks(data)
    }

    fetchDecks()
  }, [supabase])

  return (
    <ul className="space-y-2">
      {decks.map((deck) => (
        <li key={deck.id}>
          <Link
          href={`/decks/${deck.id}`}
          className="
            block border rounded p-4
            transition-colors
            bg-card           
            dark:bg-card      
            hover:bg-gray-100 
            dark:hover:bg-gray-700 
            border-border      
            dark:border-sidebar-border 
            text-foreground    
            dark:text-foreground 
          "
        >
          {deck.name}
        </Link>

        </li>
      ))}
    </ul>
  )
}
