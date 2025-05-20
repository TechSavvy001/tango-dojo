'use client'

import React from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

type Props = {
  decks: { id: string; name: string }[]
  selectedDeckId: string
  setSelectedDeckId: (id: string) => void
  shuffleMode: boolean
  setShuffleMode: (v: boolean) => void
  frontType: 'de' | 'kanji' | 'kana'
  setFrontType: (v: 'de' | 'kanji' | 'kana') => void
  filterLevel: 'all' | 'lt3' | 'gte3'
  setFilterLevel: (v: 'all' | 'lt3' | 'gte3') => void
}

export function FilterBar({
  decks,
  selectedDeckId,
  setSelectedDeckId,
  shuffleMode,
  setShuffleMode,
  frontType,
  setFrontType,
  filterLevel,
  setFilterLevel,
}: Props) {
  return (
    <div className="flex flex-wrap gap-6 items-end">
      {/* Deck-Auswahl */}
      <div>
        <Label>Deck</Label>
        <Select
          value={selectedDeckId}
          onValueChange={setSelectedDeckId}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Alle Vokabeln" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Vokabeln</SelectItem>
            {decks.map((deck) => (
              <SelectItem key={deck.id} value={deck.id}>
                {deck.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vorderseite */}
      <div>
        <Label>Vorderseite</Label>
        <Select
          value={frontType}
          onValueChange={(v) => setFrontType(v as 'de' | 'kanji' | 'kana')}
          >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Deutsch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="kanji">Kanji</SelectItem>
            <SelectItem value="kana">Kana</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Level-Filter */}
      <div>
        <Label>Level</Label>
        <Select
          value={filterLevel}
          onValueChange={(v) => setFilterLevel(v as 'all' | 'lt3' | 'gte3')}
          >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Alle Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="lt3">Level &lt; 3</SelectItem>
            <SelectItem value="gte3">Level ≥ 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Shuffle-Switch */}
      <div className="flex items-center space-x-2">
        <Switch
          id="shuffle-switch"
          checked={shuffleMode}
          onCheckedChange={setShuffleMode}
        />
        <Label htmlFor="shuffle-switch">Zufällig</Label>
      </div>
    </div>
  )
}
