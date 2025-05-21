import { ClientDeckDetail } from '@/components/vokabeln/ClientDeckDetail'

export default async function DeckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: deckId } = await params  
  return (
    <>
      <ClientDeckDetail deckId={deckId} />
    </>
  )
}
