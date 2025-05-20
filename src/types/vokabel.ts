export type Vokabel = {
    id: string
    user_id: string
    deck_id?: string | null // <- neu, optional weil "ON DELETE SET NULL"
    kanji: string
    kana: string
    romaji: string
    meaning_de: string
    example: string
    example_de: string // Neu: Deutsche Übersetzung des Beispiels
    learned: boolean
    tags?: string[]
    created_at?: string
    level: number
    last_seen?: string | null
  }
  