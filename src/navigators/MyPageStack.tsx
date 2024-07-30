import { createStackNavigator } from '@react-navigation/stack'

import { ProfileScreen } from '@/screens'

// import type { MyPageStackParamList } from '@/types/navigation'

// const Stack = createStackNavigator<MyPageStackParamList>()
const Stack = createStackNavigator()

function MyPageStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyPageProfile" component={ProfileScreen} />
      {/* <Stack.Screen name="MyPageSettings" component={SettingsScreen} /> */}
    </Stack.Navigator>
  )
}

export default MyPageStackNavigator
