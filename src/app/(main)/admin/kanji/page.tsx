'use client'

import { useEffect, useState } from 'react'
//import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type KanjiEntry = {
  id: string
  kanji: string
  bedeutung: string
  aussprache_on?: string
  aussprache_kun?: string
}

export default function AdminKanjiPage() {
  const [entries, setEntries] = useState<KanjiEntry[]>([])
  const supabase = createBrowserSupabaseClient()
  //const router = useRouter()

  useEffect(() => {
    const fetchKanji = async () => {
      const { data, error } = await supabase
        .from('kanji_entries')
        .select('id, kanji, bedeutung, aussprache_on, aussprache_kun')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Fehler beim Laden:', error.message)
      } else {
        setEntries(data || [])
      }
    }

    fetchKanji()
  }, [supabase])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📚 Kanji verwalten</h1>
        <Button asChild>
          <Link href="/admin/kanji/new">➕ Neues Kanji</Link>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <CardTitle className="text-3xl">{entry.kanji}</CardTitle>
              <p className="text-muted-foreground text-sm">{entry.bedeutung}</p>
              <p className="text-sm">{entry.aussprache_on} / {entry.aussprache_kun}</p>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/admin/kanji/${entry.id}/edit`}>Bearbeiten</Link>
              </Button>
              <Button variant="destructive" onClick={async () => {
                const confirm = window.confirm(`Wirklich „${entry.kanji}“ löschen?`)
                if (!confirm) return

                const { error } = await supabase
                  .from('kanji_entries')
                  .delete()
                  .eq('id', entry.id)

                if (error) {
                  console.error('❌ Fehler beim Löschen:', error.message)
                } else {
                  setEntries(entries.filter(e => e.id !== entry.id))
                }
              }}>
                Löschen
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
