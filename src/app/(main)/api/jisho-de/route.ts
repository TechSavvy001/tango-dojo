import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { word } = await req.json()

  // 1. Deutsch → Englisch über DeepL
  const deeplRes = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
    },
    body: new URLSearchParams({
      text: word,
      source_lang: 'DE',
      target_lang: 'EN',
    }),
  })

  const deeplJson = await deeplRes.json()
  const english = deeplJson.translations?.[0]?.text?.toLowerCase()

  if (!english) {
    return NextResponse.json({ error: 'Übersetzung fehlgeschlagen' }, { status: 500 })
  }

  // 2. Englisches Wort an Jisho
  const jishoRes = await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(english)}`)
  const jishoJson = await jishoRes.json()

  const first = jishoJson.data?.[0]
  if (!first || !first.japanese?.[0]) {
    return NextResponse.json({ kanji: '', kana: '' }, { status: 200 })
  }

  return NextResponse.json({
    kanji: first.japanese[0].word ?? first.japanese[0].reading,
    kana: first.japanese[0].reading,
  })
}
