import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../lib/supabase'

export type Spot = {
  id: string
  category_id: string
  name_ja: string
  name_en: string
  description_ja: string | null
  description_en: string | null
  lat: number
  lng: number
  address_ja: string | null
  address_en: string | null
  tags: string[]
  category_slug: string
  category_icon: string
}

const CACHE_KEY = 'cache:spots'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

async function loadCache(): Promise<Spot[] | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, savedAt } = JSON.parse(raw)
    if (Date.now() - savedAt > CACHE_TTL_MS) return null
    return data
  } catch {
    return null
  }
}

async function saveCache(data: Spot[]) {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data, savedAt: Date.now() }))
}

export function useSpots() {
  const [spots, setSpots] = useState<Spot[]>([])
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchSpots() {
      const cached = await loadCache()
      if (cached && !cancelled) {
        setSpots(cached)
        setLoading(false)
      }

      const { data, error } = await supabase.rpc('list_spots')

      if (cancelled) return

      if (error || !data) {
        setOffline(true)
        if (!cached) setLoading(false)
        return
      }

      const mapped: Spot[] = (data as any[]).map((row) => ({
        id: row.id,
        category_id: row.category_id,
        name_ja: row.name_ja,
        name_en: row.name_en,
        description_ja: row.description_ja ?? null,
        description_en: row.description_en ?? null,
        lat: Number(row.lat),
        lng: Number(row.lng),
        address_ja: row.address_ja ?? null,
        address_en: row.address_en ?? null,
        tags: row.tags ?? [],
        category_slug: row.category_slug ?? '',
        category_icon: row.category_icon ?? '📍',
      }))

      setSpots(mapped)
      setOffline(false)
      setLoading(false)
      saveCache(mapped)
    }

    fetchSpots()
    return () => { cancelled = true }
  }, [])

  return { spots, loading, offline }
}
