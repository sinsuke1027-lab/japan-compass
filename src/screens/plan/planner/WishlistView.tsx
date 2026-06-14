import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert,
} from 'react-native'
import { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { WishlistItem, WishlistCategory } from '../types'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../types'
import type { PlanStackParamList } from '../../../types/navigation'

const STORAGE_KEY = 'plan:wishlist'
const ALL_CATEGORIES: Array<WishlistCategory | 'all'> = ['all', 'food', 'sightseeing', 'shopping', 'other']

type Props = {
  navigation: NativeStackNavigationProp<PlanStackParamList, 'PlanHome'>
}

export function WishlistView({ navigation }: Props) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [filter, setFilter] = useState<WishlistCategory | 'all'>('all')

  const load = useCallback(async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    setItems(raw ? JSON.parse(raw) : [])
  }, [])

  useFocusEffect(useCallback(() => { load() }, [load]))

  async function handleDelete(id: string) {
    Alert.alert('Remove', 'Remove this place from your wishlist?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          const updated = items.filter(i => i.id !== id)
          setItems(updated)
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        },
      },
    ])
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter)

  return (
    <View style={styles.container}>
      {/* Category filter chips */}
      <View style={styles.filterRow}>
        {ALL_CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterChip,
              filter === cat && {
                backgroundColor: cat === 'all' ? '#C8392B' : CATEGORY_COLORS[cat as WishlistCategory],
              },
            ]}
            onPress={() => setFilter(cat)}
          >
            <Text style={[styles.filterChipText, filter === cat && { color: '#fff' }]}>
              {cat === 'all' ? 'All' : CATEGORY_LABELS[cat as WishlistCategory]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🗺️</Text>
            <Text style={styles.emptyTitle}>No places yet</Text>
            <Text style={styles.emptySubtitle}>Tap + to add your first wishlist place</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('WishlistAdd', { editId: item.id })}
            activeOpacity={0.8}
          >
            <View style={[styles.categoryDot, { backgroundColor: CATEGORY_COLORS[item.category] }]} />
            <View style={styles.cardBody}>
              <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
              {item.memo ? (
                <Text style={styles.cardMemo} numberOfLines={2}>{item.memo}</Text>
              ) : null}
              <View style={styles.cardFooter}>
                <Text style={styles.cardCategory}>{CATEGORY_LABELS[item.category]}</Text>
                {!item.lat && !item.lng && (
                  <Text style={styles.noLocation}>⚠️ No location</Text>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteBtnText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('WishlistAdd', {})}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

const SHADOW = {
  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
} as const

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },

  filterRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  filterChip: {
    borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12,
    backgroundColor: '#fff', ...SHADOW,
  },
  filterChipText: { fontSize: 12, fontWeight: '600', color: '#1C1C1E' },

  list: { padding: 16, paddingTop: 0, gap: 10, paddingBottom: 80 },

  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 14, ...SHADOW,
  },
  categoryDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  cardBody:    { flex: 1, gap: 4 },
  cardName:    { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
  cardMemo:    { fontSize: 13, color: '#555', lineHeight: 18 },
  cardFooter:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 },
  cardCategory:{ fontSize: 11, color: '#8E8E93', fontWeight: '600' },
  noLocation:  { fontSize: 11, color: '#E67E22', fontWeight: '600' },

  deleteBtn: { padding: 4 },
  deleteBtnText: { fontSize: 16, color: '#C7C7CC' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyIcon:     { fontSize: 48 },
  emptyTitle:    { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  emptySubtitle: { fontSize: 14, color: '#8E8E93', textAlign: 'center' },

  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#C8392B', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#C8392B', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 32 },
})
