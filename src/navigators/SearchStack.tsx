import { createStackNavigator } from '@react-navigation/stack'

import { SearchScreen, DetailScreen } from '@/screens'

import type { SearchStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<SearchStackParamList>()

function SearchStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={SearchScreen} options={{ animationEnabled: false }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  )
}

export default SearchStackNavigator
