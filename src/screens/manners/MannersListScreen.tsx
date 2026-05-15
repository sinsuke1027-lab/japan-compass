import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import type { MannersListScreenProps } from '../../types/navigation'

const MENU_ITEMS = [
  { label: 'Manner Tips',   icon: '📋', description: 'Etiquette by scene',    available: false },
  { label: 'Shrine Guide',  icon: '⛩',  description: 'How to visit a shrine', available: false },
  { label: 'Phrases',       icon: '💬', description: 'Useful phrases',        available: true  },
]

export function MannersListScreen({ navigation }: MannersListScreenProps) {
  const handlePress = (label: string, available: boolean) => {
    if (!available) return
    if (label === 'Phrases') navigation.navigate('PhraseCategoryList')
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.list}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.card, !item.available && styles.cardDisabled]}
            onPress={() => handlePress(item.label, item.available)}
            activeOpacity={item.available ? 0.7 : 1}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.textBlock}>
              <Text style={[styles.label, !item.available && styles.labelDisabled]}>{item.label}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            {item.available
              ? <Text style={styles.chevron}>›</Text>
              : <Text style={styles.comingSoon}>Soon</Text>
            }
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#F7F7F7' },
  list:         { padding: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDisabled: { opacity: 0.5 },
  icon:         { fontSize: 28, width: 44 },
  textBlock:    { flex: 1 },
  label:        { fontSize: 17, fontWeight: '600', color: '#1C1C1E' },
  labelDisabled:{ color: '#8E8E93' },
  description:  { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  chevron:      { fontSize: 22, color: '#C7C7CC' },
  comingSoon:   { fontSize: 12, color: '#C7C7CC', fontWeight: '500' },
})
