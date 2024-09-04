import { createStackNavigator } from '@react-navigation/stack'

import { LoginScreen, PrivacyPolicyScreen } from '@/screens'

import MainTabNavigator from './MainTab'
import MyPageStackNavigator from './MyPageStack'
import OnboardingStackNavigator from './OnboardingStack'
import RecordStackNavigator from './RecordStack'
import SearchStackNavigator from './SearchStack'

import type { RootStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<RootStackParamList>()

function ApplicationNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          title: '이용 약관 동의',
          headerShown: true,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen name="OnBoardingStack" component={OnboardingStackNavigator} />
      <Stack.Screen name="MainTab" component={MainTabNavigator} />
      <Stack.Screen name="RecordStack" component={RecordStackNavigator} />
      <Stack.Screen name="MyPageStack" component={MyPageStackNavigator} />
      <Stack.Screen name="SearchStack" component={SearchStackNavigator} />
    </Stack.Navigator>
  )
}

export default ApplicationNavigator
