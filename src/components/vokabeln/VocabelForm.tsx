'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { convertFurigana } from '@/lib/furigana'

const schema = z.object({
  kanji: z.string().optional(),
  kana: z.string().optional(),
  romaji: z.string().optional(),
  meaning_de: z.string().min(1, 'Bedeutung ist erforderlich'),
  example: z.string().optional(),
  example_de: z.string().optional(),
  tags: z.string().optional(),
})

type FormData = z.infer<typeof schema>

type Props = {
  deckId: string
  onSaved?: () => void
  initialData?: Partial<FormData> & { id?: string }
}

type TranslationResult = {
  kanji: string
  kana: string
  romaji: string
  example: string
  example_de: string
  tags: string
}


export function VokabelForm({ deckId, onSaved, initialData }: Props) {
  const supabase = createBrowserSupabaseClient()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
    shouldUnregister: true,
  })
  

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [translationOptions, setTranslationOptions] = useState<FormData[]>([])

  // Funktion zum Abrufen der Übersetzung
  const fetchTranslation = async (value: string) => {
    if (!value.trim()) return
  
    setLoading(true)
    setError('')
    setTranslationOptions([])
  
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ germanInput: value }),
      })
  
      if (!res.ok) throw new Error('Fehler beim Abrufen der Übersetzung')
  
      const { translations } = await res.json()
  
      const translationsWithMeaning = translations.map((translation: TranslationResult) => ({
        ...translation,
        meaning_de: value,
      }))
      
  
      setTranslationOptions(translationsWithMeaning)
  
      if (translationsWithMeaning.length > 0) {
        applyTranslation(translationsWithMeaning[1])
      }
    } catch (err) {
      console.error('GPT-Vokabel abrufen fehlgeschlagen', err)
      setError('Fehler beim Abrufen der Vokabel.')
    } finally {
      setLoading(false)
    }
  }
  
  // Funktion zum Setzen der ausgewählten Übersetzung in die Felder
// Funktion zum Setzen der ausgewählten Übersetzung in die Felder
const applyTranslation = (translation: FormData) => {
  setValue('kanji', translation.kanji || '')
  setValue('kana', translation.kana || '')
  setValue('romaji', translation.romaji || '')
  setValue('example', translation.example || '')
  setValue('example_de', translation.example_de || '')
  setValue('tags', translation.tags || '')
  setValue('meaning_de', translation.meaning_de || '')
}


  

  // Manuelles Wechseln der Auswahl im Dropdown
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value)
    if (!isNaN(index) && index >= 0 && index < translationOptions.length) {
      applyTranslation(translationOptions[index])
    }
  }
  
  
  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')

    const { data: auth } = await supabase.auth.getUser()
    const userId = auth?.user?.id
    if (!userId) {
      setError('Nicht eingeloggt')
      setLoading(false)
      return
    }

    const payload = {
      deck_id: deckId,
      user_id: userId,
      kanji: data.kanji,
      kana: data.kana,
      romaji: data.romaji,
      meaning_de: data.meaning_de,
      example: data.example,
      example_de: data.example_de,
      tags: data.tags?.split(',').map(t => t.trim()),
    }

    const { error: dbError } = initialData?.id
      ? await supabase.from('vokabeln').update(payload).eq('id', initialData.id)
      : await supabase.from('vokabeln').insert({ ...payload, level: 0, last_seen: null })

    if (dbError) {
      setError(dbError.message)
    } else {
      reset()
      onSaved?.()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
<div>
  <Label>Deutsch</Label>
  <Input 
    {...register('meaning_de')} 
    onBlur={(e) => fetchTranslation(e.target.value)} 
    placeholder="Gib ein Wort oder einen Satz ein" 
    disabled={loading}
  />
  {errors.meaning_de && <p className="text-sm text-red-500">{errors.meaning_de.message}</p>}
</div>

{translationOptions.length > 0 && (
  <div>
    <Label>Übersetzungsoptionen:</Label>
    <select 
      value={translationOptions.findIndex(option => 
        option.kanji === watch('kanji') && 
        option.kana === watch('kana') && 
        option.romaji === watch('romaji')
      )}
      onChange={handleSelectChange}
      className="w-full p-2 border rounded-md"
    >
      {translationOptions.map((option, index) => (
        <option key={index} value={index}>
          {option.kanji} - {option.example_de}
        </option>
      ))}
    </select>
  </div>
)}


      <div>
        <Label>Kanji</Label>
        <Input {...register('kanji')} disabled={loading} />
      </div>
      <div>
        <Label>Kana</Label>
        <Input {...register('kana')} disabled={loading} />
      </div>
      <div>
        <Label>Romaji</Label>
        <Input {...register('romaji')} disabled={loading} />
      </div>
      <div>
        <Label>Beispielsatz (Japanisch)</Label>
        <Input {...register('example')} disabled={loading} />
      </div>
      <div>
        <Label>Beispielsatz (Deutsch)</Label>
        <Input {...register('example_de')} disabled={loading} />
      </div>
      <div>
        <Label>Tags (z. B. JLPT N5, Verb)</Label>
        <Input {...register('tags')} placeholder="JLPT N5, Verb" disabled={loading} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? 'Speichern...' : initialData?.id ? 'Änderungen speichern' : 'Vokabel speichern'}
      </Button>

      {loading && (
        <p className="text-sm text-gray-500">Lade Übersetzung...</p>
      )}

      {watch('example') && (
        <div className="mt-4">
          <Label>Beispiel-Vorschau (mit Furigana):</Label>
          <p
            className="text-lg leading-7"
            dangerouslySetInnerHTML={{ __html: convertFurigana(watch('example') || '') }}
          />
          {watch('example_de') && (
            <p className="text-sm text-gray-500 mt-1">Deutsch: {watch('example_de')}</p>
          )}
        </div>
      )}
    </form>
  )
}
