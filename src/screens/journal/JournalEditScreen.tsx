import { useState, useEffect, useLayoutEffect } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  Alert, Modal, FlatList, ActivityIndicator,
} from 'react-native'
import { supabase } from '../../lib/supabase'
import { upsertEntry, deleteEntry } from '../../hooks/useJournal'
import { useSpots, type Spot } from '../../hooks/useSpots'
import type { JournalEditScreenProps } from '../../types/navigation'

type ExistingEntry = {
  id: string
  title: string
  body: string | null
  spot_id: string | null
  visited_at: string
  spot_name_en?: string | null
}

export function JournalEditScreen({ route, navigation }: JournalEditScreenProps) {
  const entryId = route.params?.id
  const isNew = !entryId

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [spotId, setSpotId] = useState<string | null>(null)
  const [spotName, setSpotName] = useState<string | null>(null)
  const [visitedAt] = useState(new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)
  const [spotModalVisible, setSpotModalVisible] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({ title: isNew ? 'New Entry' : 'Edit Entry' })
  }, [isNew, navigation])

  useEffect(() => {
    if (!entryId) return
    supabase
      .from('journal_entries')
      .select('id, title, body, spot_id, visited_at, sustainable_spots(name_en)')
      .eq('id', entryId)
      .single()
      .then(({ data }) => {
        if (!data) return
        const e = data as any
        setTitle(e.title ?? '')
        setBody(e.body ?? '')
        setSpotId(e.spot_id ?? null)
        setSpotName(e.sustainable_spots?.name_en ?? null)
      })
  }, [entryId])

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please enter a title for this entry.')
      return
    }
    setSaving(true)
    const { error } = await upsertEntry({
      id: entryId,
      title: title.trim(),
      body: body.trim() || null,
      spot_id: spotId,
      visited_at: visitedAt,
    })
    setSaving(false)
    if (error) {
      Alert.alert('Error', error.message)
      return
    }
    navigation.goBack()
  }

  function handleDelete() {
    Alert.alert(
      'Delete Entry',
      'This entry will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            await deleteEntry(entryId!)
            navigation.goBack()
          },
        },
      ]
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

      {/* Date (read-only) */}
      <View style={styles.field}>
        <Text style={styles.label}>Date</Text>
        <View style={styles.readonlyField}>
          <Text style={styles.readonlyText}>{visitedAt}</Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.label}>Title <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Morning at Meiji Shrine"
          placeholderTextColor="#C7C7CC"
          returnKeyType="next"
        />
      </View>

      {/* Spot */}
      <View style={styles.field}>
        <Text style={styles.label}>Spot <Text style={styles.optional}>(optional)</Text></Text>
        <TouchableOpacity style={styles.spotPicker} onPress={() => setSpotModalVisible(true)} activeOpacity={0.7}>
          {spotName ? (
            <View style={styles.spotSelected}>
              <Text style={styles.spotSelectedText}>📍 {spotName}</Text>
              <TouchableOpacity
                onPress={() => { setSpotId(null); setSpotName(null) }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.spotClear}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.spotPlaceholder}>Search and select a spot…</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Memo */}
      <View style={styles.field}>
        <Text style={styles.label}>Memo <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={body}
          onChangeText={setBody}
          placeholder="What did you experience?"
          placeholderTextColor="#C7C7CC"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
      </View>

      {/* Save button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.85}>
        {saving
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.saveBtnText}>{isNew ? 'Save Entry' : 'Update Entry'}</Text>
        }
      </TouchableOpacity>

      {/* Delete button (edit only) */}
      {!isNew && (
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
          <Text style={styles.deleteBtnText}>Delete Entry</Text>
        </TouchableOpacity>
      )}

      <SpotSearchModal
        visible={spotModalVisible}
        onClose={() => setSpotModalVisible(false)}
        onSelect={(spot) => {
          setSpotId(spot.id)
          setSpotName(spot.name_en)
          setSpotModalVisible(false)
        }}
      />
    </ScrollView>
  )
}

// ── Spot search modal ──────────────────────────────────────────

function SpotSearchModal({
  visible, onClose, onSelect,
}: {
  visible: boolean
  onClose: () => void
  onSelect: (spot: Spot) => void
}) {
  const { spots, loading } = useSpots()
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? spots.filter(s =>
        s.name_en.toLowerCase().includes(query.toLowerCase()) ||
        s.name_ja.includes(query)
      )
    : spots

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={modal.container}>
        <View style={modal.header}>
          <Text style={modal.title}>Select a Spot</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={modal.close}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={modal.searchWrap}>
          <TextInput
            style={modal.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search spots…"
            placeholderTextColor="#C7C7CC"
            autoFocus
            clearButtonMode="while-editing"
          />
        </View>
        {loading ? (
          <View style={modal.center}><ActivityIndicator color="#C8392B" /></View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            contentContainerStyle={modal.list}
            renderItem={({ item }) => (
              <TouchableOpacity style={modal.spotRow} onPress={() => onSelect(item)} activeOpacity={0.7}>
                <Text style={modal.spotIcon}>{item.category_icon}</Text>
                <View style={modal.spotInfo}>
                  <Text style={modal.spotName}>{item.name_en}</Text>
                  <Text style={modal.spotAddress} numberOfLines={1}>{item.address_en ?? item.name_ja}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </Modal>
  )
}

const SHADOW = {
  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
} as const

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#F7F7F7' },
  content:          { padding: 20, paddingBottom: 48 },

  field:            { marginBottom: 20 },
  label:            { fontSize: 13, fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  required:         { color: '#C8392B' },
  optional:         { color: '#C7C7CC', textTransform: 'none', fontWeight: '400' },

  readonlyField:    { backgroundColor: '#EFEFEF', borderRadius: 12, padding: 14 },
  readonlyText:     { fontSize: 15, color: '#8E8E93' },

  input: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    fontSize: 15, color: '#1C1C1E', ...SHADOW,
  },
  textArea:         { minHeight: 120 },

  spotPicker:       { backgroundColor: '#fff', borderRadius: 12, padding: 14, ...SHADOW },
  spotSelected:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  spotSelectedText: { fontSize: 15, color: '#1C1C1E' },
  spotClear:        { fontSize: 16, color: '#8E8E93', paddingLeft: 8 },
  spotPlaceholder:  { fontSize: 15, color: '#C7C7CC' },

  saveBtn:          { backgroundColor: '#C8392B', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  saveBtnText:      { color: '#fff', fontSize: 16, fontWeight: '700' },

  deleteBtn:        { marginTop: 16, alignItems: 'center', paddingVertical: 12 },
  deleteBtnText:    { fontSize: 15, color: '#C8392B', fontWeight: '600' },
})

const modal = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#F7F7F7' },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5EA', backgroundColor: '#fff' },
  title:       { fontSize: 17, fontWeight: '700', color: '#1C1C1E' },
  close:       { fontSize: 16, color: '#C8392B', fontWeight: '600' },
  searchWrap:  { padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  searchInput: { backgroundColor: '#F2F2F7', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: '#1C1C1E' },
  center:      { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list:        { padding: 12, gap: 8 },
  spotRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 12, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  spotIcon:    { fontSize: 24, width: 36, textAlign: 'center' },
  spotInfo:    { flex: 1 },
  spotName:    { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
  spotAddress: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
})
