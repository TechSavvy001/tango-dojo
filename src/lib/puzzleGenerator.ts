// src/lib/puzzleGenerator.ts
import type { Vokabel } from '@/types/vokabel'
import type { Puzzle, Tile } from '@/types/puzzle'  // deine Puzzle-Typen

export function generatePuzzle(
  vocabList: Vokabel[],
  size = 8,
  useKanji = true
): Puzzle {
  // wähle zufällige Vokabel
  const entry = vocabList[Math.floor(Math.random() * vocabList.length)]
  // nimm Kanji oder Kana, je nach Flag
  const wordRaw = useKanji
    ? entry.kanji || entry.kana
    : entry.kana || entry.kanji
  const clue = entry.meaning_de

  // splitte jede glyphe / jedes Zeichen
  const letters = [...wordRaw]

  // leeres grid
  const grid: Tile[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ letter: null, clue: undefined }))
  )

  // lege das Wort in Zeile 0
  letters.slice(0, size).forEach((ltr, i) => {
    grid[0][i].clue   = i === 0 ? clue : undefined
    grid[0][i].letter = null
  })

  // Buchstabenbank: Wortbuchstaben + Füllungszeichen
  const bank = [...letters]
  while (bank.length < size) {
    const rand = vocabList[Math.floor(Math.random() * vocabList.length)]
    const pool = useKanji ? (rand.kanji || '') : rand.kana || ''
    if (!pool) continue
    const char = [...pool][Math.floor(Math.random() * pool.length)]
    bank.push(char)
  }
  bank.sort(() => Math.random() - 0.5)

  return {
    id: crypto.randomUUID(),
    size,
    grid,
    bank,
  }
}
