import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MannersListScreen } from '../screens/manners/MannersListScreen'
import { MannerDetailScreen } from '../screens/manners/MannerDetailScreen'
import { PhraseCategoryListScreen } from '../screens/manners/PhraseCategoryListScreen'
import { PhraseDetailScreen } from '../screens/manners/PhraseDetailScreen'
import type { MannersStackParamList } from '../types/navigation'

const Stack = createNativeStackNavigator<MannersStackParamList>()

export function MannersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MannersList"        component={MannersListScreen}        options={{ title: 'Manner Guide' }} />
      <Stack.Screen name="MannerDetail"       component={MannerDetailScreen}       options={{ title: '' }} />
      <Stack.Screen name="PhraseCategoryList" component={PhraseCategoryListScreen} options={{ title: 'Phrases' }} />
      <Stack.Screen name="PhraseDetail"       component={PhraseDetailScreen}       options={({ route }) => ({ title: route.params.categoryName })} />
    </Stack.Navigator>
  )
}
