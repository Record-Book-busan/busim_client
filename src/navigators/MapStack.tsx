import { createStackNavigator } from '@react-navigation/stack'

import { MapDetailScreen, MapScreen } from '@/screens'

import type { MapStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<MapStackParamList>()

function MapStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapMain" component={MapScreen} />
      <Stack.Screen name="MapDetail" component={MapDetailScreen} />
    </Stack.Navigator>
  )
}

export default MapStackNavigator
