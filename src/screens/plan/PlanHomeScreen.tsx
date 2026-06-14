import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native'
import { useState } from 'react'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { PlanStackParamList } from '../../types/navigation'
import { WishlistView } from './planner/WishlistView'
import { RouteView } from './planner/RouteView'
import { ScheduleView } from './planner/ScheduleView'
import { CalendarView } from './calendar/CalendarView'

type Tab = 'planner' | 'calendar'
type PlannerSub = 'wishlist' | 'route' | 'schedule'

type Props = {
  navigation: NativeStackNavigationProp<PlanStackParamList, 'PlanHome'>
}

export function PlanHomeScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('planner')
  const [plannerSub, setPlannerSub] = useState<PlannerSub>('wishlist')

  return (
    <SafeAreaView style={styles.container}>
      {/* Top header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Plan</Text>
      </View>

      {/* Main segment: Planner / Calendar */}
      <View style={styles.segmentWrapper}>
        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'planner' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('planner')}
          >
            <Text style={[styles.segmentBtnText, activeTab === 'planner' && styles.segmentBtnTextActive]}>
              🗺️ Planner
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'calendar' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('calendar')}
          >
            <Text style={[styles.segmentBtnText, activeTab === 'calendar' && styles.segmentBtnTextActive]}>
              📅 Calendar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Planner sub-segment */}
      {activeTab === 'planner' && (
        <View style={styles.subSegmentWrapper}>
          {(['wishlist', 'route', 'schedule'] as PlannerSub[]).map(sub => (
            <TouchableOpacity
              key={sub}
              style={[styles.subSegmentBtn, plannerSub === sub && styles.subSegmentBtnActive]}
              onPress={() => setPlannerSub(sub)}
            >
              <Text style={[
                styles.subSegmentText,
                plannerSub === sub && styles.subSegmentTextActive,
              ]}>
                {sub === 'wishlist' ? '❤️ Wishlist' : sub === 'route' ? '📍 Route' : '🗓 Schedule'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'calendar' ? (
          <CalendarView />
        ) : plannerSub === 'wishlist' ? (
          <WishlistView navigation={navigation} />
        ) : plannerSub === 'route' ? (
          <RouteView />
        ) : (
          <ScheduleView />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },

  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#C8392B', letterSpacing: -0.5 },

  segmentWrapper: { paddingHorizontal: 16, paddingVertical: 8 },
  segment: {
    flexDirection: 'row', backgroundColor: '#E5E5EA',
    borderRadius: 12, padding: 3,
  },
  segmentBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  segmentBtnActive:     { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  segmentBtnText:       { fontSize: 14, fontWeight: '600', color: '#8E8E93' },
  segmentBtnTextActive: { color: '#1C1C1E' },

  subSegmentWrapper: {
    flexDirection: 'row', paddingHorizontal: 16, gap: 8, paddingBottom: 8,
  },
  subSegmentBtn: {
    flex: 1, paddingVertical: 7, borderRadius: 10,
    alignItems: 'center', backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 2, elevation: 1,
  },
  subSegmentBtnActive:   { backgroundColor: '#C8392B' },
  subSegmentText:        { fontSize: 12, fontWeight: '600', color: '#8E8E93' },
  subSegmentTextActive:  { color: '#fff' },

  content: { flex: 1 },
})
