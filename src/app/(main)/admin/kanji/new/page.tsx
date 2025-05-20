// app/admin/kanji/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'

export default function NewKanjiPage() {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()

  const [form, setForm] = useState({
    kanji: '',
    bedeutung: '',
    aussprache_on: '',
    aussprache_kun: '',
    erklaerung: '',
    merksatz: '',
    radikale: [{ name: '', bedeutung: '', erklaerung: '' }],
  })

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value })
  }

  const handleRadikalChange = (index: number, key: 'name' | 'bedeutung' | 'erklaerung', value: string) => {
    const updated = [...form.radikale]
    updated[index][key] = value
    setForm({ ...form, radikale: updated })
  }
  

  const addRadikal = () => {
    setForm({
      ...form,
      radikale: [...form.radikale, { name: '', bedeutung: '', erklaerung: '' }],
    })
  }

  const removeRadikal = (index: number) => {
    const updated = [...form.radikale]
    updated.splice(index, 1)
    setForm({ ...form, radikale: updated })
  }

  const handleSubmit = async () => {
    const { kanji, bedeutung, aussprache_on, aussprache_kun, erklaerung, merksatz, radikale } = form

    const { data: inserted, error } = await supabase
      .from('kanji_entries')
      .insert([{ kanji, bedeutung, aussprache_on, aussprache_kun, erklaerung, merksatz }])
      .select()
      .single()

    if (error) {
      console.error('❌ Fehler beim Einfügen:', error.message)
      return
    }

    if (inserted?.id && radikale.length > 0) {
      const entries = radikale
        .filter(r => r.name.trim() !== '')
        .map(r => ({ ...r, kanji_id: inserted.id }))

      const { error: radikalError } = await supabase.from('kanji_radikale').insert(entries)

      if (radikalError) {
        console.error('❌ Fehler bei Radikalen:', radikalError.message)
      }
    }

    router.push('/admin/kanji')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">➕ Neues Kanji anlegen</h1>

      <Card>
        <CardHeader><CardTitle>Kanji-Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Kanji</Label>
            <Input value={form.kanji} onChange={(e) => handleChange('kanji', e.target.value)} />
          </div>
          <div>
            <Label>Bedeutung</Label>
            <Input value={form.bedeutung} onChange={(e) => handleChange('bedeutung', e.target.value)} />
          </div>
          <div>
            <Label>Aussprache (On)</Label>
            <Input value={form.aussprache_on} onChange={(e) => handleChange('aussprache_on', e.target.value)} />
          </div>
          <div>
            <Label>Aussprache (Kun)</Label>
            <Input value={form.aussprache_kun} onChange={(e) => handleChange('aussprache_kun', e.target.value)} />
          </div>
          <div>
            <Label>Erläuterung</Label>
            <Textarea value={form.erklaerung} onChange={(e) => handleChange('erklaerung', e.target.value)} />
          </div>
          <div>
            <Label>Merksatz</Label>
            <Textarea value={form.merksatz} onChange={(e) => handleChange('merksatz', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Radikale</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {form.radikale.map((radikal, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input placeholder="Name" value={radikal.name} onChange={(e) => handleRadikalChange(i, 'name', e.target.value)} />
              <Input placeholder="Bedeutung" value={radikal.bedeutung} onChange={(e) => handleRadikalChange(i, 'bedeutung', e.target.value)} />
              <Input placeholder="Erklärung" value={radikal.erklaerung} onChange={(e) => handleRadikalChange(i, 'erklaerung', e.target.value)} />
              <div className="col-span-3 text-right">
                <Button variant="ghost" onClick={() => removeRadikal(i)}>Entfernen</Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addRadikal}>➕ Radikal hinzufügen</Button>
        </CardContent>
      </Card>

      <Button onClick={handleSubmit}>✅ Speichern</Button>
    </div>
  )
}
