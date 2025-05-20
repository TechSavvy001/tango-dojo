'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'



type GroupedRadikal = {
  name: string
  bedeutung: string
  erklaerung: string
  count: number
}

export default function RadikalePage() {
  const [radikale, setRadikale] = useState<GroupedRadikal[]>([])

  useEffect(() => {
    const fetchRadikale = async () => {
      const { data, error } = await supabase
        .from('kanji_radikale')
        .select('name, bedeutung, erklaerung')

      if (error) {
        console.error('❌ Fehler beim Laden:', error.message)
        return
      }

      // Gruppieren nach Name
      const grouped = Object.values(
        (data ?? []).reduce((acc, r) => {
          const key = r.name
          if (!acc[key]) {
            acc[key] = { ...r, count: 1 }
          } else {
            acc[key].count += 1
          }
          return acc
        }, {} as Record<string, GroupedRadikal>)
      )

      setRadikale(grouped)
    }

    fetchRadikale()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">部首 – Alle Radikale</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {radikale.map((r) => (
          <Link key={r.name} href={`/kanji?radikal=${encodeURIComponent(r.name)}`}>
            <Card className="cursor-pointer hover:shadow-md transition">
              <CardHeader>
                <CardTitle>
                  <Badge variant="outline">{r.name}</Badge> – {r.bedeutung}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {r.erklaerung?.slice(0, 100)}...
                <br />
                <span className="text-xs">Verwendet in {r.count} Kanji</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
