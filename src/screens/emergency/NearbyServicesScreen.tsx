import {
  View, Text, SectionList, TouchableOpacity, StyleSheet, Linking, Alert,
} from 'react-native'
import { NEARBY_SERVICES } from '../../data/emergency'
import type { NearbyServicesScreenProps } from '../../types/navigation'

export function NearbyServicesScreen(_props: NearbyServicesScreenProps) {
  const call = (phone: string) => {
    if (phone === '—') return
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert('Cannot place call', 'Please dial ' + phone + ' manually.')
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.offlineBadge}>
        <Text style={styles.offlineBadgeText}>✅ Static list — available offline</Text>
      </View>
      <SectionList
        sections={NEARBY_SERVICES.map((s) => ({ title: s.title, icon: s.icon, data: s.items }))}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>{section.icon}</Text>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address}>{item.address}</Text>
              {item.note && <Text style={styles.note}>{item.note}</Text>}
            </View>
            {item.phone !== '—' && (
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => call(item.phone)}
                activeOpacity={0.7}
              >
                <Text style={styles.callIcon}>📞</Text>
                <Text style={styles.callPhone}>{item.phone.replace('+81-', '0')}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListFooterComponent={
          <Text style={styles.footer}>
            This is a static list. For real-time search, please use Google Maps or ask hotel staff.
          </Text>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#F7F7F7' },
  offlineBadge:     { backgroundColor: '#EAFAF1', paddingVertical: 6, alignItems: 'center' },
  offlineBadgeText: { fontSize: 12, color: '#1E8449', fontWeight: '600' },
  list:             { padding: 16, paddingBottom: 32 },
  sectionHeader:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, marginBottom: 8 },
  sectionIcon:      { fontSize: 20 },
  sectionTitle:     { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardInfo:  { flex: 1 },
  name:      { fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 3 },
  address:   { fontSize: 12, color: '#8E8E93' },
  note:      { fontSize: 12, color: '#C8392B', marginTop: 3, fontWeight: '500' },
  callBtn:   { alignItems: 'center', gap: 2 },
  callIcon:  { fontSize: 20 },
  callPhone: { fontSize: 10, color: '#8E8E93' },
  footer:    { fontSize: 12, color: '#8E8E93', textAlign: 'center', marginTop: 16, lineHeight: 18 },
})
