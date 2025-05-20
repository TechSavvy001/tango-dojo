'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { VokabelForm } from './VocabelForm'
import type { Vokabel } from '@/types/vokabel'

type Props = {
  vokabeln: Vokabel[]
  onReload?: () => void
}

export function VokabelList({ vokabeln, onReload }: Props) {
  const [editVokabel, setEditVokabel] = useState<Vokabel | null>(null)

  return (
    <ul className="space-y-2">
      {vokabeln.map((v) => (
        <li
          key={v.id}
          className="border p-4 rounded-md shadow-sm flex justify-between items-start"
        >
          <div>
            <p className="text-xl font-bold">{v.kanji} ・ {v.kana}</p>
            <p className="text-sm text-gray-600">{v.meaning_de} ({v.romaji})</p>

          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditVokabel(v)}
              >
                Bearbeiten
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Vokabel bearbeiten</DialogTitle>
              </DialogHeader>
              {editVokabel && (
                <VokabelForm
                initialData={{
                  ...editVokabel,
                  tags: editVokabel.tags?.join(', ') // <- Typkonflikt gelöst!
                }}
                deckId={editVokabel.deck_id ?? ''}
                onSaved={() => {
                  setEditVokabel(null)
                  onReload?.()
                }}
              />
              
              
              )}
            </DialogContent>
          </Dialog>
        </li>
      ))}
    </ul>
  )
}
