import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { useJournalEntries } from '../../hooks/useJournal'
import type { TripSummaryScreenProps } from '../../types/navigation'

export function TripSummaryScreen(_props: TripSummaryScreenProps) {
  const { summary, entries, loading } = useJournalEntries()

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#C8392B" /></View>
  }

  const firstVisit = summary?.first_visit ? formatDate(summary.first_visit) : '—'
  const lastVisit  = summary?.last_visit  ? formatDate(summary.last_visit)  : '—'

  const spotsWithEntries = entries
    .filter(e => e.spot_name_en)
    .reduce<Record<string, number>>((acc, e) => {
      const name = e.spot_name_en!
      acc[name] = (acc[name] ?? 0) + 1
      return acc
    }, {})

  const topSpots = Object.entries(spotsWithEntries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <Text style={styles.heading}>Your Trip</Text>
      <Text style={styles.sub}>A summary of your sustainable activities in Japan</Text>

      {/* Stats grid */}
      <View style={styles.grid}>
        <StatCard
          value={String(summary?.total_entries ?? 0)}
          label="Entries"
          icon="📔"
          color="#C8392B"
        />
        <StatCard
          value={String(summary?.spots_visited ?? 0)}
          label="Spots Visited"
          icon="📍"
          color="#1E8449"
        />
      </View>

      {/* Date range */}
      <View style={styles.dateCard}>
        <DateItem label="First Visit" value={firstVisit} />
        <View style={styles.dateDivider} />
        <DateItem label="Last Visit" value={lastVisit} />
      </View>

      {/* Top spots */}
      {topSpots.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visited Spots</Text>
          {topSpots.map(([name, count]) => (
            <View key={name} style={styles.spotRow}>
              <Text style={styles.spotName}>{name}</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{count}×</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {entries.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyText}>Start recording your activities to see your trip summary!</Text>
        </View>
      )}

    </ScrollView>
  )
}

function StatCard({ value, label, icon, color }: { value: string; label: string; icon: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

function DateItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.dateItem}>
      <Text style={styles.dateLabel}>{label}</Text>
      <Text style={styles.dateValue}>{value}</Text>
    </View>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })
}

const SHADOW = {
  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
} as const

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#F7F7F7' },
  content:      { padding: 20, paddingBottom: 48 },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center' },

  heading:      { fontSize: 28, fontWeight: '800', color: '#1C1C1E', marginBottom: 4 },
  sub:          { fontSize: 14, color: '#8E8E93', marginBottom: 24 },

  grid:         { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 18,
    alignItems: 'center', borderTopWidth: 4, ...SHADOW,
  },
  statIcon:     { fontSize: 28, marginBottom: 8 },
  statValue:    { fontSize: 36, fontWeight: '900' },
  statLabel:    { fontSize: 13, color: '#8E8E93', fontWeight: '600', marginTop: 4 },

  dateCard: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16,
    padding: 20, marginBottom: 24, ...SHADOW,
  },
  dateItem:     { flex: 1, alignItems: 'center' },
  dateLabel:    { fontSize: 12, color: '#8E8E93', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  dateValue:    { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  dateDivider:  { width: 1, backgroundColor: '#E5E5EA', marginHorizontal: 8 },

  section:      { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  spotRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, ...SHADOW,
  },
  spotName:     { fontSize: 14, fontWeight: '600', color: '#1C1C1E', flex: 1 },
  countBadge:   { backgroundColor: '#FDECEA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countText:    { fontSize: 13, color: '#C8392B', fontWeight: '700' },

  empty:        { alignItems: 'center', paddingTop: 32 },
  emptyEmoji:   { fontSize: 40, marginBottom: 12 },
  emptyText:    { fontSize: 14, color: '#8E8E93', textAlign: 'center', lineHeight: 20 },
})
