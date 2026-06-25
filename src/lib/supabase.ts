import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseKey)

export type Lead = {
  id: string
  name: string
  phone: string
  email?: string
  company?: string
  service_interested?: string
  source_website?: string
  message?: string
  status?: string
  created_at: string
}

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data || []
}

export async function updateLeadStatus(id: string, status: string) {
  const { error } = await supabase.from('versa_leads').update({ status }).eq('id', id)
  if (error) console.error(error)
}
