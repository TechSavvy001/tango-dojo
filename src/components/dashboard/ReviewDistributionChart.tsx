'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type Props = {
  stats: {
    easy: number
    medium: number
    hard: number
  }
}

export function ReviewDistributionChart({ stats }: Props) {
  const data = [
    { name: 'Easy', value: stats.easy },
    { name: 'Medium', value: stats.medium },
    { name: 'Hard', value: stats.hard },
  ]

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">📊 Bewertungsverteilung</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
