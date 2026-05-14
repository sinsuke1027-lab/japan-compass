import { View, Text, StyleSheet } from 'react-native'
import type { HomeScreenProps } from '../../types/navigation'

export function HomeScreen(_props: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.id}>SCR-001</Text>
      <Text style={styles.title}>Japan Compass</Text>
      <Text style={styles.sub}>Home</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  id:    { fontSize: 12, color: '#999', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', color: '#C8392B' },
  sub:   { fontSize: 16, color: '#666', marginTop: 4 },
})
