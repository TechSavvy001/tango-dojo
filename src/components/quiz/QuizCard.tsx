'use client'

import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { shuffleArray } from '@/lib/shuffle' // kleine Shuffle-Helferfunktion
import { Button } from '@/components/ui/button'
import { useCallback } from 'react'
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

type QuizQuestion = {
    question: string
    correct: string
    options: string[]
  }  

  type QuizAnswer = {
    question: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
  }
  
export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [numQuestions, setNumQuestions] = useState(10)
  const [shuffleEnabled, setShuffleEnabled] = useState(true)
  const [frontType, setFrontType] = useState<'kanji' | 'kana' | 'de'>('kanji')
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const supabase = createBrowserSupabaseClient()

  const currentQuestion = questions[currentIndex]

  const fetchQuestions = useCallback(async () => {
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth?.user?.id
    if (!userId) return
  
    const { data } = await supabase
      .from('vokabeln')
      .select('kanji, kana, meaning_de')
      .eq('user_id', userId)
  
    if (!data) return
  
    const baseData = shuffleEnabled ? shuffleArray(data) : data
  
    const quizQs: QuizQuestion[] = baseData.slice(0, numQuestions).map((vok) => {
      const distractorPool = baseData.filter((d) => d.kanji !== vok.kanji)
  
      let question = ''
      let correct = ''
      let options: string[] = []
  
      if (frontType === 'de') {
        question = vok.meaning_de
        correct = vok.kanji
        const distractors = shuffleArray(distractorPool.map((d) => d.kanji)).slice(0, 3)
        options = shuffleArray([vok.kanji, ...distractors])
      } else {
        question = frontType === 'kanji' ? vok.kanji : vok.kana
        correct = vok.meaning_de
        const distractors = shuffleArray(distractorPool.map((d) => d.meaning_de)).slice(0, 3)
        options = shuffleArray([vok.meaning_de, ...distractors])
      }
  
      return {
        question: `Was bedeutet ${question}?`,
        correct,
        options,
      }
    })
  
    setAnswers([])
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setQuestions(quizQs)
  }, [supabase, numQuestions, shuffleEnabled, frontType])
  
  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])
  

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return
    setSelectedAnswer(answer)
  
    const isCorrect = answer === currentQuestion.correct
    const newEntry: QuizAnswer = {
      question: currentQuestion.question,
      userAnswer: answer,
      correctAnswer: currentQuestion.correct,
      isCorrect,
    }
    setAnswers((prev) => [...prev, newEntry])
  }
  
  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setShowResult(true)
    } else {
      setCurrentIndex((i) => i + 1)
      setSelectedAnswer(null)
    }
  }

  // automatische Speicherung bei Quiz-Ende
  useEffect(() => {
    if (!showResult || answers.length === 0) return
  
    const saveResults = async () => {
      const { data: auth } = await supabase.auth.getUser()
      const userId = auth?.user?.id
      if (!userId) return
  
      const inserts = answers.map((a) => ({
        user_id: userId,
        frage_text: a.question,
        antwort: a.userAnswer,
        richtig: a.isCorrect,
        vokabel_kanji: extractKanjiFromQuestion(a.question),
        frage_typ: frontType,
      }))
  
      await supabase.from('quiz_results').insert(inserts)
      await supabase.from('quiz_sessions').insert({ user_id: userId })
    }
  
    saveResults()
  }, [showResult, answers, frontType, supabase]) 

  // Hilfsfunktion für Kanji
  const extractKanjiFromQuestion = (q: string) =>
    q.replace('Was bedeutet', '').replace('?', '').trim()
  if (questions.length === 0) return <p className="p-8">Lade Fragen...</p>

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4 bg-card text-card-foreground rounded-xl shadow">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2">
          <Label>Fragenanzahl</Label>
          <Select value={numQuestions.toString()} onValueChange={(val) => setNumQuestions(Number(val))}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Anzahl" />
            </SelectTrigger>
<SelectContent className="w-full bg-popover text-popover-foreground shadow-lg z-50" position="popper">
              {[5, 10, 15, 20].map((n) => (
                <SelectItem key={n} value={n.toString()}>{n} Fragen</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="shuffle"
            checked={shuffleEnabled}
            onCheckedChange={(val) => setShuffleEnabled(Boolean(val))}
          />
          <Label htmlFor="shuffle">Antwortmöglichkeiten mischen</Label>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Frage anzeigen als</Label>
          <Select value={frontType} onValueChange={(val) => setFrontType(val as 'kanji' | 'kana' | 'de')}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kanji">Kanji</SelectItem>
              <SelectItem value="kana">Kana</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>


      <p className="text-sm text-gray-500">
        Frage {currentIndex + 1} von {questions.length}
      </p>
      <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>
      <div className="space-y-2">
        {currentQuestion.options.map((option, idx) => {
          const isCorrect = option === currentQuestion.correct
          const isSelected = selectedAnswer === option

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              className={`w-full text-left p-2 border rounded-md transition
              ${
                selectedAnswer
                  ? isCorrect
                    ? 'bg-green-200 dark:bg-green-700 border-green-400 dark:border-green-500'
                    : isSelected
                    ? 'bg-red-200 dark:bg-red-700 border-red-400 dark:border-red-500'
                    : 'opacity-50'
                  : 'hover:bg-muted hover:border-muted-foreground dark:hover:bg-muted dark:hover:border-muted-foreground'
              }`}

              disabled={!!selectedAnswer}
            >
              {option}
            </button>
          )
        })}
      </div>
      {selectedAnswer && !showResult && (
        <div className="pt-4">
            <Button onClick={nextQuestion}>Nächste Frage</Button>
        </div>
        )}
        {!showResult && (
        <div className="pt-8 flex justify-end">
            <Button variant="outline" onClick={fetchQuestions}>
            Quiz zurücksetzen
            </Button>
        </div>
        )}
    {showResult && (
  <div className="pt-6 space-y-4 border-t border-gray-200">
    <h3 className="text-lg font-semibold">🎉 Quiz beendet!</h3>

    {/* Erfolgsquote */}
    <p className="text-sm text-gray-600">
      Du hast {answers.filter((a) => a.isCorrect).length} von {answers.length} Fragen richtig beantwortet.
    </p>

    {/* Detailübersicht */}
    <div className="space-y-2">
      {answers.map((a, i) => (
        <div
          key={i}
          className={`p-2 border rounded-md ${
            a.isCorrect
              ? 'border-green-300 bg-green-50 dark:bg-green-800 dark:border-green-500'
              : 'border-red-300 bg-red-50 dark:bg-red-800 dark:border-red-500'
          }`}

        >
          <p className="text-sm font-medium">Frage: {a.question}</p>
          <p className="text-sm">
            Deine Antwort: <strong>{a.userAnswer}</strong> {a.isCorrect ? '✅' : '❌'}
          </p>
          {!a.isCorrect && (
            <p className="text-sm text-gray-600">Richtig wäre: {a.correctAnswer}</p>
          )}
        </div>
      ))}
    </div>

    {/* Restart-Button */}
    <div className="pt-4 flex justify-end">
      <Button onClick={fetchQuestions}>🔁 Neues Quiz starten</Button>
    </div>
  </div>
)}

    </div>
  )
}
