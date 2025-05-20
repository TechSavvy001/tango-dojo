'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type Props = {
  data: { day: string; count: number }[]
}

/**
 * Zeigt ein Liniendiagramm innerhalb einer shadcn-Card.
 */
export function ReviewLineChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews (letzte 7 Tage)</CardTitle>
      </CardHeader>
      <CardContent className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#22c55e"        // grün (Tailwind emerald-500)
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
