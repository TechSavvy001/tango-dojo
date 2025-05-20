'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { getUserWithRole } from '@/lib/getUserWithRole'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { StreakCard } from '@/components/dashboard/StreakCard'
import { subDays, format, isSameDay } from 'date-fns'
import { ReviewLineChart } from '@/components/dashboard/ReviewLineChart'
import type { Vokabel } from '@/types/vokabel'

export default function DashboardPage() {
  const session = useSession()
  const supabase = createBrowserSupabaseClient()
  const router = useRouter()
  const [reviewGrouped, setReviewGrouped] = useState<{ day: string; count: number }[]>([])

  const [userName, setUserName] = useState<string | null>(null)
  const [lastVocab, setLastVocab] = useState<{ kanji: string; kana: string; romaji: string; meaning_de: string }[]>([])
  const userId = session?.user?.id ?? ''
  const [todayVocab, setTodayVocab] = useState<Vokabel | null>(null)

  // State für den Streak
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    if (session === null) return
    if (!session) router.push('/login')
  }, [session, router])
  
  useEffect(() => {
    if (!session || !userId) return

    const fetchTodayVocab = async () => {
      // 1) Lade alle Vokabeln des Nutzers
      const { data, error } = await supabase
        .from('vokabeln')                           // kein Generic hier
        .select('id, kanji, kana, meaning_de')
        .eq('user_id', userId)

      if (error) {
        console.error('Vokabel des Tages konnte nicht geladen werden', error)
        return
      }
      if (!data || data.length === 0) {
        console.warn('Keine Vokabeln zum Auswählen vorhanden')
        return
      }

      // 2) Client-seitig eine zufällige Vokabel wählen
      const randomIndex = Math.floor(Math.random() * data.length)
      setTodayVocab(data[randomIndex] as Vokabel)
    }

    fetchTodayVocab()
  }, [session, userId, supabase])

  useEffect(() => {
    if (!session || !userId) return
    const fetchChart = async () => {
      const { data } = await supabase
        .from('review_logs')
        .select('created_at')
        .eq('user_id', userId)
      if (!data) return

      const last7Days = Array.from({ length: 7 }).map((_, i) =>
        subDays(new Date(), 6 - i)
      )
      const grouped = last7Days.map(day => ({
        day: format(day, 'EEE'),
        count: data.filter(r => isSameDay(new Date(r.created_at), day)).length,
      }))
      setReviewGrouped(grouped)
    }
    fetchChart()
  }, [session, userId, supabase])

  useEffect(() => {
    if (!session || !userId) return

    async function fetchData() {
      const user = await getUserWithRole(supabase)
      if (!user) return
      setUserName(user.name)
    }

    fetchData()
  }, [session, userId, supabase])

  useEffect(() => {
    if (!session) return

    const fetchLastVocab = async () => {
      const { data: auth } = await supabase.auth.getUser()
      const userId = auth?.user?.id
      if (!userId) return

      const { data, error } = await supabase
        .from('vokabeln')
        .select('kanji, kana, romaji, meaning_de')
        .eq('user_id', userId)
        .not('last_seen', 'is', null)
        .order('last_seen', { ascending: false })
        .limit(5)

      if (error) {
        console.error("Fehler beim Laden der letzten Vokabeln:", error.message)
        return
      }

      setLastVocab(data ?? [])
    }

    fetchLastVocab()
  }, [session, userId, supabase])


    // Helper to calculate streak
    function calculateStreak(days: Array<{ day: string; count: number }>) {
      let countStreak = 0
      for (const { count } of [...days].reverse()) {
        if (count > 0) countStreak++
        else break
      }
      return countStreak
    }

// Fetch reviews and compute streak
useEffect(() => {
  if (!session || !userId) return

  const fetchStreak = async () => {
    const { data, error } = await supabase
      .from('review_logs')
      .select('created_at')
      .eq('user_id', userId)

    if (error || !data) {
      console.error('Error loading review logs:', error?.message)
      return
    }

    // Prepare last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) =>
      subDays(new Date(), 6 - i)
    )

    // Group by day
    const grouped = last7Days.map((day) => ({
      day: format(day, 'EEE'),
      count: data.filter((r) =>
        isSameDay(new Date(r.created_at), day)
      ).length,
    }))

    setStreak(calculateStreak(grouped))
  }

  fetchStreak()
}, [session, userId, supabase])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Guten Morgen, おはようございます'
    if (hour < 18) return 'Hallo, こんにちは'
    return 'Guten Abend, こんばんは'
  }

  const getRandomQuote = () => {
    const quotes = [
      "Ein Tag ohne Lernen ist ein verlorener Tag.",
      "毎日一歩ずつ (Jeden Tag einen Schritt).",
      "Sprache ist der Schlüssel zur Welt.",
      "Übung macht den Meister.",
      "Der Weg zu fließendem Japanisch beginnt mit dem ersten Wort."
    ]
    return quotes[Math.floor(Math.random() * quotes.length)]
  }
  
  if (session === null) return <p className="p-4">⏳ Lade Session...</p>
  if (!session) return <p className="p-4">🔒 Nicht eingeloggt.</p>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <section className="text-center space-y-2">
        <h1 className="text-3xl animate-fade-in">
          {getGreeting()} {userName ?? 'Lade...'} 👋
        </h1>
        <p className="text-muted-foreground mt-2 animate-fade-in-delayed">
          🎌 Heute ist ein großartiger Tag, um Japanisch zu lernen!
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Streak-Card */}
        <StreakCard streak={streak} />

        {todayVocab && (
        <Card>
          <CardHeader>
            <CardTitle>Vokabel des Tages</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold">{todayVocab.kanji}</p>
            <p className="text-lg text-muted-foreground">{todayVocab.meaning_de}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Zitat des Tages</CardTitle></CardHeader>
        <CardContent className="italic text-center">
          “{getRandomQuote()}”
        </CardContent>
      </Card>

      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      <Card className="hover:scale-105 transition-transform shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            📌 Deine letzten Vokabeln
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="mt-2 space-y-3">
            {lastVocab.length === 0 ? (
              <p className="text-foreground">Noch keine Vokabeln gelernt.</p>
              ) : (
              lastVocab.map((vok, index) => (
                <li key={index} className="flex items-center gap-5">
                  <div className="flex-shrink-0 rounded-md bg-blue-100 text-blue-600 px-3 py-1 font-bold text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    {vok.kanji ?? '–'}
                  </div>
                  <div className="flex flex-col">
                  <p className="text-md font-medium text-foreground">
                      {vok.kana ?? '–'} / {vok.romaji ?? '–'}
                    </p>
                    <p className="text-sm text-foreground">{vok.meaning_de ?? '–'}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
      <ReviewLineChart data={reviewGrouped} />
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      

      <Card className="hover:scale-105 transition-transform">
          <CardHeader><CardTitle>📚 Neues Deck</CardTitle></CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/vokabeln')}>Erstelle ein neues Deck</Button>
          </CardContent>
        </Card>


        <Card className="hover:scale-105 transition-transform">
          <CardHeader><CardTitle>💡 Quiz starten</CardTitle></CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/quiz')}>Starte ein Quiz</Button>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-transform">
          <CardHeader><CardTitle>📖 Lerne weiter Karteikarten</CardTitle></CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/karteikarten')}>Fortsetzen</Button>
          </CardContent>
        </Card>
      </section>

      <footer className="text-center mt-12 text-sm text-muted-foreground">
        📘 Lerne jeden Tag ein wenig und du wirst überrascht sein, wie weit du kommst.
      </footer>

    </div>
  )
}
