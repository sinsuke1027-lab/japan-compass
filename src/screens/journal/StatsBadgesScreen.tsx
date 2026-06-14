import { useState, useEffect, useCallback } from 'react'
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator,
  Modal, TouchableOpacity,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../../lib/supabase'
import type { StatsBadgesScreenProps } from '../../types/navigation'

// ── Types ──────────────────────────────────────────────────────

type TripStats = {
  totalVisits: number
  spotsVisited: number
  photoCount: number
  totalContribution: number
  shrineCount: number
  foodCount: number
  ecoCount: number
  shoppingCount: number
  otherCount: number
  citiesCount: number
  hasViewedSummary: boolean
}

type Badge = {
  id: string
  icon: string
  title: string
  desc: string
  condition: (stats: TripStats) => boolean
}

// ── Badge definitions ──────────────────────────────────────────

const BADGES: Badge[] = [
  {
    id: 'first-entry',
    icon: '📔',
    title: 'First Entry',
    desc: 'Add your first journal entry',
    condition: (s) => s.totalVisits >= 1,
  },
  {
    id: 'shrine-visitor',
    icon: '⛩',
    title: 'Shrine Visitor',
    desc: 'Visit a shrine or temple',
    condition: (s) => s.shrineCount >= 1,
  },
  {
    id: 'temple-explorer',
    icon: '🏯',
    title: 'Temple Explorer',
    desc: 'Visit 5 shrines or temples',
    condition: (s) => s.shrineCount >= 5,
  },
  {
    id: 'eco-traveler',
    icon: '♻️',
    title: 'Eco Traveler',
    desc: 'Record an eco activity',
    condition: (s) => s.ecoCount >= 1,
  },
  {
    id: 'sustainable',
    icon: '🌱',
    title: 'Sustainable Explorer',
    desc: 'Record 3 eco activities',
    condition: (s) => s.ecoCount >= 3,
  },
  {
    id: 'foodie',
    icon: '🍜',
    title: 'Foodie',
    desc: 'Record 5 food experiences',
    condition: (s) => s.foodCount >= 5,
  },
  {
    id: 'memories-made',
    icon: '📸',
    title: 'Memories Made',
    desc: 'Save 10 photos',
    condition: (s) => s.photoCount >= 10,
  },
  {
    id: 'city-hopper',
    icon: '🗾',
    title: 'City Hopper',
    desc: 'Visit spots in 2 or more cities',
    condition: (s) => s.citiesCount >= 2,
  },
  {
    id: 'overt-contributor',
    icon: '🪙',
    title: 'Generous Traveler',
    desc: 'Record a donation or osaisen',
    condition: (s) => s.totalContribution > 0,
  },
  {
    id: 'trip-complete',
    icon: '✅',
    title: 'Trip Complete',
    desc: 'View your trip summary',
    condition: (s) => s.hasViewedSummary,
  },
]

// ── Main screen ────────────────────────────────────────────────

