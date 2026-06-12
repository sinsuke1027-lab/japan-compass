import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useState } from 'react'
import { SHOW_CATEGORIES, ALLERGENS, buildAllergenCard, type Allergen } from '../../data/showCards'
import { TRANSIT_CITIES, TRANSIT_PHRASE_TEMPLATES, type TransitCity, type TransitStation, type TransitLine } from '../../data/transitLines'
import type { ShowCardDetailScreenProps } from '../../types/navigation'

export function ShowCardDetailScreen({ route, navigation }: ShowCardDetailScreenProps) {
  const { categoryId } = route.params
  const category = SHOW_CATEGORIES.find(c => c.id === categoryId)!
  const [selectedAllergens, setSelectedAllergens] = useState<Allergen[]>([])
  const [selectedCity, setSelectedCity] = useState<TransitCity | null>(null)
  const [selectedStation, setSelectedStation] = useState<TransitStation | null>(null)
  const [selectedLine, setSelectedLine] = useState<TransitLine | null>(null)

  const toggleAllergen = (allergen: Allergen) => {
    setSelectedAllergens(prev =>
      prev.find(a => a.id === allergen.id)
        ? prev.filter(a => a.id !== allergen.id)
        : [...prev, allergen]
    )
  }

  const allergenCard = selectedAllergens.length > 0 ? buildAllergenCard(selectedAllergens) : null

  const navigateToFull = (japaneseText: string, englishText: string, title: string) => {
    navigation.navigate('ShowCardFull', {
      cardId: '__transit__',
      categoryId,
      transitPhrase: { japanese: japaneseText, english: englishText, title },
    })
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── Transit line selector (transport only) ── */}
      {categoryId === 'transport' && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>FIND YOUR LINE</Text>

          {/* Step 1: City */}
          <Text style={styles.stepLabel}>① City</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {TRANSIT_CITIES.map(city => {
              const active = selectedCity?.id === city.id
              return (
                <TouchableOpacity
                  key={city.id}
                  style={[styles.chip, active && { backgroundColor: category.color }]}
                  onPress={() => {
                    setSelectedCity(city)
                    setSelectedStation(null)
                    setSelectedLine(null)
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {city.name_en}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>

          {/* Step 2: Station */}
          {selectedCity && (
            <>
              <Text style={styles.stepLabel}>② Station</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
                {selectedCity.stations.map(station => {
                  const active = selectedStation?.id === station.id
                  return (
                    <TouchableOpacity
                      key={station.id}
                      style={[styles.chip, active && { backgroundColor: category.color }]}
                      onPress={() => {
                        setSelectedStation(station)
                        setSelectedLine(null)
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {station.name_en}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </>
          )}

          {/* Step 3: Line */}
          {selectedStation && (
            <>
              <Text style={styles.stepLabel}>③ Line</Text>
              <View style={styles.lineList}>
                {selectedStation.lines.map(line => {
                  const active = selectedLine?.id === line.id
                  return (
                    <TouchableOpacity
                      key={line.id}
                      style={[styles.lineChip, active && { backgroundColor: category.color }]}
                      onPress={() => setSelectedLine(line)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {line.name_en}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </>
          )}

          {/* Generated phrase cards */}
          {selectedLine && (
            <View style={styles.generatedCards}>
              <Text style={styles.stepLabel}>TAP TO SHOW</Text>
              {TRANSIT_PHRASE_TEMPLATES.map(tpl => (
                <TouchableOpacity
                  key={tpl.id}
                  style={styles.card}
                  onPress={() => navigateToFull(
                    tpl.japanese(selectedLine.name_ja),
                    tpl.english(selectedLine.name_en),
                    tpl.title,
                  )}
                  activeOpacity={0.8}
                >
                  <View style={[styles.cardAccent, { backgroundColor: category.color }]} />
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{tpl.title}</Text>
                    <Text style={styles.cardJp} numberOfLines={2}>
                      {tpl.japanese(selectedLine.name_ja)}
                    </Text>
                    <Text style={styles.cardEn} numberOfLines={1}>
                      {tpl.english(selectedLine.name_en)}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.divider} />
        </View>
      )}

      {/* ── Allergen selector (food only) ── */}
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

      {/* ── Fixed cards ── */}
      <View style={styles.section}>
        {(categoryId === 'food' || categoryId === 'transport') && (
          <Text style={styles.sectionLabel}>OR CHOOSE A CARD</Text>
        )}
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
  stepLabel:      { fontSize: 11, fontWeight: '600', color: '#1A5276', letterSpacing: 0.5, marginTop: 4 },
  divider:        { height: 1, backgroundColor: '#E0E0E0', marginVertical: 4 },

  chips:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 16, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  lineList:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  lineChip: {
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 16, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  chipText:       { fontSize: 13, color: '#555' },
  chipTextActive: { color: '#fff', fontWeight: '600' },

  generatedCards: { gap: 8, marginTop: 4 },

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
