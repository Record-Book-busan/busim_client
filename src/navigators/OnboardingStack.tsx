import { createStackNavigator } from '@react-navigation/stack'

import { OnBoardingScreen } from '@/screens'

import type { OnboardingStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<OnboardingStackParamList>()

export default function OnboardingStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
    </Stack.Navigator>
  )
}
