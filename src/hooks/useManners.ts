import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../lib/supabase'

export interface Manner {
  id: string
  title_en: string
  body_en: string
  severity: 'must' | 'should' | 'nice'
  sort_order: number
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000

export function useManners(categoryId: string) {
  const [manners, setManners] = useState<Manner[]>([])
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    if (!categoryId) return
    let cancelled = false
    const cacheKey = `cache:manners:${categoryId}`

    async function load() {
      try {
        const raw = await AsyncStorage.getItem(cacheKey)
        if (raw) {
          const { data, timestamp } = JSON.parse(raw)
          if (!cancelled && Date.now() - timestamp < CACHE_TTL_MS) {
            setManners(data)
            setLoading(false)
          }
        }
      } catch {}

      const { data, error } = await supabase
        .from('manners')
        .select('id, title_en, body_en, severity, sort_order')
        .eq('category_id', categoryId)
        .order('sort_order')

      if (cancelled) return

      if (error || !data) {
        setOffline(true)
        setLoading(false)
        return
      }

      setManners(data)
      setOffline(false)
      setLoading(false)
      AsyncStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() })).catch(() => {})
    }

    load()
    return () => { cancelled = true }
  }, [categoryId])

  return { manners, loading, offline }
}
