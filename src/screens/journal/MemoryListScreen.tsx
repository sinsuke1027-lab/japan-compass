import { useState, useCallback } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Image, Dimensions, SectionList,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import type { MemoryListScreenProps } from '../../types/navigation'

export type MemoryEntry = {
  id: string
  uri: string
  category: 'food' | 'place' | 'experience'
  title: string | null
  shopName: string | null
  comment: string | null
  created_at: string
}

const STORAGE_KEY = 'memory:entries'
const SCREEN_WIDTH = Dimensions.get('window').width
const PHOTO_SIZE = (SCREEN_WIDTH - 16 * 2 - 8) / 2

type Category = 'all' | 'food' | 'place' | 'experience'

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'all', label: 'All 📷' },
  { key: 'food', label: 'Food 🍜' },
  { key: 'place', label: 'Place 📍' },
  { key: 'experience', label: 'Experience ✨' },
]

function formatSectionDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

function groupByDate(entries: MemoryEntry[]) {
  const map = new Map<string, MemoryEntry[]>()
  for (const e of entries) {
    const key = formatSectionDate(e.created_at)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(e)
  }
  return Array.from(map.entries()).map(([title, data]) => ({ title, data: [data] }))
}

export function MemoryListScreen({ navigation }: MemoryListScreenProps) {
  const [entries, setEntries] = useState<MemoryEntry[]>([])
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(STORAGE_KEY).then(raw => {
        if (raw) setEntries(JSON.parse(raw) as MemoryEntry[])
      })
    }, [])
  )

  const filtered = activeCategory === 'all'
    ? entries
    : entries.filter(e => e.category === activeCategory)

  const sections = groupByDate(filtered)

  return (
    <View style={styles.container}>
      {/* Category filter chips */}
      <View style={styles.chipRow}>
        {CATEGORIES.map(c => (
          <TouchableOpacity
            key={c.key}
            style={[styles.chip, activeCategory === c.key && styles.chipActive]}
            onPress={() => setActiveCategory(c.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, activeCategory === c.key && styles.chipTextActive]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📷</Text>
          <Text style={styles.emptyTitle}>No memories yet.</Text>
          <Text style={styles.emptySub}>Tap ＋ to add your first photo.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(_, index) => String(index)}
          contentContainerStyle={styles.list}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderItem={({ item: rowEntries }) => (
            <View style={styles.photoRow}>
              {rowEntries.map(entry => (
                <View key={entry.id} style={styles.photoCell}>
                  <Image source={{ uri: entry.uri }} style={styles.photo} resizeMode="cover" />
                  {entry.title ? (
                    <View style={styles.titleOverlay}>
                      <Text style={styles.photoTitle} numberOfLines={1}>{entry.title}</Text>
                    </View>
                  ) : null}
                </View>
              ))}
              {/* Fill empty cell if odd number */}
              {rowEntries.length % 2 === 1 && <View style={styles.photoCell} />}
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('MemoryAdd')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </View>
  )
}

const SHADOW = {
  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
} as const

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#F7F7F7' },

  chipRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 12, paddingBottom: 4 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E5EA', ...SHADOW,
  },
  chipActive:    { backgroundColor: '#C8392B', borderColor: '#C8392B' },
  chipText:      { fontSize: 13, fontWeight: '600', color: '#8E8E93' },
  chipTextActive:{ color: '#fff' },

  list:          { padding: 16, paddingBottom: 88 },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 12 },

  photoRow:      { flexDirection: 'row', gap: 8, marginBottom: 8 },
  photoCell:     { width: PHOTO_SIZE, borderRadius: 12, overflow: 'hidden', backgroundColor: '#E5E5EA' },
  photo:         { width: PHOTO_SIZE, height: PHOTO_SIZE },
  titleOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 8, paddingVertical: 6,
  },
  photoTitle:    { fontSize: 12, color: '#fff', fontWeight: '600' },

  empty:         { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 60 },
  emptyEmoji:    { fontSize: 48, marginBottom: 16 },
  emptyTitle:    { fontSize: 18, fontWeight: '700', color: '#1C1C1E', marginBottom: 6 },
  emptySub:      { fontSize: 14, color: '#8E8E93' },

  fab: {
    position: 'absolute', right: 20, bottom: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#C8392B', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#C8392B', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
  fabIcon:       { fontSize: 28, color: '#fff', lineHeight: 32 },
})
