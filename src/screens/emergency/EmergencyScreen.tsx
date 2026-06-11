import { View, Text, StyleSheet } from 'react-native'
import type { EmergencyScreenProps } from '../../types/navigation'

export function EmergencyScreen(_props: EmergencyScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.id}>SCR-040</Text>
      <Text style={styles.title}>Emergency</Text>
      <Text style={styles.sub}>SOS / 110 / 119 — coming soon</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  id:    { fontSize: 12, color: '#999', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: '#C8392B' },
  sub:   { fontSize: 14, color: '#999', marginTop: 8 },
})
