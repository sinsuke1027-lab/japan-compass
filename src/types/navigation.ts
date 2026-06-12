import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'

export type RootStackParamList = {
  Tabs: undefined
}

export type TabParamList = {
  Home: undefined
  Manners: undefined
  Map: undefined
  Journal: undefined
  Emergency: undefined
  Show: undefined
}

export type ShowStackParamList = {
  ShowCardList: undefined
  ShowCardDetail: { categoryId: string }
  ShowCardFull: { cardId: string; categoryId: string; allergenIds?: string[] }
}

export type MannersStackParamList = {
  MannersList: undefined
  MannerDetail: { categoryId: string; categoryName: string }
  PhraseCategoryList: undefined
  PhraseDetail: { categoryId: string; categoryName: string }
  ShrineGuide: undefined
}

export type JournalStackParamList = {
  JournalList: undefined
  JournalDetail: { id: string }
  JournalEdit: { id?: string }
  TripSummary: undefined
}

export type EmergencyStackParamList = {
  EmergencyGuide: undefined
  EmergencyDetail: { typeId: string }
  NearbyServices: undefined
}

export type MapStackParamList = {
  MapMain: undefined
  SpotDetail: { spotId: string; spotName: string }
}

export type ShowScreenProps = BottomTabScreenProps<TabParamList, 'Show'>
export type ShowCardListScreenProps = NativeStackScreenProps<ShowStackParamList, 'ShowCardList'>
export type ShowCardDetailScreenProps = NativeStackScreenProps<ShowStackParamList, 'ShowCardDetail'>
export type ShowCardFullScreenProps = NativeStackScreenProps<ShowStackParamList, 'ShowCardFull'>
export type HomeScreenProps = BottomTabScreenProps<TabParamList, 'Home'>
export type MapScreenProps = BottomTabScreenProps<TabParamList, 'Map'>
export type EmergencyScreenProps = BottomTabScreenProps<TabParamList, 'Emergency'>
export type EmergencyGuideScreenProps = NativeStackScreenProps<EmergencyStackParamList, 'EmergencyGuide'>
export type EmergencyDetailScreenProps = NativeStackScreenProps<EmergencyStackParamList, 'EmergencyDetail'>
export type NearbyServicesScreenProps = NativeStackScreenProps<EmergencyStackParamList, 'NearbyServices'>
export type MannersListScreenProps = NativeStackScreenProps<MannersStackParamList, 'MannersList'>
export type MannerDetailScreenProps = NativeStackScreenProps<MannersStackParamList, 'MannerDetail'>
export type PhraseCategoryListScreenProps = NativeStackScreenProps<MannersStackParamList, 'PhraseCategoryList'>
export type PhraseDetailScreenProps = NativeStackScreenProps<MannersStackParamList, 'PhraseDetail'>
export type MapMainScreenProps = NativeStackScreenProps<MapStackParamList, 'MapMain'>
export type SpotDetailScreenProps = NativeStackScreenProps<MapStackParamList, 'SpotDetail'>
export type JournalListScreenProps = NativeStackScreenProps<JournalStackParamList, 'JournalList'>
export type JournalDetailScreenProps = NativeStackScreenProps<JournalStackParamList, 'JournalDetail'>
export type JournalEditScreenProps = NativeStackScreenProps<JournalStackParamList, 'JournalEdit'>
export type TripSummaryScreenProps = NativeStackScreenProps<JournalStackParamList, 'TripSummary'>
