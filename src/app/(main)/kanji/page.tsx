'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FavoritenKanjiGrid } from '@/components/kanji/FavoritenKanjiGrid'

type KanjiEntry = {
  id: string
  kanji: string
  bedeutung: string
  aussprache_on?: string
  aussprache_kun?: string
}

export default function KanjiSearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<KanjiEntry[]>([])
  const searchParams = useSearchParams()
  const radikalFilter = searchParams.get('radikal')
  
  useEffect(() => {
    const fetchKanji = async () => {
      const supabase = createBrowserSupabaseClient()
  
      if (radikalFilter) {
        // 1. Hole IDs der Kanji mit diesem Radikal
        const { data: radikalRows, error: radikalError } = await supabase
          .from('kanji_radikale')
          .select('kanji_id')
          .eq('name', radikalFilter)
  
        if (radikalError) {
          console.error('Fehler bei Radikal-Suche:', radikalError.message)
          return
        }
  
        const ids = radikalRows.map(r => r.kanji_id)
        if (ids.length === 0) {
          setResults([])
          return
        }
  
        // 2. Hole die Kanji
        const { data: kanjiData, error: kanjiError } = await supabase
          .from('kanji_entries')
          .select('id, kanji, bedeutung, aussprache_on, aussprache_kun')
          .in('id', ids)
  
        if (kanjiError) {
          console.error('Fehler beim Kanji-Laden:', kanjiError.message)
          return
        }
  
        setResults(kanjiData ?? [])
      }
  
      // Falls kein Radikal gesucht wird → normale Volltextsuche
      else if (query.trim() !== '') {
        const { data, error } = await supabase
          .from('kanji_entries')
          .select('id, kanji, bedeutung, aussprache_on, aussprache_kun')
          .or(
            `kanji.ilike.%${query}%,bedeutung.ilike.%${query}%,aussprache_on.ilike.%${query}%,aussprache_kun.ilike.%${query}%`
          )
  
        if (error) {
          console.error('Fehler bei Suche:', error.message)
        } else {
          setResults(data ?? [])
        }
      } else {
        // Wenn nichts eingegeben → alles laden
        const { data } = await supabase
          .from('kanji_entries')
          .select('id, kanji, bedeutung, aussprache_on, aussprache_kun')
          .order('kanji', { ascending: true })
  
        setResults(data ?? [])
      }
    }
  
    fetchKanji()
  }, [query, radikalFilter])
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🔍 Kanji durchsuchen</h1>
        <Tabs defaultValue="alle" className="space-y-6">
          <TabsList className="bg-card p-1 rounded-md flex gap-2 border border-border">
            <TabsTrigger
              value="alle"
              className="
                px-4 py-1 rounded-md border border-border
                text-foreground bg-muted
                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                transition-colors
              "
            >
              Alle Kanji
            </TabsTrigger>

            <TabsTrigger
              value="favoriten"
              className="
                px-4 py-1 rounded-md border border-border
                text-foreground bg-muted
                data-[state=active]:bg-accent data-[state=active]:text-accent-foreground
                transition-colors
              "
            >
              Favoriten
            </TabsTrigger>
          </TabsList>

        {/* Alle Kanji (Suche oder Volltext) */}
        <TabsContent value="alle">
          <Input
            placeholder="Suche nach Kanji, Bedeutung oder Lesung"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              mb-4 
              bg-input 
              text-foreground 
              placeholder-[color:var(--muted-foreground)] 
              border 
              border-border 
              focus:ring-ring
            "
          />


            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {results.map((kanji) => (
                <Link key={kanji.id} href={`/kanji/${kanji.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition">
                    <CardHeader>
                    <CardTitle className="text-3xl font-kanji">{kanji.kanji}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                    {kanji.bedeutung}<br />
                    {kanji.aussprache_on} / {kanji.aussprache_kun}
                    </CardContent>
                </Card>
                </Link>
            ))}
            </div>
        </TabsContent>

        {/* Favoriten */}
        <TabsContent value="favoriten">
            <FavoritenKanjiGrid />
        </TabsContent>
        </Tabs>

    </div>
  )
}
