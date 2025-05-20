// src/app/(main)/decks/[id]/page.tsx
import { ClientDeckDetail } from '@/components/vokabeln/ClientDeckDetail'
import BackButton from '@/components/BackButton'

export default async function DeckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: deckId } = await params  // <-- hier await
  return (
    <>
      <BackButton to="/" label="Zur Startseite" />
      <ClientDeckDetail deckId={deckId} />
    </>
  )
}
