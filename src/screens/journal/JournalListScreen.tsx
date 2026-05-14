import { View, Text, StyleSheet } from 'react-native'
import type { JournalListScreenProps } from '../../types/navigation'

export function JournalListScreen(_props: JournalListScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.id}>SCR-030</Text>
      <Text style={styles.title}>My Journal</Text>
      <Text style={styles.sub}>Entry list — coming soon</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  id:    { fontSize: 12, color: '#999', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: '#333' },
  sub:   { fontSize: 14, color: '#999', marginTop: 8 },
})
