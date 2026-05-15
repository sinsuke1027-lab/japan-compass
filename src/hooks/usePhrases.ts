import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../lib/supabase'

export interface Phrase {
  id: string
  japanese: string
  reading: string
  english: string
  audio_url: string | null
  sort_order: number
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000

export function usePhrases(categoryId: string) {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    if (!categoryId) return
    let cancelled = false
    const cacheKey = `cache:phrases:${categoryId}`

    async function load() {
      try {
        const raw = await AsyncStorage.getItem(cacheKey)
        if (raw) {
          const { data, timestamp } = JSON.parse(raw)
          if (!cancelled && Date.now() - timestamp < CACHE_TTL_MS) {
            setPhrases(data)
            setLoading(false)
          }
        }
      } catch {}

      const { data, error } = await supabase
        .from('phrases')
        .select('id, japanese, reading, english, audio_url, sort_order')
        .eq('phrase_category_id', categoryId)
        .order('sort_order')

      if (cancelled) return

      if (error || !data) {
        setOffline(true)
        setLoading(false)
        return
      }

      setPhrases(data)
      setOffline(false)
      setLoading(false)

      AsyncStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() })).catch(() => {})
    }

    load()
    return () => { cancelled = true }
  }, [categoryId])

  return { phrases, loading, offline }
}
