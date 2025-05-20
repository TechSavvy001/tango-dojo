'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type KanjiEntry = {
  id: string
  kanji: string
  bedeutung: string
  aussprache_on?: string
  aussprache_kun?: string
  erklaerung?: string
  merksatz?: string
}

type Radikal = {
  name: string
  bedeutung: string
  erklaerung: string
}

export default function KanjiDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [kanji, setKanji] = useState<KanjiEntry | null>(null)
  const [radikale, setRadikale] = useState<Radikal[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: entry } = await supabase
        .from('kanji_entries')
        .select('*')
        .eq('id', id)
        .single()

      const { data: radikaleData } = await supabase
        .from('kanji_radikale')
        .select('name, bedeutung, erklaerung')
        .eq('kanji_id', id)

      setKanji(entry)
      setRadikale(radikaleData ?? [])
    }

    fetchData()
  }, [id])

  if (!kanji) {
    return <div className="p-6 text-center text-muted-foreground">❌ Kanji nicht gefunden.</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl">{kanji.kanji}</CardTitle>
          <p className="text-muted-foreground">{kanji.bedeutung}</p>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div><strong>On-Lesung:</strong> {kanji.aussprache_on || '–'}</div>
          <div><strong>Kun-Lesung:</strong> {kanji.aussprache_kun || '–'}</div>
          <div>
            <strong>Merksatz:</strong><br />
            <span className="whitespace-pre-line">{kanji.merksatz || '–'}</span>
          </div>
          <div>
            <strong>Erläuterung:</strong><br />
            <span className="whitespace-pre-line">{kanji.erklaerung || '–'}</span>
          </div>
        </CardContent>
      </Card>

      {radikale.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Radikale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {radikale.map((r, i) => (
              <div key={i} className="border-b pb-2">
                <Badge variant="outline">{r.name}</Badge> – {r.bedeutung}
                <p className="text-muted-foreground mt-1 whitespace-pre-line">{r.erklaerung}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
