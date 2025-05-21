'use client'

import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { KarteikartenClient } from '@/components/karteikarten/KarteikartenClient'
import { Vokabel } from '@/types/vokabel'
import { FilterBar } from '@/components/karteikarten/FilterBar'
import { useCallback } from 'react'

export default function KarteikartenPage() {
  const supabase = createBrowserSupabaseClient()
  
  const [vokabeln, setVokabeln] = useState<Vokabel[]>([])
  const [decks, setDecks] = useState<{ id: string; name: string }[]>([])
  const [selectedDeckId, setSelectedDeckId] = useState<'all' | string>('all')
  const [shuffleMode, setShuffleMode] = useState(false)
  const [frontType, setFrontType] = useState<'de' | 'kanji' | 'kana'>('kanji')
  const [filterLevel, setFilterLevel] = useState<'all' | 'lt3' | 'gte3'>('all')
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)


  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth?.user?.id
    if (!userId) {
      setLoggedIn(false)
      setLoading(false)
      return
    }

    setLoggedIn(true)

  const { data: decksData } = await supabase
    .from('decks')
    .select('id, name')
    .eq('user_id', userId)
  if (decksData) setDecks(decksData)

  let query = supabase
    .from('vokabeln')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (selectedDeckId !== 'all') query = query.eq('deck_id', selectedDeckId)
  const { data } = await query
  if (data) setVokabeln(shuffleMode ? [...data].sort(() => Math.random() - 0.5) : data)

  setLoading(false)
}, [supabase, selectedDeckId, shuffleMode])


useEffect(() => {
  fetchData()
}, [fetchData])

  if (loading) return <p className="p-8">Lade...</p>
  if (!loggedIn) return <p className="p-8">Bitte einloggen</p>

  return (
    <div className="p-6 space-y-4 max-w-4xl mx-auto">
      <FilterBar
        decks={decks}
        selectedDeckId={selectedDeckId}
        setSelectedDeckId={setSelectedDeckId}
        shuffleMode={shuffleMode}
        setShuffleMode={setShuffleMode}
        filterLevel={filterLevel}
        setFilterLevel={setFilterLevel}
        frontType={frontType}
        setFrontType={setFrontType}
      />
      <KarteikartenClient
        vokabeln={vokabeln}
        frontType={frontType}
        filterLevel={filterLevel}
      />
    </div>
  )
}
