import { createStackNavigator } from '@react-navigation/stack'

import { RecordCreateScreen, RecordEditScreen } from '@/screens'

import type { CreateRecordStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<CreateRecordStackParamList>()

function CreateRecordStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="CreateRecord"
        component={RecordCreateScreen}
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
      <Stack.Screen name="EditRecord" component={RecordEditScreen} />
    </Stack.Navigator>
  )
}
export default CreateRecordStackNavigator
