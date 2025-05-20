'use client'

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import { useCallback, useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { VokabelForm } from './VocabelForm'
import { Input } from '@/components/ui/input'
import { VokabelList } from './VokabelList'
import type { Vokabel } from '@/types/vokabel'
import { downloadCSV } from '@/lib/downloadCSV'

export function ClientDeckDetail({ deckId }: { deckId: string }) {
  const [vokabeln, setVokabeln] = useState<Vokabel[]>([])
  const [filtered, setFiltered] = useState<Vokabel[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'learned' | 'notLearned'>('all')
  const [sort, setSort] = useState<'latest' | 'kanji'>('latest')
  const [deckName, setDeckName] = useState('')
  const [progress, setProgress] = useState(0)
  const [lastSeen, setLastSeen] = useState<string | null>(null)
  const [allTags, setAllTags] = useState<string[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [learnedCount, setLearnedCount] = useState(0)

  const updateStats = useCallback((vokabeln: Vokabel[]) => {
    const allTags = Array.from(new Set(vokabeln.flatMap(v => v.tags || [])))
    setAllTags(allTags.sort())
    const learned = vokabeln.filter(v => v.learned).length
    setLearnedCount(learned)
    setProgress(Math.round((learned / vokabeln.length) * 100))
    const dates = vokabeln.map(v => v.last_seen).filter(Boolean).sort()
    setLastSeen(dates.at(-1) ?? null)
  }, [])
  
  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createBrowserSupabaseClient()
    const { data: user } = await supabase.auth.getUser()
    if (!user?.user?.id) {
      setLoading(false)
      return
    }
  
    const { data: deck } = await supabase
      .from('decks')
      .select('name')
      .eq('id', deckId)
      .eq('user_id', user.user.id)
      .single()
  
    if (!deck) {
      setDeckName('❌ Deck nicht gefunden')
      setLoading(false)
      return
    }
  
    setDeckName(deck.name)
  
    const { data: vokabeln } = await supabase
      .from('vokabeln')
      .select('*')
      .eq('deck_id', deckId)
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })
  
    if (vokabeln) {
      setVokabeln(vokabeln)
      updateStats(vokabeln)
    }
  
    setLoading(false)
  }, [deckId, updateStats])


  // Nutze die load-Funktion beim ersten Laden
  useEffect(() => {
    load()
  }, [load])
  
  const updateFiltered = useCallback(() => {
    let list = [...vokabeln]
    if (filter === 'learned') list = list.filter(v => v.learned)
    if (filter === 'notLearned') list = list.filter(v => !v.learned)
    if (selectedTag) list = list.filter(v => (v.tags || []).includes(selectedTag))
    if (search) {
      list = list.filter(v =>
        (v.kanji + v.kana + v.meaning_de + (v.tags || []).join(' '))
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    }
  
    list.sort(
      sort === 'kanji'
        ? (a, b) => a.kanji.localeCompare(b.kanji)
        : (a, b) =>
            new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    )
  
    setFiltered(list)
  }, [vokabeln, filter, selectedTag, search, sort])
  

  // Update Filter und Statistiken
  useEffect(() => {
    updateFiltered()
  }, [updateFiltered])
  
  if (loading) return <p className="p-4">Lade Vokabeln...</p>

  return (
    <div className="p-6 space-y-6">
        <div className="space-y-2 border-b pb-4">
            <h1 className="text-2xl font-bold">{deckName}</h1>

            <div className="text-sm text-gray-600">
                Gelernt: {progress}% · Letzte Aktivität:{' '}
                {lastSeen ? new Date(lastSeen).toLocaleDateString() : '–'}
            </div>

            <div className="w-full bg-gray-200 rounded h-2 mt-2">
                <div
                className="bg-green-500 h-2 rounded"
                style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>

      <VokabelForm deckId={deckId} onSaved={load} />

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Suche nach Kanji, Bedeutung, Tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={selectedTag ?? 'all'} onValueChange={(val) => setSelectedTag(val === 'all' ? null : val)}>
        <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="🏷️ Alle Tags" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="all">🏷️ Alle Tags</SelectItem>
            {allTags.map((tag) => (
            <SelectItem key={tag} value={tag}>
                {tag}
            </SelectItem>
            ))}
        </SelectContent>
        </Select>


        <Select value={filter} onValueChange={(val: 'all' | 'learned' | 'notLearned') => setFilter(val)}>
            <SelectTrigger className="w-[150px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="learned">Gelernt</SelectItem>
                <SelectItem value="notLearned">Ungelernt</SelectItem>
            </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(val: 'latest' | 'kanji') => setSort(val)}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="latest">🕒 Neueste</SelectItem>
                    <SelectItem value="kanji">🔤 Kanji A–Z</SelectItem>
                </SelectContent>
                </Select>

      </div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{deckName}</h1>

        {learnedCount >= 100 && (
            <span className="text-yellow-500 text-xl" title="Gold-Badge – 100+ Vokabeln gelernt">🥇</span>
        )}
        {learnedCount >= 50 && learnedCount < 100 && (
            <span className="text-gray-500 text-xl" title="Silber-Badge – 50+ Vokabeln gelernt">🥈</span>
        )}
        {learnedCount >= 10 && learnedCount < 50 && (
            <span className="text-amber-600 text-xl" title="Bronze-Badge – 10+ Vokabeln gelernt">🥉</span>
        )}
        </div>
        <button
            onClick={() => downloadCSV(`${deckName}.csv`, vokabeln)}
            className="text-sm text-blue-600 hover:underline"
            >
            📥 Als CSV exportieren
            </button>


      <VokabelList vokabeln={filtered} onReload={load} />
    </div>
  )
}
