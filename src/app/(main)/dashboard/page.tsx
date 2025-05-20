'use client'

import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { QuizWeekChart } from '@/components/dashboard/QuizWeekChart'
import { subDays, isSameDay, format } from 'date-fns'
import { TageszielCard } from '@/components/dashboard/TageszielCard'
import { TageszielEinstellungen } from '@/components/dashboard/TageszielEinstellungen'
import { ReviewSummaryCard } from '@/components/dashboard/ReviewSummaryCard'
import { ReviewWeekChart } from '@/components/dashboard/ReviewWeekChart'
import { StreakCard } from '@/components/dashboard/StreakCard'
import { TopVocabCard } from '@/components/dashboard/TopVocabCard'
import { ReviewDistributionChart } from '@/components/dashboard/ReviewDistributionChart'
import { DeckProgressChart } from '@/components/dashboard/DeckProgressChart'
import { GesamtFortschrittDonut } from '@/components/dashboard/GesamtFortschrittDonut'


export default function Dashboard() {
  
  const [sessions, setSessions] = useState<{ created_at: string }[]>([])
  const [grouped, setGrouped] = useState<{ day: string; count: number }[]>([])
  const [goal, setGoal] = useState(3)
  const [streak, setStreak] = useState(0)
  const [topVocab, setTopVocab] = useState<{ vokabel_id: string; wort: string; count: number }[]>([])
  const [deckProgress, setDeckProgress] = useState<{ deck: string; progress: number }[]>([])
  const [gesamtFortschritt, setGesamtFortschritt] = useState({ total: 0, learned: 0 })
  const supabase = createBrowserSupabaseClient()

  function calculateStreak(days: { day: string; count: number }[]) {
    const reversed = [...days].reverse()
    let streak = 0
    for (const day of reversed) {
      if (day.count > 0) {
        streak++
      } else {
        break
      }
    }
    return streak
  }
  
  useEffect(() => {
    const fetchSessions = async () => {
      const { data: auth } = await supabase.auth.getUser()
      const userId = auth?.user?.id
      if (!userId) return

      const { data } = await supabase
        .from('quiz_sessions')
        .select('created_at')
        .eq('user_id', userId)

      if (!data) return
      setSessions(data)

      const last7Days = Array.from({ length: 7 }).map((_, i) =>
        subDays(new Date(), 6 - i)
      )

      const groupedData = last7Days.map((day) => {
        const count = data.filter((d) =>
          isSameDay(new Date(d.created_at), day)
        ).length
        return {
          day: format(day, 'EEE'),
          count,
        }
      })

      setGrouped(groupedData)
    }

    fetchSessions()
  }, [supabase])

  const todaysCount = sessions.filter((d) =>
    isSameDay(new Date(d.created_at), new Date())
  ).length

  const [reviewStats, setReviewStats] = useState<{
    total: number
    easy: number
    medium: number
    hard: number
    avgLevel: number
  }>({ total: 0, easy: 0, medium: 0, hard: 0, avgLevel: 0 })
  
  const [reviewGrouped, setReviewGrouped] = useState<{ day: string; count: number }[]>([])
  useEffect(() => {
    const fetchDeckProgress = async () => {
      const { data: auth } = await supabase.auth.getUser()
      const userId = auth?.user?.id
      if (!userId) return
  
      const { data, error } = await supabase
      .from('vokabeln')
      .select(`
        level,
        deck_id,
        decks (name)
      `)
      .eq('user_id', userId)

    if (error) {
      console.error("Fehler beim Laden der Decks:", error.message)
      return
    }

    if (!data || data.length === 0) {
      console.log("Keine Vokabeln gefunden.")
      return
    }

    console.log("Geladene Decks:", data)

    type DeckProgress = {
      deck: string;
      progress: number;
    };
    
    const grouped = data.reduce<Record<string, { total: number; learned: number }>>((acc, v) => {
      const deckName = v.decks?.[0]?.name || 'Unbekannt'; // Korrigiert: Zugriff auf den ersten Deck-Namen
      acc[deckName] = acc[deckName] || { total: 0, learned: 0 };
      acc[deckName].total++;
      if (v.level > 0) acc[deckName].learned++;
      return acc;
    }, {});
    
    const result: DeckProgress[] = Object.entries(grouped).map(([deck, val]) => ({
      deck,
      progress: Math.round((val.learned / val.total) * 100),
    }));
    
    console.log("Deck Progress:", result);
    setDeckProgress(result);
    

      const total = data.length
        const learned = data.filter((v) => v.level > 0).length
        setGesamtFortschritt({ total, learned })

    }
  
    fetchDeckProgress()
  }, [supabase])
  
  useEffect(() => {
    const fetchReviews = async () => {
      const { data: auth } = await supabase.auth.getUser()
      const userId = auth?.user?.id
      if (!userId) return
  
      const { data, error } = await supabase
        .from('review_logs')
        .select(`
          id,
          user_id,
          vokabel_id,
          rating,
          new_level,
          created_at
        `)
        .eq('user_id', userId)

      if (error) {
        console.error("Fehler beim Laden der Reviews:", error.message)
        return
      }

      if (!data || !Array.isArray(data)) {
        console.error("Reviews konnten nicht geladen werden.")
        return
      }
        
  
      const last7Days = Array.from({ length: 7 }).map((_, i) =>
        subDays(new Date(), 6 - i)
      )
  
      const grouped = last7Days.map((day) => {
        const count = data.filter((d) =>
          isSameDay(new Date(d.created_at), day)
        ).length
        return {
          day: format(day, 'EEE'),
          count,
        }
      })
  
      setReviewGrouped(grouped)
  
      const stats = {
        total: data.length,
        easy: data.filter((d) => d.rating === 'easy').length,
        medium: data.filter((d) => d.rating === 'medium').length,
        hard: data.filter((d) => d.rating === 'hard').length,
        avgLevel:
          data.reduce((sum, d) => sum + (d.new_level || 0), 0) / data.length || 0,
      }
      setReviewStats(stats)
  
      // Streak-Berechnung direkt hier (oder separat später)
      const calculatedStreak = calculateStreak(grouped)
      setStreak(calculatedStreak)
      
      // Zähle die Vorkommen pro Vokabel
      const vocabCounts = data.reduce((acc, d) => {
        if (!d.vokabel_id) return acc
        acc[d.vokabel_id] = (acc[d.vokabel_id] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const topIds = Object.entries(vocabCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, count]) => ({ id, count }))
      
      // Hole Vokabeltexte dazu
      if (topIds.length > 0) {
        const { data: vocabData } = await supabase
        .from('vokabeln')
        .select('id, meaning_de')
        .in('id', topIds.map((v) => v.id))
  
      
        if (vocabData) {
          const mapped = topIds.map((v) => {
            const match = vocabData.find((x) => x.id === v.id)
            return {
              vokabel_id: v.id,
              wort: match?.meaning_de || 'Unbekannt',
              count: v.count,
            }
          })
          setTopVocab(mapped)
        }
      }
      
    }
  
    fetchReviews()
  }, [supabase])
  
    
  
  
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold">🎯 Dein Dashboard</h1>

      {/* Einstellungen */}
      <section className="border-t pt-6">
        <TageszielEinstellungen onUpdate={(val) => setGoal(val)} />
      </section>

      {/* 1. Zeile: QuizWeekChart + TageszielCard + ReviewSummaryCard */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuizWeekChart data={grouped} />
        <TageszielCard todaysCount={todaysCount} goal={goal} />
        <ReviewSummaryCard stats={reviewStats} />
      </section>

      {/* 2. Zeile: ReviewWeekChart + Streak + TopVocab */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReviewWeekChart data={reviewGrouped} />
        <StreakCard streak={streak} />
        <TopVocabCard topVocab={topVocab} />
      </section>

      {/* 3. Zeile: Verteilung + Deck-Progress + Donut */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReviewDistributionChart stats={reviewStats} />
        <DeckProgressChart data={deckProgress} />
        <GesamtFortschrittDonut
          total={gesamtFortschritt.total}
          learned={gesamtFortschritt.learned}
        />
      </section>
      
    </div>
  )
}