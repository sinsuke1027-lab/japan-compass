import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../lib/supabase'

export interface MannerTip {
  id: string
  title_en: string
  body_en: string
  severity: 'must' | 'should' | 'nice'
}

const CACHE_KEY = 'cache:home:manner_tips'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

function pickDailyRandom<T>(items: T[]): T {
  // Stable pick per calendar day using date string as seed
  const seed = new Date().toISOString().slice(0, 10)
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return items[hash % items.length]
}

export function useHomeTip() {
  const [tip, setTip] = useState<MannerTip | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const raw = await AsyncStorage.getItem(CACHE_KEY)
        if (raw) {
          const { data, timestamp } = JSON.parse(raw)
          if (!cancelled && Date.now() - timestamp < CACHE_TTL_MS && data?.length > 0) {
            setTip(pickDailyRandom<MannerTip>(data))
            setLoading(false)
          }
        }
      } catch {}

      const { data } = await supabase
        .from('manners')
        .select('id, title_en, body_en, severity')
        .limit(100)

      if (cancelled) return

      if (data && data.length > 0) {
        setTip(pickDailyRandom<MannerTip>(data))
        AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() })).catch(() => {})
      }
      if (!cancelled) setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { tip, loading }
}
