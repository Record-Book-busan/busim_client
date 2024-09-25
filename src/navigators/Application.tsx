import { useNavigation } from '@react-navigation/native'
import { createStackNavigator, type StackNavigationProp } from '@react-navigation/stack'

import ErrorBoundary from '@/common/ErrorBoundary'
import { ErrorScreen, LoginScreen, PrivacyPolicyScreen } from '@/screens'

import CreateRecordStackNavigator from './CreateRecordStack'
import MainTabNavigator from './MainTab'
import MapStackNavigator from './MapStack'
import MyPageStackNavigator from './MyPageStack'
import OnboardingStackNavigator from './OnboardingStack'
import SearchStackNavigator from './SearchStack'

import type { RootStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<RootStackParamList>()

function ApplicationNavigator() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Error'>>()

  return (
    <ErrorBoundary navigation={navigation}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="OnBoardingStack" component={OnboardingStackNavigator} />
        <Stack.Screen
          name="MainTab"
          component={MainTabNavigator}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="MapStack" component={MapStackNavigator} />
        <Stack.Screen name="CreateRecordStack" component={CreateRecordStackNavigator} />
        <Stack.Screen name="MyPageStack" component={MyPageStackNavigator} />
        <Stack.Screen name="SearchStack" component={SearchStackNavigator} />
        <Stack.Screen name="Error" component={ErrorScreen} />
      </Stack.Navigator>
    </ErrorBoundary>
  )
}

export default ApplicationNavigator
