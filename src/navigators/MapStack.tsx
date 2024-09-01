import { createStackNavigator } from '@react-navigation/stack'
import { useEffect } from 'react'

import { MapScreen } from '@/screens'
import { showLoginInfo } from '@/services/login/login'

import type { MapStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<MapStackParamList>()

function MapStackNavigator() {
  useEffect(() => {
    showLoginInfo()
  }, [])

  return (
    <Stack.Navigator>
      <Stack.Screen name="MapHome" component={MapScreen} options={{ headerShown: false }} />
      {/* <Stack.Screen
        name="MapMapDetail"
        component={MapDetailScreen}
        options={{
          header: () => <AppBar />,
          presentation: 'transparentModal',
        }}
      /> */}
    </Stack.Navigator>
  )
}

export default MapStackNavigator
