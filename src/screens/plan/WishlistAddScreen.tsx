import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import type { WishlistAddScreenProps } from '../../types/navigation'
import type { WishlistItem, WishlistCategory } from './types'
import { CATEGORY_COLORS, CATEGORY_LABELS } from './types'
import { supabase } from '../../lib/supabase'

const STORAGE_KEY = 'plan:wishlist'
const CATEGORIES: WishlistCategory[] = ['food', 'sightseeing', 'shopping', 'other']

export function WishlistAddScreen({ route, navigation }: WishlistAddScreenProps) {
  const editId = route.params?.editId

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [memo, setMemo] = useState('')
  const [category, setCategory] = useState<WishlistCategory>('sightseeing')
  const [latStr, setLatStr] = useState('')
  const [lngStr, setLngStr] = useState('')
  const [fetchingTitle, setFetchingTitle] = useState(false)

  useEffect(() => {
    if (editId) {
      loadExisting(editId)
    }
  }, [editId])

  async function loadExisting(id: string) {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const list: WishlistItem[] = JSON.parse(raw)
    const item = list.find(i => i.id === id)
    if (item) {
      setName(item.name)
      setUrl(item.url ?? '')
      setMemo(item.memo ?? '')
      setCategory(item.category)
      setLatStr(item.lat?.toString() ?? '')
      setLngStr(item.lng?.toString() ?? '')
    }
  }

  async function handleFetchTitle() {
    if (!url.trim()) return
    setFetchingTitle(true)
    try {
      const { data, error } = await supabase.functions.invoke('fetch-url-title', {
        body: { url: url.trim() },
      })
      if (!error && data?.title) {
        setName(data.title)
      } else {
        Alert.alert('Could not fetch title', 'Please enter the name manually.')
      }
    } catch {
      Alert.alert('Could not fetch title', 'Please enter the name manually.')
    } finally {
      setFetchingTitle(false)
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a place name.')
      return
    }

    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    const list: WishlistItem[] = raw ? JSON.parse(raw) : []

    const lat = latStr.trim() ? parseFloat(latStr) : undefined
    const lng = lngStr.trim() ? parseFloat(lngStr) : undefined

    if (editId) {
      const idx = list.findIndex(i => i.id === editId)
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          name: name.trim(),
          url: url.trim() || undefined,
          memo: memo.trim() || undefined,
          category,
          lat: Number.isNaN(lat) ? undefined : lat,
          lng: Number.isNaN(lng) ? undefined : lng,
        }
      }
    } else {
      const newItem: WishlistItem = {
        id: uuidv4(),
        name: name.trim(),
        url: url.trim() || undefined,
        memo: memo.trim() || undefined,
        category,
        lat: Number.isNaN(lat) ? undefined : lat,
        lng: Number.isNaN(lng) ? undefined : lng,
        created_at: new Date().toISOString(),
      }
      list.unshift(newItem)
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    navigation.goBack()
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>URL (optional)</Text>
        <View style={styles.urlRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={url}
            onChangeText={setUrl}
            placeholder="https://..."
            autoCapitalize="none"
            keyboardType="url"
          />
          <TouchableOpacity
            style={[styles.fetchBtn, fetchingTitle && styles.fetchBtnDisabled]}
            onPress={handleFetchTitle}
            disabled={fetchingTitle || !url.trim()}
          >
            {fetchingTitle
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={styles.fetchBtnText}>Auto-fill</Text>}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>PLACE NAME *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Fushimi Inari Shrine"
        />

        <Text style={styles.sectionLabel}>CATEGORY</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                category === cat && { backgroundColor: CATEGORY_COLORS[cat] },
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryChipText, category === cat && { color: '#fff' }]}>
                {CATEGORY_LABELS[cat]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>MEMO (optional)</Text>
        <TextInput
          style={[styles.input, styles.memoInput]}
          value={memo}
          onChangeText={setMemo}
          placeholder="Notes, opening hours, tips..."
          multiline
          numberOfLines={3}
        />

        <Text style={styles.sectionLabel}>LOCATION (optional)</Text>
        <View style={styles.latLngRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={latStr}
            onChangeText={setLatStr}
            placeholder="Latitude"
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={lngStr}
            onChangeText={setLngStr}
            placeholder="Longitude"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{editId ? 'Update' : 'Add to Wishlist'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const SHADOW = {
  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
} as const

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  content:   { padding: 16, paddingBottom: 40, gap: 8 },

  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#8E8E93',
    letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 8,
  },

  input: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    fontSize: 15, color: '#1C1C1E', ...SHADOW,
  },
  memoInput: { minHeight: 80, textAlignVertical: 'top' },

  urlRow:    { flexDirection: 'row', gap: 8, alignItems: 'center' },
  latLngRow: { flexDirection: 'row', gap: 8 },

  fetchBtn: {
    backgroundColor: '#C8392B', borderRadius: 12, paddingHorizontal: 14,
    paddingVertical: 14, justifyContent: 'center', alignItems: 'center',
  },
  fetchBtnDisabled: { opacity: 0.5 },
  fetchBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: {
    borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14,
    backgroundColor: '#fff', ...SHADOW,
  },
  categoryChipText: { fontSize: 13, fontWeight: '600', color: '#1C1C1E' },

  saveBtn: {
    backgroundColor: '#C8392B', borderRadius: 14, padding: 16,
    alignItems: 'center', marginTop: 16,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})
