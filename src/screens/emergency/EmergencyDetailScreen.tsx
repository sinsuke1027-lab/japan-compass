import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Alert,
} from 'react-native'
import { useLayoutEffect } from 'react'
import { EMERGENCY_TYPES } from '../../data/emergency'
import type { EmergencyDetailScreenProps } from '../../types/navigation'

export function EmergencyDetailScreen({ route, navigation }: EmergencyDetailScreenProps) {
  const emergency = EMERGENCY_TYPES.find((e) => e.id === route.params.typeId)

  useLayoutEffect(() => {
    if (emergency) {
      navigation.setOptions({ title: emergency.title })
    }
  }, [emergency, navigation])

  if (!emergency) return null

  const call = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() =>
      Alert.alert('Cannot place call', 'Please dial ' + number + ' manually.')
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: emergency.bgColor }]}>
        <Text style={styles.headerIcon}>{emergency.icon}</Text>
        <Text style={[styles.headerTitle, { color: emergency.color }]}>{emergency.title}</Text>
        <Text style={styles.description}>{emergency.description}</Text>
      </View>

      {/* Call Button */}
      {emergency.number && (
        <TouchableOpacity
          style={[styles.callButton, { backgroundColor: emergency.color }]}
          onPress={() => call(emergency.number!)}
          activeOpacity={0.85}
        >
          <Text style={styles.callIcon}>📞</Text>
          <View>
            <Text style={styles.callNumber}>{emergency.number}</Text>
            <Text style={styles.callLabel}>{emergency.numberLabel}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Steps */}
      <Text style={styles.sectionTitle}>What to Do</Text>
      {emergency.steps.map((step, i) => (
        <View key={i} style={styles.stepRow}>
          <View style={[styles.stepBadge, { backgroundColor: emergency.bgColor }]}>
            <Text style={[styles.stepNum, { color: emergency.color }]}>{i + 1}</Text>
          </View>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}

      {/* Embassies */}
      {emergency.embassies && (
        <>
          <Text style={styles.sectionTitle}>Embassy Contacts (Tokyo)</Text>
          <Text style={styles.disclaimer}>
            ⚠️ Numbers may change. Verify on official embassy websites before your trip.
          </Text>
          {emergency.embassies.map((emb) => (
            <View key={emb.country} style={styles.embassyRow}>
              <Text style={styles.embassyFlag}>{emb.flag}</Text>
              <View style={styles.embassyInfo}>
                <Text style={styles.embassyCountry}>{emb.country}</Text>
                <Text style={styles.embassyAddress}>{emb.address}</Text>
              </View>
              <TouchableOpacity
                style={styles.embassyCall}
                onPress={() => call(emb.phone)}
                activeOpacity={0.7}
              >
                <Text style={styles.embassyCallText}>📞</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}

      {/* Phrases */}
      <Text style={styles.sectionTitle}>Key Phrases</Text>
      {emergency.phrases.map((p) => (
        <View key={p.english} style={styles.phraseCard}>
          <Text style={styles.phraseJp}>{p.japanese}</Text>
          <Text style={styles.phraseReading}>{p.reading}</Text>
          <Text style={styles.phraseEn}>{p.english}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#F7F7F7' },
  content:         { padding: 16, paddingBottom: 40 },
  header:          { borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16 },
  headerIcon:      { fontSize: 48, marginBottom: 8 },
  headerTitle:     { fontSize: 24, fontWeight: '800', marginBottom: 6 },
  description:     { fontSize: 14, color: '#555', textAlign: 'center', lineHeight: 20 },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  callIcon:    { fontSize: 28 },
  callNumber:  { fontSize: 32, fontWeight: '900', color: '#fff' },
  callLabel:   { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  sectionTitle:{ fontSize: 17, fontWeight: '700', color: '#1C1C1E', marginBottom: 10, marginTop: 8 },
  disclaimer:  { fontSize: 12, color: '#856404', backgroundColor: '#FFF3CD', padding: 10, borderRadius: 8, marginBottom: 10 },
  stepRow:     { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 10 },
  stepBadge:   { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', flexShrink: 0, marginTop: 1 },
  stepNum:     { fontSize: 13, fontWeight: '700' },
  stepText:    { flex: 1, fontSize: 14, color: '#333', lineHeight: 20 },
  embassyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  embassyFlag:      { fontSize: 24 },
  embassyInfo:      { flex: 1 },
  embassyCountry:   { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
  embassyAddress:   { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  embassyCall:      { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EAFAF1', justifyContent: 'center', alignItems: 'center' },
  embassyCallText:  { fontSize: 18 },
  phraseCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  phraseJp:      { fontSize: 20, fontWeight: '700', color: '#1C1C1E', marginBottom: 3 },
  phraseReading: { fontSize: 13, color: '#8E8E93', marginBottom: 2 },
  phraseEn:      { fontSize: 15, color: '#444', fontStyle: 'italic' },
})
