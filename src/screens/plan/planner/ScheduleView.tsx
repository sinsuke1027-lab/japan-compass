import {
  View, Text, SectionList, StyleSheet, TouchableOpacity, Modal,
  FlatList,
} from 'react-native'
import { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { WishlistItem, ScheduleEntry, ScheduleSlot } from '../types'
import { CATEGORY_COLORS } from '../types'

const WISHLIST_KEY = 'plan:wishlist'
const SCHEDULE_KEY = 'plan:schedule'

const SLOTS: ScheduleSlot[] = ['morning', 'afternoon', 'evening']
const SLOT_ICONS: Record<ScheduleSlot, string> = {
  morning:   '🌅',
  afternoon: '☀️',
  evening:   '🌙',
}

function getNext14Days(): string[] {
  const days: string[] = []
  const today = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })
}

type Section = {
  title: string
  date: string
  data: ScheduleSlot[]
}

export function ScheduleView() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [pickerVisible, setPickerVisible] = useState(false)
  const [pendingDate, setPendingDate] = useState<string>('')
  const [pendingSlot, setPendingSlot] = useState<ScheduleSlot>('morning')

  const loadData = useCallback(async () => {
    const [wRaw, sRaw] = await Promise.all([
      AsyncStorage.getItem(WISHLIST_KEY),
      AsyncStorage.getItem(SCHEDULE_KEY),
    ])
    setWishlist(wRaw ? JSON.parse(wRaw) : [])
    setSchedule(sRaw ? JSON.parse(sRaw) : [])
  }, [])

  useFocusEffect(useCallback(() => { loadData() }, [loadData]))

  function getSlotItem(date: string, slot: ScheduleSlot): WishlistItem | undefined {
    const entry = schedule.find(e => e.date === date && e.slot === slot)
    if (!entry) return undefined
    return wishlist.find(w => w.id === entry.wishlistItemId)
  }

  function openPicker(date: string, slot: ScheduleSlot) {
    setPendingDate(date)
    setPendingSlot(slot)
    setPickerVisible(true)
  }

  async function assignItem(itemId: string | null) {
    setPickerVisible(false)
    const updated = schedule.filter(
      e => !(e.date === pendingDate && e.slot === pendingSlot),
    )
    if (itemId) {
      updated.push({ date: pendingDate, slot: pendingSlot, wishlistItemId: itemId })
    }
    setSchedule(updated)
    await AsyncStorage.setItem(SCHEDULE_KEY, JSON.stringify(updated))
  }

  const days = getNext14Days()
  const sections: Section[] = days.map(date => ({
    title: formatDate(date),
    date,
    data: SLOTS,
  }))

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(slot, idx) => `${idx}-${slot}`}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => (
          <Text style={styles.dateHeader}>{section.title}</Text>
        )}
        renderItem={({ item: slot, section }) => {
          const assigned = getSlotItem(section.date, slot)
          return (
            <TouchableOpacity
              style={styles.slotRow}
              onPress={() => openPicker(section.date, slot)}
              activeOpacity={0.7}
            >
              <View style={styles.slotLabel}>
                <Text style={styles.slotIcon}>{SLOT_ICONS[slot]}</Text>
                <Text style={styles.slotName}>{slot.charAt(0).toUpperCase() + slot.slice(1)}</Text>
              </View>
              {assigned ? (
                <View style={styles.assignedChip}>
                  <View style={[styles.chipDot, { backgroundColor: CATEGORY_COLORS[assigned.category] }]} />
                  <Text style={styles.assignedText} numberOfLines={1}>{assigned.name}</Text>
                </View>
              ) : (
                <Text style={styles.emptySlot}>Tap to assign +</Text>
              )}
            </TouchableOpacity>
          )
        }}
      />

      <Modal visible={pickerVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalBackdrop} onPress={() => setPickerVisible(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>
              {SLOT_ICONS[pendingSlot]} {pendingSlot.charAt(0).toUpperCase() + pendingSlot.slice(1)} — {formatDate(pendingDate)}
            </Text>

            <FlatList
              data={[null, ...wishlist]}
              keyExtractor={item => item ? item.id : '__clear__'}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => assignItem(item ? item.id : null)}
                >
                  {item ? (
                    <>
                      <View style={[styles.chipDot, { backgroundColor: CATEGORY_COLORS[item.category] }]} />
                      <Text style={styles.pickerItemText}>{item.name}</Text>
                    </>
                  ) : (
                    <Text style={[styles.pickerItemText, { color: '#C7C7CC' }]}>— Clear slot —</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const SHADOW = {
  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
} as const

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  list:      { padding: 16, gap: 4, paddingBottom: 40 },

  dateHeader: {
    fontSize: 13, fontWeight: '700', color: '#1C1C1E',
    paddingTop: 16, paddingBottom: 6,
  },

  slotRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    marginBottom: 6, ...SHADOW,
  },
  slotLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 110 },
  slotIcon:  { fontSize: 16 },
  slotName:  { fontSize: 13, fontWeight: '600', color: '#555' },

  assignedChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#F0F0F0', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8,
  },
  chipDot:      { width: 8, height: 8, borderRadius: 4 },
  assignedText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#1C1C1E' },
  emptySlot:    { flex: 1, fontSize: 13, color: '#C7C7CC', fontStyle: 'italic' },

  // Modal
  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 15, fontWeight: '700', color: '#1C1C1E',
    marginBottom: 16, textAlign: 'center',
  },
  pickerItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  pickerItemText: { fontSize: 15, color: '#1C1C1E' },
})
