'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
  const rawId = useParams()?.id
  const id = Array.isArray(rawId) ? rawId[0] : rawId
  const supabase = createBrowserSupabaseClient()

  const [kanji, setKanji] = useState<KanjiEntry | null>(null)
  const [radikale, setRadikale] = useState<Radikal[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      // Lade Kanji
      const { data: kanjiEntry } = await supabase
        .from('kanji_entries')
        .select('*')
        .eq('id', id)
        .single()

      setKanji(kanjiEntry)

      // Lade Radikale
      const { data: radikaleData } = await supabase
        .from('kanji_radikale')
        .select('name, bedeutung, erklaerung')
        .eq('kanji_id', id)

      setRadikale(radikaleData ?? [])

      // Lade Benutzerrolle
      const { data: auth } = await supabase.auth.getUser()
      const userId = auth?.user?.id

      if (!userId) return

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (userData?.role === 'admin') {
        setIsAdmin(true)
      }

        const { data: fav } = await supabase
        .from('kanji_favoriten')
        .select('id')
        .eq('user_id', userId)
        .eq('kanji_id', id)
        .maybeSingle()

        setIsFavorited(!!fav)

    }

    fetchData()
  }, [id, supabase])

  if (!kanji) return <div className="p-6">⏳ Lade Kanji...</div>

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl">{kanji.kanji}</CardTitle>
          <p className="text-muted-foreground">{kanji.bedeutung}</p>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p><strong>On:</strong> {kanji.aussprache_on || '–'}</p>
          <p><strong>Kun:</strong> {kanji.aussprache_kun || '–'}</p>
          <p><strong>Merksatz:</strong><br />{kanji.merksatz || '–'}</p>
          <p><strong>Erläuterung:</strong><br />{kanji.erklaerung || '–'}</p>
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
                <Link href={`/kanji?radikal=${encodeURIComponent(r.name)}`}>
                  <Badge variant="outline" className="cursor-pointer hover:underline">{r.name}</Badge>
                </Link> – {r.bedeutung}
                <p className="text-muted-foreground mt-1 whitespace-pre-line">{r.erklaerung}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

        <div className="text-right space-x-2">
        {isAdmin && (
            <Button variant="outline" asChild>
            <Link href={`/admin/kanji/${id}/edit`}>Bearbeiten</Link>
            </Button>
        )}

        <Button
        variant={isFavorited ? 'destructive' : 'outline'}
        onClick={async () => {
            const { data: auth, error: authError } = await supabase.auth.getUser()
            const userId = auth?.user?.id
            if (authError || !userId) {
            console.error('❌ Fehler beim Laden des Benutzers:', authError)
            return
            }

            if (isFavorited) {
            const { error } = await supabase
                .from('kanji_favoriten')
                .delete()
                .eq('user_id', userId)
                .eq('kanji_id', id)

            if (error) {
                console.error('❌ Fehler beim Entfernen des Favoriten:', error)
                return
            }

            setIsFavorited(false)
            } else {
            const { error } = await supabase
                .from('kanji_favoriten')
                .insert({ user_id: userId, kanji_id: id })

            if (error) {
                console.error('❌ Fehler beim Speichern des Favoriten:', error)
                return
            }

            setIsFavorited(true)
            }
        }}
        >
        {isFavorited ? '★ Entfernen' : '☆ Favorisieren'}
        </Button>

        </div>

            
    </div>
  )
}
