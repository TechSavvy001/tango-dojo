'use client'

import { Card, CardContent } from '@/components/ui/card'

type Vocab = {
  vokabel_id: string
  wort: string
  count: number
}

type Props = {
  topVocab: Vocab[]
}

export function TopVocabCard({ topVocab }: Props) {
  return (
    <Card className="p-4 shadow-sm">
      <CardContent className="p-0 space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">📈 Meist geübte Vokabeln</h3>
        {topVocab.length === 0 ? (
          <p className="text-sm text-gray-500">Noch keine Daten</p>
        ) : (
          <ul className="space-y-1">
            {topVocab.map((v, i) => (
              <li key={v.vokabel_id} className="flex justify-between text-sm">
                <span className="truncate">{i + 1}. {v.wort}</span>
                <span className="text-gray-500">{v.count}x</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
