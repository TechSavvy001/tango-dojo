'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
  data: { day: string; count: number }[]
}

export function ReviewWeekChart({ data }: Props) {
  return (
    <Card className="p-4 shadow-sm">
    <CardContent className="p-0 space-y-2">

    <div className="mt-4">
      <h3 className="text-sm text-muted-foreground mb-2">🧠 Karteikarten gelernt</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    </CardContent>
    </Card>
  )
  
}
