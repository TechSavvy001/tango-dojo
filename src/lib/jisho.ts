export async function getJapaneseFromGerman(word: string) {
    const res = await fetch('/api/jisho-de', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word }),
    })
  
    if (!res.ok) throw new Error('Fehler beim Übersetzen')
  
    return res.json() as Promise<{ kanji: string; kana: string }>
  }
  