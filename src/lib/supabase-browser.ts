// lib/supabase-browser.ts
'use client'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase' // optional

export const createBrowserSupabaseClient = () => {
  return createPagesBrowserClient<Database>()
}
