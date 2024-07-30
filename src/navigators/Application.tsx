import { createStackNavigator } from '@react-navigation/stack'

import { LoginScreen } from '@/screens'

import MainTabNavigator from './MainTab'
import MyPageStackNavigator from './MyPageStack'
import RecordStackNavigator from './RecordStack'

// import type { RootStackParamList } from '@/types/navigation'

// const Stack = createStackNavigator<RootStackParamList>()
const Stack = createStackNavigator()

function ApplicationNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTab" component={MainTabNavigator} />
      <Stack.Screen name="Record" component={RecordStackNavigator} />
      <Stack.Screen name="MyPage" component={MyPageStackNavigator} />
    </Stack.Navigator>
  )
}

export default ApplicationNavigator
