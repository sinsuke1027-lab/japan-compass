import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export type JournalEntry = {
  id: string
  user_id: string
  spot_id: string | null
  title: string
  body: string | null
  insights: string | null
  visited_at: string
  created_at: string
  spot_name_en?: string | null
  activity_type: string | null
}

export type TripSummary = {
  total_entries: number
  spots_visited: number
  first_visit: string | null
  last_visit: string | null
}

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<TripSummary | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)

    const [{ data: entriesData }, { data: summaryData }] = await Promise.all([
      supabase
        .from('journal_entries')
        .select('id, user_id, spot_id, title, body, insights, visited_at, created_at, activity_type, sustainable_spots(name_en)')
        .order('visited_at', { ascending: false }),
      supabase.rpc('trip_summary'),
    ])

    if (entriesData) {
      setEntries(
        entriesData.map((e: any) => ({
          id: e.id,
          user_id: e.user_id,
          spot_id: e.spot_id,
          title: e.title,
          body: e.body,
          insights: e.insights ?? null,
          visited_at: e.visited_at,
          created_at: e.created_at,
          activity_type: e.activity_type ?? null,
          spot_name_en: e.sustainable_spots?.name_en ?? null,
        }))
      )
    }

    if (summaryData) setSummary(summaryData as TripSummary)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { entries, loading, summary, refresh: fetch }
}

export async function upsertEntry(entry: {
  id?: string
  spot_id: string | null
  title: string
  body: string | null
  insights: string | null
  visited_at: string
  activity_type?: string | null
}) {
  if (entry.id) {
    return supabase
      .from('journal_entries')
      .update({
        spot_id: entry.spot_id,
        title: entry.title,
        body: entry.body,
        insights: entry.insights,
        visited_at: entry.visited_at,
        activity_type: entry.activity_type ?? 'other',
      })
      .eq('id', entry.id)
  }
  return supabase
    .from('journal_entries')
    .insert({
      spot_id: entry.spot_id,
      title: entry.title,
      body: entry.body,
      insights: entry.insights,
      visited_at: entry.visited_at,
      activity_type: entry.activity_type ?? 'other',
    })
}

export async function deleteEntry(id: string) {
  return supabase.from('journal_entries').delete().eq('id', id)
}
