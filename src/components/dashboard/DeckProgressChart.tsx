'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts'

type Props = {
  data: { deck: string; progress: number }[]
}

export function DeckProgressChart({ data }: Props) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">🗂️ Fortschritt nach Deck</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="deck" width={100} />
          <Tooltip formatter={(v: number) => `${v}%`} />
          <Bar dataKey="progress" fill="#60a5fa">
          <LabelList
            dataKey="progress"
            position="right"
            formatter={(v: number) => `${v}%`}
          />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
