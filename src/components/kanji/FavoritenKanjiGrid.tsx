'use client'

import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

type KanjiEntry = {
  id: string
  kanji: string
  bedeutung: string
  aussprache_on?: string
  aussprache_kun?: string
}
export function FavoritenKanjiGrid() {
  const [favoriten, setFavoriten] = useState<KanjiEntry[]>([])
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    const loadFavoriten = async () => {
      const { data: auth } = await supabase.auth.getUser()
      const userId = auth?.user?.id
      if (!userId) return

      const { data: favs, error } = await supabase
        .from('kanji_favoriten')
        .select('kanji_entries(id, kanji, bedeutung, aussprache_on, aussprache_kun)')
        .eq('user_id', userId)

      if (error) console.error('❌ Fehler beim Laden der Favoriten:', error.message)

        setFavoriten(favs?.flatMap(f => f.kanji_entries) ?? [])
      }

    loadFavoriten()
  }, [supabase])

  if (favoriten.length === 0) return <p className="text-muted-foreground">Keine Favoriten gefunden.</p>

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {favoriten.map((kanji) => (
        <Link key={kanji.id} href={`/kanji/${kanji.id}`}>
          <Card className="cursor-pointer hover:shadow-md transition">
            <CardHeader>
              <CardTitle className="text-3xl">{kanji.kanji}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {kanji.bedeutung}<br />
              {kanji.aussprache_on} / {kanji.aussprache_kun}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
