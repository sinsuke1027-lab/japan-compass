import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { supabase } from '../../lib/supabase'
import type { JournalDetailScreenProps } from '../../types/navigation'

type Entry = {
  id: string
  title: string
  body: string | null
  insights: string | null
  visited_at: string
  spot_name_en: string | null
}

export function JournalDetailScreen({ route, navigation }: JournalDetailScreenProps) {
  const { id } = route.params
  const [entry, setEntry] = useState<Entry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('journal_entries')
      .select('id, title, body, insights, visited_at, sustainable_spots(name_en)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          const e = data as any
          setEntry({
            id: e.id,
            title: e.title,
            body: e.body,
            insights: e.insights ?? null,
            visited_at: e.visited_at,
            spot_name_en: e.sustainable_spots?.name_en ?? null,
          })
          navigation.setOptions({ title: e.title })
        }
        setLoading(false)
      })
  }, [id, navigation])

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#C8392B" /></View>
  }

  if (!entry) {
    return <View style={styles.center}><Text style={styles.notFound}>Entry not found.</Text></View>
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <Text style={styles.date}>{formatDate(entry.visited_at)}</Text>
      <Text style={styles.title}>{entry.title}</Text>

      {entry.spot_name_en && (
        <View style={styles.spotBadge}>
          <Text style={styles.spotText}>📍 {entry.spot_name_en}</Text>
        </View>
      )}

      {entry.body ? (
        <View style={styles.bodyCard}>
          <Text style={styles.bodyText}>{entry.body}</Text>
        </View>
      ) : (
        <Text style={styles.noMemo}>No memo added.</Text>
      )}

      {entry.insights ? (
        <View style={styles.insightsCard}>
          <Text style={styles.insightsLabel}>💡 Insights</Text>
          <Text style={styles.insightsText}>{entry.insights}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => navigation.navigate('JournalEdit', { id: entry.id })}
        activeOpacity={0.85}
      >
        <Text style={styles.editBtnText}>Edit Entry</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const SHADOW = {
  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
} as const

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#F7F7F7' },
  content:     { padding: 20, paddingBottom: 48 },
  center:      { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFound:    { color: '#999', fontSize: 16 },

  date:        { fontSize: 13, color: '#8E8E93', fontWeight: '600', marginBottom: 6 },
  title:       { fontSize: 26, fontWeight: '800', color: '#1C1C1E', marginBottom: 14 },

  spotBadge:   { backgroundColor: '#FDECEA', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 20 },
  spotText:    { fontSize: 14, color: '#C8392B', fontWeight: '600' },

  bodyCard:      { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, ...SHADOW },
  bodyText:      { fontSize: 15, color: '#333', lineHeight: 24 },
  noMemo:        { fontSize: 14, color: '#C7C7CC', marginBottom: 16 },

  insightsCard:  { backgroundColor: '#FFFBEA', borderRadius: 14, padding: 16, marginBottom: 24, ...SHADOW },
  insightsLabel: { fontSize: 12, fontWeight: '700', color: '#B7810A', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  insightsText:  { fontSize: 15, color: '#333', lineHeight: 24 },

  editBtn:     { backgroundColor: '#C8392B', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  editBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
