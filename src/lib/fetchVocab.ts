// src/lib/fetchVokabeln.ts
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import type { Vokabel } from '@/types/vokabel'

export async function fetchVokabeln(userId: string | null): Promise<Vokabel[]> {

    const supabase = createBrowserSupabaseClient()

    const { data, error } = await supabase
    .from('vokabeln')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  if (data && data.length) return data

  // Fallback auf öffentliche Vokabeln
  const { data: pubData, error: pubErr } = await supabase
    .from('vokabeln')
    .select('*')
    .is('user_id', null)

  if (pubErr) throw pubErr
  return pubData ?? []
}
