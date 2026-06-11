import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert,
} from 'react-native'
import { Audio } from 'expo-av'
import { useRef } from 'react'
import { usePhrases, type Phrase } from '../../hooks/usePhrases'
import type { PhraseDetailScreenProps } from '../../types/navigation'

export function PhraseDetailScreen({ route }: PhraseDetailScreenProps) {
  const { categoryId } = route.params
  const { phrases, loading, offline } = usePhrases(categoryId)
  const soundRef = useRef<Audio.Sound | null>(null)

  const playAudio = async (url: string | null) => {
    if (!url) {
      Alert.alert('Audio not available', 'Audio clips will be added in a future update.')
      return
    }
    if (offline) {
      Alert.alert('Offline', 'Audio playback requires an internet connection.')
      return
    }
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync()
        soundRef.current = null
      }
      const { sound } = await Audio.Sound.createAsync({ uri: url })
      soundRef.current = sound
      await sound.playAsync()
    } catch {
      Alert.alert('Playback error', 'Could not play audio.')
    }
  }

  if (loading && phrases.length === 0) {
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
        data={phrases}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PhraseCard item={item} onPlay={() => playAudio(item.audio_url)} />
        )}
      />
    </View>
  )
}

function PhraseCard({ item, onPlay }: { item: Phrase; onPlay: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.textBlock}>
        <Text style={styles.japanese}>{item.japanese}</Text>
        <Text style={styles.reading}>{item.reading}</Text>
        <Text style={styles.english}>{item.english}</Text>
      </View>
      <TouchableOpacity style={styles.playButton} onPress={onPlay} activeOpacity={0.7}>
        <Text style={styles.playIcon}>🔊</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#F7F7F7' },
  center:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list:       { padding: 16, gap: 12 },
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
  textBlock:  { flex: 1 },
  japanese:   { fontSize: 22, fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  reading:    { fontSize: 14, color: '#666', marginBottom: 2 },
  english:    { fontSize: 15, color: '#444', fontStyle: 'italic' },
  playButton: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  playIcon:   { fontSize: 20 },
  offlineBanner: { backgroundColor: '#FFF3CD', paddingVertical: 8, paddingHorizontal: 16 },
  offlineText:   { fontSize: 13, color: '#856404', textAlign: 'center' },
})