export function StatsBadgesScreen(_props: StatsBadgesScreenProps) {
  const [stats, setStats] = useState<TripStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [newBadges, setNewBadges] = useState<Badge[]>([])
  const [popupIndex, setPopupIndex] = useState(0)

  const loadData = useCallback(async () => {
    setLoading(true)

    // Fetch journal entries with activity_type and spot city info
    const { data: entriesData } = await supabase
      .from('journal_entries')
      .select('id, spot_id, activity_type, sustainable_spots(address_en)')

    // Fetch photo count from AsyncStorage (memory entries)
    let photoCount = 0
    try {
      const raw = await AsyncStorage.getItem('memory:entries')
      if (raw) {
        const arr = JSON.parse(raw)
        if (Array.isArray(arr)) photoCount = arr.length
      }
    } catch {
      photoCount = 0
    }

    // Fetch hasViewedSummary
    let hasViewedSummary = false
    try {
      const val = await AsyncStorage.getItem('hasViewedSummary')
      hasViewedSummary = val === 'true'
    } catch {
      hasViewedSummary = false
    }

    type EntryRow = {
      id: string
      spot_id: string | null
      activity_type: string | null
      sustainable_spots: { address_en: string | null } | { address_en: string | null }[] | null
    }
    const entries = (entriesData ?? []) as unknown as EntryRow[]

    // Compute category counts
    let shrineCount = 0
    let foodCount = 0
    let ecoCount = 0
    let shoppingCount = 0
    let otherCount = 0

    for (const e of entries) {
      switch (e.activity_type) {
        case 'shrine':   shrineCount++;   break
        case 'food':     foodCount++;     break
        case 'eco':      ecoCount++;      break
        case 'shopping': shoppingCount++; break
        default:         otherCount++;    break
      }
    }

    // Unique spots
    const uniqueSpots = new Set(entries.map(e => e.spot_id).filter(Boolean))

    // Cities (extract from address_en — last comma segment or whole string)
    const cities = new Set<string>()
    for (const e of entries) {
      const spotsRaw = e.sustainable_spots
      const spot = Array.isArray(spotsRaw) ? spotsRaw[0] : spotsRaw
      const addr = spot?.address_en
      if (addr) {
        const city = addr.split(',').pop()?.trim()
        if (city) cities.add(city)
      }
    }

    const computed: TripStats = {
      totalVisits: entries.length,
      spotsVisited: uniqueSpots.size,
      photoCount,
      totalContribution: 0, // no amount field in schema yet
      shrineCount,
      foodCount,
      ecoCount,
      shoppingCount,
      otherCount,
      citiesCount: cities.size,
      hasViewedSummary,
    }

    setStats(computed)

    // Determine earned badges
    const earnedIds = BADGES.filter(b => b.condition(computed)).map(b => b.id)

    // Compare with previously seen badges
    let previousIds: string[] = []
    try {
      const raw = await AsyncStorage.getItem('badges:earned')
      if (raw) previousIds = JSON.parse(raw) as string[]
    } catch {
      previousIds = []
    }

    const newlyEarned = BADGES.filter(
      b => earnedIds.includes(b.id) && !previousIds.includes(b.id)
    )

    // Persist updated earned list
    try {
      await AsyncStorage.setItem('badges:earned', JSON.stringify(earnedIds))
    } catch {
      // ignore storage errors
    }

    if (newlyEarned.length > 0) {
      setNewBadges(newlyEarned)
      setPopupIndex(0)
    }

    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  if (loading || !stats) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C8392B" />
      </View>
    )
  }

  const earnedIds = new Set(BADGES.filter(b => b.condition(stats)).map(b => b.id))

  function dismissPopup() {
    if (popupIndex < newBadges.length - 1) {
      setPopupIndex(i => i + 1)
    } else {
      setNewBadges([])
    }
  }

  const currentPopup = newBadges[popupIndex] ?? null

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* TRIP STATS */}
        <Text style={styles.sectionLabel}>TRIP STATS</Text>
        <View style={styles.grid}>
          <StatCard icon="📔" value={String(stats.totalVisits)}   label="Total Visits"  color="#C8392B" />
          <StatCard icon="📍" value={String(stats.spotsVisited)}  label="Spots Visited" color="#1E8449" />
          <StatCard icon="📸" value={String(stats.photoCount)}    label="Photos Taken"  color="#2980B9" />
          <StatCard icon="🪙" value={String(stats.totalContribution)} label="Contributed" color="#D4AC0D" />
        </View>

        {/* Category breakdown */}
        <Text style={[styles.sectionLabel, { marginTop: 8 }]}>BY CATEGORY</Text>
        <View style={styles.categoryGrid}>
          <CategoryChip icon="⛩"  label="Shrine"   count={stats.shrineCount}   />
          <CategoryChip icon="🍜" label="Food"     count={stats.foodCount}     />
          <CategoryChip icon="♻️" label="Eco"      count={stats.ecoCount}      />
          <CategoryChip icon="🛍" label="Shopping" count={stats.shoppingCount} />
          <CategoryChip icon="📌" label="Other"    count={stats.otherCount}    />
        </View>

        {/* ACHIEVEMENTS */}
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>ACHIEVEMENTS</Text>
        <View style={styles.badgeGrid}>
          {BADGES.map(badge => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              earned={earnedIds.has(badge.id)}
            />
          ))}
        </View>

      </ScrollView>

      {/* Badge unlock popup */}
      <Modal
        visible={currentPopup !== null}
        transparent
        animationType="fade"
        onRequestClose={dismissPopup}
      >
        <View style={popup.overlay}>
          <View style={popup.card}>
            <Text style={popup.celebration}>🎉</Text>
            <Text style={popup.heading}>Badge Unlocked!</Text>
            {currentPopup && (
              <>
                <Text style={popup.badgeIcon}>{currentPopup.icon}</Text>
                <Text style={popup.badgeTitle}>{currentPopup.title}</Text>
                <Text style={popup.badgeDesc}>{currentPopup.desc}</Text>
              </>
            )}
            <TouchableOpacity style={popup.btn} onPress={dismissPopup} activeOpacity={0.85}>
              <Text style={popup.btnText}>Awesome!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  )
}

