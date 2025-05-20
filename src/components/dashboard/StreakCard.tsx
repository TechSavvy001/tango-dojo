'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Flame, Sprout, Bolt, Crown } from 'lucide-react'

type Props = {
  streak: number
}

export function StreakCard({ streak }: Props) {
  const getLevel = () => {
    if (streak >= 14) return { label: 'Unaufhaltbar', icon: <Crown className="w-6 h-6" />, color: 'text-yellow-500', bg: 'bg-yellow-100' }
    if (streak >= 7) return { label: 'Konsequent', icon: <Bolt className="w-6 h-6" />, color: 'text-blue-600', bg: 'bg-blue-100' }
    if (streak >= 3) return { label: 'Dranbleiber', icon: <Flame className="w-6 h-6" />, color: 'text-orange-600', bg: 'bg-orange-100' }
    return { label: 'Anfänger', icon: <Sprout className="w-6 h-6" />, color: 'text-gray-500', bg: 'bg-gray-100' }
  }

  const level = getLevel()

  return (
    <Card className="flex items-center space-x-4 p-6 shadow-sm">
      <div className={`${level.bg} ${level.color} p-2 rounded-full`}>
        {level.icon}
      </div>
      <CardContent className="p-0">
        <p className="text-sm text-muted-foreground">Aktueller Streak</p>
        <p className="text-xl font-bold">{streak} Tag{streak === 1 ? '' : 'e'}</p>
        <p className={`text-xs font-medium ${level.color}`}>{level.label}</p>
      </CardContent>
    </Card>
  )
}
