import { createStackNavigator } from '@react-navigation/stack'

import MainTabNavigator from './MainTab'
import MyPageStackNavigator from './MyPageStack'
import RecordStackNavigator from './RecordStack'

import type { RootStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<RootStackParamList>()

function ApplicationNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTab" component={MainTabNavigator} />
      <Stack.Screen name="Record" component={RecordStackNavigator} />
      <Stack.Screen name="MyPage" component={MyPageStackNavigator} />
    </Stack.Navigator>
  )
}

export default ApplicationNavigator
