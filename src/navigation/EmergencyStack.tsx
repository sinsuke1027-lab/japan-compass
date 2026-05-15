import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { EmergencyGuideScreen } from '../screens/emergency/EmergencyGuideScreen'
import { EmergencyDetailScreen } from '../screens/emergency/EmergencyDetailScreen'
import { NearbyServicesScreen } from '../screens/emergency/NearbyServicesScreen'
import type { EmergencyStackParamList } from '../types/navigation'

const Stack = createNativeStackNavigator<EmergencyStackParamList>()

export function EmergencyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EmergencyGuide"  component={EmergencyGuideScreen}  options={{ title: 'Emergency' }} />
      <Stack.Screen name="EmergencyDetail" component={EmergencyDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="NearbyServices"  component={NearbyServicesScreen}  options={{ title: 'Nearby Services' }} />
    </Stack.Navigator>
  )
}
