import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { HomeScreen } from '../screens/home/HomeScreen'
import { MannersStack } from './MannersStack'
import { MapScreen } from '../screens/map/MapScreen'
import { JournalStack } from './JournalStack'
import { EmergencyScreen } from '../screens/emergency/EmergencyScreen'
import type { TabParamList } from '../types/navigation'

const Tab = createBottomTabNavigator<TabParamList>()

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

const TAB_ICONS: Record<keyof TabParamList, { active: IoniconsName; inactive: IoniconsName }> = {
  Home:      { active: 'home',           inactive: 'home-outline' },
  Manners:   { active: 'book',           inactive: 'book-outline' },
  Map:       { active: 'map',            inactive: 'map-outline' },
  Journal:   { active: 'journal',        inactive: 'journal-outline' },
  Emergency: { active: 'warning',        inactive: 'warning-outline' },
}

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name as keyof TabParamList]
          return (
            <Ionicons
              name={focused ? icons.active : icons.inactive}
              size={size}
              color={color}
            />
          )
        },
        tabBarActiveTintColor: '#C8392B',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home"      component={HomeScreen}      options={{ title: 'Home' }} />
      <Tab.Screen name="Manners"   component={MannersStack}    options={{ title: 'Manners' }} />
      <Tab.Screen name="Map"       component={MapScreen}       options={{ title: 'Map' }} />
      <Tab.Screen name="Journal"   component={JournalStack}    options={{ title: 'Journal' }} />
      <Tab.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'SOS' }} />
    </Tab.Navigator>
  )
}
