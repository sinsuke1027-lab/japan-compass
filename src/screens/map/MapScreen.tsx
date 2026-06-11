import { useState, useRef } from 'react'
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
  ActivityIndicator, Platform, ScrollView,
} from 'react-native'
import MapView, { Marker, Region } from 'react-native-maps'
import * as Location from 'expo-location'
import { useSpots, type Spot } from '../../hooks/useSpots'
import type { MapMainScreenProps } from '../../types/navigation'

const TOKYO_REGION: Region = {
  latitude: 35.6812, longitude: 139.7671,
  latitudeDelta: 0.08, longitudeDelta: 0.08,
}

type FilterSlug = 'all' | 'temple' | 'eco' | 'food' | 'shopping'

const FILTERS: { slug: FilterSlug; label: string; icon: string }[] = [
  { slug: 'all',      label: 'All',       icon: '🗾' },
  { slug: 'temple',   label: 'Shrines',   icon: '⛩' },
  { slug: 'eco',      label: 'Eco',       icon: '♻️' },
  { slug: 'food',     label: 'Food',      icon: '🍱' },
  { slug: 'shopping', label: 'Shopping',  icon: '🛍' },
]

const PIN_COLORS: Record<string, string> = {
  temple:   '#C8392B',
  eco:      '#1E8449',
  food:     '#E67E22',
  shopping: '#8E44AD',
}

export function MapScreen({ navigation }: MapMainScreenProps) {
  const { spots, loading, offline } = useSpots()
  const [filter, setFilter] = useState<FilterSlug>('all')
  const [view, setView] = useState<'map' | 'list'>('map')
  const mapRef = useRef<MapView>(null)

  const filtered = filter === 'all' ? spots : spots.filter(s => s.category_slug === filter)

  async function goToMyLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') return
    const pos = await Location.getCurrentPositionAsync({})
    mapRef.current?.animateToRegion({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    }, 600)
  }

  return (
    <View style={styles.container}>

      {/* Filter tabs */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.slug}
              style={[styles.filterChip, filter === f.slug && styles.filterChipActive]}
              onPress={() => setFilter(f.slug)}
              activeOpacity={0.7}
            >
              <Text style={styles.filterIcon}>{f.icon}</Text>
              <Text style={[styles.filterLabel, filter === f.slug && styles.filterLabelActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Map/List toggle */}
        <View style={styles.toggleWrap}>
          <TouchableOpacity
            style={[styles.toggleBtn, view === 'map' && styles.toggleBtnActive]}
            onPress={() => setView('map')}
          >
            <Text style={[styles.toggleText, view === 'map' && styles.toggleTextActive]}>Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, view === 'list' && styles.toggleBtnActive]}
            onPress={() => setView('list')}
          >
            <Text style={[styles.toggleText, view === 'list' && styles.toggleTextActive]}>List</Text>
          </TouchableOpacity>
        </View>
      </View>

      {offline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>You're offline. Showing cached spots.</Text>
        </View>
      )}

      {loading && spots.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#C8392B" />
        </View>
      ) : view === 'map' ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={TOKYO_REGION}
          showsUserLocation={false}
        >
          {filtered.map(spot => (
            <Marker
              key={spot.id}
              coordinate={{ latitude: spot.lat, longitude: spot.lng }}
              title={spot.name_en}
              pinColor={PIN_COLORS[spot.category_slug] ?? '#C8392B'}
              onCalloutPress={() => navigation.navigate('SpotDetail', { spotId: spot.id, spotName: spot.name_en })}
            />
          ))}
        </MapView>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <SpotRow spot={item} onPress={() => navigation.navigate('SpotDetail', { spotId: item.id, spotName: item.name_en })} />
          )}
        />
      )}

      {/* My location button (map view only) */}
      {view === 'map' && (
        <TouchableOpacity style={styles.locBtn} onPress={goToMyLocation} activeOpacity={0.8}>
          <Text style={styles.locIcon}>📍</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

function SpotRow({ spot, onPress }: { spot: Spot; onPress: () => void }) {
  const color = PIN_COLORS[spot.category_slug] ?? '#C8392B'
  return (
    <TouchableOpacity style={styles.spotRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.spotIconBadge, { backgroundColor: color + '20' }]}>
        <Text style={styles.spotIconText}>{spot.category_icon}</Text>
      </View>
      <View style={styles.spotInfo}>
        <Text style={styles.spotName}>{spot.name_en}</Text>
        <Text style={styles.spotAddress} numberOfLines={1}>{spot.address_en ?? spot.address_ja ?? ''}</Text>
        {spot.tags.length > 0 && (
          <View style={styles.tagRow}>
            {spot.tags.slice(0, 3).map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#F7F7F7' },
  center:           { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Filter bar
  filterBar:        { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E5EA', paddingVertical: 8 },
  filterScroll:     { paddingHorizontal: 12, gap: 8 },
  filterChip:       { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F2F2F7', borderWidth: 1, borderColor: 'transparent' },
  filterChipActive: { backgroundColor: '#FDECEA', borderColor: '#C8392B' },
  filterIcon:       { fontSize: 14 },
  filterLabel:      { fontSize: 13, color: '#555', fontWeight: '500' },
  filterLabelActive:{ color: '#C8392B', fontWeight: '700' },

  // Toggle
  toggleWrap:       { flexDirection: 'row', marginRight: 12, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E5EA' },
  toggleBtn:        { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fff' },
  toggleBtnActive:  { backgroundColor: '#C8392B' },
  toggleText:       { fontSize: 13, color: '#555', fontWeight: '500' },
  toggleTextActive: { color: '#fff', fontWeight: '700' },

  // Offline
  offlineBanner:    { backgroundColor: '#FFF3CD', paddingVertical: 6, paddingHorizontal: 16 },
  offlineText:      { fontSize: 13, color: '#856404', textAlign: 'center' },

  // Map
  map:              { flex: 1 },

  // List
  listContent:      { padding: 12, gap: 8 },
  spotRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  spotIconBadge:    { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  spotIconText:     { fontSize: 22 },
  spotInfo:         { flex: 1 },
  spotName:         { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
  spotAddress:      { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  tagRow:           { flexDirection: 'row', gap: 4, marginTop: 6, flexWrap: 'wrap' },
  tag:              { backgroundColor: '#F2F2F7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  tagText:          { fontSize: 11, color: '#666' },
  chevron:          { fontSize: 22, color: '#C7C7CC', fontWeight: '300' },

  // Location button
  locBtn: {
    position: 'absolute', right: 16,
    bottom: Platform.OS === 'ios' ? 32 : 16,
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
  },
  locIcon:          { fontSize: 22 },
})
