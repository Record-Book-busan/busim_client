import { createStackNavigator } from '@react-navigation/stack'

import { SearchScreen, DetailScreen } from '@/screens'

import type { SearchStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<SearchStackParamList>()

function SearchStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerTitle: '',
        }}
      />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  )
}

export default SearchStackNavigator
