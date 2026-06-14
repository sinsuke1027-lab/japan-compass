import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useHomeTip } from '../../hooks/useHomeTip'
import type { HomeScreenProps } from '../../types/navigation'
import type { JournalEntry } from '../../hooks/useJournal'

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { tip, loading: tipLoading } = useHomeTip()
  const [latestEntry, setLatestEntry] = useState<JournalEntry | null>(null)

  const loadLatestEntry = useCallback(async () => {
    const { data } = await supabase
      .from('journal_entries')
      .select('id, user_id, spot_id, title, body, visited_at, created_at, sustainable_spots(name_en)')
      .order('visited_at', { ascending: false })
      .limit(1)

    if (data && data.length > 0) {
      const e = data[0] as any
      setLatestEntry({
        id: e.id,
        user_id: e.user_id,
        spot_id: e.spot_id,
        title: e.title,
        body: e.body,
        insights: e.insights ?? null,
        visited_at: e.visited_at,
        created_at: e.created_at,
        spot_name_en: e.sustainable_spots?.name_en ?? null,
      })
    }
  }, [])

  useFocusEffect(useCallback(() => { loadLatestEntry() }, [loadLatestEntry]))

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Japan Compass</Text>
        <Text style={styles.subtitle}>Your guide to respectful travel</Text>
      </View>

      {/* Emergency Card */}
      <TouchableOpacity
        style={styles.emergencyCard}
        onPress={() => navigation.navigate('Emergency')}
        activeOpacity={0.85}
      >
        <Text style={styles.emergencyIcon}>🚨</Text>
        <View style={styles.emergencyBody}>
          <Text style={styles.emergencyTitle}>Emergency Guide</Text>
          <Text style={styles.emergencySub}>Police · Ambulance · Embassy · Disaster</Text>
        </View>
        <Text style={styles.arrowWhite}>›</Text>
      </TouchableOpacity>

      {/* Today's Manner Tip */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>TODAY'S MANNER TIP</Text>
        {tipLoading ? (
          <View style={[styles.card, styles.cardCenter]}>
            <ActivityIndicator size="small" color="#C8392B" />
          </View>
        ) : tip ? (
          <View style={styles.card}>
            <Text style={styles.tipSeverity}>{severityLabel(tip.severity)}</Text>
            <Text style={styles.tipTitle}>{tip.title_en}</Text>
            <Text style={styles.tipBody} numberOfLines={3}>{tip.body_en}</Text>
          </View>
        ) : null}
      </View>

      {/* Quick Access */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>QUICK ACCESS</Text>
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#2C6E49' }]}
            onPress={() => navigation.navigate('Map')}
            activeOpacity={0.8}
          >
            <Text style={styles.quickIcon}>🗺️</Text>
            <Text style={styles.quickLabel}>Eco Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#1A5276' }]}
            onPress={() => navigation.navigate('Journal')}
            activeOpacity={0.8}
          >
            <Text style={styles.quickIcon}>📔</Text>
            <Text style={styles.quickLabel}>Journal</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Shortcuts */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>EXPLORE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {SHORTCUTS.map(s => (
            <TouchableOpacity
              key={s.label}
              style={styles.chip}
              onPress={() => navigation.navigate(s.tab)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipIcon}>{s.icon}</Text>
              <Text style={styles.chipLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recent Journal */}
      {latestEntry && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>RECENT JOURNAL</Text>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Journal')}
            activeOpacity={0.8}
          >
            <Text style={styles.entryTitle} numberOfLines={1}>{latestEntry.title}</Text>
            {latestEntry.spot_name_en && (
              <Text style={styles.entrySpot}>📍 {latestEntry.spot_name_en}</Text>
            )}
            {latestEntry.body && (
              <Text style={styles.entryBody} numberOfLines={2}>{latestEntry.body}</Text>
            )}
            <Text style={styles.entryDate}>{formatDate(latestEntry.visited_at)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

const SHORTCUTS = [
  { icon: '🪧', label: 'Show Card', tab: 'Show' as const },
  { icon: '⛩', label: 'Shrine',    tab: 'Manners' as const },
  { icon: '💬', label: 'Phrases',   tab: 'Manners' as const },
  { icon: '♻️', label: 'Eco Tips',  tab: 'Map' as const },
]

function severityLabel(severity: string) {
  if (severity === 'must') return '🔴 Must know'
  if (severity === 'should') return '🟡 Good to know'
  return '🟢 Nice touch'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
}

const SHADOW = {
  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
} as const

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#F7F7F7' },
  content:          { padding: 16, paddingBottom: 32, gap: 20 },

  // Header
  header:           { paddingVertical: 8 },
  logo:             { fontSize: 28, fontWeight: '800', color: '#C8392B', letterSpacing: -0.5 },
  subtitle:         { fontSize: 14, color: '#8E8E93', marginTop: 2 },

  // Emergency card
  emergencyCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#C8392B', borderRadius: 16, padding: 18,
    ...SHADOW, shadowColor: '#C8392B', shadowOpacity: 0.3,
  },
  emergencyIcon:    { fontSize: 32 },
  emergencyBody:    { flex: 1 },
  emergencyTitle:   { fontSize: 18, fontWeight: '700', color: '#fff' },
  emergencySub:     { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  arrowWhite:       { fontSize: 26, color: 'rgba(255,255,255,0.7)', fontWeight: '300' },

  // Section
  section:          { gap: 8 },
  sectionLabel:     { fontSize: 11, fontWeight: '700', color: '#8E8E93', letterSpacing: 0.8 },

  // Card (manner tip + journal)
  card:             { backgroundColor: '#fff', borderRadius: 14, padding: 16, ...SHADOW },
  cardCenter:       { alignItems: 'center', paddingVertical: 24 },

  // Manner tip
  tipSeverity:      { fontSize: 12, fontWeight: '600', color: '#555', marginBottom: 6 },
  tipTitle:         { fontSize: 16, fontWeight: '700', color: '#1C1C1E', marginBottom: 6 },
  tipBody:          { fontSize: 14, color: '#555', lineHeight: 20 },

  // Quick access
  quickRow:         { flexDirection: 'row', gap: 12 },
  quickCard: {
    flex: 1, borderRadius: 14, padding: 16,
    alignItems: 'center', justifyContent: 'center', gap: 6,
    ...SHADOW,
  },
  quickIcon:        { fontSize: 28 },
  quickLabel:       { fontSize: 14, fontWeight: '700', color: '#fff' },

  // Shortcuts
  chips:            { gap: 8, paddingRight: 4 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14,
    ...SHADOW,
  },
  chipIcon:         { fontSize: 16 },
  chipLabel:        { fontSize: 13, fontWeight: '600', color: '#1C1C1E' },

  // Recent journal
  entryTitle:       { fontSize: 15, fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  entrySpot:        { fontSize: 12, color: '#8E8E93', marginBottom: 4 },
  entryBody:        { fontSize: 13, color: '#555', lineHeight: 18, marginBottom: 6 },
  entryDate:        { fontSize: 11, color: '#C7C7CC', fontWeight: '500' },
})
