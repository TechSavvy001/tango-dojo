import { DeckList } from '@/components/vokabeln/DeckList'
import { NewDeckForm } from '@/components/vokabeln/NewDeckForm'

export default function VokabelnPage() {
  return (
    <div className="space-y-6 p-6">

      <h1 className="text-2xl font-bold">📘 Deine Decks</h1>
      <NewDeckForm />
      <DeckList />
    </div>
  )
}
