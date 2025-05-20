import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function ReviewSummaryCard({
  stats,
}: {
  stats: {
    total: number
    easy: number
    medium: number
    hard: number
    avgLevel: number
  }
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📚 Karteikarten (letzte 7 Tage)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        <p>🔁 Gesamt: {stats.total}</p>
        <p>✅ Leicht: {stats.easy}</p>
        <p>🟡 Mittel: {stats.medium}</p>
        <p>🔴 Schwer: {stats.hard}</p>
        <p>📈 Durchschnittliches Level: {stats.avgLevel}</p>
      </CardContent>
    </Card>
  )
}
