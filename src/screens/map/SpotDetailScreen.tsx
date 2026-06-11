import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { useSpots } from '../../hooks/useSpots'
import type { SpotDetailScreenProps } from '../../types/navigation'

const PIN_COLORS: Record<string, string> = {
  temple:   '#C8392B',
  eco:      '#1E8449',
  food:     '#E67E22',
  shopping: '#8E44AD',
}

export function SpotDetailScreen({ route }: SpotDetailScreenProps) {
  const { spotId } = route.params
  const { spots } = useSpots()
  const spot = spots.find(s => s.id === spotId)

  if (!spot) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Spot not found.</Text>
      </View>
    )
  }

  const color = PIN_COLORS[spot.category_slug] ?? '#C8392B'

  function openMaps() {
    const query = encodeURIComponent(spot!.name_en)
    const url = `https://maps.apple.com/?q=${query}&ll=${spot!.lat},${spot!.lng}`
    Linking.openURL(url)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Header badge */}
      <View style={[styles.headerBadge, { backgroundColor: color + '15' }]}>
        <Text style={styles.headerIcon}>{spot.category_icon}</Text>
        <View style={[styles.categoryPill, { backgroundColor: color }]}>
          <Text style={styles.categoryLabel}>{spot.category_slug}</Text>
        </View>
      </View>

      {/* Name */}
      <Text style={styles.nameEn}>{spot.name_en}</Text>
      <Text style={styles.nameJa}>{spot.name_ja}</Text>

      {/* Description */}
      {spot.description_en && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{spot.description_en}</Text>
        </View>
      )}

      {/* Address */}
      {(spot.address_en || spot.address_ja) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          {spot.address_en && <Text style={styles.addressText}>{spot.address_en}</Text>}
          {spot.address_ja && <Text style={styles.addressJa}>{spot.address_ja}</Text>}
        </View>
      )}

      {/* Tags */}
      {spot.tags.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagRow}>
            {spot.tags.map(tag => (
              <View key={tag} style={[styles.tag, { borderColor: color }]}>
                <Text style={[styles.tagText, { color }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Open in Maps */}
      <TouchableOpacity style={[styles.mapsBtn, { backgroundColor: color }]} onPress={openMaps} activeOpacity={0.8}>
        <Text style={styles.mapsBtnText}>Open in Maps</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#F7F7F7' },
  content:         { padding: 20, paddingBottom: 40 },
  center:          { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFound:        { color: '#999', fontSize: 16 },

  headerBadge:     { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 16, marginBottom: 16 },
  headerIcon:      { fontSize: 48 },
  categoryPill:    { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  categoryLabel:   { color: '#fff', fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },

  nameEn:          { fontSize: 24, fontWeight: '800', color: '#1C1C1E', marginBottom: 4 },
  nameJa:          { fontSize: 16, color: '#8E8E93', marginBottom: 20 },

  section:         { marginBottom: 20 },
  sectionTitle:    { fontSize: 13, fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  description:     { fontSize: 15, color: '#333', lineHeight: 23, backgroundColor: '#fff', borderRadius: 12, padding: 14 },
  addressText:     { fontSize: 14, color: '#333', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 4 },
  addressJa:       { fontSize: 13, color: '#8E8E93', backgroundColor: '#fff', borderRadius: 12, padding: 14 },

  tagRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag:             { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, borderWidth: 1.5, backgroundColor: '#fff' },
  tagText:         { fontSize: 13, fontWeight: '600' },

  mapsBtn:         { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  mapsBtnText:     { color: '#fff', fontSize: 16, fontWeight: '700' },
})
