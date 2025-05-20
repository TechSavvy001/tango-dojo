'use client'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { useState, useEffect } from 'react'
import { Flashcard } from './Flashcard'
import type { Vokabel } from '@/types/vokabel'

type Props = {
  vokabeln: Vokabel[]           // importierter Type
  frontType: 'de' | 'kanji' | 'kana'
  filterLevel: 'all' | 'lt3' | 'gte3'
}


export function KarteikartenClient({ vokabeln, frontType, filterLevel }: Props) {
  const supabase = createBrowserSupabaseClient()

  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: auth } = await supabase.auth.getUser()
      setUserId(auth?.user?.id ?? null)
    }
    fetchUser()
  }, [supabase.auth])

  const filteredVokabeln = vokabeln.filter((v) => {
    const level = v.level ?? 0
    if (filterLevel === 'lt3') return level < 3
    if (filterLevel === 'gte3') return level >= 3
    return true
  })

  const currentVokabel = filteredVokabeln[index] ?? null

  const handleFeedback = async (type: 'easy' | 'medium' | 'hard') => {
    if (!userId || !currentVokabel?.id) return
  
    const currentLevel = currentVokabel.level ?? 0
    let newLevel = currentLevel
  
    if (type === 'easy') newLevel += 1
    else if (type === 'medium') newLevel += 0.5
    else if (type === 'hard') newLevel = Math.max(0, currentLevel - 1)
  
    // Feedback anzeigen
    setFeedback(type === 'hard' ? 'wrong' : 'correct')
  
    // nächstes Wort nach kurzer Pause
    setTimeout(() => {
      setFeedback(null)
      const nextIndex = (index + 1) % filteredVokabeln.length
      setIndex(nextIndex)
    }, 300)
  
    // Speichere neues Level in Vokabeln
    await supabase
      .from('vokabeln')
      .update({
        level: newLevel,
        last_seen: new Date().toISOString(),
      })
      .eq('id', currentVokabel.id)
      .eq('user_id', userId)
  
    // Logge Feedback
    await supabase.from('review_logs').insert({
      user_id: userId,
      vokabel_id: currentVokabel.id,
      rating: type,
      new_level: newLevel,
    })
  }

  return (
    <div className="p-8 space-y-4">
      {filteredVokabeln.length === 0 ? (
        <p className="text-center text-gray-500">Keine Vokabeln für diesen Filter gefunden.</p>
      ) : (
        <>
          <p className="text-sm text-center text-gray-600">
            Karte {index + 1} von {filteredVokabeln.length}
          </p>

          <Flashcard
            vokabel={filteredVokabeln[index]}
            frontType={frontType}
            onFeedback={handleFeedback}
          />

          {/* Feedback-Anzeige */}
          {feedback && (
            <p className={`text-center text-lg font-semibold transition-opacity duration-300 ${
              feedback === 'correct' ? 'text-green-600' : 'text-red-600'
            }`}>
              {feedback === 'correct' ? '✅ Richtig!' : '❌ Falsch!'}
            </p>
          )}
        </>

      )}
    </div>
  )
}
