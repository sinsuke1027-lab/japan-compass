import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ShowCardListScreen } from '../screens/show/ShowCardListScreen'
import { ShowCardDetailScreen } from '../screens/show/ShowCardDetailScreen'
import { ShowCardFullScreen } from '../screens/show/ShowCardFullScreen'
import type { ShowStackParamList } from '../types/navigation'

const Stack = createNativeStackNavigator<ShowStackParamList>()

export function ShowStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ShowCardList"
        component={ShowCardListScreen}
        options={{ title: 'Show Card' }}
      />
      <Stack.Screen
        name="ShowCardDetail"
        component={ShowCardDetailScreen}
        options={({ route }) => ({ title: route.params.categoryId })}
      />
      <Stack.Screen
        name="ShowCardFull"
        component={ShowCardFullScreen}
        options={{ headerShown: false, presentation: 'fullScreenModal' }}
      />
    </Stack.Navigator>
  )
}
