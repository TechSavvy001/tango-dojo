// src/app/quiz/page.tsx
'use client'

import QuizPage from '@/components/quiz/QuizCard'

export default function QuizRoute() {
  return (
  <div className="p-6 max-w-xl mx-auto space-y-4 bg-card text-card-foreground rounded-xl shadow">
      <h1 className="text-2xl font-bold p-4">Mein Quiz</h1>
      <QuizPage />
    </div>
  )
}
