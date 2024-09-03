import { createStackNavigator } from '@react-navigation/stack'

import { RecordScreen } from '@/screens'

import type { RecordStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<RecordStackParamList>()

function RecordStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CreateRecord"
        component={RecordScreen}
        options={{
          headerTitle: '여행 기록 작성',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}
export default RecordStackNavigator
