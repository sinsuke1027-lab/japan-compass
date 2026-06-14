import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { JournalListScreen } from '../screens/journal/JournalListScreen'
import { JournalDetailScreen } from '../screens/journal/JournalDetailScreen'
import { JournalEditScreen } from '../screens/journal/JournalEditScreen'
import { TripSummaryScreen } from '../screens/journal/TripSummaryScreen'
import { MemoryListScreen } from '../screens/journal/MemoryListScreen'
import { MemoryAddScreen } from '../screens/journal/MemoryAddScreen'
import type { JournalStackParamList } from '../types/navigation'

const Stack = createNativeStackNavigator<JournalStackParamList>()

export function JournalStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="JournalList"  component={JournalListScreen}  options={{ title: 'My Journal' }} />
      <Stack.Screen name="JournalDetail" component={JournalDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="JournalEdit"  component={JournalEditScreen}  options={{ title: 'Edit Entry' }} />
      <Stack.Screen name="TripSummary"  component={TripSummaryScreen}  options={{ title: 'Trip Summary' }} />
      <Stack.Screen name="MemoryList"   component={MemoryListScreen}   options={{ title: 'Memories' }} />
      <Stack.Screen name="MemoryAdd"    component={MemoryAddScreen}    options={{ title: 'Add Memory' }} />
    </Stack.Navigator>
  )
}
