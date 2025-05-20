'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type Props = {
  todaysCount: number
  goal: number
}

export function TageszielCard({ todaysCount, goal }: Props) {
  const progress = Math.min((todaysCount / goal) * 100, 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>🎯 Tagesziel</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          {todaysCount} von {goal} Quizrunden heute
        </p>
        <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="text-green-600 text-sm pt-2">✅ Ziel erreicht!</p>
        )}
      </CardContent>
    </Card>
  )
}
