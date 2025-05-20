import { SupabaseClient } from '@supabase/supabase-js'

export async function getUserWithRole(supabase: SupabaseClient) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, role')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('❌ Fehler beim Abrufen der Rolle:', error.message)
    return null
  }

  console.log('🧑 User-Rolle:', data?.role) // <== Hier wird's geloggt
  return data
}
