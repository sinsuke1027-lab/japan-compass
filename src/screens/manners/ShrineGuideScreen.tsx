import { View, Text, ScrollView, StyleSheet } from 'react-native'
import {
  SHRINE_STEPS, OSAISEN_COINS, FORTUNE_LEVELS, OMIKUJI_TIPS,
  SHRINE_SYMBOLS, BLESSINGS,
} from '../../data/shrine'

export function ShrineGuideScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* How to Visit */}
      <SectionHeader emoji="🗺" title="How to Visit" />
      {SHRINE_STEPS.map((step) => (
        <View key={step.number} style={styles.stepCard}>
          <View style={styles.stepLeft}>
            <View style={styles.stepNumBadge}>
              <Text style={styles.stepNumText}>{step.number}</Text>
            </View>
            <View style={styles.stepLine} />
          </View>
          <View style={styles.stepRight}>
            <Text style={styles.stepEmoji}>{step.emoji}</Text>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepBody}>{step.body}</Text>
          </View>
        </View>
      ))}

      {/* Osaiseninfo */}
      <SectionHeader emoji="🪙" title="Osaiseninfo — What Coin to Offer?" />
      <View style={styles.card}>
        <Text style={styles.cardNote}>
          The amount you offer is less important than your sincerity. That said, coins have symbolic meanings in Japanese:
        </Text>
        {OSAISEN_COINS.map((coin) => (
          <View key={coin.amount} style={[styles.coinRow, !coin.lucky && styles.coinRowUnlucky]}>
            <Text style={styles.coinAmount}>{coin.amount}</Text>
            <View style={styles.coinInfo}>
              <Text style={styles.coinMeaning}>{coin.meaning}</Text>
              <Text style={styles.coinNote}>{coin.note}</Text>
            </View>
            <Text style={styles.coinLuck}>{coin.lucky ? '✅' : '⚠️'}</Text>
          </View>
        ))}
      </View>

      {/* Omikuji */}
      <SectionHeader emoji="🎋" title="Omikuji — Fortune Slips" />
      <View style={styles.card}>
        {OMIKUJI_TIPS.map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
      <View style={styles.fortuneGrid}>
        {FORTUNE_LEVELS.map((f) => (
          <View key={f.kanji} style={[styles.fortuneCard, { borderLeftColor: f.color }]}>
            <Text style={[styles.fortuneKanji, { color: f.color }]}>{f.kanji}</Text>
            <Text style={styles.fortuneReading}>{f.reading}</Text>
            <Text style={styles.fortuneEnglish}>{f.english}</Text>
            <Text style={styles.fortuneDesc}>{f.description}</Text>
          </View>
        ))}
      </View>

      {/* Symbols */}
      <SectionHeader emoji="🔍" title="Shrine Symbols" />
      {SHRINE_SYMBOLS.map((sym) => (
        <View key={sym.name} style={styles.symbolRow}>
          <Text style={styles.symbolEmoji}>{sym.emoji}</Text>
          <View style={styles.symbolInfo}>
            <Text style={styles.symbolName}>{sym.name}</Text>
            <Text style={styles.symbolReading}>{sym.reading}</Text>
            <Text style={styles.symbolDesc}>{sym.description}</Text>
          </View>
        </View>
      ))}

      {/* Blessings */}
      <SectionHeader emoji="🙏" title="Types of Blessings (ご利益)" />
      {BLESSINGS.map((b) => (
        <View key={b.japanese} style={styles.blessingRow}>
          <Text style={styles.blessingEmoji}>{b.emoji}</Text>
          <View style={styles.blessingInfo}>
            <View style={styles.blessingHeader}>
              <Text style={styles.blessingType}>{b.type}</Text>
              <Text style={styles.blessingJp}>{b.japanese}（{b.reading}）</Text>
            </View>
            <Text style={styles.blessingDesc}>{b.description}</Text>
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>✅ Available offline</Text>
      </View>

    </ScrollView>
  )
}

function SectionHeader({ emoji, title }: { emoji: string; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionEmoji}>{emoji}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  )
}

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 2,
} as const

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#F7F7F7' },
  content:        { padding: 16, paddingBottom: 40 },

  // Section header
  sectionHeader:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 24, marginBottom: 12 },
  sectionEmoji:   { fontSize: 22 },
  sectionTitle:   { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },

  // Steps
  stepCard:       { flexDirection: 'row', marginBottom: 4 },
  stepLeft:       { alignItems: 'center', width: 32, marginRight: 12 },
  stepNumBadge:   { width: 28, height: 28, borderRadius: 14, backgroundColor: '#C8392B', justifyContent: 'center', alignItems: 'center' },
  stepNumText:    { color: '#fff', fontSize: 13, fontWeight: '700' },
  stepLine:       { flex: 1, width: 2, backgroundColor: '#FADADD', marginVertical: 4 },
  stepRight:      { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, ...CARD_SHADOW },
  stepEmoji:      { fontSize: 28, marginBottom: 6 },
  stepTitle:      { fontSize: 16, fontWeight: '700', color: '#1C1C1E', marginBottom: 6 },
  stepBody:       { fontSize: 14, color: '#444', lineHeight: 21 },

  // Generic card
  card:           { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, ...CARD_SHADOW },
  cardNote:       { fontSize: 13, color: '#666', marginBottom: 12, lineHeight: 19 },

  // Osaisen coins
  coinRow:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F2F2F7', gap: 10 },
  coinRowUnlucky: { opacity: 0.65 },
  coinAmount:     { fontSize: 20, fontWeight: '800', color: '#C8392B', width: 46 },
  coinInfo:       { flex: 1 },
  coinMeaning:    { fontSize: 14, fontWeight: '600', color: '#1C1C1E' },
  coinNote:       { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  coinLuck:       { fontSize: 18 },

  // Tips
  tipRow:         { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tipBullet:      { fontSize: 16, color: '#C8392B', marginTop: 1 },
  tipText:        { flex: 1, fontSize: 14, color: '#444', lineHeight: 20 },

  // Fortune grid
  fortuneGrid:    { gap: 8, marginBottom: 8 },
  fortuneCard: {
    backgroundColor: '#fff', borderRadius: 10, padding: 12,
    borderLeftWidth: 4, flexDirection: 'row', alignItems: 'center', gap: 12,
    ...CARD_SHADOW,
  },
  fortuneKanji:   { fontSize: 26, fontWeight: '900', width: 44, textAlign: 'center' },
  fortuneReading: { fontSize: 12, color: '#8E8E93' },
  fortuneEnglish: { fontSize: 13, fontWeight: '700', color: '#1C1C1E' },
  fortuneDesc:    { fontSize: 12, color: '#666', flex: 1, lineHeight: 17 },

  // Symbols
  symbolRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8,
    ...CARD_SHADOW,
  },
  symbolEmoji:    { fontSize: 30, width: 40, textAlign: 'center', marginTop: 2 },
  symbolInfo:     { flex: 1 },
  symbolName:     { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
  symbolReading:  { fontSize: 12, color: '#C8392B', marginTop: 2, marginBottom: 4 },
  symbolDesc:     { fontSize: 13, color: '#555', lineHeight: 19 },

  // Blessings
  blessingRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8,
    ...CARD_SHADOW,
  },
  blessingEmoji:  { fontSize: 28, width: 40, textAlign: 'center', marginTop: 2 },
  blessingInfo:   { flex: 1 },
  blessingHeader: { marginBottom: 4 },
  blessingType:   { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
  blessingJp:     { fontSize: 12, color: '#C8392B', marginTop: 2 },
  blessingDesc:   { fontSize: 13, color: '#555', lineHeight: 19 },

  // Footer
  footer:         { alignItems: 'center', marginTop: 16 },
  footerText:     { fontSize: 12, color: '#1E8449', fontWeight: '600' },
})
