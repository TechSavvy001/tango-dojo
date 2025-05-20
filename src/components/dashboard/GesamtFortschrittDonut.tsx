'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

type Props = {
  total: number
  learned: number
}

export function GesamtFortschrittDonut({ total, learned }: Props) {
  const percentage = total > 0 ? Math.round((learned / total) * 100) : 0
  const data = [
    { name: 'Gelernt', value: learned },
    { name: 'Ungelernt', value: total - learned },
  ]

  const COLORS = ['#10b981', '#e5e7eb'] // grün + grau

  return (
    <div className="p-4 border rounded-lg shadow-sm text-center">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">📘 Gesamtfortschritt</h3>
      <div className="relative w-full h-40">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-semibold">{percentage}%</span>
        </div>
      </div>
    </div>
  )
}
