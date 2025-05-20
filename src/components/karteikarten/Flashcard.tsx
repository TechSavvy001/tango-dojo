'use client'

import { useState } from 'react'
import { convertFurigana } from '@/lib/furigana'
import type { Vokabel } from '@/types/vokabel'

type Props = {
  vokabel: Vokabel
  frontType: 'de' | 'kanji' | 'kana'
  onFeedback: (level: 'easy' | 'medium' | 'hard') => void
}

export function Flashcard({ vokabel, frontType, onFeedback }: Props) {
  const [flipped, setFlipped] = useState(false)

  const frontText =
    frontType === 'de'
      ? vokabel.meaning_de
      : frontType === 'kanji'
      ? vokabel.kanji
      : vokabel.kana

  return (
    <div className="max-w-md mx-auto text-center">
      <div
        className={`relative h-64 rounded-2xl shadow-lg transition-transform duration-500 transform ${
          flipped ? 'rotate-y-180' : ''
        } perspective preserve-3d`}
      >
        {/* Vorderseite */}
        <div
          className="
            absolute inset-0 p-6 rounded-2xl backface-hidden flex flex-col justify-center items-center
            card
          "
        >
          <h2 className="text-2xl font-bold text-foreground">{frontText}</h2>
        </div>

        {/* Rückseite */}
        <div
          className="
            absolute inset-0 p-6 rounded-2xl backface-hidden rotate-y-180 flex flex-col justify-center items-center
            card-content
          "
        >
          {/* Kanji/Kana */}
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            {vokabel.kanji === vokabel.kana
              ? vokabel.kanji
              : `${vokabel.kanji} ・ ${vokabel.kana}`}
          </h2>

          {/* Deutsches Wort */}
          {frontType !== 'de' && (
            <p className="text-lg mb-2 text-foreground">
              {vokabel.meaning_de}
            </p>
          )}

          {/* Romaji */}
          {vokabel.romaji && (
            <p className="text-sm mb-2 text-foreground">
              {vokabel.romaji}
            </p>
          )}

          {/* Beispielsatz */}
          {vokabel.example && (
            <p
              className="text-md mb-2 text-foreground"
              dangerouslySetInnerHTML={{ __html: convertFurigana(vokabel.example) }}
            />
          )}

          {/* Übersetzung des Beispiels */}
          {vokabel.example_de && (
            <p className="text-sm italic text-foreground">
              {vokabel.example_de}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 space-x-2">
        {!flipped ? (
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            onClick={() => setFlipped(true)}
          >
            Umdrehen
          </button>
        ) : (
          <>
            <button
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
              onClick={() => {
                setFlipped(false)
                onFeedback('easy')
              }}
            >
              Leicht
            </button>
            <button
              className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500"
              onClick={() => {
                setFlipped(false)
                onFeedback('medium')
              }}
            >
              Okay
            </button>
            <button
              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              onClick={() => {
                setFlipped(false)
                onFeedback('hard')
              }}
            >
              Schwer
            </button>
          </>
        )}
      </div>
    </div>
  )
}
