import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native'
import { usePhraseCategories, type PhraseCategory } from '../../hooks/usePhraseCategories'
import type { PhraseCategoryListScreenProps } from '../../types/navigation'

export function PhraseCategoryListScreen({ navigation }: PhraseCategoryListScreenProps) {
  const { categories, loading, offline } = usePhraseCategories()

  if (loading && categories.length === 0) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#C8392B" /></View>
  }

  return (
    <View style={styles.container}>
      {offline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>You're offline. Showing cached content.</Text>
        </View>
      )}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CategoryRow
            item={item}
            onPress={() => navigation.navigate('PhraseDetail', {
              categoryId: item.id,
              categoryName: item.name_en,
            })}
          />
        )}
      />
    </View>
  )
}

function CategoryRow({ item, onPress }: { item: PhraseCategory; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.icon}>{item.icon ?? '💬'}</Text>
      <Text style={styles.name}>{item.name_en}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#F7F7F7' },
  center:        { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list:          { padding: 16, gap: 12 },
  row: {
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
  icon:    { fontSize: 28, width: 44 },
  name:    { flex: 1, fontSize: 17, fontWeight: '600', color: '#1C1C1E' },
  chevron: { fontSize: 22, color: '#C7C7CC' },
  offlineBanner: { backgroundColor: '#FFF3CD', paddingVertical: 8, paddingHorizontal: 16 },
  offlineText:   { fontSize: 13, color: '#856404', textAlign: 'center' },
})
