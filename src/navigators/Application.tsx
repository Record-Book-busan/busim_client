import { useNavigation } from '@react-navigation/native'
import { createStackNavigator, type StackNavigationProp } from '@react-navigation/stack'
import ErrorBoundary from 'react-native-error-boundary'

import { NeedLoginPopup } from '@/components/common/NeedLoginPopup'
import { useAuth } from '@/hooks/useAuthContext'
import { ErrorScreen, LoginScreen } from '@/screens'

import AuthenticatedNavigator from './AuthenticatedStack'

import type { RootStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<RootStackParamList>()

function ApplicationNavigator() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const { state } = useAuth()

  if (state.isLoading) {
    // TODO: 스플래쉬 화면 구현
    return null
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorScreen}
      onError={(error, stackTrace) => {
        console.error('[🚨 ERROR!!]:', error, stackTrace)
      }}
    >
      <NeedLoginPopup navigation={navigation} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {state.token == null ? (
          // 로그인 전 화면
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                animationTypeForReplace: state.isSignOut ? 'pop' : 'push',
              }}
            />
          </>
        ) : (
          // 로그인 후 화면
          <Stack.Screen name="Authenticated" component={AuthenticatedNavigator} />
        )}
        <Stack.Screen name="Error" component={ErrorScreen} />
      </Stack.Navigator>
    </ErrorBoundary>
  )
}

export default ApplicationNavigator
