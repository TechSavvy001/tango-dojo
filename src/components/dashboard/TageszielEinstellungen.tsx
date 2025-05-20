'use client'

import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export function TageszielEinstellungen({
  onUpdate,
}: {
  onUpdate?: (goal: number) => void
}) {
  const [goal, setGoal] = useState(3)
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    const fetchGoal = async () => {
      const { data: auth } = await supabase.auth.getUser()
      const userId = auth?.user?.id
      if (!userId) return

      const { data } = await supabase
        .from('user_goals')
        .select('daily_quiz_goal')
        .eq('user_id', userId)
        .single()

      if (data?.daily_quiz_goal) {
        setGoal(data.daily_quiz_goal)
        onUpdate?.(data.daily_quiz_goal)
      }
    }

    fetchGoal()
  }, [onUpdate, supabase])

  const saveGoal = async () => {
    setLoading(true)

    const { data: auth } = await supabase.auth.getUser()
    const userId = auth?.user?.id
    if (!userId) return

    await supabase
      .from('user_goals')
      .upsert({ user_id: userId, daily_quiz_goal: goal })

    setLoading(false)
    onUpdate?.(goal)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        saveGoal()
      }}
      className="space-y-2"
    >
      <Label htmlFor="goal">🎯 Dein Tagesziel (Quizrunden)</Label>
      <Input
        id="goal"
        type="number"
        value={goal}
        onChange={(e) => setGoal(Number(e.target.value))}
        min={1}
        max={20}
      />
      <Button type="submit" disabled={loading}>
        Speichern
      </Button>
    </form>
  )
}