// ── Sub-components ─────────────────────────────────────────────

function StatCard({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

function CategoryChip({ icon, label, count }: { icon: string; label: string; count: number }) {
  return (
    <View style={styles.categoryChip}>
      <Text style={styles.categoryIcon}>{icon}</Text>
      <Text style={styles.categoryLabel}>{label}</Text>
      <View style={styles.categoryCountBadge}>
        <Text style={styles.categoryCount}>{count}</Text>
      </View>
    </View>
  )
}

function BadgeCard({ badge, earned }: { badge: Badge; earned: boolean }) {
  return (
    <View style={[styles.badgeCard, !earned && styles.badgeCardUnearned]}>
      <Text style={[styles.badgeIcon, !earned && styles.badgeIconUnearned]}>{badge.icon}</Text>
      <Text style={[styles.badgeTitle, !earned && styles.badgeTitleUnearned]} numberOfLines={2}>
        {badge.title}
      </Text>
    </View>
  )
}

// ── Styles ─────────────────────────────────────────────────────

const SHADOW = {
  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
} as const

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#F7F7F7' },
  content:      { padding: 20, paddingBottom: 48 },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center' },

  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#8E8E93',
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12,
  },

  // Stat grid (2 columns)
  grid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  statCard: {
    width: '47%', backgroundColor: '#fff', borderRadius: 16, padding: 16,
    alignItems: 'center', borderTopWidth: 4, ...SHADOW,
  },
  statIcon:     { fontSize: 24, marginBottom: 6 },
  statValue:    { fontSize: 30, fontWeight: '900' },
  statLabel:    { fontSize: 12, color: '#8E8E93', fontWeight: '600', marginTop: 4, textAlign: 'center' },

  // Category breakdown
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8,
    ...SHADOW,
  },
  categoryIcon:       { fontSize: 16 },
  categoryLabel:      { fontSize: 13, fontWeight: '600', color: '#1C1C1E' },
  categoryCountBadge: { backgroundColor: '#F2F2F7', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  categoryCount:      { fontSize: 12, fontWeight: '700', color: '#8E8E93' },

  // Badge grid (2 columns)
  badgeGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badgeCard: {
    width: '47%', backgroundColor: '#fff', borderRadius: 16, padding: 16,
    alignItems: 'center', ...SHADOW,
  },
  badgeCardUnearned: { opacity: 0.3 },
  badgeIcon:    { fontSize: 32, marginBottom: 8 },
  badgeIconUnearned: {},
  badgeTitle:   { fontSize: 13, fontWeight: '700', color: '#1C1C1E', textAlign: 'center' },
  badgeTitleUnearned: { color: '#8E8E93' },
})

const popup = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 24, padding: 32,
    alignItems: 'center', width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 16, elevation: 10,
  },
  celebration: { fontSize: 40, marginBottom: 8 },
  heading:     { fontSize: 22, fontWeight: '800', color: '#1C1C1E', marginBottom: 20 },
  badgeIcon:   { fontSize: 56, marginBottom: 12 },
  badgeTitle:  { fontSize: 20, fontWeight: '700', color: '#1C1C1E', marginBottom: 8, textAlign: 'center' },
  badgeDesc:   { fontSize: 14, color: '#8E8E93', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  btn: {
    backgroundColor: '#C8392B', borderRadius: 14, paddingVertical: 14,
    paddingHorizontal: 40, alignItems: 'center',
  },
  btnText:     { color: '#fff', fontSize: 16, fontWeight: '700' },
})
