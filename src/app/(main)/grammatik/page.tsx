'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// NEU: API-Aufruf statt direkter Import
async function getGrammarExplanation(question: string): Promise<{ answer?: string; limit: boolean }> {
  const res = await fetch('/api/grammar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })

  if (!res.ok) throw new Error('API-Fehler')

  return res.json()
}

export default function GrammarPage() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [limitReached, setLimitReached] = useState(false)

  const handleAsk = async () => {
    setLoading(true)
    const res = await getGrammarExplanation(question)
    if (res.limit) {
      setLimitReached(true)
    } else {
      setAnswer(res.answer ?? '')
      setLimitReached(false)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">🧠 Grammatik-Hilfe</h1>
      <Input
        placeholder="Stelle eine Frage zur japanischen Grammatik..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <Button onClick={handleAsk} disabled={loading || limitReached}>
        {loading ? 'Lädt...' : 'Frage stellen'}
      </Button>
      {limitReached && (
        <p className="text-sm text-red-500">Tageslimit erreicht (max. 5 Anfragen)</p>
      )}
      {answer && (
        <Textarea
          className="mt-4"
          value={answer}
          readOnly
          rows={10}
        />
      )}
    </div>
  )
}
