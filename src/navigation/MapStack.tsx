import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MapScreen } from '../screens/map/MapScreen'
import { SpotDetailScreen } from '../screens/map/SpotDetailScreen'
import type { MapStackParamList } from '../types/navigation'

const Stack = createNativeStackNavigator<MapStackParamList>()

export function MapStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MapMain"    component={MapScreen}       options={{ title: 'Sustainable Map' }} />
      <Stack.Screen name="SpotDetail" component={SpotDetailScreen} options={({ route }) => ({ title: route.params.spotName })} />
    </Stack.Navigator>
  )
}
