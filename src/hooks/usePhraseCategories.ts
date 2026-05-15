import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../lib/supabase'

export interface PhraseCategory {
  id: string
  slug: string
  name_en: string
  icon: string | null
  sort_order: number
}

const CACHE_KEY = 'cache:phrase_categories'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

export function usePhraseCategories() {
  const [categories, setCategories] = useState<PhraseCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      // Show cached data immediately if available
      try {
        const raw = await AsyncStorage.getItem(CACHE_KEY)
        if (raw) {
          const { data, timestamp } = JSON.parse(raw)
          if (!cancelled && Date.now() - timestamp < CACHE_TTL_MS) {
            setCategories(data)
            setLoading(false)
          }
        }
      } catch {}

      // Fetch fresh data
      const { data, error } = await supabase
        .from('phrase_categories')
        .select('id, slug, name_en, icon, sort_order')
        .order('sort_order')

      if (cancelled) return

      if (error || !data) {
        setOffline(true)
        setLoading(false)
        return
      }

      setCategories(data)
      setOffline(false)
      setLoading(false)

      AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() })).catch(() => {})
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { categories, loading, offline }
}
