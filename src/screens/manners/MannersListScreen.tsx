import { View, Text, StyleSheet } from 'react-native'
import type { MannersListScreenProps } from '../../types/navigation'

export function MannersListScreen(_props: MannersListScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.id}>SCR-010</Text>
      <Text style={styles.title}>Manner Guide</Text>
      <Text style={styles.sub}>Category list — coming soon</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  id:    { fontSize: 12, color: '#999', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: '#333' },
  sub:   { fontSize: 14, color: '#999', marginTop: 8 },
})
