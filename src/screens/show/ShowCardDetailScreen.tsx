import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useState } from 'react'
import { SHOW_CATEGORIES, ALLERGENS, buildAllergenCard, type Allergen } from '../../data/showCards'
import type { ShowCardDetailScreenProps } from '../../types/navigation'

export function ShowCardDetailScreen({ route, navigation }: ShowCardDetailScreenProps) {
  const { categoryId } = route.params
  const category = SHOW_CATEGORIES.find(c => c.id === categoryId)!
  const [selectedAllergens, setSelectedAllergens] = useState<Allergen[]>([])

  const toggleAllergen = (allergen: Allergen) => {
    setSelectedAllergens(prev =>
      prev.find(a => a.id === allergen.id)
        ? prev.filter(a => a.id !== allergen.id)
        : [...prev, allergen]
    )
  }

  const allergenCard = selectedAllergens.length > 0 ? buildAllergenCard(selectedAllergens) : null

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Allergen selector (food only) */}
      {categoryId === 'food' && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SELECT YOUR ALLERGENS</Text>
          <View style={styles.chips}>
            {ALLERGENS.map(a => {
              const active = !!selectedAllergens.find(s => s.id === a.id)
              return (
                <TouchableOpacity
                  key={a.id}
                  style={[styles.chip, active && { backgroundColor: category.color }]}
                  onPress={() => toggleAllergen(a)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {a.japanese} ({a.english})
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
          {allergenCard && (
            <CardRow
              card={allergenCard}
              color={category.color}
              onPress={() => navigation.navigate('ShowCardFull', {
                cardId: allergenCard.id,
                categoryId,
                allergenIds: selectedAllergens.map(a => a.id),
              })}
            />
          )}
        </View>
      )}

      {/* Fixed cards */}
      <View style={styles.section}>
        {categoryId === 'food' && <Text style={styles.sectionLabel}>OR CHOOSE A CARD</Text>}
        {category.cards.map(card => (
          <CardRow
            key={card.id}
            card={card}
            color={category.color}
            onPress={() => navigation.navigate('ShowCardFull', { cardId: card.id, categoryId })}
          />
        ))}
      </View>
    </ScrollView>
  )
}

function CardRow({
  card,
  color,
  onPress,
}: {
  card: { title: string; japanese: string; english: string }
  color: string
  onPress: () => void
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.cardAccent, { backgroundColor: color }]} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{card.title}</Text>
        <Text style={styles.cardJp} numberOfLines={2}>{card.japanese}</Text>
        <Text style={styles.cardEn} numberOfLines={1}>{card.english}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#F7F7F7' },
  content:        { padding: 16, gap: 20, paddingBottom: 40 },
  section:        { gap: 10 },
  sectionLabel:   { fontSize: 11, fontWeight: '700', color: '#8E8E93', letterSpacing: 0.8 },

  // Allergen chips
  chips:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 16, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  chipText:       { fontSize: 13, color: '#555' },
  chipTextActive: { color: '#fff', fontWeight: '600' },

  // Card row
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  cardAccent:   { width: 5, alignSelf: 'stretch' },
  cardBody:     { flex: 1, padding: 14, gap: 3 },
  cardTitle:    { fontSize: 13, fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.5 },
  cardJp:       { fontSize: 16, fontWeight: '700', color: '#1C1C1E', lineHeight: 22 },
  cardEn:       { fontSize: 12, color: '#8E8E93' },
  chevron:      { fontSize: 24, color: '#C7C7CC', paddingRight: 14 },
})
