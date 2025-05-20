'use client'
import { useState, useEffect } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { fetchVokabeln } from '@/lib/fetchVocab'
import { generatePuzzle } from '@/lib/puzzleGenerator'
import type { Vokabel } from '@/types/vokabel'
import type { Puzzle } from '@/types/puzzle'

export default function PuzzlePage() {
  const session = useSession()
  const [vocabList, setVocabList] = useState<Vokabel[]>([])
  const [puzzle, setPuzzle]   = useState<Puzzle | null>(null)
  const [selectedTile, setSelectedTile] = useState<[number, number] | null>(null)

  // 1. Vokabeln laden
  useEffect(() => {
    if (session === null) return
    fetchVokabeln(session.user?.id ?? null).then(setVocabList)
  }, [session])

  // 2. Neues Puzzle generieren (immer Kana = useKanji: false)
  useEffect(() => {
    if (!vocabList.length) return
    setPuzzle(generatePuzzle(vocabList, 8, /*useKanji=*/ false))
  }, [vocabList])

  if (!puzzle) return <p>Lädt Puzzle…</p>

  // 3. Klick auf Buchstabenbank
  const handleBankClick = (letter: string, idx: number) => {
    if (!selectedTile) return
    const [r, c] = selectedTile
    setPuzzle(prev => {
      if (!prev) return prev
      const newGrid = prev.grid.map(row => [...row])
      newGrid[r][c].letter = letter
      const newBank = [...prev.bank]
      newBank.splice(idx, 1)
      return { ...prev, grid: newGrid, bank: newBank }
    })
    setSelectedTile(null)
  }

  // 4. Prüfen und neues Puzzle
  const handleSubmit = () => {
    // nur erste Zeile prüfen
    const solved = puzzle.grid[0].every(tile => tile.letter !== null)
    if (solved) {
      setPuzzle(generatePuzzle(vocabList, puzzle.size, /*useKanji=*/ false))
    } else {
      alert('Noch nicht fertig!')
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      {/* 1. Raster */}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${puzzle.size}, 1fr)` }}
      >
        {puzzle.grid.map((row, r) =>
          row.map((tile, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => setSelectedTile([r, c])}
              className={`
                h-10 flex flex-col items-center justify-center border
                ${selectedTile?.[0]===r && selectedTile?.[1]===c ? 'bg-blue-200' : ''}
                ${tile.letter ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}
              `}
            >
              <span>{tile.letter}</span>
              {tile.clue && !tile.letter && (
                <small className="text-xs text-gray-500">{tile.clue}</small>
              )}
            </div>
          ))
        )}
      </div>

      {/* 2. Buchstaben-Bank */}
      <div className="flex flex-wrap gap-2">
        {puzzle.bank.map((l, i) => (
          <button
            key={i}
            onClick={() => handleBankClick(l, i)}
            className="w-10 h-10 bg-yellow-300 flex items-center justify-center rounded"
          >
            {l}
          </button>
        ))}
      </div>

      {/* 3. Prüfen & nächstes Puzzle */}
      <button
        onClick={handleSubmit}
        className="w-full py-2 bg-blue-500 text-white rounded"
      >
        Prüfen & nächstes Puzzle
      </button>
    </div>
  )
}
