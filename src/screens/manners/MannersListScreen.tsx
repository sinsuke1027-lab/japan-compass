import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native'
import { useMannerCategories, type MannerCategory } from '../../hooks/useMannerCategories'
import type { MannersListScreenProps } from '../../types/navigation'

export function MannersListScreen({ navigation }: MannersListScreenProps) {
  const { categories, loading, offline } = useMannerCategories()

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
        data={[...categories, { id: 'phrases', slug: 'phrases', name_en: 'Phrases', icon: '💬', sort_order: 99 }]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <CategoryCard
            item={item}
            onPress={() => {
              if (item.slug === 'phrases') {
                navigation.navigate('PhraseCategoryList')
              } else {
                navigation.navigate('MannerDetail', {
                  categoryId: item.id,
                  categoryName: item.name_en,
                })
              }
            }}
          />
        )}
      />
    </View>
  )
}

function CategoryCard({ item, onPress }: { item: MannerCategory; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.icon}>{item.icon ?? '📋'}</Text>
      <Text style={styles.name}>{item.name_en}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#F7F7F7' },
  center:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list:       { padding: 12, gap: 12 },
  row:        { gap: 12 },
  card: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    padding: 12,
  },
  icon: { fontSize: 36, marginBottom: 8 },
  name: { fontSize: 14, fontWeight: '600', color: '#1C1C1E', textAlign: 'center' },
  offlineBanner: { backgroundColor: '#FFF3CD', paddingVertical: 8, paddingHorizontal: 16 },
  offlineText:   { fontSize: 13, color: '#856404', textAlign: 'center' },
})
