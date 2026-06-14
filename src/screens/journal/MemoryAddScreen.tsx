import 'react-native-get-random-values'
import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  Image, Alert, ActivityIndicator,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Paths, File } from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { v4 as uuidv4 } from 'uuid'
import type { MemoryAddScreenProps } from '../../types/navigation'
import type { MemoryEntry } from './MemoryListScreen'

const STORAGE_KEY = 'memory:entries'

type Category = 'food' | 'place' | 'experience'

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'food', label: 'Food 🍜' },
  { key: 'place', label: 'Place 📍' },
  { key: 'experience', label: 'Experience ✨' },
]

export function MemoryAddScreen({ navigation }: MemoryAddScreenProps) {
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [category, setCategory] = useState<Category>('place')
  const [title, setTitle] = useState('')
  const [shopName, setShopName] = useState('')
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)

  async function pickFromLibrary() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    })
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri)
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your camera.')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    })
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri)
    }
  }

  async function handleSave() {
    if (!imageUri) {
      Alert.alert('Photo required', 'Please select or take a photo.')
      return
    }

    setSaving(true)
    try {
      // Copy image to app's document directory
      const id = uuidv4()
      const ext = imageUri.split('.').pop() ?? 'jpg'
      const srcFile = new File(imageUri)
      const destFile = new File(Paths.document, `memory_${id}.${ext}`)
      srcFile.copy(destFile)
      const destPath = destFile.uri

      const entry: MemoryEntry = {
        id,
        uri: destPath,
        category,
        title: title.trim() || null,
        shopName: category === 'food' ? (shopName.trim() || null) : null,
        comment: category === 'food' ? (comment.trim() || null) : null,
        created_at: new Date().toISOString(),
      }

      const raw = await AsyncStorage.getItem(STORAGE_KEY)
      const existing: MemoryEntry[] = raw ? JSON.parse(raw) : []
      const updated = [entry, ...existing]
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

      navigation.goBack()
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to save memory.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

      {/* Image picker */}
      <View style={styles.field}>
        <Text style={styles.label}>Photo <Text style={styles.required}>*</Text></Text>
        {imageUri ? (
          <TouchableOpacity onPress={pickFromLibrary} activeOpacity={0.8}>
            <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
            <Text style={styles.changePhoto}>Tap to change</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.photoButtons}>
            <TouchableOpacity style={styles.photoBtn} onPress={pickFromLibrary} activeOpacity={0.7}>
              <Text style={styles.photoBtnIcon}>🖼</Text>
              <Text style={styles.photoBtnText}>Choose from Library</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoBtn} onPress={takePhoto} activeOpacity={0.7}>
              <Text style={styles.photoBtnIcon}>📷</Text>
              <Text style={styles.photoBtnText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Category */}
      <View style={styles.field}>
        <Text style={styles.label}>Category <Text style={styles.required}>*</Text></Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map(c => (
            <TouchableOpacity
              key={c.key}
              style={[styles.catBtn, category === c.key && styles.catBtnActive]}
              onPress={() => setCategory(c.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.catBtnText, category === c.key && styles.catBtnTextActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.label}>Title <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Amazing ramen at Ichiran"
          placeholderTextColor="#C7C7CC"
          returnKeyType="next"
        />
      </View>

      {/* Food-only fields */}
      {category === 'food' && (
        <>
          <View style={styles.field}>
            <Text style={styles.label}>Shop Name <Text style={styles.optional}>(optional)</Text></Text>
            <TextInput
              style={styles.input}
              value={shopName}
              onChangeText={setShopName}
              placeholder="Restaurant or shop name"
              placeholderTextColor="#C7C7CC"
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Comment <Text style={styles.optional}>(optional)</Text></Text>
            <TextInput
              style={styles.input}
              value={comment}
              onChangeText={setComment}
              placeholder="One-line impression..."
              placeholderTextColor="#C7C7CC"
              returnKeyType="done"
            />
          </View>
        </>
      )}

      {/* Save button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.85}>
        {saving
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.saveBtnText}>Save Memory</Text>
        }
      </TouchableOpacity>

    </ScrollView>
  )
}

const SHADOW = {
  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
} as const

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#F7F7F7' },
  content:         { padding: 20, paddingBottom: 48 },

  field:           { marginBottom: 20 },
  label:           { fontSize: 13, fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  required:        { color: '#C8392B' },
  optional:        { color: '#C7C7CC', textTransform: 'none', fontWeight: '400' },

  preview:         { width: '100%', height: 220, borderRadius: 14 },
  changePhoto:     { fontSize: 13, color: '#C8392B', fontWeight: '600', textAlign: 'center', marginTop: 8 },

  photoButtons:    { flexDirection: 'row', gap: 12 },
  photoBtn: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 20,
    alignItems: 'center', gap: 8, ...SHADOW,
  },
  photoBtnIcon:    { fontSize: 28 },
  photoBtnText:    { fontSize: 13, fontWeight: '600', color: '#1C1C1E', textAlign: 'center' },

  categoryRow:     { flexDirection: 'row', gap: 8 },
  catBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center',
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E5EA', ...SHADOW,
  },
  catBtnActive:    { backgroundColor: '#C8392B', borderColor: '#C8392B' },
  catBtnText:      { fontSize: 13, fontWeight: '600', color: '#8E8E93' },
  catBtnTextActive:{ color: '#fff' },

  input: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    fontSize: 15, color: '#1C1C1E', ...SHADOW,
  },

  saveBtn:         { backgroundColor: '#C8392B', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  saveBtnText:     { color: '#fff', fontSize: 16, fontWeight: '700' },
})
