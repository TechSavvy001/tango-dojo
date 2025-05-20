import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { kanji, correctMeaning } = await req.json()

  const prompt = `Gib mir drei plausible, aber falsche deutsche Bedeutungen für das japanische Wort "${kanji}", dessen korrekte Bedeutung "${correctMeaning}" ist. 
  Die Bedeutungen sollen realistisch klingen, aber klar falsch sein. Gib sie als durch Kommas getrennte Liste zurück.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  })

  const content = response.choices[0].message.content ?? ''
  const distractors = content.split(',').map((s) => s.trim()).filter(Boolean)

  return Response.json({ distractors: distractors.slice(0, 3) })
}
