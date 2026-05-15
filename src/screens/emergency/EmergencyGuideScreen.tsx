import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { EMERGENCY_TYPES } from '../../data/emergency'
import type { EmergencyGuideScreenProps } from '../../types/navigation'

export function EmergencyGuideScreen({ navigation }: EmergencyGuideScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.offlineBadge}>
        <Text style={styles.offlineBadgeText}>✅ Available offline</Text>
      </View>
      <FlatList
        data={EMERGENCY_TYPES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.subtitle}>Tap a card for step-by-step guidance</Text>
        }
        ListFooterComponent={
          <TouchableOpacity
            style={styles.nearbyButton}
            onPress={() => navigation.navigate('NearbyServices')}
            activeOpacity={0.8}
          >
            <Text style={styles.nearbyIcon}>📍</Text>
            <Text style={styles.nearbyText}>Find Nearby Hospitals & Embassies</Text>
          </TouchableOpacity>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: item.bgColor }]}
            onPress={() => navigation.navigate('EmergencyDetail', { typeId: item.id })}
            activeOpacity={0.8}
          >
            <Text style={styles.cardIcon}>{item.icon}</Text>
            {item.number && (
              <Text style={[styles.number, { color: item.color }]}>{item.number}</Text>
            )}
            <Text style={[styles.cardTitle, { color: item.color }]}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#F7F7F7' },
  offlineBadge:    { backgroundColor: '#EAFAF1', paddingVertical: 6, alignItems: 'center' },
  offlineBadgeText:{ fontSize: 12, color: '#1E8449', fontWeight: '600' },
  subtitle:        { fontSize: 13, color: '#8E8E93', textAlign: 'center', marginBottom: 16, marginTop: 8 },
  list:            { padding: 16, gap: 12 },
  row:             { gap: 12 },
  card: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardIcon:  { fontSize: 40, marginBottom: 6 },
  number:    { fontSize: 22, fontWeight: '800', marginBottom: 2 },
  cardTitle: { fontSize: 15, fontWeight: '700', textAlign: 'center' },
  nearbyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  nearbyIcon: { fontSize: 20 },
  nearbyText: { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
})
