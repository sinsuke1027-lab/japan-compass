import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import { SHOW_CATEGORIES, ALLERGENS, buildAllergenCard } from '../../data/showCards'
import type { ShowCardFullScreenProps } from '../../types/navigation'

export function ShowCardFullScreen({ route, navigation }: ShowCardFullScreenProps) {
  const { cardId, categoryId, allergenIds } = route.params
  const category = SHOW_CATEGORIES.find(c => c.id === categoryId)!

  const card = cardId === 'allergen-custom' && allergenIds
    ? buildAllergenCard(ALLERGENS.filter(a => allergenIds.includes(a.id)))
    : category.cards.find(c => c.id === cardId)!

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: category.color }]}
      onPress={() => navigation.goBack()}
      activeOpacity={1}
    >
      <SafeAreaView style={styles.inner}>
        <Text style={styles.tapHint}>Tap anywhere to go back</Text>
        <View style={styles.cardBox}>
          <Text style={styles.japanese}>{card.japanese}</Text>
          <View style={styles.divider} />
          <Text style={styles.english}>{card.english}</Text>
        </View>
        <Text style={styles.category}>{category.icon} {category.label}</Text>
      </SafeAreaView>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container:  { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 24,
  },
  tapHint:    { fontSize: 13, color: 'rgba(255,255,255,0.6)', position: 'absolute', top: 60 },
  cardBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  japanese:   { fontSize: 32, fontWeight: '800', color: '#1C1C1E', textAlign: 'center', lineHeight: 44 },
  divider:    { width: 48, height: 2, backgroundColor: '#E0E0E0', borderRadius: 1 },
  english:    { fontSize: 16, color: '#8E8E93', textAlign: 'center', lineHeight: 24 },
  category:   { fontSize: 16, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
})
