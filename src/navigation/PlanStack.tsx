import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PlanHomeScreen } from '../screens/plan/PlanHomeScreen'
import { WishlistAddScreen } from '../screens/plan/WishlistAddScreen'
import type { PlanStackParamList } from '../types/navigation'

const Stack = createNativeStackNavigator<PlanStackParamList>()

export function PlanStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PlanHome"
        component={PlanHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WishlistAdd"
        component={WishlistAddScreen}
        options={{ title: 'Add Place', presentation: 'modal' }}
      />
    </Stack.Navigator>
  )
}
