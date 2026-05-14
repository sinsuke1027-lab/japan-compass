import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MannersListScreen } from '../screens/manners/MannersListScreen'
import { MannerDetailScreen } from '../screens/manners/MannerDetailScreen'
import type { MannersStackParamList } from '../types/navigation'

const Stack = createNativeStackNavigator<MannersStackParamList>()

export function MannersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MannersList" component={MannersListScreen} options={{ title: 'Manner Guide' }} />
      <Stack.Screen name="MannerDetail" component={MannerDetailScreen} options={{ title: '' }} />
    </Stack.Navigator>
  )
}
