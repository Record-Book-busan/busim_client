import { createStackNavigator } from '@react-navigation/stack'

import CreateRecordStackNavigator from './CreateRecordStack'
import MainTabNavigator from './MainTab'
import MapStackNavigator from './MapStack'
import MyPageStackNavigator from './MyPageStack'
import OnboardingStackNavigator from './OnboardingStack'
import SearchStackNavigator from './SearchStack'

import type { RootStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<RootStackParamList>()

function ApplicationNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnBoardingStack" component={OnboardingStackNavigator} />
      <Stack.Screen name="MainTab" component={MainTabNavigator} />
      <Stack.Screen name="MapStack" component={MapStackNavigator} />
      <Stack.Screen name="CreateRecordStack" component={CreateRecordStackNavigator} />
      <Stack.Screen name="MyPageStack" component={MyPageStackNavigator} />
      <Stack.Screen name="SearchStack" component={SearchStackNavigator} />
    </Stack.Navigator>
  )
}

export default ApplicationNavigator
