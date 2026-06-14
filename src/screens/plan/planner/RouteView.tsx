import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
} from 'react-native'
import { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Linking } from 'react-native'
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import type { WishlistItem } from '../types'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../types'

const STORAGE_KEY = 'plan:wishlist'

export function RouteView() {
  const [items, setItems] = useState<WishlistItem[]>([])

  const load = useCallback(async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    setItems(raw ? JSON.parse(raw) : [])
  }, [])

  useFocusEffect(useCallback(() => { load() }, [load]))

  async function handleReorder(newData: WishlistItem[]) {
    setItems(newData)
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
  }

  function handleOpenMaps() {
    const withLocation = items.filter(i => i.lat !== undefined && i.lng !== undefined)
    if (withLocation.length < 2) {
      Alert.alert(
        'Not enough locations',
        'Add latitude/longitude to at least 2 wishlist places to open a route in Google Maps.',
      )
      return
    }
    const waypoints = withLocation.map(i => `${i.lat},${i.lng}`).join('|')
    const url = `https://www.google.com/maps/dir/?api=1&waypoints=${encodeURIComponent(waypoints)}`
    Linking.openURL(url)
  }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<WishlistItem>) => (
    <TouchableOpacity
      onLongPress={drag}
      disabled={isActive}
      activeOpacity={0.8}
      style={[styles.card, isActive && styles.cardActive]}
    >
      <Text style={styles.dragHandle}>☰</Text>
      <View style={[styles.categoryDot, { backgroundColor: CATEGORY_COLORS[item.category] }]} />
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardCategory}>{CATEGORY_LABELS[item.category]}</Text>
      </View>
      {(!item.lat || !item.lng) && (
        <Text style={styles.noLocationIcon}>⚠️</Text>
      )}
    </TouchableOpacity>
  )

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.hint}>Long-press to reorder • ⚠️ = no GPS location</Text>
        <TouchableOpacity style={styles.mapsBtn} onPress={handleOpenMaps}>
          <Text style={styles.mapsBtnText}>Open in Google Maps 🗺️</Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📍</Text>
          <Text style={styles.emptyTitle}>No places yet</Text>
          <Text style={styles.emptySubtitle}>Add places to your Wishlist first</Text>
        </View>
      ) : (
        <DraggableFlatList
          data={items}
          keyExtractor={item => item.id}
          onDragEnd={({ data }) => handleReorder(data)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </GestureHandlerRootView>
  )
}

const SHADOW = {
  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
} as const

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },

  header: { padding: 16, gap: 10 },
  hint:   { fontSize: 12, color: '#8E8E93', textAlign: 'center' },

  mapsBtn: {
    backgroundColor: '#1A5276', borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 16,
    alignItems: 'center',
  },
  mapsBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  list: { padding: 16, paddingTop: 0, gap: 10, paddingBottom: 40 },

  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 14, ...SHADOW,
  },
  cardActive: { opacity: 0.85, transform: [{ scale: 1.02 }] },
  dragHandle:   { fontSize: 18, color: '#C7C7CC' },
  categoryDot:  { width: 10, height: 10, borderRadius: 5 },
  cardBody:     { flex: 1, gap: 2 },
  cardName:     { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
  cardCategory: { fontSize: 11, color: '#8E8E93', fontWeight: '600' },
  noLocationIcon: { fontSize: 16 },

  empty: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyIcon:     { fontSize: 48 },
  emptyTitle:    { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  emptySubtitle: { fontSize: 14, color: '#8E8E93', textAlign: 'center' },
})
