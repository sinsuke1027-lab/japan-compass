import {
  View, Text, SectionList, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native'
import { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  SEASON_CALENDAR,
  CALENDAR_CATEGORIES,
  CALENDAR_CITIES,
  MONTH_NAMES,
  type CalendarEvent,
} from '../../../data/seasonCalendar'

const CITY_FILTER_KEY = 'plan:city-filter'

type CategoryFilter = 'all' | 'nature' | 'festival' | 'crowded' | 'daily-tip'
type CityFilter = 'all' | 'tokyo' | 'osaka' | 'kyoto' | 'nagoya' | 'fukuoka' | 'sapporo'

const CATEGORY_COLORS: Record<string, string> = {
  'all':       '#C8392B',
  'nature':    '#2C6E49',
  'festival':  '#6C3483',
  'crowded':   '#E67E22',
  'daily-tip': '#1A5276',
}

type Section = {
  title: string
  monthNum: number
  data: CalendarEvent[]
}

export function CalendarView() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [cityFilter, setCityFilter] = useState<CityFilter>('all')

  useFocusEffect(useCallback(() => {
    AsyncStorage.getItem(CITY_FILTER_KEY).then(val => {
      if (val) setCityFilter(val as CityFilter)
    })
  }, []))

  async function handleCityFilter(city: CityFilter) {
    setCityFilter(city)
    await AsyncStorage.setItem(CITY_FILTER_KEY, city)
  }

  const currentMonth = new Date().getMonth() + 1 // 1–12

  // Build sections for all 12 months starting from current month
  const orderedMonths = Array.from({ length: 12 }, (_, i) => ((currentMonth - 1 + i) % 12) + 1)

  const sections: Section[] = orderedMonths
    .map(month => {
      const events = SEASON_CALENDAR.filter(e => {
        if (e.month !== month) return false
        if (categoryFilter !== 'all' && e.category !== categoryFilter) return false
        if (cityFilter !== 'all') {
          if (!e.cities.includes('all') && !e.cities.includes(cityFilter)) return false
        }
        return true
      })
      return {
        title: MONTH_NAMES[month - 1],
        monthNum: month,
        data: events,
      }
    })
    .filter(s => s.data.length > 0)

  return (
    <View style={styles.container}>
      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {CALENDAR_CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.filterChip,
              categoryFilter === cat.id && { backgroundColor: CATEGORY_COLORS[cat.id] },
            ]}
            onPress={() => setCategoryFilter(cat.id as CategoryFilter)}
          >
            <Text style={[
              styles.filterChipText,
              categoryFilter === cat.id && { color: '#fff' },
            ]}>
              {cat.icon} {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* City filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cityRow}
      >
        {CALENDAR_CITIES.map(city => (
          <TouchableOpacity
            key={city.id}
            style={[
              styles.cityChip,
              cityFilter === city.id && styles.cityChipActive,
            ]}
            onPress={() => handleCityFilter(city.id as CityFilter)}
          >
            <Text style={[
              styles.cityChipText,
              cityFilter === city.id && { color: '#C8392B', fontWeight: '700' },
            ]}>
              {city.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🗓️</Text>
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptySubtitle}>Try changing your filters</Text>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.monthHeader}>
            <Text style={styles.monthTitle}>{section.title}</Text>
            <Text style={styles.monthNum}>{section.monthNum.toString().padStart(2, '0')}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderLeftColor: CATEGORY_COLORS[item.category] }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_COLORS[item.category] + '20' }]}>
                  <Text style={[styles.categoryBadgeText, { color: CATEGORY_COLORS[item.category] }]}>
                    {CALENDAR_CATEGORIES.find(c => c.id === item.category)?.icon}{' '}
                    {CALENDAR_CATEGORIES.find(c => c.id === item.category)?.label}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.cardDesc}>{item.description}</Text>
            {!item.cities.includes('all') && (
              <Text style={styles.cardCities}>
                📍 {item.cities.map(c => CALENDAR_CITIES.find(cc => cc.id === c)?.label ?? c).join(' · ')}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  )
}

const SHADOW = {
  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
} as const

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },

  filterRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterChip: {
    borderRadius: 20, paddingVertical: 7, paddingHorizontal: 14,
    backgroundColor: '#fff', ...SHADOW,
  },
  filterChipText: { fontSize: 13, fontWeight: '600', color: '#1C1C1E' },

  cityRow: { paddingHorizontal: 16, paddingBottom: 10, gap: 6 },
  cityChip: {
    borderRadius: 14, paddingVertical: 5, paddingHorizontal: 12,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E5EA',
  },
  cityChipActive: { borderColor: '#C8392B', backgroundColor: '#FFF5F5' },
  cityChipText: { fontSize: 12, fontWeight: '500', color: '#555' },

  list: { padding: 16, paddingTop: 4, paddingBottom: 40, gap: 10 },

  monthHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline',
    paddingBottom: 8, paddingTop: 12,
  },
  monthTitle: { fontSize: 20, fontWeight: '800', color: '#1C1C1E' },
  monthNum:   { fontSize: 13, fontWeight: '700', color: '#C7C7CC' },

  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    borderLeftWidth: 4, ...SHADOW, gap: 8,
  },
  cardHeader:     { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  cardIcon:       { fontSize: 24, lineHeight: 28 },
  cardHeaderText: { flex: 1, gap: 4 },
  cardTitle:      { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },

  categoryBadge: {
    alignSelf: 'flex-start', borderRadius: 6, paddingVertical: 2, paddingHorizontal: 7,
  },
  categoryBadgeText: { fontSize: 11, fontWeight: '600' },

  cardDesc:   { fontSize: 13, color: '#555', lineHeight: 19 },
  cardCities: { fontSize: 11, color: '#8E8E93', fontWeight: '500' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyIcon:     { fontSize: 48 },
  emptyTitle:    { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  emptySubtitle: { fontSize: 14, color: '#8E8E93', textAlign: 'center' },
})
