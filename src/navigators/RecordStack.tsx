import { createStackNavigator } from '@react-navigation/stack'

import { RecordDetailScreen, RecordScreen } from '@/screens'

import type { RecordStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<RecordStackParamList>()

function RecordStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CreateRecord" component={RecordScreen} />
      <Stack.Screen name="ReadRecord" component={RecordDetailScreen} />
      <Stack.Screen name="EditRecord" component={RecordScreen} />
    </Stack.Navigator>
  )
}
export default RecordStackNavigator
