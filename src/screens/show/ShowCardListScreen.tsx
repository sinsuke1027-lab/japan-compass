import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SHOW_CATEGORIES } from '../../data/showCards'
import type { ShowCardListScreenProps } from '../../types/navigation'

export function ShowCardListScreen({ navigation }: ShowCardListScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.hint}>Tap a card and show it to a Japanese person for help.</Text>
      <View style={styles.grid}>
        {SHOW_CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.card, { backgroundColor: cat.color }]}
            onPress={() => navigation.navigate('ShowCardDetail', { categoryId: cat.id })}
            activeOpacity={0.8}
          >
            <Text style={styles.icon}>{cat.icon}</Text>
            <Text style={styles.label}>{cat.label}</Text>
            <Text style={styles.count}>{cat.cards.length} cards</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#F7F7F7', padding: 16 },
  hint:       { fontSize: 13, color: '#8E8E93', textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  grid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  icon:   { fontSize: 40 },
  label:  { fontSize: 18, fontWeight: '700', color: '#fff' },
  count:  { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
})
