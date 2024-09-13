import { createStackNavigator } from '@react-navigation/stack'

import { MapScreen } from '@/screens'

import type { MapStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<MapStackParamList>()

function MapStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MapHome" component={MapScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default MapStackNavigator
