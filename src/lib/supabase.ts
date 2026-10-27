import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = url && key ? createClient(url, key) : null
export type UserRole = 'student' | 'teacher'

export async function getProfileRole(userId: string): Promise<UserRole> {
  if (!supabase) return 'student'
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  return !error && data?.role === 'teacher' ? 'teacher' : 'student'
}
