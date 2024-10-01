import { createStackNavigator } from '@react-navigation/stack'

import { useAuth } from '@/hooks/useAuthContext'
import { LoginScreen, PrivacyPolicyScreen } from '@/screens'

import CreateRecordStackNavigator from './CreateRecordStack'
import MainTabNavigator from './MainTab'
import MapStackNavigator from './MapStack'
import MyPageStackNavigator from './MyPageStack'
import OnboardingStackNavigator from './OnboardingStack'
import SearchStackNavigator from './SearchStack'

import type { AuthStackParamList } from '@/types/navigation'

const AuthStack = createStackNavigator<AuthStackParamList>()

export default function AuthenticatedNavigator() {
  const { state } = useAuth()

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen
        name="MainTab"
        component={MainTabNavigator}
        options={{
          gestureEnabled: false,
        }}
      />
      <AuthStack.Screen name="MapStack" component={MapStackNavigator} />
      <AuthStack.Screen name="SearchStack" component={SearchStackNavigator} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      {state.role === 'MEMBER' && (
        <>
          <AuthStack.Screen name="CreateRecordStack" component={CreateRecordStackNavigator} />
          <AuthStack.Screen name="MyPageStack" component={MyPageStackNavigator} />
        </>
      )}
      {state.role === 'PENDING_MEMBER' && (
        <>
          <AuthStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <AuthStack.Screen name="OnBoardingStack" component={OnboardingStackNavigator} />
        </>
      )}
    </AuthStack.Navigator>
  )
}
