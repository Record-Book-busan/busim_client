import { createStackNavigator } from '@react-navigation/stack'

import { SearchScreen, DetailScreen } from '@/screens'

import type { SearchStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<SearchStackParamList>()

function SearchStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          presentation: 'modal',
          cardStyle: { backgroundColor: 'transparent' },
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
              overlayStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            }
          },
          gestureEnabled: true,
          gestureDirection: 'vertical',
          gestureResponseDistance: 1500,
        }}
      />
    </Stack.Navigator>
  )
}

export default SearchStackNavigator
