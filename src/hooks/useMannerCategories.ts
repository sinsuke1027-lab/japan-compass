import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../lib/supabase'

export interface MannerCategory {
  id: string
  slug: string
  name_en: string
  icon: string | null
  sort_order: number
}

const CACHE_KEY = 'cache:manner_categories'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

export function useMannerCategories() {
  const [categories, setCategories] = useState<MannerCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
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

      // Fetch only categories that have manners
      const { data, error } = await supabase
        .from('categories')
        .select('id, slug, name_en, icon, sort_order, manners(id)')
        .order('sort_order')

      if (cancelled) return

      if (error || !data) {
        setOffline(true)
        setLoading(false)
        return
      }

      const withManners = data
        .filter((c: any) => c.manners && c.manners.length > 0)
        .map(({ manners: _, ...rest }: any) => rest) as MannerCategory[]

      setCategories(withManners)
      setOffline(false)
      setLoading(false)
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data: withManners, timestamp: Date.now() })).catch(() => {})
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { categories, loading, offline }
}
