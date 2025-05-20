import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const promptLog: Record<string, string[]> = {}

export async function POST(req: Request) {
  const body = await req.json()
  const question = body.question
  const userId = 'demo-user' // später mit echtem User ersetzen

  const today = new Date().toISOString().split('T')[0]
  const usedToday = (promptLog[userId]?.filter((t) => t.startsWith(today)) || []).length

  if (usedToday >= 5) {
    return NextResponse.json({ limit: true })
  }

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: `Erkläre auf Deutsch: ${question}` }],
    temperature: 0.7,
  })

  const answer = res.choices[0].message.content ?? 'Keine Antwort erhalten.'
  promptLog[userId] = [...(promptLog[userId] || []), new Date().toISOString()]

  return NextResponse.json({ answer, limit: false })
}
