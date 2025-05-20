// src/app/quiz/page.tsx
'use client'

import QuizPage from '@/components/quiz/QuizCard'

export default function QuizRoute() {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold p-4">Mein Quiz</h1>
      <QuizPage />
    </div>
  )
}
