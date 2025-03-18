import { createBrowserClient } from '@supabase/ssr'

let supabase

if (typeof window !== 'undefined') {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key not defined')
  }
  
  supabase = createBrowserClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
  )
}

export { supabase }