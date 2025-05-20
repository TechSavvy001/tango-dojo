'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'

type Radikal = {
  name: string
  bedeutung: string
  erklaerung: string
}

export default function EditKanjiPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const supabase = createBrowserSupabaseClient()

  const [form, setForm] = useState({
    kanji: '',
    bedeutung: '',
    aussprache_on: '',
    aussprache_kun: '',
    erklaerung: '',
    merksatz: '',
    radikale: [] as Radikal[],
  })

  useEffect(() => {
    const load = async () => {
      const { data: entry } = await supabase
        .from('kanji_entries')
        .select('*')
        .eq('id', id)
        .single()

      const { data: radikale } = await supabase
        .from('kanji_radikale')
        .select('name, bedeutung, erklaerung')
        .eq('kanji_id', id)

      if (entry) {
        setForm({
          kanji: entry.kanji,
          bedeutung: entry.bedeutung,
          aussprache_on: entry.aussprache_on || '',
          aussprache_kun: entry.aussprache_kun || '',
          erklaerung: entry.erklaerung || '',
          merksatz: entry.merksatz || '',
          radikale: radikale ?? [],
        })
      }
    }

    load()
  }, [id, supabase])

  const updateField = (key: string, value: string) => {
    setForm({ ...form, [key]: value })
  }

  const updateRadikal = (i: number, key: string, value: string) => {
    const updated = [...form.radikale]
    updated[i][key as keyof Radikal] = value
    setForm({ ...form, radikale: updated })
  }

  const addRadikal = () => {
    setForm({
      ...form,
      radikale: [...form.radikale, { name: '', bedeutung: '', erklaerung: '' }],
    })
  }

  const removeRadikal = (i: number) => {
    const updated = [...form.radikale]
    updated.splice(i, 1)
    setForm({ ...form, radikale: updated })
  }

  const save = async () => {
    const { kanji, bedeutung, aussprache_on, aussprache_kun, erklaerung, merksatz, radikale } = form

    const { error: updateError } = await supabase
      .from('kanji_entries')
      .update({ kanji, bedeutung, aussprache_on, aussprache_kun, erklaerung, merksatz })
      .eq('id', id)

    if (updateError) {
      console.error('❌ Fehler beim Update:', updateError.message)
      return
    }

    // Alte Radikale löschen
    await supabase.from('kanji_radikale').delete().eq('kanji_id', id)

    // Neue Radikale einfügen
    const cleaned = radikale
      .filter((r) => r.name.trim() !== '')
      .map((r) => ({ ...r, kanji_id: id }))

    if (cleaned.length > 0) {
      const { error: insertError } = await supabase.from('kanji_radikale').insert(cleaned)
      if (insertError) {
        console.error('❌ Fehler bei Radikalen:', insertError.message)
      }
    }

    router.push('/admin/kanji')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">✏️ Kanji bearbeiten</h1>

      <Card>
        <CardHeader><CardTitle>Kanji</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Kanji</Label>
            <Input value={form.kanji} onChange={(e) => updateField('kanji', e.target.value)} />
          </div>
          <div>
            <Label>Bedeutung</Label>
            <Input value={form.bedeutung} onChange={(e) => updateField('bedeutung', e.target.value)} />
          </div>
          <div>
            <Label>On-Lesung</Label>
            <Input value={form.aussprache_on} onChange={(e) => updateField('aussprache_on', e.target.value)} />
          </div>
          <div>
            <Label>Kun-Lesung</Label>
            <Input value={form.aussprache_kun} onChange={(e) => updateField('aussprache_kun', e.target.value)} />
          </div>
          <div>
            <Label>Erläuterung</Label>
            <Textarea value={form.erklaerung} onChange={(e) => updateField('erklaerung', e.target.value)} />
          </div>
          <div>
            <Label>Merksatz</Label>
            <Textarea value={form.merksatz} onChange={(e) => updateField('merksatz', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Radikale</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {form.radikale.map((radikal, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input placeholder="Name" value={radikal.name} onChange={(e) => updateRadikal(i, 'name', e.target.value)} />
              <Input placeholder="Bedeutung" value={radikal.bedeutung} onChange={(e) => updateRadikal(i, 'bedeutung', e.target.value)} />
              <Input placeholder="Erklärung" value={radikal.erklaerung} onChange={(e) => updateRadikal(i, 'erklaerung', e.target.value)} />
              <div className="col-span-3 text-right">
                <Button variant="ghost" onClick={() => removeRadikal(i)}>Entfernen</Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addRadikal}>➕ Radikal hinzufügen</Button>
        </CardContent>
      </Card>

      <Button onClick={save}>💾 Speichern</Button>
    </div>
  )
}
