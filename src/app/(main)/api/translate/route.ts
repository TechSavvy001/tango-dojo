import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  const { germanInput } = await req.json()

  const prompt = `
  Du bist ein intelligenter und kontextsensitiver Übersetzungsassistent. Analysiere den folgenden deutschen Text:
  "${germanInput}"
  
  Wenn es sich um einen vollständigen Satz handelt:
  - Übersetze den Satz direkt ins Japanische.
  - Jedes Kanji im Satz muss mit Furigana versehen werden, im Format [Kanji]{Kana}.
  - Beispiel: [私は]{わたしは}[犬]{いぬ}を[飼]{か}っています。
  - Jedes Kanji muss Furigana haben, außer wenn es bereits Hiragana oder Katakana ist.
  - Der Satz muss genau die gleiche Bedeutung wie der deutsche Satz haben.
  
  Wenn es sich um ein einzelnes Wort handelt:
  - Analysiere das deutsche Wort und bestimme, ob es mehrere Bedeutungen oder Verwendungen hat.
  - Gib für jede Bedeutung die natürlichste und kontextabhängige Übersetzung auf Japanisch an.
  - Füge **immer** einen vollständigen Beispielsatz hinzu (kein isoliertes Wort!), der mindestens 5 Wörter enthält und komplett im Furigana-Format [Kanji]{Kana} steht.
  - Gib außerdem eine kurze deutsche Übersetzung dieses Beispielsatzes.
  - Berücksichtige dabei typische Wortfelder (Lebensmittel, Aktivitäten, Kleidung, Orte etc.).
  
  Gib die Übersetzungen in folgendem Format aus:
  Übersetzungen:
  1. 
    Kanji: ...
    Kana: ...
    Romaji: ...
    Beispiel: ... (Vollständiger japanischer Satz mit Furigana)
    Deutsche Übersetzung: ... (Übersetzung des Beispielsatzes)
    Tags: ...
  2. 
    Kanji: ...
    Kana: ...
    Romaji: ...
    Beispiel: ... (Vollständiger japanischer Satz mit Furigana)
    Deutsche Übersetzung: ... (Übersetzung des Beispielsatzes)
    Tags: ...
  ...
  `
  

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
    temperature: 0.7,
  })

  const text = response.choices[0].message.content || ''

  const translations = text
    .split(/(?=^\d+\.\s)/gm)
    .filter(t => t.trim())
    .map(t => ({
      kanji: t.match(/Kanji:\s*(.+)/)?.[1]?.trim() || '',
      kana: t.match(/Kana:\s*(.+)/)?.[1]?.trim() || '',
      romaji: t.match(/Romaji:\s*(.+)/)?.[1]?.trim() || '',
      example: t.match(/Beispiel:\s*(.+)/)?.[1]?.trim() || '',
      example_de: t.match(/Deutsche Übersetzung:\s*(.+)/)?.[1]?.trim() || '',
      tags: t.match(/Tags:\s*(.+)/)?.[1]?.trim() || '',
    }))

  return NextResponse.json({ translations })
}
