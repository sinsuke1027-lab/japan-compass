import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { useJournalEntries, type JournalEntry } from '../../hooks/useJournal'
import type { JournalListScreenProps } from '../../types/navigation'

export function JournalListScreen({ navigation }: JournalListScreenProps) {
  const { entries, loading, summary, refresh } = useJournalEntries()

  useFocusEffect(useCallback(() => { refresh() }, [refresh]))

  if (loading && entries.length === 0) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#C8392B" /></View>
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <TouchableOpacity
              style={styles.summaryCard}
              onPress={() => navigation.navigate('TripSummary')}
              activeOpacity={0.8}
            >
              <View style={styles.summaryLeft}>
                <Text style={styles.summaryLabel}>Trip so far</Text>
                <Text style={styles.summaryCount}>
                  {summary?.total_entries ?? 0} <Text style={styles.summaryUnit}>entries</Text>
                </Text>
                <Text style={styles.summarySub}>
                  {summary?.spots_visited ?? 0} spots visited
                </Text>
              </View>
              <View style={styles.summaryRight}>
                <Text style={styles.summaryArrow}>View Summary →</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.memoriesCard}
              onPress={() => navigation.navigate('MemoryList')}
              activeOpacity={0.8}
            >
              <Text style={styles.memoriesIcon}>📷</Text>
              <View style={styles.memoriesInfo}>
                <Text style={styles.memoriesTitle}>Memories</Text>
                <Text style={styles.memoriesSub}>Photos, food & experiences</Text>
              </View>
              <Text style={styles.memoriesArrow}>›</Text>
            </TouchableOpacity>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📔</Text>
            <Text style={styles.emptyTitle}>No entries yet</Text>
            <Text style={styles.emptySub}>Tap ＋ to record your first activity</Text>
          </View>
        }
        renderItem={({ item }) => (
          <EntryRow
            entry={item}
            onPress={() => navigation.navigate('JournalDetail', { id: item.id })}
          />
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('JournalEdit', {})}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </View>
  )
}

function EntryRow({ entry, onPress }: { entry: JournalEntry; onPress: () => void }) {
  const date = new Date(entry.visited_at)
  const month = date.toLocaleString('en', { month: 'short' })
  const day = date.getDate()

  return (
    <TouchableOpacity style={styles.entryRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.dateBadge}>
        <Text style={styles.dateMonth}>{month}</Text>
        <Text style={styles.dateDay}>{day}</Text>
      </View>
      <View style={styles.entryInfo}>
        <Text style={styles.entryTitle} numberOfLines={1}>{entry.title}</Text>
        {entry.spot_name_en && (
          <Text style={styles.entrySpot} numberOfLines={1}>📍 {entry.spot_name_en}</Text>
        )}
        {entry.body && (
          <Text style={styles.entryBody} numberOfLines={2}>{entry.body}</Text>
        )}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  )
}

const SHADOW = {
  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
} as const

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#F7F7F7' },
  center:         { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list:           { padding: 16, gap: 10, paddingBottom: 80 },

  // Summary card
  summaryCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#C8392B', borderRadius: 16, padding: 18, marginBottom: 4,
  },
  summaryLeft:    { flex: 1 },
  summaryLabel:   { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryCount:   { fontSize: 36, fontWeight: '800', color: '#fff', marginTop: 2 },
  summaryUnit:    { fontSize: 18, fontWeight: '500' },
  summarySub:     { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  summaryRight:   { alignItems: 'flex-end' },
  summaryArrow:   { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },

  // Memories card
  memoriesCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 4, ...SHADOW,
  },
  memoriesIcon:   { fontSize: 28 },
  memoriesInfo:   { flex: 1 },
  memoriesTitle:  { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
  memoriesSub:    { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  memoriesArrow:  { fontSize: 22, color: '#C7C7CC', fontWeight: '300' },

  // Empty state
  empty:          { alignItems: 'center', paddingTop: 60 },
  emptyEmoji:     { fontSize: 48, marginBottom: 16 },
  emptyTitle:     { fontSize: 18, fontWeight: '700', color: '#1C1C1E', marginBottom: 6 },
  emptySub:       { fontSize: 14, color: '#8E8E93' },

  // Entry row
  entryRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 14, ...SHADOW,
  },
  dateBadge:      { alignItems: 'center', width: 40 },
  dateMonth:      { fontSize: 11, color: '#C8392B', fontWeight: '700', textTransform: 'uppercase' },
  dateDay:        { fontSize: 22, fontWeight: '800', color: '#1C1C1E', lineHeight: 26 },
  entryInfo:      { flex: 1 },
  entryTitle:     { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
  entrySpot:      { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  entryBody:      { fontSize: 13, color: '#555', marginTop: 4, lineHeight: 18 },
  chevron:        { fontSize: 22, color: '#C7C7CC', fontWeight: '300' },

  // FAB
  fab: {
    position: 'absolute', right: 20, bottom: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#C8392B', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#C8392B', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
  fabIcon:        { fontSize: 28, color: '#fff', lineHeight: 32 },
})
