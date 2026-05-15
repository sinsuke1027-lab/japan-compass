import {
  View, Text, SectionList, StyleSheet, ActivityIndicator,
} from 'react-native'
import { useManners, type Manner } from '../../hooks/useManners'
import type { MannerDetailScreenProps } from '../../types/navigation'

type Section = { title: string; severity: Manner['severity']; data: Manner[] }

const SEVERITY_CONFIG = {
  must:   { label: 'MUST KNOW',   color: '#C8392B', bg: '#FFF0EE' },
  should: { label: 'SHOULD KNOW', color: '#E67E22', bg: '#FFF8F0' },
  nice:   { label: 'NICE TO KNOW',color: '#27AE60', bg: '#F0FFF4' },
} as const

export function MannerDetailScreen({ route }: MannerDetailScreenProps) {
  const { categoryId } = route.params
  const { manners, loading, offline } = useManners(categoryId)

  if (loading && manners.length === 0) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#C8392B" /></View>
  }

  const sections: Section[] = (['must', 'should', 'nice'] as const)
    .map((sev) => ({
      title:    SEVERITY_CONFIG[sev].label,
      severity: sev,
      data:     manners.filter((m) => m.severity === sev),
    }))
    .filter((s) => s.data.length > 0)

  return (
    <View style={styles.container}>
      {offline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>You're offline. Showing cached content.</Text>
        </View>
      )}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => {
          const cfg = SEVERITY_CONFIG[section.severity]
          return (
            <View style={[styles.sectionHeader, { backgroundColor: cfg.bg }]}>
              <Text style={[styles.sectionTitle, { color: cfg.color }]}>{section.title}</Text>
            </View>
          )
        }}
        renderItem={({ item, section }) => (
          <MannerItem item={item} severity={section.severity} />
        )}
        stickySectionHeadersEnabled={false}
      />
    </View>
  )
}

function MannerItem({ item, severity }: { item: Manner; severity: Manner['severity'] }) {
  const isDont = item.title_en.startsWith("Don't") || item.title_en.startsWith("Don't")
  const cfg = SEVERITY_CONFIG[severity]

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.doIcon}>{isDont ? '❌' : '✅'}</Text>
        <Text style={[styles.title, isDont && { color: '#C8392B' }]}>{item.title_en}</Text>
        <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.badgeText, { color: cfg.color }]}>{severity.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.body}>{item.body_en}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#F7F7F7' },
  center:        { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list:          { padding: 16, paddingBottom: 32 },
  sectionHeader: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 8, marginTop: 16 },
  sectionTitle:  { fontSize: 12, fontWeight: '700', letterSpacing: 0.8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6, gap: 8 },
  doIcon:     { fontSize: 16, marginTop: 1 },
  title:      { flex: 1, fontSize: 15, fontWeight: '700', color: '#1C1C1E', lineHeight: 20 },
  badge: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 6, alignSelf: 'flex-start',
  },
  badgeText:  { fontSize: 10, fontWeight: '700' },
  body:       { fontSize: 14, color: '#555', lineHeight: 20, marginLeft: 24 },
  offlineBanner: { backgroundColor: '#FFF3CD', paddingVertical: 8, paddingHorizontal: 16 },
  offlineText:   { fontSize: 13, color: '#856404', textAlign: 'center' },
})
