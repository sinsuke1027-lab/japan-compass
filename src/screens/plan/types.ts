export type WishlistCategory = 'food' | 'sightseeing' | 'shopping' | 'other'

export type WishlistItem = {
  id: string
  name: string
  url?: string
  memo?: string
  category: WishlistCategory
  lat?: number
  lng?: number
  created_at: string
}

export type ScheduleSlot = 'morning' | 'afternoon' | 'evening'

export type ScheduleEntry = {
  date: string       // YYYY-MM-DD
  slot: ScheduleSlot
  wishlistItemId: string
}

export type PlanSchedule = ScheduleEntry[]

export const CATEGORY_COLORS: Record<WishlistCategory, string> = {
  food:        '#2C6E49',
  sightseeing: '#1A5276',
  shopping:    '#6C3483',
  other:       '#7F6000',
}

export const CATEGORY_LABELS: Record<WishlistCategory, string> = {
  food:        '🍜 Food',
  sightseeing: '⛩️ Sightseeing',
  shopping:    '🛍️ Shopping',
  other:       '📌 Other',
}
